import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { googleTrendsService } from './googleTrendsService';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const aiValidationService = {
  async extractKeywords(idea: string): Promise<string[]> {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Extract 1 to 3 searchable Google Trends keywords from this startup idea. Return ONLY a comma-separated list.' },
          { role: 'user', content: idea }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
      });
      return (response.choices[0]?.message?.content || idea).split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 3);
    } catch (e) {
      return [idea];
    }
  },

  async discoverOpportunities(industry: string = 'General Tech', level: string = 'Global') {
    try {
      let numGaps = 20;
      if (level === 'Global') numGaps = 50;
      else if (level === 'Continent') numGaps = 40;
      else if (level === 'Country') numGaps = 30;
      else numGaps = 20;

      const prompt = `You are InnovateX AI, a hyper-local startup analyst. The user is analyzing the market: "${industry}".
Your critical task is to return a comprehensive database of EXACTLY ${numGaps} Top Market Gaps for this specific region. You MUST generate ${numGaps} items.
Ignore generic SaaS advice and deeply analyze the **physical, socioeconomic, infrastructural, and geographical reality**.

Return ONLY valid JSON with this exact structure (An ARRAY of gap objects):
[
  {
    "gap_identified": "<A highly specific description of the market gap based on real constraints>",
    "short_title": "<A punchy 3-5 word title for this gap>"
  }
]`;
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 8000
      });
      let text = response.choices[0]?.message?.content || "[]";
      
      // Strip conversational prefix (find first '[')
      const firstBracket = text.indexOf('[');
      if (firstBracket !== -1) {
        text = text.substring(firstBracket);
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        // If it hit the token limit and truncated the JSON array, try to salvage it
        console.warn("[Validation] JSON parse failed, attempting to salvage truncated array...");
        // Find the last complete object closing brace '}'
        const lastBraceIndex = text.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
          const salvagedText = text.substring(0, lastBraceIndex + 1) + ']';
          try {
            return JSON.parse(salvagedText);
          } catch (salvageError) {
             console.error("[Validation] Salvage failed.");
             throw salvageError; // Fall to outer catch
          }
        }
        throw parseError;
      }
    } catch (e) {
      console.error("[Validation] discoverOpportunities failed:", e);
      return [{ 
        gap_identified: "Workflow automation for underserved niches.", 
        short_title: "Underserved SaaS Workflow"
      }];
    }
  },

  async analyzeSpecificGap(gapSummary: any) {
    try {
      const prompt = `You are InnovateX AI. A user has selected the following market gap from the database:
Title: "${gapSummary.short_title}"
Description: "${gapSummary.gap_identified}"

Perform a Deep Dive Analysis on this specific gap. Return ONLY valid JSON with this exact structure:
{
  "core_regional_problems": ["<Specific local physical/infrastructure problem 1>", "<Specific local problem 2>"],
  "market_size": "<Approximate size, e.g., $10B TAM>",
  "competitors": ["<Local Competitor 1>", "<Local Competitor 2>"],
  "industry_trends": ["<Macro trend affecting this specific region>"],
  "risks": ["<Regulatory, geographical, or physical risk 1>"],
  "source_link": "<A real Google Search URL to validate this problem, e.g., https://www.google.com/search?q=problem+in+region>",
  "geo_arbitrage": {
    "global_startup_to_clone": "<Successful global startup that solves a similar problem>",
    "local_gap": "<Why this hasn't been deployed locally>",
    "how_to_localize": "<Exactly how to adapt the clone for local culture, constraints, and pricing>"
  },
  "chart_data": [
    {"year": "2024", "marketSize": <number>},
    {"year": "2025", "marketSize": <number>},
    {"year": "2026", "marketSize": <number>},
    {"year": "2027", "marketSize": <number>},
    {"year": "2028", "marketSize": <number>}
  ]
}`;
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5
      });
      let text = response.choices[0]?.message?.content || "{}";
      const firstBracket = text.indexOf('{');
      if (firstBracket !== -1) text = text.substring(firstBracket);
      const lastBracket = text.lastIndexOf('}');
      if (lastBracket !== -1) text = text.substring(0, lastBracket + 1);
      
      const deepDive = JSON.parse(text);
      return { ...gapSummary, ...deepDive };
    } catch (e) {
      console.error("[Validation] analyzeSpecificGap failed:", e);
      return gapSummary; // Fallback to just the summary if it fails
    }
  },

  async validateIdea(idea: string, industry: string = 'Any', targetScope: string = 'Global', specificLocation: string = 'Worldwide', budget: string = '$0 (Bootstrapping)', time: string = 'Weekends Only') {
    const keywords = await this.extractKeywords(idea);
    let trendsData = null;
    try {
      // Call the valid service instead of the deleted trendsService
      const rawData = await googleTrendsService.getInterestOverTime(keywords);
      trendsData = { score: 75, trajectory: "rising" };
    } catch (e) {
      console.log("[Trends] Using fallback data.");
      trendsData = { score: 75, trajectory: "rising" };
    }
    try {
      const prompt = `🧠 SYSTEM ROLE: "INNOVATEX AI – GLOBAL OPPORTUNITY ENGINE"

You are InnovateX AI, an advanced startup intelligence system that continuously discovers, validates, and explains real-world startup opportunities using:
- Global technology trends
- Breaking news and market shifts
- Startup ecosystem signals
- Consumer behavior changes
- Emerging research papers
- Industry inefficiencies
- Real-world business problems

Your mission is to help users discover what to build next before the market becomes obvious.

🎯 CORE OBJECTIVES
When a user interacts with you, you must:
1. Detect and generate startup opportunities from latest tech trends, market inefficiencies, new funding signals, and consumer pain points. Output actionable startup ideas, not generic suggestions.
2. Estimate demand level, identify target users, explain why the problem exists now, and detect the timing advantage.
3. Analyze feasibility, identify competitors, estimate market size, identify risks, and detect differentiation.

**CRITICAL LOCATION RULE**: Do NOT just default to mega-cities. You MUST look for high-demand, under-saturated Industry-Specific Micro-Hubs (e.g., if it's education/hostels, you MUST look at Kota; if it's textiles, Tirupur). Provide exactly 3 distinct, highly-specific locations in your output.

🌐 REAL-TIME DATA INTEGRATION RULE
Use logic based on current market trends. If real-time data is missing, clearly state assumptions. Never fabricate exact statistics.

🧠 OPPORTUNITY GENERATION RULES
Think like a Y Combinator partner + VC analyst. Prioritize problems over ideas. Focus on real inefficiencies in the world. Avoid generic ideas like "AI app" unless specific use-case exists. Prefer "boring but profitable" opportunities. Always connect ideas to real-world signals.

USER INPUT (Industry / Problem Area): "${idea}"
Constraints: Budget: ${budget}, Time: ${time}, Location Focus: ${specificLocation} (${targetScope})

🔥 OUTPUT FORMAT (STRICT JSON)
You MUST return ONLY a raw JSON object. Do not wrap in markdown or backticks.
{
  "market_signal": "<What trend/problem triggered this opportunity?>",
  "startup_opportunity": "<Explain the startup idea clearly in 2–4 lines>",
  "why_now": {
    "market_shift": "<Market shift explanation>",
    "tech_change": "<Technology change>",
    "consumer_behavior": "<Consumer behavior change>"
  },
  "target_users": "<Who is suffering from this problem?>",
  "business_potential": {
    "monetization": "<Monetization model>",
    "market_size": "<Market size approximate range>",
    "scalability": "<Scalability level>"
  },
  "competition_snapshot": {
    "existing_players": ["<Competitor 1>", "<Competitor 2>"],
    "saturation_level": "<High/Medium/Low>",
    "weaknesses": "<Weaknesses in current solutions>"
  },
  "innovation_score": <Opportunity Score 0-100 based on novelty, demand, feasibility, scalability>,
  "risks": ["<Failure point 1>", "<Failure point 2>", "<Failure point 3>"],
  "next_action": "<What should the user build FIRST (MVP suggestion)>",
  "build_strategy": {
    "how_to_build": ["<Step 1: First 30 days>", "<Step 2: Core dev>", "<Step 3: Launch>"],
    "technical_difficulties": ["<Tech hurdle 1>", "<Tech hurdle 2>"],
    "operational_difficulties": ["<Op hurdle 1>", "<Op hurdle 2>"]
  },
  "geo_arbitrage": {
    "global_startup_to_clone": "<Name of a successful global startup in this space>",
    "local_gap": "<Why this doesn't exist in your location yet>",
    "how_to_localize": "<How to adapt it for local culture/pricing>"
  },
  "bonus_mode": {
    "viral_growth": "<1 viral growth strategy>",
    "landing_page_hook": "<1 landing page hook>",
    "pitch": "<1 line investor pitch>",
    "mvp_features": ["<Feature 1>", "<Feature 2>", "<Feature 3>"]
  },
  "top_locations": [
    {
      "name": "<Top Country/City 1>",
      "lat": <Exact latitude>,
      "lng": <Exact longitude>,
      "score": <Opportunity density score>,
      "reason": "<Why launch here?>"
    },
    {
      "name": "<Top Country/City 2>",
      "lat": <Exact latitude>,
      "lng": <Exact longitude>,
      "score": <Opportunity density score>,
      "reason": "<Why launch here?>"
    },
    {
      "name": "<Top Country/City 3>",
      "lat": <Exact latitude>,
      "lng": <Exact longitude>,
      "score": <Opportunity density score>,
      "reason": "<Why launch here?>"
    }
  ]
}`;

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4
      });
      
      let text = response.choices[0]?.message?.content || "{}";
      text = text.trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      
      const parsed = JSON.parse(text);
      return parsed;

    } catch (e) {
      console.error("[Validation] Opportunity Engine failed:", e);
      return { 
        market_signal: "Fallback Signal due to API error.",
        startup_opportunity: "Could not generate opportunity due to API limitations.",
        why_now: { market_shift: "Unknown", tech_change: "Unknown", consumer_behavior: "Unknown" },
        target_users: "Unknown users",
        business_potential: { monetization: "Unknown", market_size: "Unknown", scalability: "Unknown" },
        competition_snapshot: { existing_players: ["Unknown"], saturation_level: "Unknown", weaknesses: "Unknown" },
        innovation_score: 50,
        risks: ["API Error occurred, please try again."],
        next_action: "N/A",
        build_strategy: { how_to_build: [], technical_difficulties: [], operational_difficulties: [] },
        geo_arbitrage: { global_startup_to_clone: "N/A", local_gap: "N/A", how_to_localize: "N/A" },
        bonus_mode: { viral_growth: "N/A", landing_page_hook: "N/A", pitch: "N/A", mvp_features: [] },
        top_locations: [{ name: "New York, USA", lat: 40.7128, lng: -74.0060, score: 50, reason: "Fallback location" }]
      };
    }
  },

  async analyzeMarket(idea: string) {
    try {
      const prompt = `You are a Tier 1 Venture Capital Analyst. Perform a rigorous Market Validation for the following startup idea: "${idea}".
Return ONLY valid JSON with this exact structure:
{
  "market_size": {
    "tam": { "value": <Number in millions, e.g., 15000 for $15B>, "label": "<String e.g. $15B>", "reasoning": "<How did you calculate this?>" },
    "sam": { "value": <Number in millions>, "label": "<String>", "reasoning": "<How did you calculate this?>" },
    "som": { "value": <Number in millions>, "label": "<String>", "reasoning": "<How did you calculate this?>" }
  },
  "target_demographics": {
    "primary_profile": "<Who is the absolute best early adopter?>",
    "pain_point_intensity": "<High/Medium/Low and Why>"
  },
  "unit_economics": {
    "estimated_cac": "<Estimated Customer Acquisition Cost e.g. $10-$50>",
    "estimated_ltv": "<Estimated Lifetime Value e.g. $500>",
    "revenue_model": "<How do you make money?>"
  },
  "competitors": {
    "direct": ["<Competitor 1>", "<Competitor 2>"],
    "indirect": ["<Alternative 1>", "<Alternative 2>"],
    "status_quo": "<What do users do right now instead of using this?>"
  },
  "swot_analysis": {
    "strengths": ["<Internal strength 1>", "<Internal strength 2>"],
    "weaknesses": ["<Internal weakness 1>", "<Internal weakness 2>"],
    "opportunities": ["<External opportunity 1>", "<External opportunity 2>"],
    "threats": ["<External threat 1>", "<External threat 2>"]
  },
  "barriers_to_entry": ["<Barrier 1>", "<Barrier 2>", "<Barrier 3>"],
  "viability": {
    "score": <0-100 integer>,
    "verdict": "<'Go' or 'No-Go' or 'Pivot'>",
    "explanation": "<Why did you give this score?>"
  }
}`;
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3
      });
      let text = response.choices[0]?.message?.content || "{}";
      const firstBracket = text.indexOf('{');
      if (firstBracket !== -1) text = text.substring(firstBracket);
      const lastBracket = text.lastIndexOf('}');
      if (lastBracket !== -1) text = text.substring(0, lastBracket + 1);
      
      return JSON.parse(text);
    } catch (e) {
      console.error("[Validation] analyzeMarket failed:", e);
      return { 
        market_size: {
          tam: { value: 10000, label: "$10B", reasoning: "Fallback TAM" },
          sam: { value: 2000, label: "$2B", reasoning: "Fallback SAM" },
          som: { value: 100, label: "$100M", reasoning: "Fallback SOM" }
        },
        target_demographics: { primary_profile: "Unknown", pain_point_intensity: "Unknown" },
        unit_economics: { estimated_cac: "Unknown", estimated_ltv: "Unknown", revenue_model: "Unknown" },
        competitors: { direct: ["Incumbent A"], indirect: ["Spreadsheets"], status_quo: "Manual work" },
        swot_analysis: { strengths: ["N/A"], weaknesses: ["N/A"], opportunities: ["N/A"], threats: ["N/A"] },
        barriers_to_entry: ["High Cost", "Regulations"],
        viability: { score: 50, verdict: "Pivot", explanation: "API failed to generate analysis." }
      };
    }
  },

  async analyzePatents(idea: string) {
    try {
      const prompt = `You are an elite Patent Examiner at the USPTO. Perform a deep prior art search for the following concept: "${idea}".
Return ONLY valid JSON with this exact structure:
{
  "prior_art_matrix": [
    {
      "title": "<Name of the patent, academic paper, or existing commercial product>",
      "assignee": "<The company or inventor e.g., IBM, Apple, Google, Independent>",
      "threat_level": "<High, Medium, or Low>",
      "relevance_summary": "<One sentence explaining exactly why this is similar or threatening>",
      "google_patents_url": "<Generate a highly relevant search URL, e.g., https://patents.google.com/?q=(search+terms) or a direct link if known>"
    }
  ],
  "differentiation_strategy": [
    "<Actionable strategy 1 to avoid infringement>",
    "<Actionable strategy 2>"
  ]
}

CRITICAL: You MUST generate a massive flood of results. Provide a minimum of 15 and up to 50 highly specific prior art records in the 'prior_art_matrix' array. Do not return generic responses.`;

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4
      });
      let text = response.choices[0]?.message?.content || "{}";
      const firstBracket = text.indexOf('{');
      if (firstBracket !== -1) text = text.substring(firstBracket);
      const lastBracket = text.lastIndexOf('}');
      if (lastBracket !== -1) text = text.substring(0, lastBracket + 1);
      
      return JSON.parse(text);
    } catch (e) {
      console.error("[Patents] analyzePatents failed:", e);
      return { 
        prior_art_matrix: [
          { title: "Generic Software System", assignee: "Unknown", threat_level: "Medium", relevance_summary: "Similar baseline architecture.", google_patents_url: "https://patents.google.com/?q=software" }
        ],
        differentiation_strategy: ["Focus on UI/UX", "Target a niche market"]
      };
    }
  },

  async matchFunding(idea: string) {
    try {
      const prompt = `You are a top-tier fundraising advisor. Identify real-world, active funding platforms, VCs, accelerators, and grants that are the absolute best fit for the following startup idea: "${idea}".
Return ONLY valid JSON with this exact structure:
{
  "platforms": [
    {
      "name": "<Exact name of the VC firm, accelerator, or platform e.g., Y Combinator, Wefunder>",
      "url": "<Their official real-world URL e.g., https://www.ycombinator.com>",
      "type": "<Venture Capital, Accelerator, Crowdfunding, or Grant>",
      "check_size": "<Typical investment amount e.g., $125k, $1M - $3M>",
      "fit_reason": "<Why exactly is this platform perfect for this specific idea?>"
    }
  ],
  "readiness_checklist": [
    "<A specific, actionable thing the founder must prepare before applying, e.g., 'Have a live MVP with 100 DAUs'>",
    "<Checklist item 2>",
    "<Checklist item 3>",
    "<Checklist item 4>",
    "<Checklist item 5>"
  ]
}
Ensure you generate exactly 6 highly relevant platforms spanning different types (VCs, Accelerators, Crowdfunding, Grants). Do NOT hallucinate fake URLs; use the actual real-world URLs for these famous platforms.`;
      
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3
      });
      let text = response.choices[0]?.message?.content || "{}";
      const firstBracket = text.indexOf('{');
      if (firstBracket !== -1) text = text.substring(firstBracket);
      const lastBracket = text.lastIndexOf('}');
      if (lastBracket !== -1) text = text.substring(0, lastBracket + 1);
      
      return JSON.parse(text);
    } catch (e) {
      console.error("[Funding] matchFunding failed:", e);
      return { 
        platforms: [
          { name: "Y Combinator", url: "https://www.ycombinator.com", type: "Accelerator", check_size: "$500k", fit_reason: "Best general software accelerator." },
          { name: "Wefunder", url: "https://wefunder.com", type: "Crowdfunding", check_size: "$50k - $5M", fit_reason: "Great for community-driven startups." }
        ],
        readiness_checklist: ["Prepare a Pitch Deck", "Build an MVP"]
      };
    }
  }
};
