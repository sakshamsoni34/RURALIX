import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { location } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback for hackathon
      return NextResponse.json([
        {
          zone: "Highway Outskirts",
          businessType: "Dairy & Cold Storage",
          level: "High",
          reason: "High traffic area, excellent transport access for milk collection, low competition.",
          x: 20, y: 30
        },
        {
          zone: "Village Center",
          businessType: "Flour Mill",
          level: "High",
          reason: "High daily footfall, central to all residential areas, high demand for staples.",
          x: 50, y: 50
        },
        {
          zone: "Market Square",
          businessType: "Grocery Store",
          level: "Medium",
          reason: "Good population demand but already has 3 existing stores. Moderate competition.",
          x: 75, y: 40
        },
        {
          zone: "Inner Residential",
          businessType: "Mobile Shop",
          level: "Low",
          reason: "Low footfall, poor accessibility for heavy deliveries, and saturated market.",
          x: 35, y: 75
        }
      ]);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert rural business strategist and GIS analyst.
      Analyze the region of "${location}" and identify 4 distinct business opportunity zones.
      For each zone, recommend a specific business type, assign an opportunity level ("High", "Medium", "Low"), and explain WHY based on factors like population, competition, and accessibility.
      Provide relative X and Y coordinates (between 10 and 90) to plot them on a map grid. Ensure they are spaced apart.
      
      You MUST return ONLY a JSON array (no markdown, no formatting) matching this exact schema:
      [
        {
          "zone": "String (e.g., Highway Access)",
          "businessType": "String (e.g., Dairy)",
          "level": "String (High, Medium, or Low)",
          "reason": "String (Detailed reason mentioning demand, competition, etc.)",
          "x": Number (between 10 and 90),
          "y": Number (between 10 and 90)
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate map data' },
      { status: 500 }
    );
  }
}
