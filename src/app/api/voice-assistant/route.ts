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
  metrics?: {
    estimatedMargin?: string;
    investmentRequired?: string;
    breakevenTimeline?: string;
    subsidy?: string;
  };
  extracted?: {
    capital?: string;
    businessType?: string;
    location?: string;
    experience?: string;
    requirements?: string;
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
    'sarkari', 'madad', 'paisa', 'kharidna', 'bhechna', 'bataiye', 'kholna'
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
          capital: profile?.capital?.toString() || "₹1,50,000",
          location: profile?.location || "Local Rural Cluster",
          experience: profile?.experience || "Practical farming knowledge",
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

  // 2. Poultry / Broiler / Layer / Eggs / Chicken
  if (query.includes('poultry') || query.includes('murgi') || query.includes('chicken') || query.includes('egg') || query.includes('anda') || query.includes('broiler') || query.includes('layer')) {
    if (isHindi) {
      return {
        spokenText: "Poultry farming ek tezi se badhne wala vyavasay hai. Broiler farming mein 40 se 45 din ke cycle mein munafa milna shuru ho jata hai. 500 murgiyon ke batch ke liye lagbhag 70,000 se 1.2 lakh rupaye ki lagat aati hai, aur har batch par 25 se 35 percent munafa banta hai.",
        headline: "Poultry Farming Setup & Profit Analysis",
        directAnswer: "**Poultry Farming (Murgi Palan)** rural areas mein sabse fast turnover dene wala business hai. Broiler birds 42 din mein 2 kg vajan le lete hain. Local chicken meat vendors aur weekly haats mein inki barah maas maang rehti hai.",
        keyPoints: [
          "**Fast Cycle:** Har 45 din mein naya batch tayyar aur cash return.",
          "**FCR Target:** Feed Conversion Ratio 1.5–1.6 ke andar rakhne par munafa badhta hai.",
          "**Layer Farming:** Kadaknath ya Desi murgi ke ande ₹10–₹15 prati nag bikte hain."
        ],
        actionSteps: [
          "Shed mein East-West hawa ki disha aur bio-security foot dip lagayein.",
          "Certified hatchery se vaccinated Day-Old Chicks (DOC) book karein.",
          "Local meat dukaandaron se batch bikri ka advance agreement karein."
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
        suggestedFollowUps: [
          "How to create a project report (DPR) for PMEGP?",
          "What documents are needed for PM Mudra loan?",
          "How to track loan application status on Jan Samarth?"
        ]
      };
    }
  }

  // 4. Cold Press Oil / Flour Mill / Chakki / Spices / Food Processing
  if (query.includes('oil') || query.includes('tel') || query.includes('chakki') || query.includes('atta') || query.includes('flour') || query.includes('masala') || query.includes('spice') || query.includes('kachi ghani') || query.includes('cold press')) {
    if (isHindi) {
      return {
        spokenText: "Cold-press oil aur mini flour chakki ka business gaon aur kasbon mein behad kamyab hai. Shuddh kachi ghani sarson ya moongfali ke tel par 35 se 45 percent tak ka gross profit margin milta hai. Sath hi tel nikalne ke baad bachi hui khali dairy kisano ko bechkar extra kamai hoti hai.",
        headline: "Cold Press Oil & Agro-Processing Enterprise",
        directAnswer: "**Cold-Press Oil & Spices Unit (Kachi Ghani Tel / Masala Udyog):** Chemical-free shuddh tel aur taze masalon ki maang tezi se badh rahi hai. Cold-press lakdi/steel expeller machine se sarson, moongfali ya til ka tel nikaal kar local bazaar mein premium daam par becha ja sakta hai.",
        keyPoints: [
          "**Dual Earning:** Tel bikne ke sath sath tel ki khali (oil cake) dairy walo ko ₹25–₹35/kg bikti hai.",
          "**High Margins:** Shuddh kachi ghani tel standard packaged tel se 30% zyada rate par bikta hai.",
          "**Steady Demand:** Har parivar mein tel aur masale rozana ki zaroorat hain."
        ],
        actionSteps: [
          "10 HP cold press expeller aur stainless steel filtration tank lagwayen.",
          "Local kisano se seedhe harvest ke samay saste daam par sarson/moongfali kharidein.",
          "FSSAI Basic registration aur clean bottle packaging ka intezam karein."
        ],
        metrics: {
          estimatedMargin: "35% - 48%",
          investmentRequired: "₹1,20,000 - ₹2,50,000",
          breakevenTimeline: "3 se 5 Mahine",
          subsidy: "PMFME Scheme (35% Subsidy on Food Processing)"
        },
        suggestedFollowUps: [
          "Cold press tel machine ki kimat kitni hai?",
          "FSSAI food license lene ki kya prakriya hai?",
          "Sarson tel nikaalne par kitna percent tel aur kitni khali nikalti hai?"
        ]
      };
    } else {
      return {
        spokenText: "A cold-press oil or spice processing unit is highly profitable, delivering 35 to 48 percent margins. Pure wood-pressed mustard or groundnut oil commands premium local prices, and the leftover oil cake is sold directly to dairy farmers as high-protein cattle feed.",
        headline: "Cold-Press Oil & Agro-Processing Feasibility",
        directAnswer: "**Cold-Pressed Oil and Spice Processing** leverages the rising consumer preference for pure, unadulterated edible oils and freshly ground spices. By procuring seeds directly from farmers at harvest, you maximize margins.",
        keyPoints: [
          "**Byproduct Monetization:** Oil cake (Khali) is liquidated immediately to local cattle owners.",
          "**Premium Retail Pricing:** Cold-pressed oil sells at ₹180–₹240/litre vs. standard ₹140 refined oil.",
          "**PMFME Support:** Eligible for 35% credit-linked capital subsidy up to ₹10 Lakhs."
        ],
        actionSteps: [
          "Procure a single-phase/three-phase cold-press expeller and oil settling tanks.",
          "Source dry mustard or groundnut seeds with < 8% moisture content.",
          "Establish monthly subscription orders with 40-50 local families."
        ],
        metrics: {
          estimatedMargin: "35% - 45%",
          investmentRequired: "₹1,20,000 - ₹2,50,000",
          breakevenTimeline: "4 - 5 Months",
          subsidy: "PMFME (35% capital subsidy)"
        },
        suggestedFollowUps: [
          "What is the power consumption and machinery cost for cold-press expeller?",
          "How to get basic FSSAI certification online?",
          "What is the average oil extraction yield percentage?"
        ]
      };
    }
  }

  // 5. Vermicompost / Organic Farming / Manure / Khaad
  if (query.includes('vermicompost') || query.includes('khaad') || query.includes('manure') || query.includes('khechua') || query.includes('organic') || query.includes('fertilizer') || query.includes('jaivik')) {
    if (isHindi) {
      return {
        spokenText: "Vermicompost yaani kenchua khaad ka business sabse kam lagat aur sabse zyada munafe wala vyavasay hai. 40,000 se 70,000 rupaye mein aap 5 se 10 vermi-beds shuru kar sakte hain. Isme 60 percent se zyada ka gross margin hota hai kyunki gobar aur kheti ka kachra lagbhag muft milta hai.",
        headline: "Vermicompost & Organic Fertilizer Business",
        directAnswer: "**Vermicompost (Kenchua Khaad Nirman):** Gobar aur sukhe patton se Eisenia Foetida kenchuo ke zariye banai gayi jaivik khaad ₹8 se ₹12 prati kilo bikti hai. Sath hi har 60 din mein kenchuo ki sankhya double hoti hai, jinhe aap anya kisano ko ₹400/kg bech sakte hain.",
        keyPoints: [
          "**Near-Zero Raw Material Cost:** Gobar aur fasal ke aavshesh local dairy aur kheton se asaani se milte hain.",
          "**Multiple Income Streams:** Vermicompost khaad + Vermiwash liquid tonic + Earthworms sales.",
          "**Government Promotion:** Paramparagat Krishi Vikas Yojana (PKVY) ke tehat certified farmers ko high demand hai."
        ],
        actionSteps: [
          "12x4 ft ke HDPE vermi-beds lagayein aur 75% agro-shade net lagayein.",
          "KVK ya certified farm se Eisenia Foetida kenchue procure karein.",
          "Khaad ki chhannaai ke liye rotary drum sieve ka istemal karein."
        ],
        metrics: {
          estimatedMargin: "60% - 75%",
          investmentRequired: "₹35,000 - ₹80,000",
          breakevenTimeline: "60 - 75 Din (1st Batch)",
          subsidy: "National Project on Organic Farming & PKVY Grants"
        },
        suggestedFollowUps: [
          "Vermi-bed mein nami aur tapman kaise maintain karein?",
          "Vermiwash liquid ko alag se kaise collect karein aur kitne me bechein?",
          "Local nurseries aur bagwani walo ko khaad kaise supply karein?"
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
        suggestedFollowUps: [
          "How to maintain moisture levels in hot summer months?",
          "How to package and brand organic vermicompost?",
          "How to extract vermiwash liquid spray?"
        ]
      };
    }
  }

  // 6. Generic / Custom Business & General Guidance
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
    const { transcript, history, userProfile, language } = body;

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
      return NextResponse.json(dynamicResponse);
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
      const responseText = result.response.text();
      const parsedData: VoiceAssistantResponse = JSON.parse(responseText);

      // Sanitize and ensure spokenText exists
      const normalized = normalizeResponse(parsedData);
      return NextResponse.json(normalized);
    } catch (geminiError) {
      console.error("Gemini API call failed, falling back to dynamic knowledge engine:", geminiError);
      const dynamicResponse = generateDynamicKnowledgeResponse(cleanTranscript, userProfile);
      return NextResponse.json(normalizeResponse(dynamicResponse));
    }
  } catch (error) {
    console.error("Voice Assistant Route Error:", error);
    return NextResponse.json(
      { error: 'Failed to process voice request' },
      { status: 500 }
    );
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
