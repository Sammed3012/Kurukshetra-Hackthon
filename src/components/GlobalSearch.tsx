import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "@/lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SearchResult {
  title: string;
  description: string;
  tabId: string;
  type: "feature" | "info";
}

export default function GlobalSearch({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const features = [
    { id: "home", label: "Home", desc: "Main dashboard and overview" },
    { id: "voice", label: "AgriVoice Connect", desc: "Voice-based agricultural assistant" },
    { id: "finance", label: "AgriFinance Advisor", desc: "Personalized loans and insurance" },
    { id: "doctor", label: "AgriDoctor Pro", icon: "Stethoscope", desc: "Crop disease diagnosis" },
    { id: "academy", label: "AgriProfit Academy", desc: "Personalized learning courses" },
    { id: "community", label: "AgriCommunity Network", desc: "Connect with other farmers" },
    { id: "map", label: "FarmVision 3D", desc: "3D farm mapping and analysis" },
    { id: "locator", label: "AgriMatch Locator", desc: "Find nearby agricultural services" },
    { id: "weather", label: "AgriWeather Insights", desc: "Weather forecasts and farm impact" },
    { id: "market", label: "AgriMarket Intelligence", desc: "Mandi prices and market trends" },
    { id: "mart", label: "AgriMart Exchange", desc: "Buy, sell, and rent equipment" },
    { id: "profile", label: "User Dashboard", desc: "Manage your profile and farm data" },
  ];

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Local feature search
    const matchedFeatures = features
      .filter(f => f.label.toLowerCase().includes(val.toLowerCase()) || f.desc.toLowerCase().includes(val.toLowerCase()))
      .map(f => ({
        title: f.label,
        description: f.desc,
        tabId: f.id,
        type: "feature" as const
      }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: `User is searching for: "${val}" in an agricultural app. Provide 3 relevant search results or information snippets. Each result should have a title, a short description, and suggest which app feature (tabId) is most relevant. Features are: ${features.map(f => f.id).join(", ")}.` }] }],
        config: {
          systemInstruction: "You are a smart search assistant for an agricultural app called AgriDhan. Provide helpful search results in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                tabId: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["info"] }
              },
              required: ["title", "description", "tabId", "type"]
            }
          }
        }
      });

      const aiResults = JSON.parse(response.text || "[]") as SearchResult[];
      setResults([...matchedFeatures, ...aiResults]);
    } catch (error) {
      console.error("Search error:", error);
      setResults(matchedFeatures);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-3 px-4 h-10 w-64 rounded-full bg-gray-100 border border-transparent hover:border-[#5A5A40]/20 transition-all text-gray-400 group"
      >
        <Search className="w-4 h-4 group-hover:text-[#5A5A40]" />
        <span className="text-sm font-medium"><Translate>Search anything...</Translate></span>
        <kbd className="ml-auto text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-400">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                <Search className="w-5 h-5 text-[#5A5A40]" />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search features, crops, weather, or ask AI..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-900 placeholder:text-gray-400"
                />
                {loading ? (
                  <Loader2 className="w-5 h-5 text-[#5A5A40] animate-spin" />
                ) : (
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(res.tabId);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-4 rounded-2xl hover:bg-[#5A5A40]/5 transition-all group flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{res.title}</span>
                            {res.type === "info" && (
                              <Badge className="bg-blue-100 text-blue-600 border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                                AI Insight
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{res.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#5A5A40] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : query.length > 1 ? (
                  <div className="py-12 text-center text-gray-400">
                    <p><Translate>No results found for</Translate> "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2"><Translate>Quick Actions</Translate></h4>
                      <div className="grid grid-cols-2 gap-2">
                        {features.slice(0, 4).map(f => (
                          <button 
                            key={f.id}
                            onClick={() => {
                              setActiveTab(f.id);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex gap-4">
                  <span><span className="bg-white px-1 rounded border border-gray-200">↵</span> Select</span>
                  <span><span className="bg-white px-1 rounded border border-gray-200">↑↓</span> Navigate</span>
                </div>
                <div>Powered by AgriDhan AI</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}
