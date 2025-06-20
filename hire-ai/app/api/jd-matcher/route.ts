import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Verify environment variable
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface JDMatchResult {
    resumeId: string;
    resumeName: string;
    score: number;
    reasoning: {
        whyHire: string[];
        whyNotHire: string[];
        keyStrengths: string[];
        missingSkills: string[];
    };
    extractedText: string;
}

export interface JDMatchRequest {
    jobDescription: string;
    resumes: Array<{
        id: string;
        name: string;
        file: File;
    }>;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const jobDescription = formData.get("jobDescription") as string;
        
        if (!jobDescription) {
            return NextResponse.json(
                { error: "Job description is required" },
                { status: 400 }
            );
        }

        // Get all resume files
        const resumeResults: JDMatchResult[] = [];
        const resumeEntries = Array.from(formData.entries()).filter(
            ([key]) => key.startsWith("resume_")
        );

        if (resumeEntries.length === 0) {
            return NextResponse.json(
                { error: "At least one resume is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        for (const [key, value] of resumeEntries) {
            if (value instanceof File) {
                const resumeId = key.replace("resume_", "");
                const file = value as File;

                try {
                    // Validate file
                    if (!file.type.includes("pdf") && !file.type.includes("doc")) {
                        console.warn(`Skipping invalid file type: ${file.name}`);
                        continue;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                        console.warn(`Skipping oversized file: ${file.name}`);
                        continue;
                    }

                    // Extract text from resume
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const base64Data = buffer.toString("base64");

                    const extractPrompt = `
                        Extract all text content from this resume/CV document. 
                        Preserve the structure and include all sections like personal information, experience, education, skills, etc.
                        Return only the extracted text content.
                    `;

                    const extractResult = await model.generateContent([
                        extractPrompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: file.type,
                            },
                        },
                    ]);

                    const extractedText = await extractResult.response.text();

                    // Analyze match with job description
                    const matchPrompt = `
                        You are an expert HR recruiter. Analyze how well this resume matches the given job description.

                        Job Description:
                        ${jobDescription}

                        Resume Content:
                        ${extractedText}

                        Provide a detailed analysis in the following JSON format:
                        {
                            "score": 85,
                            "whyHire": [
                                "Strong technical background in required technologies",
                                "5+ years of relevant experience",
                                "Previous leadership experience"
                            ],
                            "whyNotHire": [
                                "Lacks experience with specific framework mentioned in JD",
                                "No mention of certification requirements"
                            ],
                            "keyStrengths": [
                                "Expert in Python and machine learning",
                                "Strong communication skills",
                                "Proven track record of project delivery"
                            ],
                            "missingSkills": [
                                "Kubernetes experience",
                                "AWS certifications",
                                "Agile methodology experience"
                            ]
                        }

                        Rules:
                        - Score should be 0-100 based on overall match quality
                        - Consider skills, experience level, education, and cultural fit
                        - whyHire should highlight 3-5 strongest points for hiring
                        - whyNotHire should list 2-4 potential concerns or gaps
                        - keyStrengths should highlight candidate's top 3-5 abilities
                        - missingSkills should list skills mentioned in JD but not found in resume
                        - Be specific and actionable in your reasoning
                        - Return ONLY the JSON object, no additional text
                    `;

                    const matchResult = await model.generateContent(matchPrompt);
                    let matchResponse = await matchResult.response.text();

                    // Clean up the response
                    matchResponse = matchResponse.trim();
                    if (matchResponse.startsWith("```json")) {
                        matchResponse = matchResponse
                            .replace(/^```json\s*/, "")
                            .replace(/\s*```$/, "");
                    } else if (matchResponse.startsWith("```")) {
                        matchResponse = matchResponse
                            .replace(/^```\s*/, "")
                            .replace(/\s*```$/, "");
                    }

                    const analysis = JSON.parse(matchResponse);

                    resumeResults.push({
                        resumeId,
                        resumeName: file.name,
                        score: analysis.score,
                        reasoning: {
                            whyHire: analysis.whyHire || [],
                            whyNotHire: analysis.whyNotHire || [],
                            keyStrengths: analysis.keyStrengths || [],
                            missingSkills: analysis.missingSkills || [],
                        },
                        extractedText,
                    });
                } catch (error) {
                    console.error(`Error processing resume ${file.name}:`, error);
                    // Add failed result
                    resumeResults.push({
                        resumeId,
                        resumeName: file.name,
                        score: 0,
                        reasoning: {
                            whyHire: [],
                            whyNotHire: ["Failed to process resume"],
                            keyStrengths: [],
                            missingSkills: [],
                        },
                        extractedText: "Error processing resume",
                    });
                }
            }
        }

        // Sort by score (highest first)
        resumeResults.sort((a, b) => b.score - a.score);

        return NextResponse.json({
            success: true,
            results: resumeResults,
            totalResumes: resumeResults.length,
            averageScore: resumeResults.length > 0 
                ? Math.round(resumeResults.reduce((sum, r) => sum + r.score, 0) / resumeResults.length)
                : 0,
        });

    } catch (error) {
        console.error("JD Matcher error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "An error occurred",
            },
            { status: 500 }
        );
    }
} 