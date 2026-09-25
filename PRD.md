# Product Requirement Document (PRD)

**Project Name:** GrameenSathi (RURALIX)  
**Version:** 1.0.0  
**Document Type:** Product Requirement Document (PRD)  
**Target Release:** Production / Smart India Hackathon (SIH) Showcase  
**Status:** Implemented & Verified  

---

## 1. Executive Summary & Product Overview

### 1.1 Vision & Mission
**GrameenSathi (RURALIX)** is an AI-powered, hyper-local business advisory and financial structuring platform specifically designed to empower India's 63+ million rural and semi-urban micro-entrepreneurs. 

The platform addresses grassroots challenges—such as low formal financial literacy, lack of localized market data, language barriers, and high business failure rates—by delivering real-time actionable intelligence, mathematical risk feasibility scores, official government subsidy matching, and vernacular voice-first advisory.

### 1.2 Key Objectives
- **Mitigate Enterprise Mortality:** Provide pre-launch feasibility stress-testing to avoid fixed-capital loss and predatory debt traps.
- **Democratize Subsidies & Financing:** Seamlessly match entrepreneurs to credit-linked government subsidies (PMEGP 35% capital subsidy, PM MUDRA loans, PMFME, NLM, KCC).
- **Frictionless Vernacular Access:** Deliver bi-directional voice interfaces (Hindi, Hinglish, English) using Web Speech STT/TTS.
- **Hyper-Local Geospatial Intelligence:** Uncover untapped market voids and commercial opportunities using OpenStreetMap live radar.

---

## 2. Problem Statement & Target Personas

### 2.1 The Core Problems
1. **High Rural Business Failure Rate:** Over 70% of rural micro-enterprises close within their first 18 months due to inadequate working capital buffers and zero localized market research.
2. **Under-Utilized Government Subsidies:** Despite thousands of crores allocated to PMEGP, MUDRA, and PMFME, grassroots founders struggle with eligibility discovery and paperwork complexity.
3. **Language & Literacy Hurdles:** Complex financial reports and banking portals alienate non-English native speakers.
4. **Blind Inventory Stocking:** Lack of predictive tools for seasonal weather changes, mandi harvest cycles, and local festive demand surges leads to dead stock.

### 2.2 Target User Personas

| Persona | Profile & Background | Core Pain Point | GrameenSathi Solution |
| :--- | :--- | :--- | :--- |
| **Ramesh (Aspiring Founder)** | Village resident with ₹1.5L savings, wants to start a business. | Unsure which enterprise is viable in his village without losing money. | **AI Business Advisor & GIS Map:** Identifies high-margin gaps (Cold Storage, CSC, Oil Mill). |
| **Sunita (Small Dairy Owner)** | Runs a 3-cow dairy setup; seeks expansion. | Low milk margins due to middlemen; unaware of subsidies. | **Scheme Matcher & Mentor:** Matches 35% PMFME/PMEGP subsidy & value-added paneer/ghee workflows. |
| **Vikas (Village Kirana Owner)** | Manages general grocery store in a panchayat town. | Overstocking during slow seasons; unpredictable cash flow. | **Demand Predictor & Cash Flow Assistant:** Accurate seasonal inventory forecasts & daily P&L tracking. |

---

## 3. Product Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                              USER INTERFACES                                      |
|  - Web Application (Next.js 16 Responsive UI)                                      |
|  - Interactive Vernacular Voice Assistant (आवाज़)                                   |
|  - Continuous WhatsApp-Style Mentor Chatbot                                       |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           NEXT.JS API & ROUTE LAYER                               |
|  - /api/advisory       - /api/reality-check    - /api/schemes     - /api/demand   |
|  - /api/opportunity-map- /api/voice-assistant  - /api/chat        - /api/detect-loc|
+------------------------------------------+----------------------------------------+
                                           |
             +-----------------------------+-----------------------------+
             |                                                           |
             v                                                           v
+-------------------------------------------+   +------------------------------------+
|            AI & INTELLIGENCE ENGINES      |   |        REAL-TIME TELEMETRY         |
|  - Google Gemini 1.5 Flash / Pro LLM      |   |  - Open-Meteo Weather API          |
|  - Mathematical Feasibility & Risk Engine |   |  - OpenStreetMap Geocoding         |
|  - Official National Schemes Database    |   |  - Overpass Live POI Queries       |
+-------------------------------------------+   +------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        CLIENT STATE & LOCAL PERSISTENCE                           |
|  - React Context API (DashboardContext)                                           |
|  - Browser LocalStorage Session Cache (Zero Hydration Mismatch)                   |
+-----------------------------------------------------------------------------------+
```

---

## 4. Detailed Functional Specifications & Modules

### 4.1 Module 1: Interactive Vernacular Voice Assistant (आवाज़)
- **Feature Description:** Provides real-time bi-directional voice consultation in Hindi, Hinglish, and English.
- **Capabilities:**
  - Speech Recognition with auto-silence detection and volume level visualizer.
  - Natural Speech Synthesis with selectable speech rates and pause/resume audio playback.
  - Automatic extraction of user parameters (Capital, Business Type, Location, Experience) into active state.
  - Generates structured operational metric breakdowns: Spoken response, direct answer, action steps, margin metrics, and follow-up prompts.

### 4.2 Module 2: Hyper-Local AI Business Recommendation
- **Feature Description:** Recommends viable, regionally tailored enterprises based on 4 concurrent parameters:
  1. `Location` (with automatic GPS/IP geolocation reverse-geocoded via Nominatim).
  2. `Available Capital` (₹) with tiered subsidy callouts.
  3. `Commercial Space & Sector Interests` (Retail, Cold Storage, Processing, Dairy, Hardware, etc.).
  4. `Available Infrastructure & Utilities` (3-Phase power, road connectivity, water supply).
- **Outputs:** Recommended enterprise name, viability rating (0–100%), regional economic analysis, and immediate 4-step execution roadmap.

### 4.3 Module 3: Uncompromising Financial Reality Check
- **Feature Description:** Stress-tests business ideas against real-world constraints before founders commit capital.
- **Evaluation Dimensions:**
  - `Market Demand Score` (0–100)
  - `Competition Resistance Score` (0–100)
  - `Capital Runway & Sufficiency` (0–100)
  - `Projected Operating Margins` (0–100)
  - `Infrastructure Compatibility` (0–100)
  - `Operational Risk Index` (0–100)
- **Output:** Strict feasibility score verdict with cost structures and actionable mitigation strategies.

### 4.4 Module 4: Government Scheme Matcher
- **Feature Description:** Automatically connects entrepreneurs to verified national and state credit/subsidy portals.
- **Key Supported Programs:**
  1. **PMEGP:** Prime Minister's Employment Generation Programme (Up to 35% Capital Subsidy).
  2. **PM MUDRA Yojana:** Collateral-free loans up to ₹10 Lakhs (Shishu, Kishore, Tarun).
  3. **PMFME:** PM Formalisation of Micro Food Processing Enterprises (35% Grant up to ₹10L).
  4. **Kisan Credit Card (KCC):** Subsidized 4% working capital credit.
  5. **Stand-Up India Scheme:** Greenfield loans for SC/ST and Women founders (₹10L to ₹1Cr).
  6. **National Livestock Mission (NLM):** 50% capital subsidy for poultry, goat, and dairy units.
  7. **PMFBY:** Pradhan Mantri Fasal Bima Yojana crop and loss insurance.
- **Actionability:** Direct portal links to `pmkisan.gov.in`, `mudra.org.in`, `jansamarth.in`, and `pmfme.mofpi.gov.in`.

### 4.5 Module 5: Seasonal Demand & Inventory Forecaster
- **Feature Description:** Predicts high-velocity consumer demand spikes based on local seasons, weather cycles, and upcoming festivals or weekly village haats.
- **Inputs:** Location, Agricultural Season (Monsoon, Summer, Winter, Harvest, Sowing), Upcoming Festival/Event (Diwali, Navratri, Holi, Wedding Season, Weekly Mandi).
- **Outputs:** Top 3 trending items with demand surge badges (🔥 Demand Surge) and strategic inventory advice.

### 4.6 Module 6: Interactive Live GIS Market Opportunity Map
- **Feature Description:** Visual GIS radar mapping local enterprises, competitor density, and untapped market voids.
- **Capabilities:**
  - Interactive Leaflet.js map with Street and Satellite imagery layers.
  - Live POI querying via OpenStreetMap Overpass API (Retail, Hardware, Banks, Pharmacies, Mandis).
  - Automatically identifies and flags **Untapped Opportunity Gaps** (e.g. cold storage voids, processing clusters).
  - One-click "Open Live Location in Google Maps" navigation.

### 4.7 Module 7: Continuous AI Business Mentor & Chatbot
- **Feature Description:** Long-term, context-aware business mentor remembering past decisions and milestones.
- **Capabilities:**
  - WhatsApp-style floating widget with quick prompts.
  - End-to-end 6-Phase Business Workflow generator (Setup & Licensing, Sourcing & Supply Chain, Daily Operations SOP, Quality & Packaging, Hyperlocal Marketing, Financial Scaling).
  - Session history memory persisted via `localStorage`.

### 4.8 Module 8: Live Dashboard & Telemetry Widgets
- **Dynamic KPI Cards:** Active business status, estimated monthly turnover, monthly footfall visits, milestones completed.
- **Profit Simulator:** Interactive slider simulating monthly net profits across daily customer volume.
- **Daily Cash-Flow Assistant:** Projected sales, operating expenses, and net daily cash margins.
- **Live Weather Telemetry:** Real-time temperature, humidity, and weather conditions fetched via Open-Meteo API.
- **Loan Readiness Gauge:** Bank and subsidy readiness score (0–100) with document checklist.

---

## 5. Technical Stack & Technology Choices

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16.3 (App Router, Turbopack) | Fast server-side rendering, API routes, instant cold starts |
| **Language** | TypeScript 5 | Strong type safety and clean interfaces |
| **Styling** | Vanilla CSS Modules | Zero runtime CSS overhead, full theme flexibility |
| **Icons** | Lucide React | Lightweight, consistent SVG icon set |
| **GIS Mapping** | Leaflet 1.9 + Esri Satellite Tiles | Open-source, fast, lightweight interactive mapping |
| **AI Models** | Google Gemini (`gemini-1.5-flash` & `gemini-1.5-pro`) | High-speed structured JSON inference, multi-lingual RAG |
| **Geospatial APIs** | OpenStreetMap (Nominatim Geocoding + Overpass POI API) | Real-world global and local commercial locations |
| **Weather Telemetry** | Open-Meteo API | Free, open real-time weather and humidity data |
| **State & Persistence** | React Context API + LocalStorage | Offline-resilient, hydration-safe client state |

---

## 6. Non-Functional Requirements (NFRs)

1. **Performance & Speed:**
   - First Contentful Paint (FCP) < 1.2s on 4G networks.
   - AI Chat & Voice Assistant response latency < 1.5s using `gemini-1.5-flash`.
2. **Reliability & Offline Fallbacks:**
   - 100% operational resilience: In the absence of an active LLM key, mathematical scoring models and authoritative scheme algorithms continue to provide accurate results.
3. **Accessibility & Usability:**
   - High-contrast green palette (`#059669`) tailored for mobile screens under bright daylight.
   - Touch-friendly tap targets (> 44px) for all mobile buttons and interactive chips.
4. **Security & Data Privacy:**
   - No sensitive personally identifiable information (PII) transmitted to unencrypted endpoints.
   - Client session data securely sandboxed in browser `localStorage`.

---

## 7. Product Roadmap

```
+-----------------------------------------------------------------------------------+
| PHASE 1: CORE FOUNDATION (COMPLETED)                                              |
| - AI Business Recommendation & Mathematical Feasibility Reality Check             |
| - Live GIS Market Map & Official Government Schemes Matcher                       |
| - Vernacular Voice Assistant (Web Speech STT/TTS) & Live Weather Telemetry        |
+-----------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
| PHASE 2: REGIONAL & MESSAGING SCALE (Q4 2026)                                     |
| - Official WhatsApp Business Bot Webhook Integration                              |
| - Bhashini AI Integration for 12+ Indian Regional Dialects (Marathi, Bengali, etc)|
| - e-NAM Real-Time Mandi Price & Commodity APMC Data Feeds                         |
+-----------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
| PHASE 3: COMMERCE & CREDIT LINKAGES (2027)                                        |
| - Direct Jan Samarth & Bank API Subsidized Loan Application Integration           |
| - ONDC Rural Seller Onboarding & Digital Catalog Integration                      |
| - Self-Help Group (SHG) & FPO Cluster Collaboration Dashboard                     |
+-----------------------------------------------------------------------------------+
```

---

## 8. Business Impact & Success Metrics

| Metric | Target Goal | Measurement Mechanism |
| :--- | :--- | :--- |
| **Subsidy Discovery Rate** | > 85% of users matched to eligible schemes | Scheme Matcher completion logs |
| **Feasibility Validation** | > 90% of ideas stress-tested prior to capex | Reality Check module usage |
| **Voice Accessibility** | > 50% queries initiated via Voice / Vernacular | Speech recognition session counts |
| **Response Latency** | < 1.5s average AI response time | Server telemetry & API latency logs |
| **User Retention** | > 60% repeat monthly engagement via AI Mentor | LocalStorage & interaction history |
