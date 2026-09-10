import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { location, season, festival } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock fallback
      return NextResponse.json({
        trendingItems: [
          { name: "Sweets & Dairy Products", trend: "UP", reason: `High demand expected for ${festival || 'upcoming season'}` },
          { name: "Traditional Clothes", trend: "UP", reason: "Festive purchases increasing" },
          { name: "Decorative Items", trend: "UP", reason: "Local market preparation" }
        ],
        analysis: `Based on your location (${location}) during the ${season} season with ${festival || 'no specific festival'} approaching, we project a massive spike in retail consumables. Stocking up on raw dairy and textiles will yield high margins.`
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert rural market analyst and demand predictor in India.
      Analyze the local market demand based on these parameters:
      Location: ${location}
      Current Season/Weather: ${season}
      Upcoming Festival/Event: ${festival}
      
      Predict the top 3 items that will have the highest demand surge.
      You MUST return ONLY a JSON object (no markdown, no formatting) matching this exact schema:
      {
        "trendingItems": [
          { 
            "name": "String (e.g., Agricultural Tools, Sweets)", 
            "trend": "UP", 
            "reason": "String (Short reason, e.g., 'Harvest season starting')" 
          }
        ],
        "analysis": "String (A 2-3 sentence strategic analysis of why these items will sell well and how the entrepreneur should prepare)"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to predict demand' },
      { status: 500 }
    );
  }
}
