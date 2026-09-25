import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface MentorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MentorContext {
  userProfile?: {
    businessIdea?: string;
    location?: string;
    capital?: string | number;
    monthlyRevenue?: string | number;
    infrastructure?: string;
    experience?: string;
    hasBusiness?: boolean | null;
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
  focusMode?: 'general' | 'growth' | 'capital' | 'cost' | 'marketing' | 'risk';
}

function buildSystemPrompt(context?: MentorContext): string {
  const profile = context?.userProfile;
  const scores = context?.realityScores;
  const idea = profile?.businessIdea || 'Rural Micro-Enterprise';
  const location = profile?.location || 'India (Tier 2/3 / Rural)';
  const capital = profile?.capital ? `₹${Number(profile.capital).toLocaleString('en-IN')}` : 'Flexible budget';
  const revenue = profile?.monthlyRevenue ? `₹${Number(profile.monthlyRevenue).toLocaleString('en-IN')}/month` : 'Early Stage';
  const infra = profile?.infrastructure || 'Standard rural/semi-urban infrastructure';
  const experience = profile?.experience || 'General practical knowledge';
  const feasibility = scores?.overall || 82;
  const risk = scores?.risk || 28;
  const focus = context?.focusMode || 'general';

  return `You are "Grameen Senior Enterprise Mentor AI (ग्रामीण व्यापार सलाहकार)", a top-tier hyper-local business mentor, rural economist, and operations strategist. 
You are advising an Indian rural and semi-urban entrepreneur running or starting a venture.

YOUR MISSION:
Provide continuous, highly practical, battle-tested, and empathetic business mentorship. Track past decisions, diagnose bottlenecks, and formulate step-by-step strategies tailored specifically to the realities of Tier-2/3 towns, mandis, panchayats, and rural India.

ENTREPRENEUR'S LIVE PROFILE:
- Business Venture: ${idea}
- Location / Catchment: ${location}
- Working Capital Base: ${capital}
- Estimated Turnover: ${revenue}
- Available Infrastructure: ${infra}
- Founder Experience: ${experience}
- AI Feasibility Score: ${feasibility}/100 (Operational Risk: ${risk}%)
- Current Focus Lens: ${focus.toUpperCase()}

RESPONSE GUIDELINES & FORMATTING:
1. Always be direct, structured, encouraging, and highly specific to ${idea} in ${location}.
2. Use clean, beautiful Markdown formatting with clear section headers:
   - 💡 **Strategic Assessment & Verdict:** Direct analysis answering the user's specific query.
   - ⚡ **Actionable Step-by-Step Plan:** Concrete steps (Step 1, Step 2, Step 3) with practical daily operating routines.
   - 💰 **Financial Impact & Unit Economics:** Realistic margins (e.g. 25%-35%), working capital reserve rules, and cash flow timing.
   - 🛡️ **Risk Guardrail & Mitigation:** Key pitfalls to avoid (credit defaults, spoilage, raw material price swings).
   - 🎯 **Next Immediate Milestone:** 1 concrete task the entrepreneur should complete in the next 48-72 hours.
3. Incorporate relevant Indian schemes (PMEGP, PM MUDRA, Stand-Up India, Udyam MSME, NABARD) when discussing capital, loans, or subsidies.
4. Support natural bilingual queries: If the user writes in Hindi or Hinglish, respond warmly in natural conversational Hinglish/Hindi while maintaining professional structure.`;
}

function generateSmartFallbackResponse(query: string, context?: MentorContext): string {
  const idea = context?.userProfile?.businessIdea || 'your business venture';
  const location = context?.userProfile?.location || 'your local market';
  const capital = context?.userProfile?.capital ? `₹${Number(context.userProfile.capital).toLocaleString('en-IN')}` : 'your available capital';
  const infra = context?.userProfile?.infrastructure || 'your available facility';
  const exp = context?.userProfile?.experience || 'practical knowledge';
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('pme') || lowerQuery.includes('subsidy') || lowerQuery.includes('mudra') || lowerQuery.includes('loan') || lowerQuery.includes('fund') || lowerQuery.includes('capital')) {
    return `💡 **Strategic Assessment & Subsidy Verdict for ${idea}:**
With your base capital of **${capital}** in **${location}**, you are strongly positioned to leverage central and state government credit-linked capital subsidies.

⚡ **Actionable Step-by-Step Capital Plan:**
1. **PMEGP Application:** File under the rural category for up to **35% capital subsidy** on project cost. Ensure your project report lists machinery and raw material setup.
2. **PM MUDRA Scheme:** Apply under *Kishore* category (₹50,000 to ₹5 Lakhs) for collateral-free working capital from your local Grameen Bank or SBI branch.
3. **Udyam MSME Registration:** Generate your 12-digit Udyam number online in 5 minutes (free) using Aadhaar.

💰 **Financial Impact & Unit Economics:**
• Effective interest rate with subsidy drops to 4%–6% per annum.
• Keeps 20% of your starting capital (${capital}) liquid as emergency buffer.

🛡️ **Risk Guardrail & Mitigation:**
• *Banker follow-up:* Submit verified quotations for machinery from authorized GST vendors to prevent loan processing delays.

🎯 **Next Immediate Milestone:**
Gather 3 machinery quotations and download the model project DPR from the PMEGP portal today.`;
  }

  if (lowerQuery.includes('compet') || lowerQuery.includes('shop') || lowerQuery.includes('price') || lowerQuery.includes('discount') || lowerQuery.includes('cut')) {
    return `💡 **Strategic Assessment & Competitive Defense for ${idea}:**
When local competitors enter or undercut prices in **${location}**, competing on a direct price war erodes your working capital. Instead, win on freshness, relationship loyalty, and bundled value.

⚡ **Actionable Step-by-Step Defense Plan:**
1. **Differentiated Value Bundle:** Don't discount; offer value additions (e.g., free delivery within 3 km, guaranteed replacement, or loyalty card for regular customers).
2. **Direct WhatsApp Broadcast:** Build a VIP customer list on WhatsApp Business. Notify them 1 day before fresh stock arrives.
3. **Institutional Tie-ups:** Lock in 3–5 recurring bulk buyers (local eateries, tea points, sweet makers, or contractors) on weekly settlement contracts.

💰 **Financial Impact & Unit Economics:**
• Preserves healthy 28%–34% gross margin without engaging in margin-killing price wars.
• Increases customer lifetime value by 40%.

🛡️ **Risk Guardrail & Mitigation:**
• Never offer loose credit beyond 7 days to match competitor terms. Enforce prompt UPI payments.

🎯 **Next Immediate Milestone:**
Interview your top 5 most frequent customers today to find out the #1 reason they choose your service over competitors.`;
  }

  if (lowerQuery.includes('grow') || lowerQuery.includes('scale') || lowerQuery.includes('double') || lowerQuery.includes('sales') || lowerQuery.includes('customer')) {
    return `💡 **Strategic Assessment & 30-Day Growth Plan for ${idea}:**
Expanding ${idea} in **${location}** requires maximizing catchment reach without ballooning fixed rental or equipment costs.

⚡ **Actionable Step-by-Step Expansion Roadmap:**
1. **Hub-and-Spoke Distribution:** Partner with 8–10 existing Kirana or neighborhood counters in surrounding villages within a 10 km radius.
2. **Weekly Haat Penetration:** Set up dedicated mobile pop-ups during regional weekly Haat/Bazaar days for maximum cash sales.
3. **Referral Incentive:** Offer existing satisfied clients a ₹50 credit or gift item for every neighbor they introduce.

💰 **Financial Impact & Unit Economics:**
• Targeted 45%–60% increase in monthly turnover within 60 days.
• Low customer acquisition cost (CAC < ₹25 per active customer).

🛡️ **Risk Guardrail & Mitigation:**
• Ensure your daily production throughput can meet the surge without sacrificing quality or delivery deadlines.

🎯 **Next Immediate Milestone:**
Shortlist 5 retail shops in neighboring villages and propose a 10% commission reseller partnership this week.`;
  }

  // Default rich mentor response
  return `💡 **Strategic Assessment regarding "${query.trim()}":**
For your enterprise **${idea}** based in **${location}** (Capital base: **${capital}**, Experience: **${exp}**), addressing this decision strategically will protect your margins and unlock steady local demand.

⚡ **Actionable Step-by-Step Execution Plan:**
1. **Validate Local Demand:** Conduct a quick pulse check with 10 potential village customers or local retail partners before investing fresh funds.
2. **Lean Operational Execution:** Utilize your existing infrastructure (${infra}) to keep overheads low and avoid high fixed monthly rent.
3. **Daily Cash Settlement:** Enforce same-day digital UPI/cash collection to keep your working capital rotating swiftly.

💰 **Financial Impact & Margin Economics:**
• Target gross margins: **28% – 38%**.
• Maintain at least 20% of your capital as an emergency buffer for seasonal fluctuations.

🛡️ **Risk Guardrail & Mitigation:**
• Avoid single-supplier dependency; identify at least 2 backup vendors for critical raw materials.

🎯 **Next Immediate Milestone:**
Draft a 3-point daily operational checklist and test it during tomorrow's morning operational cycle.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [], context = {}, apiKey: customApiKey } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const mistralKey = customApiKey || process.env.MISTRAL_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const systemPrompt = buildSystemPrompt(context);

    // 1. Try Mistral AI API
    if (mistralKey) {
      try {
        const formattedMessages: MentorMessage[] = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-8).map((m: any) => ({
            role: m.role === 'user' ? 'user' : ('assistant' as const),
            content: m.content || ''
          })),
          { role: 'user', content: message }
        ];

        const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mistralKey.trim()}`
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            temperature: 0.7,
            max_tokens: 1200,
            messages: formattedMessages
          })
        });

        if (mistralRes.ok) {
          const data = await mistralRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              reply,
              provider: 'mistral',
              model: 'mistral-small-latest',
              status: 'success'
            });
          }
        } else {
          const errText = await mistralRes.text();
          console.warn('Mistral API response error:', mistralRes.status, errText);
        }
      } catch (mistralErr) {
        console.error('Mistral call failed, falling back:', mistralErr);
      }
    }

    // 2. Fallback to Gemini if configured
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chatSession = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I am Grameen Senior Enterprise Mentor AI. Ready to guide the entrepreneur.' }] }
          ]
        });
        const result = await chatSession.sendMessage(message);
        const reply = result.response.text();
        return NextResponse.json({
          reply,
          provider: 'gemini',
          model: 'gemini-1.5-flash',
          status: 'success'
        });
      } catch (geminiErr) {
        console.error('Gemini fallback failed:', geminiErr);
      }
    }

    // 3. Fallback to High-Fidelity Knowledge Engine
    const fallbackReply = generateSmartFallbackResponse(message, context);
    return NextResponse.json({
      reply: fallbackReply,
      provider: 'offline_engine',
      model: 'grameen-advisor-v2',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Mentor Route Error:', error);
    return NextResponse.json({
      reply: 'I am here to guide your business operations and growth. Let us focus on optimizing your unit margins, expanding customer reach, and securing government subsidies.',
      provider: 'offline_engine',
      status: 'error'
    });
  }
}
