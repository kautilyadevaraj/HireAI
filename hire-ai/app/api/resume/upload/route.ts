import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeStructuredData } from '@/types/resume';

// Verify environment variable
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF or DOC files.' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Generate unique filename for reference (no file saving in serverless)
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;

    // Convert file to buffer for processing (in memory only)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text using Gemini API
    let extractedText = '';
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert file to base64 for Gemini API
      const base64Data = buffer.toString('base64');
      const mimeType = file.type;

      const prompt = `
        Extract all text content from this resume/CV document. 
        Preserve the structure and formatting as much as possible.
        Include all sections like personal information, experience, education, skills, etc.
        Return only the extracted text content.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      extractedText = response.text();
      
    } catch (error) {
      console.error('Error extracting text with Gemini:', error);
      extractedText = 'Error: Could not extract text from the document. Please try again or upload a different file.';
    }

    // Analyze extracted text to get structured data
    let structuredData: ResumeStructuredData | null = null;
    if (extractedText && !extractedText.startsWith('Error:')) {
      try {
        const analyzeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const analyzePrompt = `
          Analyze the following resume text and extract structured information. Return ONLY a valid JSON object with the following structure:

          {
            "name": "Full name of the person",
            "email": "Email address",
            "phone": "Phone number",
            "location": "City, State/Country",
            "title": "Current or most recent job title",
            "experience": "Years of experience (e.g., '5 years', 'Entry level')",
            "summary": "Brief professional summary or objective",
            "skills": ["skill1", "skill2", "skill3", ...],
            "education": [
              {
                "degree": "Degree name",
                "school": "School/University name",
                "year": "Graduation year",
                "gpa": "GPA if mentioned",
                "honors": "Any honors/distinctions"
              }
            ],
            "workHistory": [
              {
                "company": "Company name",
                "position": "Job title",
                "duration": "Start - End dates",
                "description": "Brief job description",
                "achievements": ["achievement1", "achievement2", ...]
              }
            ]
          }

          Rules:
          - If information is not found, use empty string "" for strings and empty array [] for arrays
          - Extract all relevant skills including technical skills, programming languages, tools, etc.
          - For experience, estimate years based on work history if not explicitly stated
          - Keep descriptions concise but informative
          - Return ONLY the JSON object, no additional text or formatting

          Resume text to analyze:
          ${extractedText}
        `;

        const analyzeResult = await analyzeModel.generateContent(analyzePrompt);
        const analyzeResponse = await analyzeResult.response;
        let aiResponseText = analyzeResponse.text();
        
        // Clean up the response - remove any markdown formatting or extra text
        aiResponseText = aiResponseText.trim();
        if (aiResponseText.startsWith('```json')) {
          aiResponseText = aiResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (aiResponseText.startsWith('```')) {
          aiResponseText = aiResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        structuredData = JSON.parse(aiResponseText) as ResumeStructuredData;
        
        // Validate the structure
        if (structuredData) {
          const requiredFields = ['name', 'email', 'phone', 'location', 'title', 'experience', 'skills', 'education', 'workHistory'];
          const isValid = requiredFields.every(field => field in structuredData!);
          
          if (!isValid) {
            throw new Error('Invalid structure returned from AI');
          }
        }

      } catch (error) {
        console.error('Error analyzing text:', error);
        // Continue without structured data
        structuredData = null;
      }
    }

    return NextResponse.json({
      success: true,
      filename: filename, // Reference only, no actual file saved
      originalName: file.name,
      size: file.size,
      extractedText: extractedText,
      structuredData: structuredData ?? undefined,
      uploadTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // More detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
} 