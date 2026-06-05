"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useState } from 'react'
import { BookOpen, PlayCircle, ExternalLink, TrendingUp, Briefcase, Lightbulb, Banknote, ChevronDown, ChevronUp } from 'lucide-react'

const curriculum = [
  {
    id: 1,
    title: "Module 1: Market Fundamentals",
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
    color: "blue",
    concepts: [
      {
        term: "TAM (Total Addressable Market)",
        definition: "The absolute maximum amount of revenue a business could possibly generate if it captured 100% of the market. It shows VCs the 'ceiling' of your idea. A massive TAM is required for Venture Capital because VCs need your company to potentially reach a $1B+ valuation to return their fund.",
        example: "If you sell a $100 software to all 10 million dentists on Earth, your TAM is $1 Billion.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Total_addressable_market"
      },
      {
        term: "SAM (Serviceable Available Market)",
        definition: "The chunk of the TAM that you can actually reach with your specific product, geographic constraints, or sales channels. It filters out the theoretical market to show the practical market.",
        example: "Only 3 million of those dentists speak English and have internet access in clinics, making your realistic SAM $300 Million.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Serviceable_available_market"
      },
      {
        term: "SOM (Serviceable Obtainable Market)",
        definition: "The highly realistic portion of the SAM you can capture in the next 1-3 years with your current team and budget. This is the metric that proves you aren't delusional.",
        example: "You aim to capture 1% of the English-speaking dentists using cold email, making your SOM $3 Million in revenue.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Serviceable_obtainable_market"
      }
    ],
    reading: { title: "Paul Graham: Startup Ideas", url: "http://www.paulgraham.com/startupideas.html" },
    video: { title: "YC: How to Size Your Market", url: "https://www.youtube.com/results?search_query=y+combinator+market+sizing" }
  },
  {
    id: 2,
    title: "Module 2: Business Models & Economics",
    icon: <Briefcase className="w-6 h-6 text-emerald-500" />,
    color: "emerald",
    concepts: [
      {
        term: "B2B vs. B2C",
        definition: "B2B (Business-to-Business) means you sell to other companies, which usually involves higher price points, longer sales cycles, and rational buying. B2C (Business-to-Consumer) means selling directly to everyday people, which relies on viral marketing, impulse buying, and massive scale.",
        example: "Salesforce is B2B. Spotify is B2C.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Business-to-business"
      },
      {
        term: "SaaS (Software as a Service)",
        definition: "A highly scalable business model where users pay a recurring subscription fee to use cloud-based software. VCs love SaaS because revenue is predictable and gross margins are incredibly high (often 80%+).",
        example: "Netflix, Slack, or Adobe Creative Cloud.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Software_as_a_service"
      },
      {
        term: "CAC (Customer Acquisition Cost)",
        definition: "The total sales and marketing cost required to acquire ONE paying customer. A high CAC kills startups. If your CAC is higher than your LTV, you are losing money on every customer you acquire.",
        example: "If you spend $1000 on Facebook ads and get 10 paying customers, your CAC is $100.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Customer_acquisition_cost"
      },
      {
        term: "LTV (Lifetime Value)",
        definition: "The total amount of gross profit a single customer will generate before they cancel or churn. A healthy SaaS startup aims for an LTV that is at least 3x higher than their CAC.",
        example: "If a customer pays $100/month and stays for 3 years, their LTV is $3,600.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Customer_lifetime_value"
      }
    ],
    reading: { title: "a16z: 16 Startup Metrics", url: "https://a16z.com/16-startup-metrics/" },
    video: { title: "David Skok: SaaS Metrics 101", url: "https://www.youtube.com/results?search_query=David+Skok+SaaS+Metrics" }
  },
  {
    id: 3,
    title: "Module 3: Intellectual Property (IP)",
    icon: <Lightbulb className="w-6 h-6 text-orange-500" />,
    color: "orange",
    concepts: [
      {
        term: "Patent & Utility Patent",
        definition: "A government-granted monopoly giving you the exclusive right to exclude others from making, using, or selling your invention for a set period (usually 20 years). A 'Utility Patent' protects how something works, while a 'Design Patent' protects how it looks.",
        example: "A highly complex neural network architecture for diagnosing cancer could potentially be protected by a utility patent.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Patent"
      },
      {
        term: "Prior Art",
        definition: "Any evidence that your invention is already known. If prior art exists anywhere in the world (even in a different language or industry), your patent application will be rejected for lack of 'novelty'.",
        example: "An old academic paper from 1995 describing the exact same algorithm you are trying to patent today.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Prior_art"
      },
      {
        term: "Defensive IP & Freedom to Operate (FTO)",
        definition: "FTO means you have the legal right to sell your product without infringing on someone else's IP. Startups file 'Defensive Patents' not to sue others, but to ensure giant tech companies can't sue them and block them from operating.",
        example: "Filing a provisional patent on day one to secure an early priority date against competitors.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Freedom_to_operate"
      }
    ],
    reading: { title: "USPTO: Patent Basics", url: "https://www.uspto.gov/patents/basics" },
    video: { title: "How to Patent an Idea", url: "https://www.youtube.com/results?search_query=How+to+patent+a+startup+idea" }
  },
  {
    id: 4,
    title: "Module 4: Fundraising 101",
    icon: <Banknote className="w-6 h-6 text-violet-500" />,
    color: "violet",
    concepts: [
      {
        term: "Pre-Seed vs. Seed Stage",
        definition: "Pre-Seed ($100k-$500k) is capital raised to build an MVP and prove demand, often from Angels. Seed ($1M-$3M) is raised after you have a working product and early revenue, used to figure out your Go-To-Market strategy before scaling.",
        example: "Raising $250k with just a Figma mockup is Pre-Seed. Raising $2M with 10,000 active users is Seed.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Seed_money"
      },
      {
        term: "Equity vs. Convertible Note (SAFE)",
        definition: "Priced Equity means selling an exact percentage of your company today at a fixed valuation. A SAFE (Simple Agreement for Future Equity) is a fast contract where investors give you cash today in exchange for equity later, usually during your Series A round, bypassing the need to negotiate a valuation now.",
        example: "Y Combinator invented the SAFE to help founders close funding rounds in days instead of months of legal negotiations.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Simple_agreement_for_future_equity"
      },
      {
        term: "Venture Capital (VC) vs. Angel Investor",
        definition: "Angels are wealthy individuals investing their personal money, meaning they can make fast decisions. VCs are professional firms managing millions of dollars from institutions (LPs); they write massive checks but require extensive due diligence and board seats.",
        example: "Naval Ravikant investing $50k is an Angel. Sequoia Capital writing a $5M check is a VC.",
        deepDiveUrl: "https://en.wikipedia.org/wiki/Venture_capital"
      }
    ],
    reading: { title: "Paul Graham: How to Raise Money", url: "http://www.paulgraham.com/fr.html" },
    video: { title: "YC: How to Raise Money", url: "https://www.youtube.com/results?search_query=y+combinator+how+to+raise+money" }
  }
]

export default function StartupAcademyPage() {
  const [openModule, setOpenModule] = useState<number>(1)

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Startup Academy" description="Master the core concepts of entrepreneurship before you pitch to investors." />
      
      <div className="max-w-4xl mx-auto space-y-6 mt-8">
        {curriculum.map((mod) => (
          <Card 
            key={mod.id} 
            className={`border-2 transition-all duration-300 overflow-hidden ${openModule === mod.id ? `border-${mod.color}-500/50 shadow-lg` : 'border-transparent shadow-sm hover:border-primary/20'}`}
          >
            <div 
              className={`p-6 flex items-center justify-between cursor-pointer ${openModule === mod.id ? `bg-${mod.color}-500/5` : 'bg-card'}`}
              onClick={() => setOpenModule(openModule === mod.id ? 0 : mod.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${mod.color}-500/10`}>
                  {mod.icon}
                </div>
                <h2 className="text-xl font-bold">{mod.title}</h2>
              </div>
              {openModule === mod.id ? <ChevronUp className="w-6 h-6 text-muted-foreground" /> : <ChevronDown className="w-6 h-6 text-muted-foreground" />}
            </div>

            {openModule === mod.id && (
              <CardContent className="p-6 pt-0 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="space-y-8 mt-4">
                  
                  {/* CONCEPTS */}
                  <div className="space-y-6">
                    {mod.concepts.map((concept, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-lg font-black text-${mod.color}-600 dark:text-${mod.color}-400`}>{concept.term}</h4>
                          <a 
                            href={concept.deepDiveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border rounded-full px-3 py-1 bg-background"
                          >
                            Deep Dive <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-base font-medium leading-relaxed">{concept.definition}</p>
                        <div className="bg-muted/30 border-l-4 border-muted p-3 text-sm italic text-muted-foreground">
                          <strong>Example:</strong> {concept.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="border-border/50" />

                  {/* RESOURCES */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <a 
                      href={mod.reading.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Read Article</p>
                        <p className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{mod.reading.title}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>

                    <a 
                      href={mod.video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-600 group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Watch Video</p>
                        <p className="text-sm font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-1">{mod.video.title}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>

                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
