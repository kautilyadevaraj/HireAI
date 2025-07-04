import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Candidate {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    experience: string;
    education: string;
    skills: string[];
    email: string;
    phone: string;
    summary: string;
    image: string;
    gender: string;
    ethnicity: string;
    match: number;
}

export async function POST(request: NextRequest) {
    try {
        const { query, candidates } = await request.json();

        if (!query || !candidates || candidates.length === 0) {
            return NextResponse.json({ error: 'Missing query or candidates' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Create a structured prompt for candidate matching
        const prompt = `
You are an AI recruitment assistant. Analyze the following search query and rank candidates based on how well they match the requirements.

Search Query: "${query}"

Instructions:
1. Analyze the query to understand what the recruiter is looking for (skills, experience, role, gender, education level, etc.)
2. For each candidate, give a match score from 0-100 based on how well they fit the query
3. Consider all relevant factors: job title, skills, experience, education, gender (if specified), company background
4. Return ONLY a JSON array of candidate IDs with their match scores, ordered by match score (highest first)
5. Include only candidates with scores >= 60

Candidates data:
${candidates.map((c: Candidate, index: number) => `
${index + 1}. ID: ${c.id}
   Name: ${c.name}
   Title: ${c.title}
   Company: ${c.company}
   Location: ${c.location}
   Experience: ${c.experience}
   Education: ${c.education}
   Skills: ${c.skills.join(', ')}
   Gender: ${c.gender}
   Summary: ${c.summary}
`).join('')}

Return format (JSON only, no other text):
[
    {"id": "1", "score": 95, "reasoning": "Brief explanation of why this candidate matches"},
    {"id": "3", "score": 88, "reasoning": "Brief explanation"},
    ...
]
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            // Extract JSON from the response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const matchResults = JSON.parse(jsonMatch[0]);
            
            // Create a map for quick lookup
            const scoreMap = new Map(matchResults.map((result: any) => [result.id, result.score]));
            
            // Filter and sort candidates based on AI scores
            const rankedCandidates = candidates
                .filter((candidate: Candidate) => scoreMap.has(candidate.id))
                .map((candidate: Candidate) => ({
                    ...candidate,
                    match: scoreMap.get(candidate.id) || candidate.match
                }))
                .sort((a: Candidate, b: Candidate) => b.match - a.match);

            return NextResponse.json({
                candidates: rankedCandidates,
                total: rankedCandidates.length,
                query: query
            });

        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.log('AI Response:', text);
            
            // Fallback: return original candidates if AI parsing fails
            return NextResponse.json({
                candidates: candidates.slice(0, 20), // Limit to 20 for performance
                total: candidates.length,
                query: query,
                fallback: true
            });
        }

    } catch (error) {
        console.error('AI search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 