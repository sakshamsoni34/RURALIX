import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function extractJSON(text: string) {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI JSON response in demand:', err);
    return null;
  }
}

function calculateHeuristicDemand(businessIdea: string, location: string, season: string, festival: string) {
  const normalizedIdea = (businessIdea || '').toLowerCase();
  const normalizedSeason = season || 'Harvest Season';
  const eventName = festival || `${season} Market Cycle`;
  const cityName = (location || 'your area').split(',')[0].trim() || 'Regional Mandi';

  let trendingItems: Array<{ name: string; trend: 'UP' | 'DOWN'; reason: string }> = [];
  let analysis = '';

  if (normalizedIdea.includes('dairy') || normalizedIdea.includes('milk') || normalizedIdea.includes('sweet')) {
    trendingItems = [
      { name: "Khoya & High-FAT Buffalo Milk", trend: "UP", reason: `High demand for sweets and delicacies during ${eventName}` },
      { name: "Fresh Paneer & White Butter Blocks", trend: "UP", reason: "Increased household catering and banquet consumption" },
      { name: "Packaged Pure Ghee Tins (1L/5L)", trend: "UP", reason: "Festive gifting & puja rituals across local markets" }
    ];
    analysis = `In ${cityName} during ${normalizedSeason} and ${eventName}, milk derivatives experience a 40%+ sales velocity spike. Securing raw milk supply contracts from 10-15 local dairy owners now protects against wholesale price inflation.`;
  } else if (normalizedIdea.includes('agro') || normalizedIdea.includes('cold') || normalizedIdea.includes('flour') || normalizedIdea.includes('oil')) {
    trendingItems = [
      { name: "Cold-Pressed Mustard / Sesame Oil", trend: "UP", reason: `Peak consumption surge during ${normalizedSeason}` },
      { name: "Coarse Grain Flours & Fresh Chakki Atta", trend: "UP", reason: "Shift to fresh local milling over branded factory packs" },
      { name: "Air-Tight Storage Sacks & Plastic Crates", trend: "UP", reason: "Post-harvest preservation and transit to mandi" }
    ];
    analysis = `Commodity turnover in ${cityName} rises steeply around ${eventName}. Promoting fresh, unadulterated cold pressed batches will allow you to command a 15-20% margin premium over standard commercial packs.`;
  } else if (normalizedIdea.includes('hardware') || normalizedIdea.includes('electrical') || normalizedIdea.includes('tool') || normalizedIdea.includes('solar')) {
    trendingItems = [
      { name: "Submersible Pump Accessories & PVC Pipes", trend: "UP", reason: `Irrigation and water management during ${normalizedSeason}` },
      { name: "LED Festive Lights & Decorative Fixtures", trend: "UP", reason: `Commercial shop and home decor for ${eventName}` },
      { name: "Inverter Batteries & Solar Panels", trend: "UP", reason: "Reliable power backup for agricultural equipment" }
    ];
    analysis = `Hardware demand in ${cityName} aligns closely with ${normalizedSeason} maintenance and ${eventName} preparations. Maintaining a 2-week buffer inventory on high-turnover fittings prevents lost walk-in sales.`;
  } else {
    trendingItems = [
      { name: businessIdea ? `Fast-Moving Supplies for ${businessIdea}` : "Daily FMCG & Essential Staples", trend: "UP", reason: `High consumer footfall expected for ${eventName}` },
      { name: "Packaged Festive Consumables & Sweets", trend: "UP", reason: `Seasonal gifting surge in ${cityName} trade clusters` },
      { name: "Gift Packaging & Eco-Friendly Bags", trend: "UP", reason: "Local retail merchant preparation" }
    ];
    analysis = `Based on consumer purchasing patterns in ${cityName} during ${normalizedSeason} with ${eventName} approaching, retail velocity is projected to increase by 35%. Early inventory stocking will optimize supplier bulk discounts.`;
  }

  return {
    trendingItems,
    analysis
  };
}

export async function POST(req: Request) {
  try {
    const { location = '', season = 'Harvest Season', festival = 'Local Festival Cycle', businessIdea = '' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const modelName of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            You are an expert rural and regional market analyst and demand forecaster in India.
            Parameters:
            - Business Idea: ${businessIdea || 'General Small Enterprise'}
            - Location: ${location}
            - Season / Weather: ${season}
            - Upcoming Festival / Event: ${festival}
            
            Predict top 3 trending items or products with demand surge.
            Return ONLY a valid JSON object without markdown formatting:
            {
              "trendingItems": [
                {
                  "name": "String",
                  "trend": "UP",
                  "reason": "String"
                }
              ],
              "analysis": "String (Strategic analysis on market dynamics and stocking recommendations)"
            }
          `;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsedData = extractJSON(responseText);

          if (parsedData && Array.isArray(parsedData.trendingItems) && parsedData.trendingItems.length > 0) {
            return NextResponse.json(parsedData);
          }
        } catch (modelErr) {
          console.warn(`Gemini demand model ${modelName} failed, trying next:`, modelErr);
        }
      }
    }

    return NextResponse.json(calculateHeuristicDemand(businessIdea, location, season, festival));
  } catch (error) {
    console.error('Demand API error, returning fallback:', error);
    return NextResponse.json(calculateHeuristicDemand('', '', 'Harvest Season', 'Upcoming Festival'));
  }
}
