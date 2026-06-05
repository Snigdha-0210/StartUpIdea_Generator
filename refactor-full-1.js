const fs = require('fs');
const path = require('path');

const files = {
  'src/store/index.ts': `import { create } from 'zustand'

export interface Project {
  id: string
  name: string
  description: string
  industry: string
}

export interface AppState {
  currentProject: Project | null
  currentIdea: string | null
  innovationIndex: number
  timelineProgress: number
  setCurrentProject: (p: Project) => void
  setIdea: (idea: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: null,
  currentIdea: null,
  innovationIndex: 84,
  timelineProgress: 45,
  setCurrentProject: (p) => set({ currentProject: p }),
  setIdea: (idea) => set({ currentIdea: idea })
}))
`,
  'src/services/aiValidationService.ts': `import { Groq } from 'groq-sdk';
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
        model: 'llama3-8b-8192',
        temperature: 0.1,
      });
      return (response.choices[0]?.message?.content || idea).split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 3);
    } catch (e) {
      return [idea];
    }
  },

  async discoverOpportunities() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = \`You are an Innovation AI. Analyze current global tech trends and suggest a new startup opportunity. Return strict JSON:
      {
        "emergingTech": "<Name of tech>",
        "marketGaps": "<The gap>",
        "industryChallenges": "<The challenge>",
        "discovered": "<Short description of what was discovered>",
        "matters": "<Why it matters>",
        "nextSteps": "<Next steps>"
      }\`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\\\`\\\`\\\`json/i, '').replace(/\\\`\\\`\\\`$/i, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return { emergingTech: "AI Agents", marketGaps: "Workflow automation", industryChallenges: "High cost", discovered: "AI is growing.", matters: "It saves money.", nextSteps: "Build an AI agent." };
    }
  },

  async validateIdea(idea: string) {
    const keywords = await this.extractKeywords(idea);
    let trendsData = null, relatedQueries = null;
    try {
      const primaryKeyword = keywords[0] || idea;
      trendsData = await googleTrendsService.getInterestOverTime(primaryKeyword);
      relatedQueries = await googleTrendsService.getRelatedQueries(primaryKeyword);
    } catch (e) {}

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = \`Analyze this idea: "\${idea}". Return strict JSON:
      {
        "idea": "\${idea}",
        "demandScore": <0-100 number>,
        "trendDirection": "<Growing | Flat | Declining>",
        "marketInterest": "<High | Medium | Low>",
        "insights": ["<Insight 1>", "<Insight 2>"]
      }\`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\\\`\\\`\\\`json/i, '').replace(/\\\`\\\`\\\`$/i, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return { idea, demandScore: 75, trendDirection: "Growing", marketInterest: "Medium", insights: ["Promising idea."] };
    }
  },

  async analyzeMarket(idea: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = \`Analyze the market for this startup idea: "\${idea}". Return strict JSON:
      {
        "tam": "<e.g. $15B>",
        "sam": "<e.g. $3B>",
        "som": "<e.g. $500M>",
        "competitors": "<Names>",
        "barriers": "<Text>",
        "viabilityScore": <0-100 number>,
        "discovered": "<Short description of market discovery>",
        "matters": "<Why it matters>",
        "nextSteps": "<Next steps>"
      }\`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\\\`\\\`\\\`json/i, '').replace(/\\\`\\\`\\\`$/i, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return { tam: "$10B", sam: "$2B", som: "$100M", competitors: "Incumbents", barriers: "High Cost", viabilityScore: 80, discovered: "Large market.", matters: "Scalable.", nextSteps: "Build MVP." };
    }
  },

  async analyzePatents(idea: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = \`Analyze patentability for: "\${idea}". Return strict JSON:
      {
        "priorArt": ["<Patent 1>", "<Patent 2>"],
        "differentiations": ["<Point 1>", "<Point 2>"],
        "discovered": "<Short description of patent landscape>",
        "matters": "<Why IP matters here>",
        "nextSteps": "<Next steps>"
      }\`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\\\`\\\`\\\`json/i, '').replace(/\\\`\\\`\\\`$/i, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return { priorArt: ["Existing software patents"], differentiations: ["Novel algorithm"], discovered: "Some prior art exists.", matters: "Need to differentiate.", nextSteps: "Draft provisional." };
    }
  },

  async matchFunding(idea: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = \`Find funding for: "\${idea}". Return strict JSON:
      {
        "programs": ["<Program 1 - Match %>", "<Program 2 - Match %>"],
        "investorReadiness": "<High|Medium|Low>",
        "commercialReadiness": "<High|Medium|Low>",
        "discovered": "<Short description of funding landscape>",
        "matters": "<Why funding fits this stage>",
        "nextSteps": "<Next steps>"
      }\`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\\\`\\\`\\\`json/i, '').replace(/\\\`\\\`\\\`$/i, '').trim();
      return JSON.parse(text);
    } catch (e) {
      return { programs: ["Seed Fund - 80%"], investorReadiness: "Medium", commercialReadiness: "Low", discovered: "Funding available.", matters: "Extends runway.", nextSteps: "Create pitch deck." };
    }
  }
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
