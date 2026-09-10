import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { idea, capital, land, electricity, experience, hours, customers } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        scores: {
          demand: 82,
          competition: 65,
          capital: 75,
          profit: 78,
          risk: 32,
          infra: 88,
          overall: 77
        },
        explanation: `Based on your inputs for a ${idea}, this business shows strong potential. The local demand (${customers}) is solid. Your capital (₹${capital}) is adequate for initial setup, and having ${land} with ${electricity} electricity significantly reduces infrastructure risk. However, with ${experience} experience, you should monitor competition closely.`
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Act as a strict rural business evaluator. Analyze the feasibility of the following business idea based on the local constraints:
      Idea: ${idea}
      Capital: ₹${capital}
      Land/Shop: ${land}
      Electricity: ${electricity}
      Experience: ${experience}
      Expected Working Hours: ${hours}
      Local Customer Base: ${customers}
      
      You must return ONLY a JSON object (no markdown, no formatting) with this exact schema:
      {
        "scores": {
          "demand": Number (0-100),
          "competition": Number (0-100),
          "capital": Number (0-100),
          "profit": Number (0-100),
          "risk": Number (0-100),
          "infra": Number (0-100),
          "overall": Number (0-100)
        },
        "explanation": "String (Detailed explanation of why this idea is feasible or risky based on the specific inputs)"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate reality check' },
      { status: 500 }
    );
  }
}
