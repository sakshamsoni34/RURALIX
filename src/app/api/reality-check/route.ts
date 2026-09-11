import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { idea, capital, land, electricity, experience, hours, customers } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Calculate realistic pseudo-scores based on inputs if no API key is provided
      const cap = parseInt(capital) || 0;
      const capitalScore = cap > 100000 ? 85 : (cap > 40000 ? 60 : 35);
      const infraScore = electricity.toLowerCase().includes('24/7') || electricity.toLowerCase().includes('good') ? 85 : 45;
      const expScore = experience.toLowerCase().includes('year') || experience.toLowerCase().includes('expert') ? 80 : 40;
      const demandScore = customers.toLowerCase().includes('high') || customers.toLowerCase().includes('many') ? 85 : 55;
      const riskScore = 100 - (capitalScore + expScore) / 2; // high risk if low capital/experience
      
      const overall = Math.floor((capitalScore + infraScore + expScore + demandScore + (100 - riskScore)) / 5);

      return NextResponse.json({
        scores: {
          demand: demandScore,
          competition: 65, // default
          capital: capitalScore,
          profit: Math.floor(overall * 0.9),
          risk: Math.floor(riskScore),
          infra: infraScore,
          overall: overall
        },
        explanation: `Based on a brutal reality check of your inputs for ${idea}: Your capital of ₹${capital} scores ${capitalScore}/100 in sufficiency. Your infrastructure scores ${infraScore}/100. Because your experience level is "${experience}", your operational risk is calculated at ${Math.floor(riskScore)}%. This gives a realistic overall viability of ${overall}%. Be extremely careful with fixed costs.`
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Act as an uncompromising, brutally honest business analyst and financial evaluator. Your target is ANY business idea.
      Analyze the feasibility of the following business idea based strictly on the provided real-world constraints. Do NOT inflate scores to be polite. If an idea is financially unsound, give it a low score.
      Idea: ${idea}
      Capital: ₹${capital}
      Land/Shop: ${land}
      Electricity: ${electricity}
      Experience: ${experience}
      Expected Working Hours: ${hours}
      Local Customer Base: ${customers}
      
      CRITICAL INSTRUCTION: Calculate exact, mathematically realistic scores (0-100). 
      - Demand: Based on actual market size and typical consumer behavior for this specific idea.
      - Competition: Based on market saturation.
      - Capital: Is ₹${capital} actually enough to cover fixed setup costs, licenses, inventory, and 6 months of operational runway?
      - Risk: Heavily penalize lack of experience or poor infrastructure.
      
      You must return ONLY a JSON object (no markdown, no formatting) with this exact schema:
      {
        "scores": {
          "demand": Number (0-100),
          "competition": Number (0-100),
          "capital": Number (0-100),
          "profit": Number (0-100),
          "risk": Number (0-100, where 100 means extreme risk),
          "infra": Number (0-100),
          "overall": Number (0-100, strict calculation)
        },
        "explanation": "String (Brutally honest, detailed explanation of exactly why this idea is feasible or why it will fail based on the specific inputs. Mention cost structures.)"
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
