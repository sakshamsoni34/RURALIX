import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UserProfile {
  businessIdea?: string;
  location?: string;
  capital?: string | number;
  infrastructure?: string;
  experience?: string;
}

interface RequestBody {
  transcript: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userProfile?: UserProfile;
  language?: 'hi' | 'en' | 'auto';
}

interface VoiceAssistantResponse {
  spokenText: string;
  headline: string;
  directAnswer: string;
  keyPoints: string[];
  actionSteps: string[];
  plan?: string[];
  metrics?: {
    estimatedMargin?: string;
    investmentRequired?: string;
    breakevenTimeline?: string;
    subsidy?: string;
  };
  extracted?: {
    capital?: string | null;
    businessType?: string | null;
    location?: string | null;
    experience?: string | null;
    requirements?: string | null;
  };
  suggestedFollowUps: string[];
}

function detectIsHindiOrHinglish(text: string): boolean {
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) return true;
  const hinglishWords = [
    'kya', 'kaise', 'kitna', 'hoga', 'mera', 'meri', 'mere', 'paas', 'chahiye',
    'batao', 'karna', 'hai', 'hain', 'mein', 'se', 'gaon', 'rupaye', 'rupay',
    'subsidy', 'munafa', 'kamai', 'kharch', 'dukaan', 'kheti', 'yojna', 'yojana',
    'sarkari', 'madad', 'paisa', 'kharidna', 'bhechna', 'bataiye', 'kholna',
    'kirana', 'pashupalan', 'bakri', 'chalaun', 'lagat', 'paisa'
  ];
  const words = text.toLowerCase().split(/\s+/);
  return words.some(w => hinglishWords.includes(w));
}

function generateDynamicKnowledgeResponse(transcript: string, profile?: UserProfile): VoiceAssistantResponse {
  const query = transcript.toLowerCase();
  const isHindi = detectIsHindiOrHinglish(transcript);
  const loc = profile?.location || 'aapke ilaqe';
  const idea = profile?.businessIdea || 'business';

  // 1. Dairy / Milk / Ghee / Paneer
  if (query.includes('dairy') || query.includes('milk') || query.includes('doodh') || query.includes('ghee') || query.includes('paneer') || query.includes('cow') || query.includes('buffalo') || query.includes('bhains') || query.includes('gaay')) {
    if (isHindi) {
      return {
        spokenText: "Dairy business gaon aur chote shehron ke liye ek bohot hi laabhkari vikalp hai. 1 se 2 lakh rupaye mein aap do acchi nasl ki gaay ya bhains ke saath shuruat kar sakte hain. Isme 30 se 40 percent tak ka gross profit margin milta hai aur PMEGP yojana ke tehat 35 percent tak subsidy uplabdh hai.",
        headline: "Dairy & Milk Business Margins and Setup Blueprint",
        directAnswer: "**Dairy Business** ek daily cash-flow dene wala behtareen vyavasay hai. Sahi pashu nasl (jaise Murrah bhains ya HF/Gir gaay) chunne se pratidin 20-30 litre doodh prapt kiya ja sakta hai. Seedhe gharon, mithaai ki dukaano aur dairy plants ko supply karke aap munafe ko badha sakte hain.",
        keyPoints: [
          "**Daily Revenue:** 2 gaay/bhains se pratidin lagbhag ₹1,000–₹1,500 ki bikri.",
          "**Value Addition:** Paneer aur Ghee banane par margin 25% se badhkar 45% ho jata hai.",
          "**Local Tie-ups:** Chai ki dukaanein aur local sweet shops instant payment dete hain."
        ],
        actionSteps: [
          "Pashu aahar (green & dry fodder) aur saaf pani ka shed taiyar karein.",
          "Veterinary doctor se sampark karke regular vaccination aur bima karwayen.",
          "Udyam portal par free MSME registration aur PMEGP subsidy ke liye apply karein."
        ],
        metrics: {
          estimatedMargin: "30% - 40%",
          investmentRequired: "₹80,000 - ₹1,80,000",
          breakevenTimeline: "4 se 6 Mahine",
          subsidy: "PMEGP (Up to 35% Subsidy) & NABARD DEDS"
        },
        extracted: {
          businessType: "Dairy & Value-Added Milk Products",
          capital: query.match(/(\d+[\s]*(lakh|hazaar|k|rupaye|rs))/i)?.[0] || profile?.capital?.toString() || "₹1,00,000 - ₹2,00,000",
          location: profile?.location || "Rural / Semi-urban Area",
          experience: "Cattle rearing / Basic knowledge",
          requirements: "Cattle shed, Chilling / Deep freezer, Stainless steel cans"
        },
        suggestedFollowUps: [
          "Dairy ke liye sarkari subsidy kaise apply karein?",
          "Doodh se paneer aur ghee banane ka setup kharcha kitna hai?",
          "Gaay aur bhains ki behtareen nasl kaun si hai?"
        ]
      };
    } else {
      return {
        spokenText: "Starting a dairy business offers strong daily cash flow and 30 to 40 percent profit margins. With one to two lakh rupees, you can acquire two high-yield cattle, set up a basic chilling facility, and secure up to 35 percent capital subsidy under the PMEGP scheme.",
        headline: "Dairy Farming & Milk Value-Addition Blueprint",
        directAnswer: "A **Dairy Enterprise** provides resilient daily income in rural and semi-urban markets. By supplying high-FAT milk directly to consumers, sweet shops, and local tea stalls, you avoid middlemen cuts and maximize unit economics.",
        keyPoints: [
          "**Daily Cash Inflow:** 2 high-yield animals produce ~25-30 litres/day, generating ₹1,200–₹1,600 daily gross sales.",
          "**Value Multiplication:** Converting evening surplus into Paneer or Ghee yields 40%+ margins.",
          "**Byproduct Revenue:** Composted cow dung can be sold as organic vermicompost for additional income."
        ],
        actionSteps: [
          "Construct a well-ventilated shed with clean water drainage.",
          "Establish fodder supply contracts with local farmers for green grass.",
          "Apply for PMEGP subsidy online for up to 35% capital assistance."
        ],
        metrics: {
          estimatedMargin: "30% - 42%",
          investmentRequired: "₹1,00,000 - ₹2,50,000",
          breakevenTimeline: "4 - 6 Months",
          subsidy: "PMEGP (up to 35%) & NABARD AHIDF"
        },
        extracted: {
          businessType: "Dairy Enterprise",
          capital: "₹1,50,000",
          location: "Local Rural Cluster",
          experience: "Practical farming knowledge",
          requirements: "Cattle shed, lactometer, deep freezer, stainless cans"
        },
        suggestedFollowUps: [
          "How to get PMEGP subsidy for dairy farming?",
          "What is the daily feed cost per cow?",
          "How to set up direct milk delivery on WhatsApp?"
        ]
      };
    }
  }

  // 2. Poultry / Murgi Palan / Egg / Broiler
  if (query.includes('poultry') || query.includes('murgi') || query.includes('chicken') || query.includes('egg') || query.includes('anda') || query.includes('broiler') || query.includes('layer')) {
    if (isHindi) {
      return {
        spokenText: "Murgi palan ya poultry farming ek tezi se ghoomne wala business hai jisme 45 din ke ek broiler batch cycle mein 25 se 35 percent ka profit margin milta hai. 80,000 se 1.5 lakh rupaye mein aap 500 murgiyon ka batch shuru kar sakte hain.",
        headline: "Poultry Farming Setup & Profit Dynamics",
        directAnswer: "**Poultry Farming** mein Broiler (meat) aur Layer (anda) do pramukh vikalp hain. Broiler cycle sirf 40-45 din ka hota hai, jisse saal mein 6 se 7 baar profit ghumaya ja sakta hai. Sahi biosecurity aur saste local feed mix se kharch kam kiya ja sakta hai.",
        keyPoints: [
          "**Fast Rotation:** Har 45 din mein batch bikri ke liye taiyar hota hai.",
          "**B2B Tie-ups:** Local dhabas aur chicken retailers se direct supply contract karein.",
          "**Manure Earnings:** Murgi ki khaad (poultry manure) high-nitrogen fertilizer ke roop mein ₹250/bori bikti hai."
        ],
        actionSteps: [
          "500 sq.ft ka ventilated shed banwayen jisme rice husk (dhan ki bhusi) ka bed ho.",
          "Certified hatchery se DOC (Day Old Chicks) aur starter feed khareedein.",
          "Newcastle (Ranikhet) disease aur IBD ka samay par teekakaran (vaccination) karein."
        ],
        metrics: {
          estimatedMargin: "25% - 35%",
          investmentRequired: "₹70,000 - ₹1,50,000",
          breakevenTimeline: "2 Batches (approx. 3 Months)",
          subsidy: "National Livestock Mission (NLM) & Mudra Loan"
        },
        extracted: {
          businessType: "Poultry Farming (Broiler / Desi Egg)",
          capital: profile?.capital?.toString() || "₹80,000 - ₹1,20,000",
          location: profile?.location || "Rural Plot",
          experience: "Basic livestock management",
          requirements: "Ventilated shed, bell drinkers, brooder heater"
        },
        suggestedFollowUps: [
          "Broiler murgi ke feed kharche ko kaise kam karein?",
          "Desi Kadaknath murgi palan mein kitna munafa hai?",
          "National Livestock Mission subsidy kaise milti hai?"
        ]
      };
    } else {
      return {
        spokenText: "Poultry farming is one of the fastest cash-turnaround businesses. A 500-bird broiler cycle takes 40 to 45 days and delivers 25 to 35 percent net profit margins with an initial capital of 80,000 to 1.5 lakh rupees.",
        headline: "Poultry Farming Commercial Feasibility",
        directAnswer: "**Poultry Farming** offers rapid capital turnaround through 6 to 7 broiler cycles per year. Keeping biosecurity tight and managing feed conversion ratio (FCR below 1.6) guarantees solid profitability in rural markets.",
        keyPoints: [
          "**High Velocity:** 45-day growth cycle allows reinvesting profits multiple times a year.",
          "**Local Demand:** Continuous consumption across regional dhabas, meat markets, and weekly haats.",
          "**Organic Byproduct:** Dry poultry manure is a high-nitrogen organic fertilizer sold to farmers."
        ],
        actionSteps: [
          "Construct a 500 sq.ft shed with proper curtain ventilation and dry rice-husk bedding.",
          "Procure vaccinated Day-Old Chicks (Cobb 500 / Hubbard) from registered hatcheries.",
          "Tie up with 3-4 local meat retailers for bulk farm-gate pickup."
        ],
        metrics: {
          estimatedMargin: "25% - 38%",
          investmentRequired: "₹80,000 - ₹1,50,000",
          breakevenTimeline: "3 - 4 Months",
          subsidy: "National Livestock Mission (NLM 50% capital subsidy)"
        },
        extracted: {
          businessType: "Poultry Farming",
          capital: "₹1,00,000",
          location: profile?.location || "Rural/Semi-urban",
          experience: "Livestock care",
          requirements: "Shed, drinkers, feeders, heating lamp"
        },
        suggestedFollowUps: [
          "What is the ideal vaccination schedule for poultry?",
          "How to apply for the National Livestock Mission grant?",
          "Comparison between Broiler and Layer egg farming"
        ]
      };
    }
  }

  // 3. Government Scheme / Loan / Subsidy / PMEGP / MUDRA / KCC
  if (query.includes('scheme') || query.includes('subsidy') || query.includes('yojana') || query.includes('loan') || query.includes('pmegp') || query.includes('mudra') || query.includes('sarkari') || query.includes('grant') || query.includes('paisa')) {
    if (isHindi) {
      return {
        spokenText: "Gramin udyamiyon ke liye sabse behtareen yojanaayein PMEGP aur PM Mudra Yojana hain. PMEGP mein gramin kshetra ke liye 35 percent tak ki capital subsidy milti hai, jabki PM Mudra ke tehat 50,000 se 10 lakh rupaye tak ka bina collateral ka loan milta hai.",
        headline: "Government Schemes & Subsidy Guide",
        directAnswer: "Bharat Sarkar aur Rajya Sarkarein rural enterprises ke liye kai aakarshak subsidies pradan karti hain:\n\n1. **PMEGP (Prime Minister's Employment Generation Programme):**\n   - Gramin kshetra ke liye **35% Subsidy** (General ke liye 25%, Special category/Women/SC/ST/OBC ke liye 35%).\n   - Manufacturing ke liye ₹50 Lakh aur Services ke liye ₹20 Lakh tak project cost.\n\n2. **PM MUDRA Yojana:**\n   - **Shishu Loan:** ₹50,000 tak bina kisi guarantee ke.\n   - **Kishore Loan:** ₹50,000 se ₹5 Lakh tak.\n   - **Tarun Loan:** ₹5 Lakh se ₹10 Lakh tak.\n\n3. **PMFME (Food Processing Scheme):**\n   - 35% Credit-linked subsidy micro food enterprises (Chakki, Oil, Pickle, Spices) ke liye.",
        keyPoints: [
          "**Collateral Free:** MUDRA loan mein kisi zameen ya gold guarantee ki zarurat nahi hoti.",
          "**Direct Subsidy:** PMEGP subsidy sidhe bank account mein 3 saal ke lock-in ke baad adjust hoti hai.",
          "**Online Application:** KVIC portal ya Jan Samarth portal par online aavedan kiya ja sakta hai."
        ],
        actionSteps: [
          "Aadhaar, PAN card, Bank passbook aur Niwas praman patra taiyar rakhein.",
          "Apne business ka ek simple Project DPR (Detailed Project Report) banwayen.",
          "Jan Samarth (jansamarth.in) ya KVIC portal par apply karein."
        ],
        metrics: {
          estimatedMargin: "Govt Subsidized",
          investmentRequired: "₹50,000 to ₹10,00,000",
          breakevenTimeline: "Loan Approval: 15-30 Days",
          subsidy: "Up to 35% under PMEGP / PMFME"
        },
        extracted: {
          businessType: "Subsidized Rural Enterprise",
          capital: "₹50,000 - ₹5,00,000",
          location: profile?.location || "Rural Block",
          experience: "Entrepreneurial intent",
          requirements: "Aadhaar, PAN, Bank Statement, Project Proposal"
        },
        suggestedFollowUps: [
          "PMEGP ke liye Project Report (DPR) kaise banayein?",
          "PM Mudra loan ke liye bank manager se kaise baat karein?",
          "Food processing ke liye PMFME scheme mein kaise apply karein?"
        ]
      };
    } else {
      return {
        spokenText: "The top government schemes for your enterprise are PMEGP, which provides up to 35 percent capital subsidy in rural areas, and PM MUDRA Yojana, offering collateral-free loans up to 10 lakh rupees. You can apply directly through the Jan Samarth government portal.",
        headline: "Government Subsidies & Financing Assistance",
        directAnswer: "Top Government Schemes for Rural MSMEs & Agribusiness:\n\n1. **PMEGP Scheme:** 35% capital subsidy for rural entrepreneurs and women/SC/ST/OBC categories. Supports projects up to ₹50 Lakhs.\n2. **PM MUDRA Loan:** Collateral-free financing up to ₹10 Lakhs under Shishu, Kishore, and Tarun brackets.\n3. **PMFME Scheme:** 35% subsidy for food processing, flour mills, cold-press oil, and spice packaging units.\n4. **KCC (Kisan Credit Card for Animal Husbandry):** Concessional interest rate loan for working capital.",
        keyPoints: [
          "**Zero Collateral:** No property mortgage required for loans under ₹10 Lakhs.",
          "**Fast-Track Portal:** Single window application via `jansamarth.in`.",
          "**Margin Money Grant:** The subsidy reduces loan liability directly after 3 years."
        ],
        actionSteps: [
          "Prepare KYC documents (Aadhaar, PAN, Bank Statement of 6 months).",
          "Create a 2-page project report with cost estimation and revenue projections.",
          "Submit application on Jan Samarth or visit your local Lead Bank / District Industries Centre (DIC)."
        ],
        metrics: {
          estimatedMargin: "Financial Assistance",
          investmentRequired: "₹50,000 - ₹10,00,000",
          breakevenTimeline: "Processing time: 2 - 4 Weeks",
          subsidy: "25% to 35% Capital Grant"
        },
        extracted: {
          businessType: "MSME Grant",
          capital: "₹1,00,000 - ₹5,00,000",
          location: profile?.location || "Rural District",
          experience: "Eligible borrower",
          requirements: "KYC documents, project proposal"
        },
        suggestedFollowUps: [
          "How to create a project report (DPR) for PMEGP?",
          "What is the difference between Shishu and Kishore Mudra loans?",
          "How to get PMFME 35% subsidy for food processing?"
        ]
      };
    }
  }

  // 4. Cold Press Oil / Chakki / Atta / Spices / Masala
  if (query.includes('oil') || query.includes('tel') || query.includes('chakki') || query.includes('atta') || query.includes('flour') || query.includes('masala') || query.includes('spice') || query.includes('expeller') || query.includes('mustard') || query.includes('sarson')) {
    if (isHindi) {
      return {
        spokenText: "Cold press oil mill aur masala chakki unit gramin kshetra mein sabse tej bikne wala vyavasay hai. 1.5 se 3 lakh rupaye mein aap stainless steel automatic oil expeller machine laga sakte hain, jisme 35 se 50 percent ka shuddh munafa hota hai.",
        headline: "Cold Press Oil & Spice Processing Unit",
        directAnswer: "**Cold-Press Oil & Spices Unit (Kachi Ghani Tel / Masala Udyog):** Chemical-free shuddh tel aur taze masalon ki maang tezi se badh rahi hai. Cold-press lakdi/steel expeller machine se sarson, moongfali ya til ka tel nikaal kar local bazaar mein premium daam par becha ja sakta hai.",
        keyPoints: [
          "**High Value Addition:** Sarson khareed kar tel aur khali (oil cake) bechne par 40% margin nikalta hai.",
          "**Byproduct Demand:** Tel nikalne ke baad bachi hui Sarson Khali pashu aahar ke roop mein ₹28-₹35/kg bikti hai.",
          "**PMFME Subsidy:** Khadya praskaran (Food Processing) par 35% credit-linked subsidy milti hai."
        ],
        actionSteps: [
          "1 HP se 3 HP ki single-phase / 3-phase cold press oil expeller machine khareedein.",
          "FSSAI basic registration aur local vyapar licence lein.",
          "1 litre aur 5 litre ki food-grade transparent bottles par apni local branding karein."
        ],
        metrics: {
          estimatedMargin: "35% - 50%",
          investmentRequired: "₹1,20,000 - ₹2,80,000",
          breakevenTimeline: "3 se 5 Mahine",
          subsidy: "PMFME (35% Credit Linked Subsidy)"
        },
        extracted: {
          businessType: "Cold Press Oil & Spices Unit",
          capital: "₹1,50,000 - ₹2,50,000",
          location: profile?.location || "Rural / Semi-urban Mandi",
          experience: "Basic machine operation",
          requirements: "Oil expeller machine, filtering unit, packing bottles"
        },
        suggestedFollowUps: [
          "Sarson ke tel ke expeller machine ki kimat kitni hai?",
          "PMFME scheme mein oil mill ke liye apply kaise karein?",
          "Local market mein branding aur packing kaise karein?"
        ]
      };
    } else {
      return {
        spokenText: "A cold press oil mill and spice grinding unit is a high-margin enterprise. With 1.5 to 3 lakh rupees, you can install an automatic expeller machine that delivers 35 to 50 percent gross margins and qualifies for a 35 percent PMFME subsidy.",
        headline: "Cold Press Oil & Agro-Processing Blueprint",
        directAnswer: "The **Cold Press Oil & Spice Processing Enterprise** addresses the booming demand for pure, unadulterated mustard, groundnut, and sesame oils. Selling cold-pressed oil along with nutrient-rich oil cake for cattle generates dual revenue streams.",
        keyPoints: [
          "**Dual Revenue Model:** Revenue from premium cold-pressed oil + cattle feed oil cake (Khali).",
          "**Strong Unit Economics:** Gross processing margin exceeds 35-48%.",
          "**PMFME Support:** Eligible for 35% capital subsidy up to ₹10 Lakhs."
        ],
        actionSteps: [
          "Procure a stainless steel Cold Press Expeller with commercial electric motor.",
          "Obtain online FSSAI basic registration (Form A).",
          "Distribute branded bottles through local retail grocery tie-ups and WhatsApp pre-orders."
        ],
        metrics: {
          estimatedMargin: "35% - 50%",
          investmentRequired: "₹1,50,000 - ₹3,00,000",
          breakevenTimeline: "4 - 5 Months",
          subsidy: "PMFME (35% Capital Subsidy)"
        },
        extracted: {
          businessType: "Agro Food Processing",
          capital: "₹2,00,000",
          location: profile?.location || "Town / Mandi Area",
          experience: "Food processing / Retail",
          requirements: "Cold press expeller, filter unit, bottles"
        },
        suggestedFollowUps: [
          "What is the power consumption of a 3HP oil expeller?",
          "How to apply for PMFME 35% subsidy?",
          "What are the best packaging options for edible oils?"
        ]
      };
    }
  }

  // 5. Vermicompost / Organic Farming / Manure / Khaad
  if (query.includes('vermicompost') || query.includes('khaad') || query.includes('manure') || query.includes('khechua') || query.includes('kenchua') || query.includes('organic') || query.includes('fertilizer') || query.includes('jaivik')) {
    if (isHindi) {
      return {
        spokenText: "Vermicompost yaani kenchua khaad ka business sabse kam lagat aur sabse zyada munafe wala vyavasay hai. 40,000 se 70,000 rupaye mein aap 5 se 10 vermi-beds shuru kar sakte hain. Isme 60 percent se zyada ka gross margin hota hai kyunki gobar aur kheti ka kachra lagbhag muft milta hai.",
        headline: "Vermicompost & Organic Fertilizer Business",
        directAnswer: "**Vermicompost (Kenchua Khaad Nirman):** Gobar aur sukhe patton se Eisenia Foetida kenchuo ke zariye banai gayi jaivik khaad ₹8 se ₹12 prati kilo bikti hai. Sath hi har 60 din mein kenchuo ki sankhya double hoti hai, jinhe aap anya kisano ko ₹400/kg bech sakte hain.",
        keyPoints: [
          "**High Margin (60%+):** Gobar aur kheti ka avshesh bohot kam daam par mil jata hai.",
          "**Multiple Income Streams:** Vermicompost khaad + Vermiwash liquid tonic + Earthworms sales.",
          "**Growing Organic Demand:** Polyhouse kheti, fal-sabzi kisan aur nursery wale direct bulk khareedte hain."
        ],
        actionSteps: [
          "Chhavdar jagah par 5-10 HDPE UV-treated vermi-beds lagayein.",
          "KVIC ya certified farm se *Eisenia Foetida* laal kenchua khareedein.",
          "50-60 din baad jaali se chaan kar 5kg aur 50kg ke bags mein pack karein."
        ],
        metrics: {
          estimatedMargin: "60% - 75%",
          investmentRequired: "₹35,000 - ₹75,000",
          breakevenTimeline: "60 se 90 Din",
          subsidy: "PKVY (Paramparagat Krishi Vikas Yojana) & NABARD Organic Grant"
        },
        extracted: {
          businessType: "Vermicompost & Bio-Fertilizer",
          capital: "₹40,000 - ₹80,000",
          location: profile?.location || "Agricultural Land / Backyard",
          experience: "Composting / Farming",
          requirements: "HDPE vermi-beds, cow dung, Eisenia Foetida earthworms, water spray"
        },
        suggestedFollowUps: [
          "Eisenia Foetida kenchua kahan se aur kitne me khareedein?",
          "Vermiwash liquid spray kaise banayein aur bechein?",
          "Nursery aur kisano ko bulk supply kaise karein?"
        ]
      };
    } else {
      return {
        spokenText: "Vermicompost manufacturing is a low-capex, high-margin rural enterprise. With an investment of 35,000 to 80,000 rupees for HDPE beds and earthworms, you can generate over 60 percent profit margin within 60 days.",
        headline: "Commercial Vermicomposting Project Blueprint",
        directAnswer: "**Vermicomposting** converts agricultural waste and cattle dung into nutrient-rich organic black gold. The dual revenue model (selling packaged compost + surplus earthworms + liquid vermiwash) makes it extraordinarily resilient.",
        keyPoints: [
          "**High Gross Margins (60%+):** Feedstock is abundant and low cost.",
          "**Earthworm Multiplication:** Worm biomass doubles every 60 days, fetching ₹350–₹500/kg.",
          "**B2B & Retail Markets:** High demand from vegetable growers, polyhouse farms, and urban plant nurseries."
        ],
        actionSteps: [
          "Install 5-10 UV-stabilized HDPE vermi-beds under green shade net.",
          "Inoculate pre-cured cow dung with *Eisenia Foetida* earthworms.",
          "Harvest and rotary sieve into 5kg, 25kg, and 50kg branded breathable bags."
        ],
        metrics: {
          estimatedMargin: "60% - 75%",
          investmentRequired: "₹40,000 - ₹80,000",
          breakevenTimeline: "60 - 75 Days",
          subsidy: "Paramparagat Krishi Vikas Yojana (PKVY) & State Organic Missions"
        },
        extracted: {
          businessType: "Bio-Fertilizer Unit",
          capital: "₹50,000",
          location: profile?.location || "Rural Plot",
          experience: "Organic farming basics",
          requirements: "HDPE beds, worms, green net"
        },
        suggestedFollowUps: [
          "How to maintain moisture levels in hot summer months?",
          "How to package and brand organic vermicompost?",
          "How to extract vermiwash liquid spray?"
        ]
      };
    }
  }

  // 6. Kirana / Grocery / General Store / Retail Shop / Dukan
  if (query.includes('kirana') || query.includes('grocery') || query.includes('dukaan') || query.includes('dukan') || query.includes('shop') || query.includes('store') || query.includes('retail')) {
    if (isHindi) {
      return {
        spokenText: "Kirana aur daily essentials ki dukan gaon aur kasbe mein lagatar bikri dene wala business hai. 60,000 se 1.5 lakh rupaye mein aap fast-moving grocery items, packaged spices aur daily needs ke saath shuru kar sakte hain, jisme 18 se 28 percent ka net margin milta hai.",
        headline: "Kirana & General Store Setup Blueprint",
        directAnswer: "**Kirana & Retail General Store:** Gaon aur semi-urban ilaqo mein FMCG, daalein, packaged tel, biscuit aur stationery ki regular demand rehti hai. Wholesaler se direct sourcing aur cash/UPI discount se margin badhaya ja sakta hai.",
        keyPoints: [
          "**Consistent Daily Turnover:** Daily cash turnover ₹2,500 se ₹8,000 tak rehta hai.",
          "**Fast Moving Inventory:** Aata, tel, daalein, sabun aur masale tezi se bikte hain.",
          "**Digital Credit Ledger:** Khatabook ya Vyapar app use karke udhaar recovery regular karein."
        ],
        actionSteps: [
          "Bazaar ya colony ke pravesh dwar par 150-250 sq.ft ki dukan select karein.",
          "Nearest main mandi ke top 2 wholesalers se bulk pricing contract karein.",
          "QR code scanner aur basic digital POS billing set karein."
        ],
        metrics: {
          estimatedMargin: "18% - 28%",
          investmentRequired: "₹60,000 - ₹1,50,000",
          breakevenTimeline: "1 se 2 Mahine",
          subsidy: "PM MUDRA Shishu Loan (up to ₹50,000 without guarantee)"
        },
        extracted: {
          businessType: "Kirana & General Store",
          capital: "₹80,000 - ₹1,50,000",
          location: profile?.location || "Village Main Chowk",
          experience: "Retail customer handling",
          requirements: "Wooden/steel racks, electronic weighing scale, initial stock"
        },
        suggestedFollowUps: [
          "Kirana dukan ke liye wholesale maal kahan se khareedein?",
          "Mudra Shishu loan kirana dukan ke liye kaise lein?",
          "Udhaar khata kaise manage karein?"
        ]
      };
    } else {
      return {
        spokenText: "A Kirana and general retail store provides stable daily cash flow with 18 to 28 percent gross margins. With an initial inventory budget of 60,000 to 1.5 lakh rupees, you can serve daily consumer goods in high-traffic rural spots.",
        headline: "Kirana & Retail Store Setup Feasibility",
        directAnswer: "**Kirana & FMCG Retail Store:** Daily essentials, grains, packaged cooking oils, toiletries, and confectionery have non-cyclical demand. Negotiating wholesale cash discounts and managing stock turnover optimizes working capital.",
        keyPoints: [
          "**High Velocity:** Fast turnover of essential staples ensures quick cash circulation.",
          "**High-Margin Add-ons:** Snacks, cold drinks, recharge, and dairy products yield up to 30% margin.",
          "**Low Default Risk:** Implementing instant UPI payments and digital ledgers."
        ],
        actionSteps: [
          "Secure a 150-200 sq.ft shop at high-footfall village junctions.",
          "Source directly from primary mandi distributors for FMCG staples.",
          "Set up digital payments and digital inventory tracking."
        ],
        metrics: {
          estimatedMargin: "18% - 28%",
          investmentRequired: "₹70,000 - ₹1,50,000",
          breakevenTimeline: "1 - 2 Months",
          subsidy: "PM MUDRA Shishu Loan (up to ₹50,000)"
        },
        extracted: {
          businessType: "Retail FMCG Store",
          capital: "₹1,00,000",
          location: profile?.location || "Main Bazaar",
          experience: "Customer service",
          requirements: "Display racks, digital scale, inventory stock"
        },
        suggestedFollowUps: [
          "What are the top 10 fastest-selling grocery items in rural areas?",
          "How to get Mudra loan for grocery shop?",
          "How to reduce spoilage in grocery inventory?"
        ]
      };
    }
  }

  // 7. CSC / Jan Seva Kendra / Cyber Cafe / Digital Seva / CSP
  if (query.includes('csc') || query.includes('jan seva') || query.includes('cyber') || query.includes('digital') || query.includes('csp') || query.includes('banking') || query.includes('sewa')) {
    if (isHindi) {
      return {
        spokenText: "CSC aur Jan Seva Kendra gaon mein bohot demand wala service business hai. 50,000 se 90,000 rupaye mein computer, printer aur biometric scanner lagakar aap government forms, Aadhaar banking aur money transfer se mahine ka 20,000 se 40,000 rupaye kama sakte hain.",
        headline: "CSC Jan Seva Kendra & Digital Banking Point",
        directAnswer: "**Jan Seva Kendra (CSC & Micro-ATM CSP):** Gaon ke logon ko sarkari yojana form, kisan registration, bijli bill, train ticket aur micro-ATM cash withdrawal ki suvidha pradan karke prati transaction commission kamaya ja sakta hai.",
        keyPoints: [
          "**Zero Raw Material Risk:** Service-based model hone ke karan stock kharab hone ka koi risk nahi hota.",
          "**Multiple Income Streams:** Banking CSP commission + Online Form fees + Photostat/Lamination.",
          "**High Customer Footfall:** Har mahine 300 se 800 log regular suvidhaon ke liye aate hain."
        ],
        actionSteps: [
          "CSC VLE (register.csc.gov.in) par VLE registration aur TEC certificate complete karein.",
          "Basic desktop/laptop, All-in-One printer aur Mantra/Morpho biometric device set karein.",
          "Airtel Payments Bank, Spice Money ya Paynearby se Banking CSP id activate karein."
        ],
        metrics: {
          estimatedMargin: "55% - 70%",
          investmentRequired: "₹45,000 - ₹85,000",
          breakevenTimeline: "2 se 3 Mahine",
          subsidy: "Digital India VLE Support & Mudra Shishu"
        },
        extracted: {
          businessType: "CSC Jan Seva Kendra & Digital Banking",
          capital: "₹50,000 - ₹80,000",
          location: profile?.location || "Gram Panchayat Office nearby",
          experience: "Basic computer and internet knowledge",
          requirements: "Computer/Laptop, Multi-function Printer, Biometric device, Internet"
        },
        suggestedFollowUps: [
          "CSC VLE registration aur TEC certificate kaise milega?",
          "Micro ATM aur cash withdrawal CSP kaise chalu karein?",
          "Monthly 30,000 kamane ke liye kaun si services provide karein?"
        ]
      };
    } else {
      return {
        spokenText: "Starting a CSC Jan Seva Kendra and Digital Banking Center requires 50,000 to 90,000 rupees for IT equipment. It delivers over 60 percent profit margins with zero inventory risk through citizen service commissions.",
        headline: "CSC Jan Seva Kendra & Micro-Banking Hub",
        directAnswer: "A **Common Service Center (CSC) & Banking Kiosk** offers essential digital government services, PM Kisan KYC, bill payments, and AEPS Aadhaar ATM cash withdrawals to rural citizens.",
        keyPoints: [
          "**Pure Service Margin:** 60-75% gross margins with negligible recurring cost.",
          "**Recurring Footfall:** Steady stream of users for government registrations, tickets, and photocopies.",
          "**Fintech Commission:** Earn ₹3–₹12 per cash withdrawal/deposit transaction."
        ],
        actionSteps: [
          "Complete TEC certification and register at `register.csc.gov.in`.",
          "Procure a PC, heavy-duty duplex printer, and UIDAI certified biometric scanner.",
          "Partner with AEPS platforms (Spice Money, Paynearby, or bank BC)."
        ],
        metrics: {
          estimatedMargin: "60% - 75%",
          investmentRequired: "₹50,000 - ₹90,000",
          breakevenTimeline: "2 - 3 Months",
          subsidy: "Digital India MSME MUDRA Eligible"
        },
        extracted: {
          businessType: "Digital Service Center (CSC)",
          capital: "₹60,000",
          location: profile?.location || "Panchayat Center",
          experience: "Computer literacy",
          requirements: "PC, Printer, Biometric scanner, Broadband"
        },
        suggestedFollowUps: [
          "How to get TEC certification for CSC?",
          "Which AEPS provider gives the highest commission?",
          "How to add banking kiosk services to CSC?"
        ]
      };
    }
  }

  // 8. Goat Farming / Bakri Palan
  if (query.includes('goat') || query.includes('bakri') || query.includes('bakra') || query.includes('sheep') || query.includes('bhed')) {
    if (isHindi) {
      return {
        spokenText: "Bakri palan ya goat farming gramin kshetra ke liye 'chhota ATM' mana jata hai. 70,000 se 1.3 lakh rupaye mein aap 10 bakri aur 1 bakra ke saath shuruat kar sakte hain, jisme 45 se 55 percent tak ka munafa hota hai aur NLM yojana mein 50 percent subsidy milti hai.",
        headline: "Goat Farming Setup & Economics",
        directAnswer: "**Bakri Palan (Commercial Goat Farming):** Sirohi, Barbari, ya Black Bengal jaise behtareen nasl chunne se har 8 mahine mein bachhe milte hain. Eid aur regional markets mein bakron ki bhaari maang hoti hai.",
        keyPoints: [
          "**High Reproduction:** Ek bakri saal mein 2 se 3 bachhe deti hai, tezi se herd size badhta hai.",
          "**Low Feed Cost:** Neem, peepal, jhaadiyan aur kheti ka chara kha kar pal jati hain.",
          "**50% Subsidy:** National Livestock Mission (NLM) ke tehat 50% capital subsidy uplabdh hai."
        ],
        actionSteps: [
          "Raised wooden slatted floor ya ventilated shed banwayen.",
          "Certified livestock breeding center se 10 female + 1 male (Barbari / Sirohi) khareedein.",
          "PPR, Enterotoxemia aur Goat Pox ka regular vaccination schedule follow karein."
        ],
        metrics: {
          estimatedMargin: "45% - 60%",
          investmentRequired: "₹70,000 - ₹1,40,000",
          breakevenTimeline: "8 se 10 Mahine",
          subsidy: "National Livestock Mission (50% Subsidy) & NABARD"
        },
        extracted: {
          businessType: "Goat Farming (Bakri Palan)",
          capital: "₹80,000 - ₹1,50,000",
          location: profile?.location || "Rural Grazing Area",
          experience: "Livestock handling",
          requirements: "Shed, grazing ground / stall feed, Barbari/Sirohi breed"
        },
        suggestedFollowUps: [
          "Bakri palan ke liye 50% NLM subsidy kaise apply karein?",
          "Stall-fed (shed ke andar) bakri palan kaise karein?",
          "Sabse zyada bachhe dene wali bakri ki nasl kaun si hai?"
        ]
      };
    } else {
      return {
        spokenText: "Goat farming offers robust 45 to 60 percent returns with low feeding costs. Starting with 10 does and 1 buck requires 70,000 to 1.3 lakh rupees, with up to 50 percent capital subsidy under the National Livestock Mission.",
        headline: "Commercial Goat Farming Project Plan",
        directAnswer: "**Goat Farming Enterprise:** Known as the 'poor man's cow', goats offer high disease resistance, multiple twinning rates, and peak festive market value in meat trading.",
        keyPoints: [
          "**Herd Doubling:** Herd expands rapidly through 8-month reproductive cycles.",
          "**Low Overhead:** High feed-to-meat conversion using local shrubs and dry roughage.",
          "**Subsidy Access:** 50% capital subsidy under NLM and concessional KCC credit."
        ],
        actionSteps: [
          "Construct a semi-intensive elevated shed with dry ventilation.",
          "Acquire vaccinated Barbari or Sirohi breeding stock.",
          "Maintain vaccination calendar against PPR and Enterotoxemia."
        ],
        metrics: {
          estimatedMargin: "45% - 60%",
          investmentRequired: "₹80,000 - ₹1,50,000",
          breakevenTimeline: "8 - 10 Months",
          subsidy: "NLM (50% Subsidy) & NABARD Support"
        },
        extracted: {
          businessType: "Goat Farming",
          capital: "₹1,00,000",
          location: profile?.location || "Rural Plot",
          experience: "Livestock rearing",
          requirements: "Elevated shed, fodder supply, breeding buck"
        },
        suggestedFollowUps: [
          "How to apply for NLM 50% goat farming subsidy?",
          "What is stall feeding vs open grazing economics?",
          "Best commercial breeds for meat yield in India"
        ]
      };
    }
  }

  // 9. Generic / Custom Business & General Guidance
  const capVal = query.match(/(\d+[\s]*(lakh|hazaar|k|rupaye|rs|thousand|cr))/i)?.[0] || profile?.capital?.toString() || "₹50,000 - ₹1,00,000";

  if (isHindi) {
    return {
      spokenText: `Aapke sawal ka jawab yeh hai: ${idea || 'Aapka vyavasay'} ${loc} ke kshetra mein lagbhag ${capVal} ki lagat se safalta-purvak shuru kiya ja sakta hai. Isme 25 se 40 percent ka profit margin sambhav hai aur sarkari yojanaon ke madhyam se aapko aasan loan aur subsidy mil sakti hai.`,
      headline: `${idea || 'Rural Business'} Action Plan & Guidance`,
      directAnswer: `**Aapke Sawal Par Mentor Guidance:**\n\n${loc} kshetra mein **${idea}** shuru karne ke liye sahi planning, local distribution aur cash-flow management zaroori hai. Kam lagat mein pehle 20-30 customers se feedback lein aur fir vyavasay ko aage badhayein.`,
      keyPoints: [
        "**Demand Validation:** Pehle apne aaspas ke 15–20 retail grahakon ya dukaano se baat karke demand confirm karein.",
        "**Controlled Capex:** Shuruat mein sirf zaroori equipment par 40% budget kharch karein, 20% emergency reserve rakhein.",
        "**Financial Assistance:** Udyam registration aur PM Mudra / PMEGP yojana ka laabh uthayein."
      ],
      actionSteps: [
        "Local market survey karein aur competitors ke daam aur quality ko samjhein.",
        "WhatsApp Business aur local bazaar networking ke zariye grahak jodein.",
        "Dashboard par 'Govt Schemes' tab me jakar subsidy eligibility check karein."
      ],
      metrics: {
        estimatedMargin: "25% - 40%",
        investmentRequired: capVal,
        breakevenTimeline: "4 se 6 Mahine",
        subsidy: "PMEGP / MUDRA Loan Eligible"
      },
      extracted: {
        businessType: idea || "Micro Enterprise",
        capital: capVal,
        location: profile?.location || loc,
        experience: profile?.experience || "Practical knowledge",
        requirements: "Basic setup, working capital, local sales channels"
      },
      suggestedFollowUps: [
        "Is business ka step-by-step daily workflow kya hoga?",
        "Main apne pehle 50 grahak kaise banaun?",
        "Isme kitna risk hai aur usse kaise bachein?"
      ]
    };
  } else {
    return {
      spokenText: `Regarding your query: Setting up ${idea || 'your business'} in ${loc} with a capital of ${capVal} is highly viable. You can expect profit margins between 25 and 40 percent, with collateral-free financing and subsidy options available under government programs.`,
      headline: `${idea || 'Business'} Action Blueprint & Feasibility`,
      directAnswer: `**Strategic Mentor Guidance for Your Enterprise:**\n\nLaunching and scaling **${idea}** in **${loc}** requires a disciplined focus on unit economics, direct local supply, and rapid customer acquisition. Keep overheads lean and leverage community trust.`,
      keyPoints: [
        "**Validation First:** Secure intent or pre-orders from 10-15 local buyers before heavy equipment deployment.",
        "**Capital Allocation:** Invest 40% in core setup, 40% in initial inventory/working capital, and retain 20% in reserve.",
        "**Government Backing:** Leverage PMEGP or PM MUDRA for low-cost debt and capital subsidies."
      ],
      actionSteps: [
        "Conduct a 3-day local price and availability survey across nearby mandis.",
        "Set up a digital ledger (Khatabook/Vyapar) for daily sales and expense tracking.",
        "Apply for Udyam registration and explore dashboard schemes."
      ],
      metrics: {
        estimatedMargin: "25% - 40%",
        investmentRequired: capVal,
        breakevenTimeline: "4 - 6 Months",
        subsidy: "PMEGP / PM MUDRA Eligible"
      },
      extracted: {
        businessType: idea || "Rural Micro Enterprise",
        capital: capVal,
        location: profile?.location || loc,
        experience: profile?.experience || "Practical experience",
        requirements: "Core equipment, working capital, sales channels"
      },
      suggestedFollowUps: [
        "What is the step-by-step daily operational workflow?",
        "How do I acquire my first 50 paying customers?",
        "What are the major risks and how to mitigate them?"
      ]
    };
  }
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { transcript, userProfile, language } = body;

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return NextResponse.json(
        { error: 'Voice transcript is required' },
        { status: 400 }
      );
    }

    const cleanTranscript = transcript.trim();
    const isHindi = language === 'hi' || (language !== 'en' && detectIsHindiOrHinglish(cleanTranscript));

    if (!process.env.GEMINI_API_KEY) {
      // Dynamic intelligent knowledge fallback
      const dynamicResponse = generateDynamicKnowledgeResponse(cleanTranscript, userProfile);
      return NextResponse.json(normalizeResponse(dynamicResponse));
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Use gemini-1.5-flash for rapid voice interaction
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });

      const prompt = `
        You are "Grameen Voice Assistant", an expert, encouraging, and accurate AI business advisor for Indian rural & semi-urban entrepreneurs.
        
        The user has spoken a voice query/request. It might be in Hindi (Devanagari or Romanized Hinglish), English, or mixed.
        
        USER INPUT TRANSCRIPT: "${cleanTranscript}"
        
        USER CONTEXT (from current session):
        - Stored Business Idea: ${userProfile?.businessIdea || 'Not yet set'}
        - Location: ${userProfile?.location || 'Rural India'}
        - Stored Capital: ₹${userProfile?.capital || 'Not specified'}
        - Infrastructure: ${userProfile?.infrastructure || 'Standard'}
        - Experience: ${userProfile?.experience || 'Not specified'}
        - Primary Preferred Language: ${isHindi ? 'Hindi / Hinglish' : 'English'}
        
        TASK:
        1. Answer the user's specific voice query with HIGH PRECISION, practical realism, and encouragement.
        2. Generate a "spokenText" string: A concise, natural, warm spoken summary (2-4 sentences) that will be read aloud by the browser's Text-to-Speech (TTS) engine.
           - If user spoke in Hindi or Hinglish, "spokenText" MUST be in clear, natural Hindi/Hinglish (e.g. "Dairy vyavasay gaon mein bohot hi laabhkari hai...").
           - If user spoke in English, "spokenText" MUST be in clean, crisp English.
        3. Provide structured details:
           - "headline": Short punchy title (4-8 words).
           - "directAnswer": In-depth, Markdown-formatted answer addressing the exact query with facts, figures, and practical advice.
           - "keyPoints": 3 high-impact bullet points highlighting revenues, numbers, or strategies.
           - "actionSteps": 3 clear sequential action steps the user can execute immediately.
           - "metrics": Object with "estimatedMargin", "investmentRequired", "breakevenTimeline", "subsidy" (use realistic estimates).
           - "extracted": If the user mentioned business parameters (capital, business type, location, experience, requirements), extract them. If not mentioned in this query, leave them as null or use the context values.
           - "suggestedFollowUps": Array of 3 relevant follow-up voice query suggestions for the user to ask next.
        
        RETURN ONLY A VALID JSON OBJECT MATCHING THIS EXACT SCHEMA:
        {
          "spokenText": "string (warm, natural spoken answer for TTS audio playback)",
          "headline": "string",
          "directAnswer": "string (markdown formatted)",
          "keyPoints": ["string", "string", "string"],
          "actionSteps": ["string", "string", "string"],
          "metrics": {
            "estimatedMargin": "string",
            "investmentRequired": "string",
            "breakevenTimeline": "string",
            "subsidy": "string"
          },
          "extracted": {
            "capital": "string or null",
            "businessType": "string or null",
            "location": "string or null",
            "experience": "string or null",
            "requirements": "string or null"
          },
          "suggestedFollowUps": ["string", "string", "string"]
        }
      `;

      const result = await model.generateContent(prompt);
      let rawText = result.response.text().trim();
      
      // Clean markdown code blocks if present
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }

      const parsedData: VoiceAssistantResponse = JSON.parse(rawText);
      const normalized = normalizeResponse(parsedData);
      return NextResponse.json(normalized);
    } catch (geminiError) {
      console.error("Gemini API call failed, falling back to dynamic knowledge engine:", geminiError);
      const dynamicResponse = generateDynamicKnowledgeResponse(cleanTranscript, userProfile);
      return NextResponse.json(normalizeResponse(dynamicResponse));
    }
  } catch (error) {
    console.error("Voice Assistant Route Error, returning fallback:", error);
    const dynamicResponse = generateDynamicKnowledgeResponse('Business Plan Guidance', undefined);
    return NextResponse.json(normalizeResponse(dynamicResponse));
  }
}

function normalizeResponse(data: any): any {
  const keyPoints = Array.isArray(data?.keyPoints) ? data.keyPoints : [];
  const actionSteps = Array.isArray(data?.actionSteps) 
    ? data.actionSteps 
    : (Array.isArray(data?.plan) ? data.plan : []);
  const plan = Array.isArray(data?.plan)
    ? data.plan
    : (Array.isArray(data?.actionSteps) ? data.actionSteps : []);
  const suggestedFollowUps = Array.isArray(data?.suggestedFollowUps) ? data.suggestedFollowUps : [];
  
  return {
    spokenText: data?.spokenText || data?.headline || "Aapke business query ka vishleshan taiyar hai.",
    headline: data?.headline || "Business Guidance & Feasibility",
    directAnswer: data?.directAnswer || "Yahan aapke vyavasay ke liye mukhya jaankari di gayi hai.",
    keyPoints,
    actionSteps,
    plan,
    metrics: data?.metrics || {
      estimatedMargin: "25% - 40%",
      investmentRequired: "₹50,000 - ₹1,50,000",
      breakevenTimeline: "4 - 6 Months",
      subsidy: "PMEGP / MUDRA Eligible"
    },
    extracted: data?.extracted || {
      businessType: "Rural Enterprise",
      capital: "₹1,00,000",
      location: "Local Area",
      experience: "Practical knowledge",
      requirements: "Basic setup"
    },
    suggestedFollowUps
  };
}
