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
    console.error('Failed to parse AI JSON response in reality-check:', err);
    return null;
  }
}

function calculateHeuristicRealityCheck(idea: string, capital: string, land: string, electricity: string, experience: string, hours: string, customers: string) {
  const cap = parseInt(capital, 10) || 100000;
  const normalizedExp = (experience || '').toLowerCase();
  const normalizedElec = (electricity || '').toLowerCase();
  const normalizedLand = (land || '').toLowerCase();
  const normalizedCust = (customers || '').toLowerCase();
  const normalizedIdea = (idea || 'Commercial Enterprise').toLowerCase();

  // Capital score
  let capitalScore = 50;
  if (cap >= 300000) capitalScore = 92;
  else if (cap >= 150000) capitalScore = 82;
  else if (cap >= 75000) capitalScore = 70;
  else if (cap >= 40000) capitalScore = 58;
  else if (cap > 0) capitalScore = 45;

  // Infrastructure adequacy score
  let infraScore = 65;
  if (normalizedElec.includes('24/7') || normalizedElec.includes('3-phase') || normalizedElec.includes('backup') || normalizedElec.includes('solar')) {
    infraScore = 90;
  } else if (normalizedElec.includes('18') || normalizedElec.includes('12-16') || normalizedElec.includes('generator')) {
    infraScore = 78;
  } else if (normalizedElec.includes('single') || normalizedElec.includes('domestic')) {
    infraScore = 60;
  }

  if (normalizedLand.includes('own') || normalizedLand.includes('pucca') || normalizedLand.includes('highway')) {
    infraScore = Math.min(100, infraScore + 8);
  }

  // Experience level score
  let expScore = 55;
  if (normalizedExp.includes('5+') || normalizedExp.includes('pro') || normalizedExp.includes('expert') || normalizedExp.includes('veteran')) {
    expScore = 94;
  } else if (normalizedExp.includes('1-3') || normalizedExp.includes('year') || normalizedExp.includes('experienced') || normalizedExp.includes('trade')) {
    expScore = 82;
  } else if (normalizedExp.includes('trained') || normalizedExp.includes('certified') || normalizedExp.includes('course')) {
    expScore = 75;
  } else {
    expScore = 52;
  }

  // Customer demand score
  let demandScore = 70;
  if (normalizedCust.includes('500') || normalizedCust.includes('high') || normalizedCust.includes('busy') || normalizedCust.includes('mandi')) {
    demandScore = 88;
  } else if (normalizedCust.includes('200') || normalizedCust.includes('moderate') || normalizedCust.includes('market')) {
    demandScore = 76;
  } else {
    demandScore = 64;
  }

  const competitionScore = 64;
  const riskScore = Math.max(12, Math.min(88, Math.round(100 - (capitalScore * 0.35 + expScore * 0.35 + infraScore * 0.3))));
  const profitScore = Math.max(25, Math.min(95, Math.round((demandScore * 0.45 + capitalScore * 0.35 + expScore * 0.2))));
  const overall = Math.round((demandScore * 0.25 + capitalScore * 0.25 + infraScore * 0.2 + expScore * 0.15 + (100 - riskScore) * 0.15));

  return {
    scores: {
      demand: demandScore,
      competition: competitionScore,
      capital: capitalScore,
      profit: profitScore,
      risk: riskScore,
      infra: infraScore,
      overall: overall
    },
    explanation: `Feasibility Assessment for "${idea || 'Your Enterprise'}": Working capital of ₹${cap.toLocaleString('en-IN')} scores ${capitalScore}/100 for operational resilience and initial stock buffer. Infrastructure readiness is rated at ${infraScore}/100. Founder background and readiness score ${expScore}/100, resulting in a controlled operational risk rating of ${riskScore}%. Overall commercial viability stands at an encouraging ${overall}%.`
  };
}

export async function POST(req: Request) {
  try {
    const { 
      idea = '', 
      capital = '100000', 
      land = '', 
      electricity = '', 
      experience = '', 
      hours = '', 
      customers = '' 
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const modelName of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            Act as an uncompromising, highly analytical business feasibility auditor.
            Analyze the feasibility of the following business idea:
            - Business Idea: ${idea}
            - Capital: ₹${capital}
            - Land / Commercial Space: ${land}
            - Electricity / Utilities: ${electricity}
            - Experience: ${experience}
            - Working Hours: ${hours}
            - Customer Base / Footfall: ${customers}
            
            Return ONLY a valid JSON object without markdown formatting:
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
              "explanation": "String (Honest, insightful explanation of viability, cost dynamics, and risk factors)"
            }
          `;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsedData = extractJSON(responseText);

          if (parsedData && parsedData.scores && typeof parsedData.scores.overall === 'number') {
            return NextResponse.json(parsedData);
          }
        } catch (modelErr) {
          console.warn(`Gemini reality-check model ${modelName} failed, trying next:`, modelErr);
        }
      }
    }

    const fallback = calculateHeuristicRealityCheck(idea, capital, land, electricity, experience, hours, customers);
    return NextResponse.json(fallback);

  } catch (error) {
    console.error('Reality check error, returning heuristic fallback:', error);
    const fallback = calculateHeuristicRealityCheck('', '100000', '', '', '', '', '');
    return NextResponse.json(fallback);
  }
}
