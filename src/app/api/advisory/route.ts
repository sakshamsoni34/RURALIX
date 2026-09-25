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

  let recommendation = `Local Retail & Grocery Store (${cityName})`;
  let viabilityScore = 82;
  let analysis = '';
  let actionSteps: string[] = [];

  if (normalizedInterest.includes('dairy') || normalizedInterest.includes('milk') || normalizedInterest.includes('pashu') || normalizedInterest.includes('ghee') || normalizedInterest.includes('paneer')) {
    recommendation = `Dairy Farming & Milk Products Unit (${cityName})`;
    viabilityScore = cap >= 100000 ? 89 : 76;
    analysis = `Based on your target market in ${normalizedLoc} and available capital of ₹${cap.toLocaleString('en-IN')}, a dairy collection, chilling, and milk products unit (paneer, curd, packaged milk) is highly viable. Local households, sweet shops, and eateries in ${cityName} provide a steady daily cash customer base with 25-32% gross margins.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.45).toLocaleString('en-IN')} for 2 high-yield cattle or bulk milk storage cans`,
      "Obtain basic FSSAI Form A registration and local trade license",
      "Establish morning doorstep milk deliveries across 35-50 neighborhood families",
      "Apply for 35% PMEGP capital subsidy or National Livestock Mission loan"
    ];
  } else if (normalizedInterest.includes('cold') || normalizedInterest.includes('storage') || normalizedInterest.includes('warehouse') || normalizedInterest.includes('logistics') || normalizedInterest.includes('delivery')) {
    recommendation = `Cold Storage & Agri-Logistics Center (${cityName})`;
    viabilityScore = cap >= 250000 ? 88 : 74;
    analysis = `Mandi trade areas in ${normalizedLoc} experience produce spoilage during seasonal harvest peaks. Utilizing your capital of ₹${cap.toLocaleString('en-IN')} alongside ${infrastructure || 'storage space'} will capture reliable storage fees and transport consolidation for local farmers and traders.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.4).toLocaleString('en-IN')} for cold room equipment or storage racking`,
      "Partner with 10-15 local mandi vegetable and fruit traders for monthly storage agreements",
      "Register on the e-NAM portal and apply for Agriculture Infrastructure Fund (AIF) 3% interest subsidy",
      "Set up solar or inverter power backup to protect stored produce"
    ];
  } else if (normalizedInterest.includes('oil') || normalizedInterest.includes('flour') || normalizedInterest.includes('chakki') || normalizedInterest.includes('mill') || normalizedInterest.includes('spice') || normalizedInterest.includes('masala')) {
    recommendation = `Cold-Pressed Oil & Flour Mill (${cityName})`;
    viabilityScore = cap >= 120000 ? 87 : 78;
    analysis = `Consumer demand for pure mustard/sesame oil and freshly ground flour is high across ${normalizedLoc}. Sourcing seeds directly from nearby farmers and selling packaged oil with byproduct cattle feed cake (Khali) delivers steady profits with break-even within 4 months.`;
    actionSteps = [
      `Procure commercial 3HP oil expeller and flour mill (₹${Math.floor(cap * 0.45).toLocaleString('en-IN')})`,
      "Obtain FSSAI license and Udyam MSME registration online",
      "Package oil in 1L and 5L clean food-grade bottles with custom labels",
      "Supply 15-20 neighborhood Kirana stores with introductory retail margins"
    ];
  } else if (normalizedInterest.includes('csc') || normalizedInterest.includes('digital') || normalizedInterest.includes('service') || normalizedInterest.includes('cyber') || normalizedInterest.includes('banking') || normalizedInterest.includes('atm')) {
    recommendation = `Digital Seva & Banking Kiosk (${cityName})`;
    viabilityScore = 91;
    analysis = `A digital services and micro-ATM kiosk in ${normalizedLoc} requires low capital (₹${cap.toLocaleString('en-IN')}) with zero inventory risk. Your setup with ${infrastructure || 'power & internet'} enables continuous footfall for government scheme applications, banking cash withdrawals (AEPS), and utility bill payments.`;
    actionSteps = [
      `Invest ₹${Math.floor(Math.min(cap, 60000) * 0.6).toLocaleString('en-IN')} in printer, computer, and biometric scanner`,
      "Register for CSC VLE ID and partner with an authorized AEPS banking partner (PayPoint/SpiceMoney)",
      "Place clear signage near Panchayat office and market area",
      "Provide PM Kisan e-KYC, utility bill payment, and photo services"
    ];
  } else if (normalizedInterest.includes('hardware') || normalizedInterest.includes('electrical') || normalizedInterest.includes('pipe') || normalizedInterest.includes('solar') || normalizedInterest.includes('tools')) {
    recommendation = `Electrical & Hardware Store (${cityName})`;
    viabilityScore = cap >= 150000 ? 86 : 75;
    analysis = `Construction and farming in ${normalizedLoc} drive steady demand for water pipes, electrical wiring, solar lights, and tools. With your working capital of ₹${cap.toLocaleString('en-IN')}, partnering with wholesale distributors yields consistent 22-30% margins.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.5).toLocaleString('en-IN')} on fast-moving electrical wires, switches, LED lights, and PVC pipes`,
      "Secure dealership connection with electrical wholesale distributor in nearest district market",
      "Offer on-call repair and installation technicians to local households",
      "Enroll under PM Surya Ghar Muft Bijli Yojana vendor network for solar installations"
    ];
  } else if (normalizedInterest.includes('pharmacy') || normalizedInterest.includes('medical') || normalizedInterest.includes('health') || normalizedInterest.includes('clinic')) {
    recommendation = `Medical Store & Healthcare Center (${cityName})`;
    viabilityScore = cap >= 200000 ? 92 : 79;
    analysis = `Access to essential medicines and health supplies in ${normalizedLoc} commands constant demand. Sourcing generic pharmaceuticals through Jan Aushadhi Kendra or MSME wholesale provides solid margins and vital community service.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.45).toLocaleString('en-IN')} for generic pharmaceutical stock and display racks`,
      "Obtain State Drug Controller retail license or apply for Pradhan Mantri Jan Aushadhi Kendra",
      "Add digital blood pressure, glucose testing, and online doctor consultation kiosk",
      "Provide medicine delivery for elderly patients across neighboring villages"
    ];
  } else if (cap < 75000) {
    recommendation = `Daily Needs & Essentials Store (${cityName})`;
    viabilityScore = 84;
    analysis = `With an initial capital of ₹${cap.toLocaleString('en-IN')} in ${normalizedLoc}, launching a retail and essential goods store offers fast break-even and reliable daily cash flow.`;
    actionSteps = [
      `Deploy ₹${Math.floor(cap * 0.4).toLocaleString('en-IN')} into fast-moving daily grocery and household items`,
      "Set up digital UPI QR payment and WhatsApp orders for neighborhood families",
      "Apply for PM MUDRA Shishu collateral-free loan (up to ₹50,000)",
      "Maintain daily sales records on Khatabook to track profits"
    ];
  } else {
    recommendation = `Agri-Processing & Supply Center (${cityName})`;
    viabilityScore = 85;
    analysis = `Based on your location in ${normalizedLoc} and capital of ₹${cap.toLocaleString('en-IN')}, establishing a local supply and processing unit delivers solid returns. Your infrastructure (${infrastructure || 'commercial space'}) supports steady local sales with 28%-38% operating margins.`;
    actionSteps = [
      `Allocate ₹${Math.floor(cap * 0.38).toLocaleString('en-IN')} for machinery, shop setup, and initial stock`,
      "Obtain local trade licenses and Udyam MSME registration",
      "Form direct purchasing links with nearby wholesale mandis",
      "Apply for PMEGP 35% subsidy to strengthen working capital"
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
            Act as a practical rural and small business advisor in India.
            Target Audience: Entrepreneurs, micro-enterprise founders, traders, and small shop owners.
            Analyze the following inputs and generate a specific, realistic business plan tailored strictly to the location provided.
            
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
