import { CloudSun, CloudRain, Wind, Thermometer, Droplets, Sun, Calendar, ArrowRight, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { getCachedAIResponse, setCachedAIResponse } from "../lib/aiCache";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function AgriWeather() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState({
    temp: "32°C",
    condition: "Sunny",
    humidity: "45%",
    wind: "12 km/h",
    rain: "5%",
    uv: "High (8)"
  });

  const forecast = [
    { day: "Mon", temp: "32°C", icon: Sun, condition: "Sunny" },
    { day: "Tue", temp: "30°C", icon: CloudSun, condition: "Partly Cloudy" },
    { day: "Wed", temp: "28°C", icon: CloudRain, condition: "Light Rain" },
    { day: "Thu", temp: "29°C", icon: CloudSun, condition: "Cloudy" },
    { day: "Fri", temp: "31°C", icon: Sun, condition: "Sunny" },
    { day: "Sat", temp: "33°C", icon: Sun, condition: "Clear Sky" },
    { day: "Sun", temp: "32°C", icon: Sun, condition: "Clear Sky" }
  ];

  const generateImpactAnalysis = async () => {
    const cacheKey = `weather_analysis_${weatherData.temp}_${weatherData.condition}`;
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      setAnalysis(cached);
      return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Based on today's weather: ${weatherData.temp}, ${weatherData.condition}, Humidity: ${weatherData.humidity}. Provide 3 short agricultural impact tips (Irrigation, Sowing, Pest Risk) for a farmer in India.` }] }
        ],
        config: {
          systemInstruction: "You are an expert agricultural meteorologist. Provide concise, practical advice for farmers based on current weather conditions."
        }
      });
      const text = response.text || "No analysis available.";
      setAnalysis(text);
      setCachedAIResponse(cacheKey, text, 1000 * 60 * 60); // 1 hour cache
      toast.success("Weather impact analysis updated!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      const isRateLimited = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimited) {
        setAnalysis("AI service is currently busy. Please follow standard seasonal planting guidelines.");
      } else {
        toast.error("Failed to generate analysis");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateImpactAnalysis();
  }, []);

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>AgriWeather Insights</Translate></h2>
          <p className="text-gray-500"><Translate>Detailed weather predictions and agricultural impact analysis.</Translate></p>
        </div>
        <Button 
          variant="outline" 
          onClick={generateImpactAnalysis} 
          disabled={loading}
          className="rounded-xl border-gray-200 font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          <Translate>Refresh Analysis</Translate>
        </Button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <CloudSun className="w-64 h-64" />
          </div>
          <CardContent className="p-10 relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2"><Translate>Today's Outlook</Translate></p>
                <div className="flex items-center gap-6">
                  <h3 className="text-7xl font-black">{weatherData.temp}</h3>
                  <Sun className="w-16 h-16 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-white/90 font-medium text-xl mt-4"><Translate>{`${weatherData.condition} with light breeze • Pune, Maharashtra`}</Translate></p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest"><Translate>Air Quality</Translate></p>
                <p className="text-2xl font-bold text-green-300">Good (42)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-70">
                  <Droplets className="w-4 h-4" />
                  <p className="text-xs uppercase font-bold tracking-wider"><Translate>Humidity</Translate></p>
                </div>
                <p className="text-2xl font-bold">{weatherData.humidity}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-70">
                  <Wind className="w-4 h-4" />
                  <p className="text-xs uppercase font-bold tracking-wider"><Translate>Wind Speed</Translate></p>
                </div>
                <p className="text-2xl font-bold">{weatherData.wind}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-70">
                  <CloudRain className="w-4 h-4" />
                  <p className="text-xs uppercase font-bold tracking-wider"><Translate>Precipitation</Translate></p>
                </div>
                <p className="text-2xl font-bold">{weatherData.rain}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-70">
                  <Sun className="w-4 h-4" />
                  <p className="text-xs uppercase font-bold tracking-wider"><Translate>UV Index</Translate></p>
                </div>
                <p className="text-2xl font-bold">{weatherData.uv}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5A5A40]" />
              <Translate>7-Day Forecast</Translate>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {forecast.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="w-12 font-bold text-gray-400">{item.day}</span>
                    <div className="flex items-center gap-3 flex-1 px-4">
                      <Icon className="w-5 h-5 text-[#5A5A40]" />
                      <span className="text-sm font-medium text-gray-600">{item.condition}</span>
                    </div>
                    <span className="font-black text-gray-900">{item.temp}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#5A5A40]" />
          <h3 className="font-bold text-xl text-[#5A5A40]"><Translate>AI Agricultural Impact Analysis</Translate></h3>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : analysis ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              <Translate>{analysis}</Translate>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-none shadow-sm rounded-2xl p-6">
              <h4 className="font-bold text-green-900 mb-2"><Translate>Irrigation Advice</Translate></h4>
              <p className="text-sm text-green-800/70"><Translate>Low evaporation rates today. Reduce irrigation by 20% for maize crops.</Translate></p>
            </Card>
            <Card className="bg-blue-50 border-none shadow-sm rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-2"><Translate>Sowing Window</Translate></h4>
              <p className="text-sm text-blue-800/70"><Translate>Optimal soil temperature and moisture for soybean sowing starting Wednesday.</Translate></p>
            </Card>
            <Card className="bg-orange-50 border-none shadow-sm rounded-2xl p-6">
              <h4 className="font-bold text-orange-900 mb-2"><Translate>Pest Risk</Translate></h4>
              <p className="text-sm text-orange-800/70"><Translate>High humidity may increase fungal growth. Monitor vegetable plots closely.</Translate></p>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
