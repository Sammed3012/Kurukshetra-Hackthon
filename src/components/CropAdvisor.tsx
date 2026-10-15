import { useState } from "react";
import { Sprout, MapPin, Droplets, Calendar, Wallet, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from "sonner";

interface CropRecommendation {
  name: string;
  risk: string;
  profit: string;
  yield: string;
  cost: string;
  reason: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function CropAdvisor() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [formData, setFormData] = useState({
    location: "Pune, Maharashtra",
    soilType: "Black Soil",
    waterAvailability: "Irrigated",
    season: "Kharif",
    budget: "₹50,000",
  });

  const handleGetRecommendations = async () => {
    setLoading(true);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide 3 crop recommendations for a farm in ${formData.location} with ${formData.soilType}, ${formData.waterAvailability} water, during ${formData.season} season, and a budget of ${formData.budget}.`,
        config: {
          systemInstruction: "You are a smart agricultural advisor. Based on the farm profile provided, recommend the best crops to grow. For each crop, provide the name, risk level (Low, Medium, High), estimated profit, expected yield, estimated cost, and a brief reason for the recommendation. Return the result as a JSON array of objects.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                risk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                profit: { type: Type.STRING },
                yield: { type: Type.STRING },
                cost: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "risk", "profit", "yield", "cost", "reason"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]") as CropRecommendation[];
      setRecommendations(data);
    } catch (error) {
      console.error("Recommendation error:", error);
      toast.error("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]"><Translate>Smart Crop Advisor</Translate></h2>
        <p className="text-gray-500 text-sm md:text-base"><Translate>AI-driven crop planning based on your farm profile and local conditions.</Translate></p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Form */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#5A5A40]" /> <Translate>Location</Translate>
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-gray-100 bg-gray-50 h-12 focus:ring-[#5A5A40]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <Sprout className="w-3 h-3 text-[#5A5A40]" /> <Translate>Soil Type</Translate>
                  </label>
                  <Input
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="rounded-xl border-gray-100 bg-gray-50 h-12 focus:ring-[#5A5A40]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-[#5A5A40]" /> <Translate>Water</Translate>
                  </label>
                  <Input
                    value={formData.waterAvailability}
                    onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                    className="rounded-xl border-gray-100 bg-gray-50 h-12 focus:ring-[#5A5A40]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#5A5A40]" /> <Translate>Season</Translate>
                  </label>
                  <Input
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="rounded-xl border-gray-100 bg-gray-50 h-12 focus:ring-[#5A5A40]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <Wallet className="w-3 h-3 text-[#5A5A40]" /> <Translate>Investment Budget</Translate>
                </label>
                <Input
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="rounded-xl border-gray-100 bg-gray-50 h-12 focus:ring-[#5A5A40]/20"
                />
              </div>
            </div>

            <Button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] rounded-2xl h-14 text-lg font-bold shadow-lg shadow-[#5A5A40]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <Translate>Analyzing Data...</Translate>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  <Translate>Get Recommendations</Translate>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {recommendations.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {recommendations.map((crop, idx) => (
                  <Card key={idx} className="border-none shadow-sm bg-white overflow-hidden rounded-3xl group hover:shadow-md transition-all">
                    <CardContent className="p-0">
                      <div className="flex flex-col h-full">
                        <div className="h-2 bg-[#5A5A40] opacity-20 group-hover:opacity-100 transition-opacity" />
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-2xl font-black text-[#5A5A40]"><Translate>{crop.name}</Translate></h4>
                              <Badge variant="outline" className="mt-2 border-[#5A5A40]/20 text-[#5A5A40]/70 rounded-full px-3">
                                <Translate>{crop.risk}</Translate> <Translate>Risk Profile</Translate>
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1"><Translate>Est. Profit</Translate></p>
                              <p className="text-2xl font-black text-green-600">{crop.profit}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1"><Translate>Expected Yield</Translate></p>
                              <p className="text-sm font-bold text-gray-700">{crop.yield}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1"><Translate>Est. Cost</Translate></p>
                              <p className="text-sm font-bold text-gray-700">{crop.cost}</p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-500 leading-relaxed italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                            "<Translate>{crop.reason}</Translate>"
                          </p>

                          <Button variant="ghost" className="w-full justify-between text-[#5A5A40] hover:bg-[#5A5A40]/5 rounded-xl px-4 font-bold">
                            <Translate>View Cultivation Guide</Translate> <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 min-h-[400px]"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 opacity-20" />
                </div>
                <h4 className="text-xl font-bold text-gray-500"><Translate>Ready to Plan Your Season?</Translate></h4>
                <p className="text-sm max-w-sm mx-auto mt-3 leading-relaxed">
                  <Translate>Fill in your farm details on the left and our AI will analyze local market trends and soil conditions to recommend the most profitable crops for you.</Translate>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
