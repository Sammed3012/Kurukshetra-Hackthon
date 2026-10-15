import { Wallet, Landmark, ShieldCheck, FileText, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Translate } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleGenAI, Type } from "@google/genai";
import { getCachedAIResponse, setCachedAIResponse } from "../lib/aiCache";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface FinanceRecommendation {
  title: string;
  provider: string;
  type: "Loan" | "Insurance";
  rate: string;
  limit: string;
  status: string;
  description: string;
}

export default function AgriFinance() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<FinanceRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchRecommendations = async (profile: any) => {
    const cacheKey = `finance_recs_${profile.primaryCrop}_${profile.location}`;
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      setRecommendations(JSON.parse(cached));
      return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Based on this farmer's profile: Crop: ${profile.primaryCrop || "Wheat"}, Location: ${profile.location || "Pune"}, Farm Size: ${profile.farmSize || "5 acres"}. Provide 2 personalized financial recommendations (one loan, one insurance) in India. Include title, provider, type, rate, limit/coverage, status, and a brief description.` }] }
        ],
        config: {
          systemInstruction: "You are an expert agricultural financial advisor in India. Provide structured financial recommendations in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                provider: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Loan", "Insurance"] },
                rate: { type: Type.STRING },
                limit: { type: Type.STRING },
                status: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "provider", "type", "rate", "limit", "status", "description"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const data = JSON.parse(text) as FinanceRecommendation[];
      setRecommendations(data);
      setCachedAIResponse(cacheKey, text, 1000 * 60 * 60 * 2); // 2 hour cache
    } catch (error: any) {
      console.error("Finance recommendations error:", error);
      const isRateLimited = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimited) {
        toast.error("AI service is busy. Showing general financial tips.");
      } else {
        toast.error("Failed to fetch financial advice");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile(data);
          fetchRecommendations(data);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>AgriFinance Advisor</Translate></h2>
          <p className="text-gray-500"><Translate>Smart insurance and loan recommendations tailored for your farm.</Translate></p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => userProfile && fetchRecommendations(userProfile)} 
          disabled={loading}
          className="rounded-xl border-gray-200 font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          <Translate>Update Advice</Translate>
        </Button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-xl text-[#5A5A40]"><Translate>Personalized Recommendations</Translate></h3>
          
          {loading ? (
            <div className="space-y-6 animate-pulse">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded-3xl" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((item, idx) => (
              <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-[#5A5A40]/10 p-4 rounded-2xl">
                        {item.type === "Loan" ? <Landmark className="w-6 h-6 text-[#5A5A40]" /> : <ShieldCheck className="w-6 h-6 text-[#5A5A40]" />}
                      </div>
                      <div>
                        <Badge className="bg-[#5A5A40]/10 text-[#5A5A40] border-none mb-2">{item.status}</Badge>
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.provider}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.type === "Loan" ? "Interest Rate" : "Premium Rate"}</p>
                      <p className="text-lg font-bold text-green-600">{item.rate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.type === "Loan" ? "Credit Limit" : "Coverage"}</p>
                      <p className="text-lg font-bold text-gray-900">{item.limit}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl py-6 h-auto font-bold">
                    <Translate>Apply Now</Translate>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-medium"><Translate>No recommendations available yet. Complete your profile to get started.</Translate></p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] text-white border-none shadow-xl rounded-3xl">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4"><Translate>Credit Score</Translate></h3>
              <div className="flex items-center justify-center py-6">
                <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-8 border-white rounded-full border-t-transparent rotate-[45deg]"></div>
                  <span className="text-4xl font-black">742</span>
                </div>
              </div>
              <p className="text-center text-white/70 text-sm"><Translate>Your credit score is excellent! You qualify for lower interest rates.</Translate></p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5A5A40]" />
                <Translate>Required Documents</Translate>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Aadhaar Card", "Land Records (7/12)", "Bank Statement", "Crop Sowing Certificate"].map((doc) => (
                <div key={doc} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-[#5A5A40] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{doc}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
