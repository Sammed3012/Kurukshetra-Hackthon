import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, Info, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { GoogleGenAI, Type } from "@google/genai";
import { getCachedAIResponse, setCachedAIResponse } from "../lib/aiCache";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface MarketInsight {
  currentPrice: string;
  trend: "Rising" | "Falling" | "Stable";
  forecast: { week: string; price: number }[];
  recommendation: string;
  nearbyMandis: { name: string; price: string; trend: string }[];
}

export default function MarketWidget() {
  const [crop, setCrop] = useState("Wheat");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<MarketInsight | null>(null);

  const fetchInsights = async () => {
    if (!crop.trim()) return;
    const cacheKey = `market_insight_${crop}`;
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      setInsight(JSON.parse(cached));
      return;
    }

    setLoading(true);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Provide market intelligence for the crop: ${crop} in India. Include current average price, trend, 4-week price forecast, a recommendation for farmers, and 3 nearby mandi rates.` }] }
        ],
        config: {
          systemInstruction: "You are a market analyst specializing in Indian agriculture. Provide structured market data in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentPrice: { type: Type.STRING },
              trend: { type: Type.STRING, enum: ["Rising", "Falling", "Stable"] },
              forecast: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.STRING },
                    price: { type: Type.NUMBER }
                  },
                  required: ["week", "price"]
                }
              },
              recommendation: { type: Type.STRING },
              nearbyMandis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.STRING },
                    trend: { type: Type.STRING }
                  },
                  required: ["name", "price", "trend"]
                }
              }
            },
            required: ["currentPrice", "trend", "forecast", "recommendation", "nearbyMandis"]
          }
        }
      });

      const text = response.text || "{}";
      const data = JSON.parse(text) as MarketInsight;
      setInsight(data);
      setCachedAIResponse(cacheKey, text, 1000 * 60 * 60 * 4); // 4 hour cache
    } catch (error: any) {
      console.error("Market insight error:", error);
      const isRateLimited = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimited) {
        toast.error("Market analysis is temporarily unavailable due to high demand.");
      } else {
        toast.error("Failed to fetch market insights");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]"><Translate>Market Intelligence</Translate></h2>
          <p className="text-gray-500 text-sm md:text-base"><Translate>Real-time Mandi prices and AI-driven market forecasts.</Translate></p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchInsights()}
              placeholder="Search crop (e.g. Wheat)"
              className="pl-10 rounded-xl border-gray-100 bg-white h-12 focus:ring-[#5A5A40]/20"
            />
          </div>
          <Button onClick={fetchInsights} disabled={loading} className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl h-12 px-6">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Translate>Check Rates</Translate>}
          </Button>
        </div>
      </section>

      {insight ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1"><Translate>Price Analysis</Translate></p>
                  <CardTitle className="text-3xl font-black text-[#5A5A40]"><Translate>{crop}</Translate></CardTitle>
                </div>
                <Badge className={cn(
                  "rounded-full px-4 py-1.5 border-none font-bold",
                  insight.trend === "Rising" ? "bg-green-100 text-green-700" : 
                  insight.trend === "Falling" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                )}>
                  {insight.trend === "Rising" ? <TrendingUp className="w-4 h-4 mr-2" /> : 
                   insight.trend === "Falling" ? <TrendingDown className="w-4 h-4 mr-2" /> : <Info className="w-4 h-4 mr-2" />}
                  <Translate>{insight.trend}</Translate>
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-5xl font-black text-gray-900 tracking-tight">{insight.currentPrice}</p>
                <p className="text-sm text-gray-400 font-medium mt-1"><Translate>Current Average • Pune Mandi, Maharashtra</Translate></p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={insight.forecast}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5A5A40" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999', fontWeight: 'bold' }} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#5A5A40"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black text-[#5A5A40]"><Translate>AI Insights</Translate></CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-[#5A5A40]/5 rounded-3xl border border-[#5A5A40]/10 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-[#5A5A40] rounded-2xl flex items-center justify-center shadow-lg shadow-[#5A5A40]/20">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#5A5A40] uppercase tracking-[0.2em] mb-2"><Translate>Recommendation</Translate></p>
                    <p className="text-gray-700 leading-relaxed font-medium"><Translate>{insight.recommendation}</Translate></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-400"><Translate>Nearby Mandis</Translate></h4>
                  <div className="space-y-3">
                    {insight.nearbyMandis.map((mandi) => (
                      <div key={mandi.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <div>
                          <p className="font-bold text-gray-900">{mandi.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest"><Translate>Mandi</Translate></p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#5A5A40]">{mandi.price}</p>
                          <p className={cn("text-[10px] font-bold", mandi.trend.startsWith('+') ? "text-green-600" : "text-red-600")}>{mandi.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <TrendingUp className="w-12 h-12 text-gray-200" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-400"><Translate>Market Analysis Ready</Translate></h4>
            <p className="text-sm text-gray-300 max-w-xs mx-auto mt-2"><Translate>Search for any crop above to see real-time Mandi rates and AI price predictions.</Translate></p>
          </div>
        </div>
      )}
    </div>
  );
}
