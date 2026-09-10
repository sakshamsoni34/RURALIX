import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback for hackathon
      return NextResponse.json({
        extracted: {
          capital: "1 Lakh (extracted from transcript)",
          businessType: "Dairy / Milk Business",
          location: "Village (implied)",
          experience: "Not specified",
          requirements: "Needs to buy cows and setup shed"
        },
        plan: [
          "Phase 1: Setup a basic shed and purchase 2 high-yield cows.",
          "Phase 2: Establish local delivery routes in nearby towns.",
          "Phase 3: Reinvest profits to expand herd size."
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert AI rural business assistant. 
      Read the following spoken transcript from a rural entrepreneur. It may be in Hindi, Hinglish, or English.
      Transcript: "${transcript}"
      
      Extract the specific business parameters and generate a short, preliminary business plan.
      You MUST return ONLY a JSON object (no markdown, no formatting) matching this exact structure:
      {
        "extracted": {
          "capital": "String (Extract the capital mentioned, or 'Not specified')",
          "businessType": "String (Extract the business idea, e.g., 'Dairy')",
          "location": "String (Extract the location or write 'Not specified')",
          "experience": "String (Extract the experience or write 'Not specified')",
          "requirements": "String (Extract specific needs or write 'None')"
        },
        "plan": ["String (Bullet point 1)", "String (Bullet point 2)", "String (Bullet point 3)"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process voice transcript' },
      { status: 500 }
    );
  }
}
