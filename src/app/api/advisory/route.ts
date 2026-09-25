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
    console.error('Failed to parse AI JSON response:', err);
    return null;
  }
}

function generateHeuristicAdvisory(location: string, capital: string, interests: string, infrastructure: string) {
  const cap = parseInt(capital, 10) || 100000;
  const normalizedInterest = (interests || '').toLowerCase();
  const normalizedInfra = (infrastructure || '').toLowerCase();
  const normalizedLoc = location || 'your region';
  const cityName = normalizedLoc.split(',')[0].trim() || 'Regional Market';

  let recommendation = `Hyper-Local Retail & Essential Consumer Goods Hub (${cityName})`;
  let viabilityScore = 82;
  let analysis = '';
  let actionSteps: string[] = [];

  if (normalizedInterest.includes('dairy') || normalizedInterest.includes('milk') || normalizedInterest.includes('pashu') || normalizedInterest.includes('ghee') || normalizedInterest.includes('paneer')) {
    recommendation = `Modern Dairy & Value-Added Milk Unit (${cityName})`;
    viabilityScore = cap >= 100000 ? 89 : 76;
    analysis = `Based on your target market in ${normalizedLoc} and available capital of ₹${cap.toLocaleString('en-IN')}, a dairy collection, chilling, and value-added product unit (paneer, curd, packaged milk) is highly viable. Your infrastructure assets (${infrastructure || 'local facility'}) support clean milk handling. Local households, sweet shops, and eateries in ${cityName} provide a reliable, daily cash-settled customer base with 25-32% gross margins.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.45).toLocaleString('en-IN')} for 2 high-yield cattle or bulk stainless steel milk chilling cans`,
      "Obtain basic FSSAI Form A registration and local trade license",
      "Establish morning doorstep WhatsApp subscriptions across 35-50 residential clusters",
      "Apply for 35% PMEGP capital subsidy or National Livestock Mission loan"
    ];
  } else if (normalizedInterest.includes('cold') || normalizedInterest.includes('storage') || normalizedInterest.includes('warehouse') || normalizedInterest.includes('logistics') || normalizedInterest.includes('delivery')) {
    recommendation = `Agro-Cold Storage & Regional Logistics Depot (${cityName})`;
    viabilityScore = cap >= 250000 ? 88 : 74;
    analysis = `Regional mandi trade corridors in ${normalizedLoc} suffer 18-25% crop spoilage during seasonal harvest peaks. Utilizing your capital of ₹${cap.toLocaleString('en-IN')} alongside ${infrastructure || 'storage space'} will capture high-margin storage fees and bulk transport consolidation for local farmers and mandi traders.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.4).toLocaleString('en-IN')} for modular cold chamber installation or insulated storage racking`,
      "Partner with 10-15 local mandi vegetable and fruit traders for guaranteed monthly batch contracts",
      "Register on the e-NAM portal and apply for Agriculture Infrastructure Fund (AIF) 3% interest subvention",
      "Implement solar/inverter power backup to safeguard perishable inventory"
    ];
  } else if (normalizedInterest.includes('oil') || normalizedInterest.includes('flour') || normalizedInterest.includes('chakki') || normalizedInterest.includes('mill') || normalizedInterest.includes('spice') || normalizedInterest.includes('masala')) {
    recommendation = `Cold-Press Oil Extraction & Clean Flour Mill (${cityName})`;
    viabilityScore = cap >= 120000 ? 87 : 78;
    analysis = `Consumer demand for pure, unadulterated cold-pressed mustard/sesame oil and stone-ground flour is surging across ${normalizedLoc}. Sourcing seeds directly from nearby growers and selling packaged oil with byproduct cattle feed cake (Khali) delivers dual profit streams with break-even within 4 months.`;
    actionSteps = [
      `Procure commercial 3HP cold-press expeller and pulverizer (₹${Math.floor(cap * 0.45).toLocaleString('en-IN')})`,
      "Obtain FSSAI license and Udyam MSME certification online",
      "Package cold-pressed oil in 1L and 5L transparent food-grade bottles with custom branding",
      "Supply 15-20 neighborhood Kirana stores with introductory retail margins"
    ];
  } else if (normalizedInterest.includes('csc') || normalizedInterest.includes('digital') || normalizedInterest.includes('service') || normalizedInterest.includes('cyber') || normalizedInterest.includes('banking') || normalizedInterest.includes('atm')) {
    recommendation = `Panchayat Digital Seva & Micro-Banking Hub (${cityName})`;
    viabilityScore = 91;
    analysis = `A digital services and micro-ATM kiosk in ${normalizedLoc} requires low capital (₹${cap.toLocaleString('en-IN')}) with zero inventory risk. Your setup with ${infrastructure || 'power & connectivity'} enables continuous footfall for government scheme benefit filings, banking AEPS cash withdrawals, PAN/Aadhaar updates, and online utility ticketing.`;
    actionSteps = [
      `Invest ₹${Math.floor(Math.min(cap, 60000) * 0.6).toLocaleString('en-IN')} in multi-function duplex printer, PC, and biometric scanner`,
      "Register for CSC VLE ID and partner with an authorized AEPS banking correspondent (PayPoint/SpiceMoney)",
      "Place physical signage near Panchayat office and market chowk",
      "Provide PM Kisan e-KYC, utility bill payment, and passport photo services"
    ];
  } else if (normalizedInterest.includes('hardware') || normalizedInterest.includes('electrical') || normalizedInterest.includes('pipe') || normalizedInterest.includes('solar') || normalizedInterest.includes('tools')) {
    recommendation = `Solar Equipment, Hardware & Electrical Point (${cityName})`;
    viabilityScore = cap >= 150000 ? 86 : 75;
    analysis = `Agricultural modernization in ${normalizedLoc} is driving unprecedented demand for submersible pump pipes, fittings, solar inverters, and electrical accessories. With your working capital of ₹${cap.toLocaleString('en-IN')}, partnering with wholesale distributors will yield steady 22-30% margins.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.5).toLocaleString('en-IN')} on fast-moving electrical wire bundles, switches, LED fixtures, and PVC pipe fittings`,
      "Secure dealership linkage with regional electrical wholesale distributor in nearest district hub",
      "Offer on-call repair and installation technicians to village households",
      "Enroll under PM Surya Ghar Muft Bijli Yojana vendor network for rooftop solar installations"
    ];
  } else if (normalizedInterest.includes('pharmacy') || normalizedInterest.includes('medical') || normalizedInterest.includes('health') || normalizedInterest.includes('clinic')) {
    recommendation = `Rural Health Care & Essential Pharmacy Outlet (${cityName})`;
    viabilityScore = cap >= 200000 ? 92 : 79;
    analysis = `Access to essential generic medicines and diagnostic test kits in ${normalizedLoc} commands consistent, year-round demand. Sourcing generic pharmaceuticals through Jan Aushadhi Kendra or MSME wholesale provides up to 50% profit margins.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.45).toLocaleString('en-IN')} for licensed generic pharmaceutical inventory and glass display racks`,
      "Obtain State Drug Controller retail license or apply for Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
      "Add digital blood pressure, glucose testing, and telemedicine consultation kiosk",
      "Establish home delivery services for elderly patients across neighboring villages"
    ];
  } else if (cap < 75000) {
    recommendation = `Hyper-Local Digital & Fast-Moving Retail Kiosk (${cityName})`;
    viabilityScore = 84;
    analysis = `With an accessible capital of ₹${cap.toLocaleString('en-IN')} in ${normalizedLoc}, launching a low-capex digital retail and essential goods point offers rapid break-even (under 45 days) and high daily cash velocity.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.4).toLocaleString('en-IN')} into high-turnover fast-moving inventory and packaging staples`,
      "Set up digital UPI QR billing and WhatsApp catalog for neighboring households",
      "Apply for PM MUDRA Shishu collateral-free loan (up to ₹50,000)",
      "Maintain daily digital ledger on Khatabook to monitor gross margin"
    ];
  } else {
    recommendation = `Specialized Agro-Processing & Commercial Supply Center (${cityName})`;
    viabilityScore = 85;
    analysis = `Based on your geographic positioning in ${normalizedLoc} and capital base of ₹${cap.toLocaleString('en-IN')}, establishing a commercial supply and processing point delivers resilient returns. Your infrastructure setup (${infrastructure || 'commercial space'}) supports scalable local distribution with 28%-38% operating margins.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.38).toLocaleString('en-IN')} for initial machinery, shop front, and safety equipment`,
      "Obtain necessary local trade licenses and Udyam MSME registration",
      "Form direct supplier linkages with regional wholesale mandis",
      "Leverage PMEGP 35% subsidy to scale working capital buffer"
    ];
  }

  return {
    recommendation,
    viabilityScore,
    analysis,
    actionSteps
  };
}

export async function POST(req: Request) {
  try {
    const { location = '', capital = '100000', interests = '', infrastructure = '' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const modelName of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            Act as a highly analytical hyper-local rural & semi-urban business advisor in India.
            Target Audience: Entrepreneurs, micro-enterprise founders, traders, and small business owners.
            Analyze the following inputs and generate a highly specific, hyper-accurate business plan tailored strictly to the EXACT location provided.
            
            Inputs:
            - Location: ${location || 'India'}
            - Available Capital: ₹${capital}
            - Interests / Preferred Sector / Experience: ${interests || 'General Small Business'}
            - Available Infrastructure / Utilities: ${infrastructure || 'Commercial space with basic utilities'}

            CRITICAL INSTRUCTIONS:
            1. Tailor the business idea specifically to ${location}.
            2. Viability Score must be an integer between 0 and 100 based on realistic market conditions.
            3. Return ONLY a valid JSON object without markdown formatting:
            {
              "recommendation": "String (e.g. Modern Dairy & Value-Added Milk Unit (Delhi))",
              "viabilityScore": Number (0-100),
              "analysis": "String (Detailed strategic analysis of why this works in ${location}, market gap, profit margins, and customer demand)",
              "actionSteps": ["Step 1 with estimated cost", "Step 2 with license/regulatory step", "Step 3 with customer acquisition", "Step 4 with subsidy/loan application"]
            }
          `;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsedData = extractJSON(responseText);

          if (parsedData && parsedData.recommendation && parsedData.viabilityScore) {
            return NextResponse.json({
              recommendation: parsedData.recommendation,
              viabilityScore: typeof parsedData.viabilityScore === 'number' ? parsedData.viabilityScore : 85,
              analysis: parsedData.analysis || 'Comprehensive market evaluation generated.',
              actionSteps: Array.isArray(parsedData.actionSteps) && parsedData.actionSteps.length > 0 
                ? parsedData.actionSteps 
                : [
                    'Procure essential machinery and initial raw inventory',
                    'Obtain local trade licenses and Udyam MSME certification',
                    'Establish local retail distribution and doorstep subscriptions',
                    'Apply for government subsidy (PMEGP / MUDRA) to expand working capital'
                  ]
            });
          }
        } catch (modelErr) {
          console.warn(`Gemini model ${modelName} call failed, trying next:`, modelErr);
        }
      }
    }

    // High-quality deterministic fallback if no API key or if API calls failed
    const fallbackData = generateHeuristicAdvisory(location, capital, interests, infrastructure);
    return NextResponse.json(fallbackData);

  } catch (error) {
    console.error('Advisory POST error, returning fallback:', error);
    const fallbackData = generateHeuristicAdvisory('', '100000', '', '');
    return NextResponse.json(fallbackData);
  }
}
