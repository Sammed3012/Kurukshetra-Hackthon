import { Cloud, Sun, Thermometer, Wind, TrendingUp, AlertTriangle, ArrowRight, Stethoscope, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { getCachedAIResponse, setCachedAIResponse } from "../lib/aiCache";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [healthSummary, setHealthSummary] = useState<string | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.displayName || auth.currentUser.displayName || "Farmer");
          setUserProfile(data);
          generateHealthSummary(data);
        }
      }
    };
    fetchUserData();
  }, []);

  const generateHealthSummary = async (profile: any) => {
    const cacheKey = `health_summary_${auth.currentUser?.uid}_${profile.primaryCrop}_${profile.location}`;
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      setHealthSummary(cached);
      return;
    }

    setLoadingHealth(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Based on this farmer's profile: Crop: ${profile.primaryCrop || "Wheat"}, Location: ${profile.location || "Pune"}, Farm Size: ${profile.farmSize || "5 acres"}. Provide a 2-sentence farm health summary and one urgent action item.` }] }
        ],
        config: {
          systemInstruction: "You are an AI farm advisor. Provide a very brief health summary and one clear action item."
        }
      });
      const text = response.text || "No summary available.";
      setHealthSummary(text);
      setCachedAIResponse(cacheKey, text, 1000 * 60 * 30); // 30 min cache
    } catch (error: any) {
      console.error("Health summary error:", error);
      const isRateLimited = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimited) {
        setHealthSummary("AI service is currently busy due to high demand. Please try again in a few minutes.");
      } else {
        setHealthSummary("Unable to generate summary at this time. Please check your connection.");
      }
    } finally {
      setLoadingHealth(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]">
            <Translate>Namaste</Translate>, {userName}!
          </h2>
          <p className="text-gray-500 text-sm md:text-base"><Translate>Here's what's happening on your farm today.</Translate></p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setActiveTab("profile")}
            variant="outline" 
            className="rounded-xl px-6 border-gray-200"
          >
            <Translate>Edit Profile</Translate>
          </Button>
          <Button className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-6">
            <Translate>Download Report</Translate>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Weather & Alerts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weather Widget */}
          <Card 
            className="bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] text-white border-none shadow-xl overflow-hidden relative min-h-[240px] flex flex-col justify-center cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setActiveTab("weather")}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Cloud className="w-48 h-48" />
            </div>
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2"><Translate>Current Weather</Translate></p>
                  <div className="flex items-center gap-4">
                    <h3 className="text-6xl font-black">32°C</h3>
                    <Sun className="w-12 h-12 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-white/90 font-medium text-lg mt-2"><Translate>{`Partly Cloudy • ${userProfile?.location || "Pune, Maharashtra"}`}</Translate></p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-white/60 text-sm font-bold uppercase tracking-widest"><Translate>Last Updated</Translate></p>
                  <p className="font-medium">10:30 AM</p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center md:items-start">
                  <Thermometer className="w-5 h-5 mb-2 opacity-70" />
                  <p className="text-[10px] md:text-xs uppercase font-bold opacity-70 tracking-wider"><Translate>Humidity</Translate></p>
                  <p className="text-lg font-bold">45%</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <Wind className="w-5 h-5 mb-2 opacity-70" />
                  <p className="text-[10px] md:text-xs uppercase font-bold opacity-70 tracking-wider"><Translate>Wind</Translate></p>
                  <p className="text-lg font-bold">12 km/h</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <Cloud className="w-5 h-5 mb-2 opacity-70" />
                  <p className="text-[10px] md:text-xs uppercase font-bold opacity-70 tracking-wider"><Translate>Rain</Translate></p>
                  <p className="text-lg font-bold">5%</p>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <Sun className="w-5 h-5 mb-2 opacity-70" />
                  <p className="text-[10px] md:text-xs uppercase font-bold opacity-70 tracking-wider"><Translate>UV Index</Translate></p>
                  <p className="text-lg font-bold">High (8)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#5A5A40]" />
              <h4 className="font-bold text-lg text-[#5A5A40]"><Translate>AI Farm Health Summary</Translate></h4>
            </div>
            {loadingHealth ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#5A5A40]" />
                <p className="text-gray-400 text-sm font-medium"><Translate>Generating your personalized summary...</Translate></p>
              </div>
            ) : healthSummary ? (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {healthSummary || "Generating farm summary..."}
              </div>
            ) : (
              <p className="text-gray-400 text-sm"><Translate>Complete your profile to get personalized AI insights.</Translate></p>
            )}
          </motion.div>

          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-100 rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm"
          >
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200 shrink-0">
              <AlertTriangle className="text-white w-6 h-6" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-lg text-orange-900 leading-tight"><Translate>Pest Alert: Fall Armyworm</Translate></h4>
                <Badge className="bg-orange-200 text-orange-800 border-none shrink-0"><Translate>Urgent</Translate></Badge>
              </div>
              <p className="text-sm md:text-base text-orange-800/80 mt-2 leading-relaxed"><Translate>High risk detected in nearby farms. Check your maize crops immediately for signs of infestation.</Translate></p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button 
                  onClick={() => setActiveTab("doctor")}
                  variant="outline" 
                  className="w-full sm:w-auto border-orange-200 text-orange-900 bg-white hover:bg-orange-50 rounded-xl py-5 h-auto"
                >
                  <Translate>Open Agri Doctor</Translate>
                </Button>
                <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5 h-auto">
                  <Translate>Report Sighting</Translate>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Market Trends Summary */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl text-[#5A5A40]"><Translate>Market Trends</Translate></h3>
              <Button 
                onClick={() => setActiveTab("market")}
                variant="ghost" 
                className="text-[#5A5A40] font-bold"
              >
                <Translate>View Full Market</Translate> <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-gray-100">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="text-gray-400 font-medium"><Translate>No market trends available at the moment.</Translate></p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Quick Actions & Stats */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="font-bold text-xl text-[#5A5A40]"><Translate>Quick Actions</Translate></h3>
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => setActiveTab("doctor")}
                variant="outline" 
                className="h-20 flex items-center justify-start gap-4 rounded-2xl border-white bg-white shadow-sm hover:bg-[#5A5A40]/5 px-6 group"
              >
                <div className="bg-[#5A5A40]/10 p-3 rounded-xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900"><Translate>Scan Crop</Translate></p>
                  <p className="text-xs text-gray-400"><Translate>Detect diseases instantly</Translate></p>
                </div>
              </Button>
              <Button 
                onClick={() => setActiveTab("market")}
                variant="outline" 
                className="h-20 flex items-center justify-start gap-4 rounded-2xl border-white bg-white shadow-sm hover:bg-[#5A5A40]/5 px-6 group"
              >
                <div className="bg-[#5A5A40]/10 p-3 rounded-xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900"><Translate>Price Check</Translate></p>
                  <p className="text-xs text-gray-400"><Translate>Check latest Mandi rates</Translate></p>
                </div>
              </Button>
              <Button 
                onClick={() => setActiveTab("weather")}
                variant="outline" 
                className="h-20 flex items-center justify-start gap-4 rounded-2xl border-white bg-white shadow-sm hover:bg-[#5A5A40]/5 px-6 group"
              >
                <div className="bg-[#5A5A40]/10 p-3 rounded-xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                  <Cloud className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900"><Translate>Weather Forecast</Translate></p>
                  <p className="text-xs text-gray-400"><Translate>7-day detailed outlook</Translate></p>
                </div>
              </Button>
            </div>
          </section>

          {/* Farm Stats */}
          <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#5A5A40]"><Translate>Farm Health Score</Translate></CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-100"
                      strokeDasharray="100, 100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-green-500"
                      strokeDasharray="85, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-gray-900">85</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Great</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium"><Translate>Soil Moisture</Translate></span>
                  <span className="text-sm font-bold text-green-600">Optimal</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[70%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium"><Translate>Nutrient Level</Translate></span>
                  <span className="text-sm font-bold text-yellow-600">Moderate</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[45%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
