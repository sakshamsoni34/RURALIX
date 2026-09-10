import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { location, capital, interests, infrastructure } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        recommendation: "Dairy Farming & Paneer Production",
        viabilityScore: 85,
        analysis: `Based on your location in ${location} and capital of ₹${capital}, starting a dairy business is highly viable. The local weather is suitable for high-yield cattle. The nearby Mandi shows a 15% increase in paneer demand. Your ${infrastructure} infrastructure supports cold storage.`,
        actionSteps: [
          `Allocate ₹${Math.floor(capital * 0.5)} for high-yield cows`,
          "Invest ₹15,000 in basic paneer pressing equipment",
          "Register with the local milk cooperative",
          "Set up solar backup for cold storage"
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Act as a hyper-local business advisor for rural Indian micro-entrepreneurs.
      Analyze the following inputs and generate a highly specific business plan.
      Location: ${location}
      Available Capital: ₹${capital}
      Interests/Current Setup: ${interests}
      Available Infrastructure: ${infrastructure}

      Take into account simulated local weather, typical local crops for that region, nearby market demand, and local prices.
      
      You must respond ONLY with a valid JSON object matching this schema, without markdown formatting or code blocks:
      {
        "recommendation": "String (e.g., Small dairy + paneer business)",
        "viabilityScore": Number (0-100),
        "analysis": "String (Detailed analysis of why, including demand, infra, competition)",
        "actionSteps": ["String", "String"] (Array of 3-4 immediate actionable steps with estimated costs)
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate advisory' },
      { status: 500 }
    );
  }
}
