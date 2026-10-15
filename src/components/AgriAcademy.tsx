import { GraduationCap, Play, BookOpen, Recycle, Sprout, TrendingUp, FlaskConical, Loader2, Sparkles, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Translate } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface CourseModule {
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: string;
  category: string;
}

export default function AgriAcademy() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseModule[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const defaultModules = [
    {
      title: "Organic Farming Mastery",
      description: "Learn sustainable and chemical-free farming techniques for premium crop value.",
      duration: "4 Weeks",
      lessons: 12,
      level: "Beginner",
      category: "Organic"
    },
    {
      title: "Farm Income Booster",
      description: "Strategies to maximize revenue through crop diversification and direct marketing.",
      duration: "6 Weeks",
      lessons: 18,
      level: "Intermediate",
      category: "Finance"
    }
  ];

  const generatePersonalizedCourse = async (profile: any) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Based on this farmer's profile: Crop: ${profile.primaryCrop || "Wheat"}, Location: ${profile.location || "Pune"}, Farm Size: ${profile.farmSize || "5 acres"}. Generate 2 highly relevant agricultural course modules. Include title, description, duration, lessons count, level, and category.` }] }
        ],
        config: {
          systemInstruction: "You are an AI agricultural educator. Provide structured course modules in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                lessons: { type: Type.NUMBER },
                level: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["title", "description", "duration", "lessons", "level", "category"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]") as CourseModule[];
      setCourses(prev => [...data, ...prev].slice(0, 6));
      toast.success("Personalized courses generated!");
    } catch (error) {
      console.error("Course generation error:", error);
      toast.error("Failed to generate courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      }
      setCourses(defaultModules);
    };
    fetchUserData();
  }, []);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "organic": return Sprout;
      case "finance": return TrendingUp;
      case "waste": return Recycle;
      case "tech": return FlaskConical;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>AgriProfit Academy</Translate></h2>
          <p className="text-gray-500"><Translate>Master modern farming and boost your farm's profitability.</Translate></p>
        </div>
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => userProfile && generatePersonalizedCourse(userProfile)}
            disabled={loading}
            className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-6 h-12 font-bold gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <Translate>Personalize My Learning</Translate>
          </Button>
          <div className="hidden sm:flex gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your Progress</p>
              <p className="text-xl font-black text-[#5A5A40]">65%</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#5A5A40] border-t-transparent animate-spin-slow"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((module, idx) => {
          const Icon = getIcon(module.category);
          return (
            <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-[#5A5A40]/10 p-4 rounded-2xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-none px-3 py-1">{module.level}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{module.description}</p>
                <div className="flex items-center gap-6 mb-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{module.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{module.duration}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl py-6 h-auto font-bold flex items-center justify-center gap-3">
                  <Play className="w-5 h-5 fill-current" />
                  <Translate>Start Learning</Translate>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
