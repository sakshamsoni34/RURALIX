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
    console.error('Failed to parse AI JSON response in schemes:', err);
    return null;
  }
}

const ALL_SCHEMES = [
  {
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    description: "Credit-linked capital subsidy up to 35% for setting up new micro enterprises in rural areas with project costs up to ₹50 Lakh (Manufacturing) and ₹20 Lakh (Service).",
    matchPercentage: 94,
    eligibilityFactors: ["Rural location eligible for 35% subsidy", "Individual entrepreneur above 18 years", "Manufacturing & service ventures"],
    documents: ["Aadhaar Card", "PAN Card", "Detailed Project Report (DPR)", "EDP Training Certificate", "Bank Passbook"],
    missingRequirements: ["Entrepreneurship Development Programme (EDP) online training completion"]
  },
  {
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    description: "Collateral-free institutional credit up to ₹10 Lakhs categorized under Shishu (up to ₹50K), Kishore (₹50K to ₹5L), and Tarun (₹5L to ₹10L).",
    matchPercentage: 90,
    eligibilityFactors: ["Non-corporate small business", "Zero collateral required", "Manufacturing, trading and services"],
    documents: ["Identity & Address Proof (KYC)", "Business Registration Proof", "Last 6 months Bank Statement"],
    missingRequirements: ["Udyam Registration Certificate"]
  },
  {
    name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    description: "Credit-linked capital subsidy of 35% (up to ₹10 Lakh) for micro food processing units (Oil mill, flour mill, spices, pickles, dairy products).",
    matchPercentage: 88,
    eligibilityFactors: ["Micro food processing unit", "Individual/SHG/FPO eligible", "One District One Product (ODOP) focus"],
    documents: ["Aadhaar & PAN", "Quotation of Machinery", "Detailed Project Report", "FSSAI Registration"],
    missingRequirements: ["Basic FSSAI Food Business Registration"]
  },
  {
    name: "Stand-Up India Scheme",
    description: "Bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    matchPercentage: 86,
    eligibilityFactors: ["SC/ST and/or Women entrepreneurs", "Greenfield enterprise", "Manufacturing, services, or trading sector"],
    documents: ["KYC Documents", "Caste Certificate (for SC/ST)", "Project Report", "Balance Sheet / Net Worth Statement"],
    missingRequirements: ["Formal enterprise registration"]
  },
  {
    name: "National Livestock Mission (NLM)",
    description: "Direct 50% capital subsidy (up to ₹25 Lakh to ₹50 Lakh) for poultry breeding, sheep/goat farming, piggery, and fodder seed processing units.",
    matchPercentage: 89,
    eligibilityFactors: ["Livestock & Poultry farming", "50% direct capital subsidy", "State animal husbandry alignment"],
    documents: ["Land ownership / Lease deed", "Detailed Livestock Project Report", "Bank Loan In-principle Sanction"],
    missingRequirements: ["Land demarcation for livestock shed"]
  },
  {
    name: "Agriculture Infrastructure Fund (AIF)",
    description: "Medium-long term debt financing for post-harvest management infrastructure and community farming assets with 3% interest subvention per annum.",
    matchPercentage: 91,
    eligibilityFactors: ["Cold storage, warehouse, sorting/grading units", "Primary Agricultural Credit Societies & Agri-entrepreneurs", "3% interest subvention for 7 years"],
    documents: ["Land Revenue Record", "Detailed Project Report", "Audited Financials/ITR", "Bank Loan Application"],
    missingRequirements: ["NOC from local development authority"]
  }
];

function matchHeuristicSchemes(query: string) {
  const q = (query || '').toLowerCase();
  let matched = ALL_SCHEMES;

  if (q.includes('food') || q.includes('oil') || q.includes('chakki') || q.includes('processing') || q.includes('spice') || q.includes('flour') || q.includes('pickle')) {
    matched = ALL_SCHEMES.filter(s => s.name.includes('PMFME') || s.name.includes('PMEGP') || s.name.includes('MUDRA'));
  } else if (q.includes('dairy') || q.includes('poultry') || q.includes('goat') || q.includes('livestock') || q.includes('murgi') || q.includes('bakri') || q.includes('milk')) {
    matched = ALL_SCHEMES.filter(s => s.name.includes('NLM') || s.name.includes('PMEGP') || s.name.includes('MUDRA'));
  } else if (q.includes('storage') || q.includes('warehouse') || q.includes('cold') || q.includes('agri')) {
    matched = ALL_SCHEMES.filter(s => s.name.includes('AIF') || s.name.includes('PMEGP') || s.name.includes('MUDRA'));
  } else if (q.includes('women') || q.includes('mahila') || q.includes('sc') || q.includes('st')) {
    matched = ALL_SCHEMES.filter(s => s.name.includes('Stand-Up') || s.name.includes('PMEGP'));
  }

  return { schemes: matched.slice(0, 3) };
}

export async function POST(req: Request) {
  try {
    const { query = '' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const modelName of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            Act as an expert advisor on Indian Government Schemes (PMEGP, MUDRA, PMFME, Stand-Up India, AIF, NLM, etc.).
            Analyze this query/profile and find the top 2-3 best matching schemes:
            Query: "${query}"

            Return ONLY a valid JSON object without markdown formatting:
            {
              "schemes": [
                {
                  "name": "String (Official Scheme Name)",
                  "description": "String (Clear summary of subsidy/loan terms)",
                  "matchPercentage": Number (0-100),
                  "eligibilityFactors": ["Factor 1", "Factor 2"],
                  "documents": ["Doc 1", "Doc 2", "Doc 3"],
                  "missingRequirements": ["Requirement user may need to obtain"]
                }
              ]
            }
          `;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsedData = extractJSON(responseText);

          if (parsedData && Array.isArray(parsedData.schemes) && parsedData.schemes.length > 0) {
            return NextResponse.json(parsedData);
          }
        } catch (modelErr) {
          console.warn(`Gemini schemes model ${modelName} failed, trying next:`, modelErr);
        }
      }
    }

    return NextResponse.json(matchHeuristicSchemes(query));
  } catch (error) {
    console.error('Schemes API error, returning fallback:', error);
    return NextResponse.json(matchHeuristicSchemes(''));
  }
}
