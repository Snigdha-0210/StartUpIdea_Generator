# InnovateX AI 🚀 (StartUpIdea_Generator)

InnovateX AI is an advanced, AI-powered platform designed to act as your ultimate co-founder. It accelerates the entire entrepreneurial journey—from ideation and market validation to patent research and finding venture capital.

## 🌟 Key Features

- **💡 Startup Generator**: Instantly generate brilliant startup ideas based on emerging trends, AI advancements, and market gaps.
- **📊 Market Validation**: Run deep-dive market analyses to prove product-market fit, calculate TAM/SAM/SOM, and discover your core target audience.
- **🛡️ Patent Intelligence**: Protect your intellectual property by checking for prior art and understanding patentability before you build.
- **📚 Startup Academy**: A comprehensive, step-by-step masterclass covering business models, unit economics, fundraising, and more.
- **💰 Funding Directory**: Get automatically matched with Venture Capital firms, Accelerators, and Crowdfunding platforms tailored to your specific startup's stage and industry.

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + custom glassmorphism & micro-animations
- **Database & Auth**: Firebase / Firestore
- **Icons**: Lucide React
- **State Management**: Zustand
- **AI Integrations**: Groq & Google Gemini (Keys hidden in `.env.local`)

## 🔐 Security Notice

All sensitive API keys and configuration variables have been properly hashed and removed from version control. 

To run this project locally, you will need to create a `.env.local` file in the root directory and provide your own keys:
```env
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🚀 Running Locally

1. Clone the repository:
```bash
git clone https://github.com/Snigdha-0210/StartUpIdea_Generator.git
cd StartUpIdea_Generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*Built with ❤️ by InnovateX AI*
