import { MapPin, Search, Navigation, Phone, Star, Filter, Loader2, LocateFixed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Translate } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleGenAI, Type } from "@google/genai";
import { getCachedAIResponse, setCachedAIResponse } from "../lib/aiCache";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface AgriLocation {
  name: string;
  type: string;
  distance: string;
  rating: number;
  status: string;
  address: string;
  phone?: string;
}

export default function AgriLocator() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<AgriLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<AgriLocation | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchLocations = async (query: string = "", profile: any = null) => {
    const cacheKey = `locator_${profile?.location || "default"}_${query}`;
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      setLocations(data);
      if (data.length > 0) setSelectedLocation(data[0]);
      return;
    }

    setLoading(true);
    try {
      const locationContext = profile?.location || "Pune, Maharashtra";
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Find agricultural locations near ${locationContext}. Search query: "${query}". Provide 4 locations (Markets, Stores, Govt Centers). Include name, type, distance, rating, status (Open/Closed), address, and a mock phone number.` }] }
        ],
        config: {
          systemInstruction: "You are an AI agricultural location finder. Provide structured location data in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                distance: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                status: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING }
              },
              required: ["name", "type", "distance", "rating", "status", "address"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const data = JSON.parse(text) as AgriLocation[];
      setLocations(data);
      if (data.length > 0) setSelectedLocation(data[0]);
      setCachedAIResponse(cacheKey, text, 1000 * 60 * 60 * 24); // 24 hour cache
    } catch (error: any) {
      console.error("Locator error:", error);
      const isRateLimited = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimited) {
        toast.error("AI service is busy. Please try searching again in a moment.");
      } else {
        toast.error("Failed to find locations");
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
          fetchLocations("", data);
        } else {
          fetchLocations("");
        }
      } else {
        fetchLocations("");
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations(searchQuery, userProfile);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>AgriMatch Locator</Translate></h2>
          <p className="text-gray-500"><Translate>Find markets, stores, and government centers near your location.</Translate></p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 rounded-xl border-gray-200" 
              placeholder="Search locations..." 
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-6 font-bold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Translate>Search</Translate>}
          </Button>
          <Button variant="outline" className="rounded-xl border-gray-200">
            <LocateFixed className="w-4 h-4" />
          </Button>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-250px)]">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : locations.map((loc, idx) => (
            <Card 
              key={idx} 
              onClick={() => setSelectedLocation(loc)}
              className={`bg-white border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl group ${selectedLocation?.name === loc.name ? 'ring-2 ring-[#5A5A40]' : ''}`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <Badge className="bg-[#5A5A40]/10 text-[#5A5A40] border-none">{loc.type}</Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{loc.rating}</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-[#5A5A40] transition-colors">{loc.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{loc.address}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold">{loc.distance}</span>
                  </div>
                  <span className={loc.status.toLowerCase().includes("open") ? "text-xs font-bold text-green-600" : "text-xs font-bold text-orange-600"}>
                    {loc.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2 bg-gray-100 rounded-3xl relative overflow-hidden shadow-inner min-h-[400px]">
          {/* Mock Map View */}
          <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
            <div className="relative w-full h-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
              {/* Mock Map Markers */}
              {locations.map((loc, i) => (
                <div 
                  key={i}
                  className="absolute animate-bounce"
                  style={{ 
                    top: `${20 + (i * 15)}%`, 
                    left: `${20 + (i * 20)}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  <div className={`p-2 rounded-full shadow-lg ${selectedLocation?.name === loc.name ? 'bg-[#5A5A40] scale-125' : 'bg-gray-400'} transition-all`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
              <div className="absolute top-1/2 left-1/2">
                <div className="bg-blue-500 p-2 rounded-full shadow-lg animate-pulse">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{selectedLocation.name}</h4>
                  <p className="text-sm text-gray-500">{selectedLocation.address}</p>
                </div>
                <div className="flex gap-3">
                  {selectedLocation.phone && (
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <Phone className="w-5 h-5" />
                    </Button>
                  )}
                  <Button className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-6 font-bold">
                    <Navigation className="w-4 h-4 mr-2" /> <Translate>Directions</Translate>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
