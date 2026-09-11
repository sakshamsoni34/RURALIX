import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UserContext {
  userProfile?: {
    businessIdea?: string;
    location?: string;
    capital?: string | number;
    infrastructure?: string;
    experience?: string;
  };
  realityScores?: {
    overall?: number;
    demand?: number;
    competition?: number;
    profit?: number;
    risk?: number;
    infra?: number;
  };
  schemes?: Array<{
    name: string;
    subsidy: string;
    status: string;
    portalUrl?: string;
  }>;
}

function generateBusinessWorkflow(idea: string, loc: string, cap: string, infra: string, exp: string): string {
  const normalized = idea.toLowerCase();

  if (normalized.includes('dairy') || normalized.includes('milk') || normalized.includes('ghee') || normalized.includes('paneer')) {
    return `📋 **End-to-End Business Workflow: Dairy & Milk Processing in ${loc}**

🏗️ **Phase 1: Setup & Licensing (Week 1–2)**
• **Registrations:** Obtain Udyam Registration (free online) and basic FSSAI Registration (Form A) for dairy handling.
• **Premises:** Set up your ${infra || 'chilling & packaging area'} with washable tiled floors and 24/7 clean water supply.
• **Equipment Setup:** Procure stainless steel milk cans (40L), milk analyzer/lactometer, electronic weighing scale, and deep freezer/chiller.

📦 **Phase 2: Sourcing & Farmer Network (Week 2–3)**
• **Direct Farmer Tie-ups:** Form agreements with 10–15 local cattle owners within a 5–8 km radius.
• **Pricing Model:** Implement transparent FAT/SNF-based instant testing & digital payout system.
• **Logistics:** Set up insulated pickup crates/cans for morning (6 AM) and evening (5 PM) collection routes.

⚙️ **Phase 3: Daily Operations Schedule (Daily Routine)**
• **05:30 AM – 07:30 AM:** Morning milk reception, FAT & density quality test, immediate straining & chilling (< 4°C).
• **08:00 AM – 11:30 AM:** Value-addition processing (curd setting, paneer pressing, or cream separation for ghee).
• **04:30 PM – 06:30 PM:** Evening batch collection, cold storage rotation, and container sterilization.
• **07:00 PM – 08:30 PM:** Pouching/bottling and delivery staging for local retailers.

🏷️ **Phase 4: Quality, Packaging & Hygiene (Continuous)**
• **Sterilization:** CIP (Clean-in-Place) hot water wash with food-grade sanitizers after every single batch.
• **Packaging:** Food-grade tamper-evident pouches or reusable glass bottles with dated seal.
• **Cold Chain:** Strict adherence to sub-5°C cold chain to eliminate spoilage risk.

🚚 **Phase 5: Marketing & Local Distribution (Ongoing)**
• **Direct Consumer (D2C):** Morning doorstep delivery subscriptions via WhatsApp broadcast.
• **B2B Bulk Supply:** Partner with local sweet shops (Mithai wallahs), tea stalls, and neighborhood bakeries.
• **Weekly Haat Stall:** Sell fresh paneer, butter, and ghee at the weekly regional mandi.

📈 **Phase 6: Finance, Working Capital & Growth (Weekly/Monthly)**
• **Daily Ledger:** Record liters collected vs. sold using Khatabook or digital register.
• **Cash Cycle:** Weekly billing for bulk buyers; upfront daily/monthly prepayment for household customers.
• **Reinvestment:** Reinvest ~35% of monthly profits to add automated cream separator or cold storage battery backup.

🛠️ **Essential Equipment Checklist:**
1. Electronic Milk Tester & Lactometer (₹18,000–₹25,000)
2. Stainless Steel Milk Cans & Strainers (₹8,000)
3. Commercial Deep Freezer / Chilling Unit (₹30,000–₹45,000)
4. Paneer Pressing Machine & Cloths (₹6,000)

⚠️ **Critical Risk & Mitigation:**
• *Spoilage risk during power cuts:* Ensure inverter/battery backup for the primary chiller unit from day one.`;
  }

  if (normalized.includes('poultry') || normalized.includes('chicken') || normalized.includes('broiler') || normalized.includes('layer') || normalized.includes('egg')) {
    return `📋 **End-to-End Business Workflow: Poultry & Egg Farming in ${loc}**

🏗️ **Phase 1: Shed Setup & Biosecurity (Week 1–2)**
• **Facility:** Prepare well-ventilated shed with proper East-West orientation on your ${infra || 'open plot'}.
• **Disinfection:** Thoroughly whitewash walls with quicklime and spray formaldehyde/iodophor disinfectant.
• **Bedding:** Lay 3–4 inches of clean, dry paddy husk or wood shavings.
• **Brooding Zone:** Install infrared heating lamps or hover brooders to maintain 33°C–35°C temperature.

📦 **Phase 2: Sourcing Day-Old Chicks (DOC) & Feed (Week 2–3)**
• **Chicks:** Procure vaccinated Day-Old Chicks (DOC) from a certified hatchery (Cobb 500/Hubbard for broilers; BV380 for layers).
• **Feed Supplies:** Pre-order Starter, Grower, and Finisher poultry feed bags plus multivitamin/probiotic electrolytes.

⚙️ **Phase 3: Lifecycle Management (40–45 Day Broiler Cycle / Daily Layer SOP)**
• **Week 1 (Brooding):** 24-hr lighting, temperature monitoring, electrolyte water, and crumble starter feed.
• **Week 2–4 (Growing):** Gradual feeder height adjustment, ventilation management, Newcastle (Ranikhet) and Gumboro vaccinations.
• **Week 5–6 (Finishing):** Transition to Finisher mash; target body weight: 2.0–2.4 kg per bird.
• **Daily SOP:** 06:00 AM feeder refill & water line flushing → 12:00 PM temperature/mortality inspection → 05:30 PM evening feeding.

🏷️ **Phase 4: Harvesting & Health Management**
• **Culling / Harvesting:** Clean catching at night or early morning to minimize bird stress.
• **Egg Collection (for Layers):** 3 collections daily (9 AM, 1 PM, 5 PM), grading by size, and gentle tray packing.
• **Manure Handling:** Weekly litter racking to prevent ammonia buildup; dry composting for high-value organic manure sales.

🚚 **Phase 5: Sales & Distribution (Market Phase)**
• **Local Meat Traders & Dressed Outlets:** Direct wholesale contract with local poultry shops in ${loc}.
• **Direct Farm Gate Sales:** Sell live birds / fresh country eggs directly to neighboring villagers and food stalls.
• **Panchayat/Haat Days:** Bulk batch offloading during festive peaks or Sunday markets.

📈 **Phase 6: Cycle Settlement & Cash Flow**
• **FCR Calculation:** Calculate Feed Conversion Ratio (Target < 1.6 FCR for maximum profitability).
• **Working Capital:** Reinvest chick & feed cost for the next batch immediately upon batch liquidation.
• **Reserve Fund:** Keep 15% margin fund for emergency vaccination or feed price fluctuations.

🛠️ **Essential Equipment Checklist:**
1. Bell Drinkers & Hanging Feeders (₹4,000–₹8,000)
2. Brooder Hood & Infrared Bulbs (₹3,500)
3. Thermometer & Hygrometer (₹800)
4. Spray Disinfectant Pump (₹1,500)

⚠️ **Critical Risk & Mitigation:**
• *Disease Outbreak:* Strict visitor restriction, foot dip at shed entrance, and 100% adherence to vaccination schedule.`;
  }

  if (normalized.includes('oil') || normalized.includes('flour') || normalized.includes('atta') || normalized.includes('chakki') || normalized.includes('mill') || normalized.includes('spice')) {
    return `📋 **End-to-End Business Workflow: Agro-Processing & Cold-Press Unit in ${loc}**

🏗️ **Phase 1: Unit Setup & Power Connection (Week 1–2)**
• **Location:** Setup unit in a dust-free space with single/three-phase electricity and concrete machinery foundation.
• **Permits:** Udyam MSME, FSSAI Basic registration, and local Panchayat NOC.
• **Machinery:** Install cold-press wooden/stainless expeller, commercial pulverizer, and vibro-sifter.

📦 **Phase 2: Raw Material Sourcing (Week 2–3)**
• **Direct Mandi Procurement:** Buy dry seeds (mustard, groundnut, sesame, wheat, turmeric) directly from local farmers at peak harvest.
• **Quality Checks:** Inspect moisture content (< 8% moisture) and sieve out dust/chaff before storage.
• **Storage:** Store in food-grade moisture-proof HDPE bags stacked on wooden pallets off the floor.

⚙️ **Phase 3: Daily Production Cycle (Daily SOP)**
• **07:00 AM – 09:00 AM:** Seed sorting, solar drying check, and machine lubrication with food-grade oil.
• **09:30 AM – 02:00 PM:** Cold-pressing extraction / slow-speed chakki milling (retaining nutrients & natural aroma).
• **02:30 PM – 04:30 PM:** Multi-stage cloth filtration & oil settling in stainless steel tanks.
• **05:00 PM – 07:00 PM:** Cake (khali / bran) extraction, bagging, and machine shutdown deep-clean.

🏷️ **Phase 4: Packaging & Value Byproduct Monetization**
• **Packaging:** Seal in clear PET bottles / food-grade stand-up zip pouches with attractive batch label and FSSAI mark.
• **Byproduct Revenue:** Sell organic oil cakes (Khali) and bran (Choker) to local dairy farmers as premium cattle feed.

🚚 **Phase 5: Hyperlocal Sales & Distribution**
• **Retailer Shelves:** Supply 15–20 neighborhood Kirana shops with sale-or-return introductory margins.
• **Direct Subscriptions:** Monthly 5L/15L household tin supplies across residential clusters in ${loc}.
• **Sample Campaign:** Distribute 50ml trial bottles to local sweet makers and premium home kitchens.

📈 **Phase 6: Financial Management & Growth**
• **Margin Tracking:** Monitor seed cost vs. oil yield (e.g. 33%–38% for mustard) + cake recovery.
• **Cash Flow:** Require instant UPI/cash payment from walk-in retail; 7-day credit cap on grocery stores.
• **Scale-up:** Introduce regional specialty spices or cold-pressed coconut/sesame variants in Month 4.

🛠️ **Essential Equipment Checklist:**
1. Cold Press Expeller / Heavy Duty Chakki (₹65,000–₹1,10,000)
2. Stainless Steel Filtration Tank (₹12,000)
3. Semi-Automatic Liquid / Powder Filler (₹15,000)
4. Impulse Heat Sealer & Digital Scale (₹4,500)

⚠️ **Critical Risk & Mitigation:**
• *Rancidity & Moisture:* Always pre-clean and sun-dry raw grains/seeds to keep moisture under 8% before milling.`;
  }

  if (normalized.includes('vermicompost') || normalized.includes('fertilizer') || normalized.includes('organic farm') || normalized.includes('manure')) {
    return `📋 **End-to-End Business Workflow: Vermicompost & Organic Fertilizer Unit in ${loc}**

🏗️ **Phase 1: Bed Preparation & Shade Setup (Week 1–2)**
• **Site Selection:** Elevated, well-drained shaded ground on your ${infra || 'farm premises'}.
• **Bed Construction:** Build HDPE vermi-beds (12ft x 4ft x 2ft) or brick-lined raised beds under agro-net shade (75% shade).
• **Earthworm Selection:** Procure *Eisenia Foetida* (Red Wigglers) from an authorized Krishi Vigyan Kendra (KVK).

📦 **Phase 2: Biomass & Dung Sourcing (Week 2–3)**
• **Raw Material:** Collect fresh cow dung from local dairy owners and dry agricultural residues (crop stubble, dry leaves).
• **Pre-Decomposition:** Mix cow dung and biomass (1:1 ratio) and pre-cure for 10–12 days to release initial heat.

⚙️ **Phase 3: Vermicomposting Process (45–60 Day Cycle)**
• **Bed Layering:** Base layer of dry straw (3 inches) → Pre-decomposed cow dung mixture (1.5 ft height).
• **Inoculation:** Release 1.5–2 kg earthworms per bed on the top surface.
• **Moisture Maintenance:** Light water sprinkling every 2–3 days to maintain 60%–70% moisture and cool temperature.
• **Top Raking:** Gently rake the top 2 inches weekly once black granular castings appear.

🏷️ **Phase 4: Harvesting, Sieving & Packing**
• **Harvesting:** Stop watering 3 days prior; earthworms migrate down; scrape top granular compost layer.
• **Sieving:** Pass compost through a 3mm rotary sieve to separate fine tea-powder-like vermicompost and cocoons.
• **Packaging:** Pack in 5kg, 25kg, and 50kg UV-stabilized breathable HDPE bags.
• **Byproduct:** Collect nutrient-dense **Vermiwash** liquid from bed drainage taps as liquid foliar spray.

🚚 **Phase 5: Sales Channels & Marketing**
• **Local Farmers:** Package bulk 50kg bags for vegetable, fruit, and sugarcane growers in ${loc}.
• **Urban & Nursery Channels:** Supply 2kg/5kg premium packs to plant nurseries and home gardeners.
• **Government Linkages:** Register as supplier for PKVY (Paramparagat Krishi Vikas Yojana) farmer clusters.

📈 **Phase 6: Revenue Cycle & Multiplication**
• **Earthworm Doubling:** Earthworm population multiplies by 2x every 60 days—sell surplus worms at ₹300–₹500/kg.
• **Cash Margins:** 60%–70% gross margins due to near-zero raw material input cost.
• **Reinvestment:** Add 4 new vermi-beds every quarter from operational profits.

🛠️ **Essential Equipment Checklist:**
1. HDPE Reinforced Vermi-Beds with Shade Net (₹1,800–₹2,500/bed)
2. Rotary Drum Compost Sieve (₹12,000–₹18,000)
3. Water Sprinkler System / Hose (₹2,500)
4. Heavy Duty Moisture Meter & Bag Stitcher (₹4,500)

⚠️ **Critical Risk & Mitigation:**
• *Pest Protection & Overheating:* Protect beds from red ants/birds with neem oil spray borders; never add hot fresh dung directly.`;
  }

  // Dynamic Comprehensive 6-Phase Workflow for Any Custom Business Idea
  return `📋 **End-to-End Business Workflow: ${idea} in ${loc}**

🏗️ **Phase 1: Business Setup, Licensing & Location Prep (Week 1–2)**
• **Statutory Approvals:** Register Udyam MSME certificate (online), obtain local Panchayat trade NOC, and applicable sector permits (e.g. GSTIN if turnover > ₹20L/₹40L or FSSAI if food-related).
• **Premises & Layout:** Organize your workspace utilizing your ${infra || 'designated workspace'}, ensuring clear zoning for raw materials, core production/service station, and finished storage.
• **Initial Capital Allocation:** Deploy approx. 35% of your available budget (${cap}) into essential machinery, foundation work, and initial security deposits.

📦 **Phase 2: Vendor Sourcing & Supply Chain Readiness (Week 2–3)**
• **Direct Vendor Discovery:** Shortlist 2–3 primary wholesale distributors or raw material suppliers within ${loc} or regional trading hubs.
• **Terms Negotiation:** Negotiate initial batch wholesale pricing and secure flexible 7–14 day credit cycles once repeat orders commence.
• **Safety Buffer Inventory:** Keep a minimum 10-day buffer of high-demand consumables to avoid supply chain disruptions.

⚙️ **Phase 3: Core Daily Execution & Standard Operating Procedure (Daily SOP)**
• **Morning (08:00 AM – 11:00 AM):** Material readiness check, equipment calibration, and high-focus production/service kickoff.
• **Afternoon (11:30 AM – 03:30 PM):** Main processing, order fulfillment, client handling, and active team coordination.
• **Evening (04:00 PM – 06:30 PM):** Packaging, final inspection, delivery dispatch, and daily tools maintenance/sterilization.
• **Closing (07:00 PM – 07:30 PM):** Daily inventory count, ledger entry, and next-day material staging.

🏷️ **Phase 4: Quality Assurance, Packaging & Customer Experience (Continuous)**
• **Standard Quality Checkpoints:** Implement a 3-point checklist (Visual integrity, Exact weight/dimensions, Functionality test) prior to handoff.
• **Professional Presentation:** Use clean, branded labeling with clear contact details, price, batch code, and date.
• **Customer Feedback Loop:** Capture phone numbers of walk-in or delivery customers for automated satisfaction check-ins.

🚚 **Phase 5: Hyperlocal Marketing, Distribution & Sales Channels (Ongoing)**
• **Direct Local Outlets:** Establish direct supply to 10–15 retail touchpoints or anchor clients in ${loc}.
• **WhatsApp Business Engine:** Run a digital catalog with broadcast updates announcing fresh batches, seasonal offers, and discounts.
• **Community Footprint:** Partner with local self-help groups (SHGs), village panchayat hubs, and weekly market haats for direct awareness.

📈 **Phase 6: Financial Control, Cash Flow & Scalability (Weekly/Monthly)**
• **Daily Settlement:** Log every inflow and outflow immediately on Khatabook or digital accounting app.
• **Working Capital Rule:** Maintain a strict 20% liquid cash reserve (${cap ? `₹${Math.round(Number(cap) * 0.2).toLocaleString('en-IN')}` : 'reserve'}) for seasonal surges.
• **Reinvestment Milestones:** Once consistent operating profit is achieved (Month 3–4), reinvest 30% into semi-automation or expanding your delivery radius.

🛠️ **Essential Operational Toolset:**
1. Core Commercial Equipment / Workstation Machinery
2. Electronic Weighing & Measurement Instruments
3. Digital Payment POS & Invoicing Setup
4. Protective Safety Gear & Clean Storage Racks

⚠️ **Critical Risk & Mitigation:**
• *Cash flow blockage from delayed credit:* Never extend credit exceeding 20% of your total working capital. Enforce strict payment terms on delivery.

💡 **Grameen Mentor Pro-Tip:**
• Leverage your background (${exp || 'practical experience'}) to train one local helper within your first 30 days, freeing your time to focus on sales and supplier bargaining!`;
}

function generateContextualMockResponse(message: string, context: UserContext): string {
  const query = message.toLowerCase();
  const idea = context.userProfile?.businessIdea || 'your business venture';
  const loc = context.userProfile?.location || 'your local region';
  const cap = context.userProfile?.capital ? `₹${Number(context.userProfile.capital).toLocaleString('en-IN')}` : 'your available budget';
  const infra = context.userProfile?.infrastructure || 'standard setup';
  const exp = context.userProfile?.experience || 'practical knowledge';
  const score = context.realityScores?.overall || 78;
  const risk = context.realityScores?.risk || 32;

  // Workflow / Process / SOP / Operations / Day-to-Day query
  if (
    query.includes('workflow') ||
    query.includes('process') ||
    query.includes('sop') ||
    query.includes('how to run') ||
    query.includes('operate') ||
    query.includes('daily') ||
    query.includes('supply chain') ||
    query.includes('lifecycle') ||
    query.includes('schedule') ||
    query.includes('phases') ||
    query.includes('step by step') ||
    query.includes('roadmap')
  ) {
    return generateBusinessWorkflow(idea, loc, cap, infra, exp);
  }

  if (query.includes('scheme') || query.includes('subsidy') || query.includes('govt') || query.includes('loan') || query.includes('grant')) {
    return `📋 **Government Schemes & Financial Support for ${idea}:**\n\n` +
      `1. **PMEGP (Prime Minister Employment Generation Programme):** Up to 35% capital subsidy for setting up new ventures in ${loc}.\n` +
      `2. **PM MUDRA Yojana:** Access collateral-free loans up to ₹10 Lakhs (Shishu, Kishore, Tarun) aligned with your ${cap} requirement.\n` +
      `3. **Stand-Up India / State MSME Support:** Low-interest credit facilities with fast-track panchayat approvals.\n\n` +
      `💡 *Action:* You can click directly on the **Govt Schemes** section on your dashboard to open official government application portals!`;
  }

  if (query.includes('profit') || query.includes('margin') || query.includes('revenue') || query.includes('earn') || query.includes('money')) {
    return `💰 **Profitability & Financial Outlook for ${idea}:**\n\n` +
      `• **Estimated Gross Margins:** 25% - 38% depending on operational efficiency.\n` +
      `• **Break-Even Timeline:** Typically 4 to 6 months with your starting capital of ${cap}.\n` +
      `• **Key Revenue Drivers in ${loc}:** High repeat demand, direct local customer relationships, and low overheads.\n` +
      `• **Cost Optimization Tip:** Reinvest 40% of first quarter cashflow back into marketing and inventory turnover.`;
  }

  if (query.includes('score') || query.includes('reality') || query.includes('risk') || query.includes('feasibility')) {
    return `📊 **Reality Check Breakdown for ${idea}:**\n\n` +
      `• **Overall Feasibility Score:** **${score}/100**\n` +
      `• **Market Demand:** **${context.realityScores?.demand || 75}/100**\n` +
      `• **Calculated Risk Level:** **${risk}%**\n\n` +
      `🔍 **Mentor Advice to Boost Your Score:**\n` +
      `1. Secure pre-orders or intent letters from 10-15 local clients before full capital deployment.\n` +
      `2. Leverage your infrastructure (${infra}) to keep fixed rental expenses near zero.\n` +
      `3. Maintain at least 20% of your capital (${cap}) as an emergency cash reserve.`;
  }

  if (query.includes('market') || query.includes('customer') || query.includes('sell') || query.includes('promote') || query.includes('grow')) {
    return `🚀 **Hyperlocal Growth & Customer Acquisition in ${loc}:**\n\n` +
      `1. **WhatsApp Commerce:** Create a digital product/service catalog on WhatsApp Business and share with local community groups.\n` +
      `2. **Local Merchant Partnerships:** Partner with 3-5 established neighborhood shops for referrals.\n` +
      `3. **Inaugural Promotion:** Offer a 10% introductory discount or free initial consultation/sample for the first 50 customers.\n` +
      `4. **Physical Touchpoints:** Place visible signage in busy market junctions and weekly haats.`;
  }

  // General responsive answer for any custom user prompt
  return `💡 **Mentor Guidance regarding "${message.trim()}":**\n\n` +
    `For your **${idea}** in **${loc}** with capital of **${cap}**:\n\n` +
    `• **Direct Assessment:** Addressing this effectively requires leveraging your local market advantage in ${loc} and optimizing your operational costs.\n` +
    `• **Recommended Action:** Focus on low-cost high-impact execution. Ensure you validate this step with at least 5 potential customers first.\n` +
    `• **Resource Alignment:** Your experience (${exp}) combined with your infrastructure is your biggest advantage.\n\n` +
    `💡 *Tip:* Ask me: *"Show me the step-by-step business workflow"* to generate your full operational blueprint!`;
}

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { userProfile, realityScores, schemes } = (context || {}) as UserContext;

    if (!process.env.GEMINI_API_KEY) {
      // Dynamic Mock Response tailored to any user query
      const reply = generateContextualMockResponse(message, { userProfile, realityScores, schemes });
      return NextResponse.json({ reply });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash for ultra fast interactive chat
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are "Grameen Mentor AI", an empathetic, highly knowledgeable, and practical business mentor in India.
      You are speaking to an entrepreneur via a WhatsApp-style chat interface.
      
      The user can ask ANY question, assign ANY business task, or discuss ANY topic related to their enterprise.
      Always respond directly, accurately, and actionably to the user's specific query.
      
      USER CONTEXT (Lightweight RAG):
      - Business Idea: ${userProfile?.businessIdea || 'Rural Enterprise'}
      - Target Location: ${userProfile?.location || 'India'}
      - Working Capital: ₹${userProfile?.capital || '0'}
      - Available Infrastructure: ${userProfile?.infrastructure || 'Standard'}
      - Prior Experience: ${userProfile?.experience || 'Not specified'}
      - Feasibility Score: ${realityScores?.overall || 'N/A'}/100
      - Market Demand Score: ${realityScores?.demand || 'N/A'}/100
      - Operational Risk: ${realityScores?.risk || 'N/A'}%
      
      SPECIAL WORKFLOW DIRECTIVE:
      If the user asks for a "workflow", "process", "SOP", "how to operate", "daily schedule", "supply chain", or "step by step guide to run this business":
      - Provide a comprehensive, end-to-end 6-Phase Operational Workflow:
        • Phase 1: 🏗️ Setup & Legal Compliance (Week 1–2)
        • Phase 2: 📦 Sourcing & Raw Material Supply Chain (Week 2–3)
        • Phase 3: ⚙️ Daily Operations & Production/Service Cycle (Daily SOP)
        • Phase 4: 🏷️ Quality Assurance, Packaging & Storage (Continuous)
        • Phase 5: 🚚 Hyperlocal Marketing, Distribution & Sales (Ongoing)
        • Phase 6: 📈 Financial Control, Working Capital & Scaling (Weekly/Monthly)
      - Include timelines, daily hours/shifts, essential equipment list, critical risk & mitigation checkpoints, and a practical mentor tip.
      
      GUIDELINES:
      - Answer the user's query specifically with high precision.
      - Use clear Markdown formatting with bullet points and bold headers.
      - Keep responses crisp, actionable, and encouraging.
      - Ground your advice in real-world Indian business realities (MSME schemes, local marketing, logistics, unit economics).
    `;

    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Grameen Mentor AI. I have the user's full context and will provide direct, actionable answers, comprehensive 6-phase operational workflows, and practical guidance." }],
        },
      ],
    });

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    // Fallback to contextual generator on error
    const fallbackReply = generateContextualMockResponse(
      "workflow",
      {}
    );
    return NextResponse.json({ reply: fallbackReply });
  }
}

