import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        schemes: [
          {
            name: "Stand-Up India Scheme",
            description: "Financial assistance for SC/ST and/or women entrepreneurs setting up greenfield enterprises.",
            matchPercentage: 92,
            eligibilityFactors: ["Location eligible", "Women entrepreneur eligible", "Capital requirement eligible"],
            documents: ["Aadhaar Card", "PAN Card", "Business Plan Project Report", "Caste Certificate (if applicable)"],
            missingRequirements: ["Formal Business Registration Certificate required"]
          },
          {
            name: "PMEGP (Prime Minister's Employment Gen.)",
            description: "Credit-linked subsidy program to generate employment in rural and urban areas.",
            matchPercentage: 85,
            eligibilityFactors: ["Age criteria met", "Rural location eligible"],
            documents: ["Aadhaar Card", "Education Certificate", "Detailed Project Report"],
            missingRequirements: ["Entrepreneurship Development Programme (EDP) training completion"]
          }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Act as an expert advisor on Indian Government Schemes for MSMEs, agriculture, and rural development.
      Analyze the following user profile/query and find the best matching government schemes.
      
      User Query: "${query}"
      
      You must return ONLY a JSON object (no markdown, no code blocks) with this exact schema:
      {
        "schemes": [
          {
            "name": "Scheme Name",
            "description": "Short description of the scheme",
            "matchPercentage": Number (0-100),
            "eligibilityFactors": ["String", "String"] (Array of specific matched criteria, e.g. 'Women entrepreneur eligible'),
            "documents": ["String", "String"] (Array of required documents),
            "missingRequirements": ["String"] (Array of warnings/missing things the user likely needs, e.g., 'Business Registration required')
          }
        ]
      }
      Limit the response to the top 2 best-matching schemes.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to find matching schemes' },
      { status: 500 }
    );
  }
}
