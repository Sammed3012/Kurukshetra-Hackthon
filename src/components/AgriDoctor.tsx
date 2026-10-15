import React, { useState, useEffect } from "react";
import { Camera, Loader2, CheckCircle2, Stethoscope, History, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

// Interface for diagnosis
interface DiseaseDiagnosis {
  id?: string;
  disease: string;
  severity: string;
  confidence: string;
  treatment: { organic: string; chemical: string };
  prevention: string;
  imageUrl?: string;
  createdAt?: any;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function AgriDoctor() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDiagnosis | null>(null);
  const [history, setHistory] = useState<DiseaseDiagnosis[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "diagnoses"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiseaseDiagnosis[];
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image || !auth.currentUser) return;
    setLoading(true);
    
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              { text: "Analyze this crop image and identify any diseases. Provide the diagnosis in JSON format." }
            ]
          }
        ],
        config: {
          systemInstruction: "You are an expert plant pathologist. Analyze the provided image of a crop and identify any diseases, pests, or nutrient deficiencies. Provide a structured diagnosis including disease name, severity (Low, Medium, High), confidence percentage, treatment (organic and chemical), and prevention tips.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              disease: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              confidence: { type: Type.STRING },
              treatment: {
                type: Type.OBJECT,
                properties: {
                  organic: { type: Type.STRING },
                  chemical: { type: Type.STRING }
                },
                required: ["organic", "chemical"]
              },
              prevention: { type: Type.STRING }
            },
            required: ["disease", "severity", "confidence", "treatment", "prevention"]
          }
        }
      });

      const diagnosis = JSON.parse(response.text || "{}") as DiseaseDiagnosis;
      
      // Save to Firestore
      await addDoc(collection(db, "diagnoses"), {
        uid: auth.currentUser.uid,
        ...diagnosis,
        imageUrl: image, // In a real app, we'd upload to Storage first
        createdAt: serverTimestamp()
      });

      setResult(diagnosis);
      toast.success("Diagnosis complete and saved to history!");
    } catch (error) {
      console.error("Diagnosis error:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    try {
      await deleteDoc(doc(db, "diagnoses", id));
      toast.success("Diagnosis removed from history");
    } catch (error) {
      toast.error("Failed to delete diagnosis");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]"><Translate>Agri Doctor</Translate></h2>
          <p className="text-gray-500 text-sm md:text-base"><Translate>Upload a photo of your crop to detect diseases instantly using AI.</Translate></p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowHistory(!showHistory)}
          className="rounded-xl border-gray-200"
        >
          <History className="w-4 h-4 mr-2" />
          <Translate>{showHistory ? "Back to Scan" : "History"}</Translate>
        </Button>
      </section>

      {showHistory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 font-medium"><Translate>No diagnosis history found.</Translate></p>
            </div>
          ) : (
            history.map((diag) => (
              <Card key={diag.id} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={diag.imageUrl} alt={diag.disease} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => diag.id && deleteDiagnosis(diag.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#5A5A40]">{diag.disease}</h4>
                    <Badge variant={diag.severity === "High" ? "destructive" : "secondary"} className="text-[10px]">
                      {diag.severity}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {diag.createdAt?.toDate().toLocaleDateString()}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-[#5A5A40] font-bold text-xs"
                    onClick={() => {
                      setResult(diag);
                      setShowHistory(false);
                      setImage(diag.imageUrl || null);
                    }}
                  >
                    <Translate>View Details</Translate>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-50 flex items-center justify-center relative group">
                  {image ? (
                    <img src={image} alt="Crop" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-12">
                      <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-10 h-10 text-[#5A5A40]/40" />
                      </div>
                      <p className="text-gray-400 font-medium"><Translate>Drag & drop or click to upload</Translate></p>
                      <p className="text-[10px] text-gray-300 uppercase font-bold mt-2 tracking-widest"><Translate>Supports JPG, PNG</Translate></p>
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {!image && <div className="sr-only"><Translate>Upload Image</Translate></div>}
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-[#5A5A40] hover:bg-[#4A4A30] rounded-2xl h-14 text-lg font-bold shadow-lg shadow-[#5A5A40]/20"
                disabled={!image || loading}
                onClick={handleDiagnose}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <Translate>Analyzing Sample...</Translate>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    <Translate>Diagnose Disease</Translate>
                  </>
                )}
              </Button>
              {image && (
                <Button variant="outline" className="rounded-2xl h-14 px-6 border-gray-200" onClick={() => { setImage(null); setResult(null); }}>
                  <Translate>Reset</Translate>
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {result ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4 bg-[#5A5A40]/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-[#5A5A40] uppercase font-black tracking-[0.2em] mb-1"><Translate>Diagnosis Result</Translate></p>
                        <CardTitle className="text-2xl font-black text-[#5A5A40]"><Translate>{result.disease}</Translate></CardTitle>
                      </div>
                      <Badge variant={result.severity === "High" ? "destructive" : "secondary"} className="rounded-full px-4 py-1">
                        <Translate>{result.severity}</Translate> <Translate>Severity</Translate>
                      </Badge>
                    </div>
                    <p className="text-sm text-green-600 font-bold flex items-center gap-1.5 mt-2">
                      <CheckCircle2 className="w-4 h-4" /> <Translate>{result.confidence}</Translate> <Translate>AI Confidence Score</Translate>
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-black text-xs uppercase tracking-widest text-gray-400"><Translate>Recommended Treatment</Translate></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100/50">
                          <p className="text-[10px] font-black text-green-800 uppercase mb-2 tracking-widest"><Translate>Organic Solution</Translate></p>
                          <p className="text-sm text-green-900 font-medium leading-relaxed"><Translate>{result.treatment.organic}</Translate></p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
                          <p className="text-[10px] font-black text-blue-800 uppercase mb-2 tracking-widest"><Translate>Chemical Solution</Translate></p>
                          <p className="text-sm text-blue-900 font-medium leading-relaxed"><Translate>{result.treatment.chemical}</Translate></p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-black text-xs uppercase tracking-widest text-gray-400"><Translate>Prevention Strategy</Translate></h4>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium"><Translate>{result.prevention}</Translate></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8 opacity-20" />
                </div>
                <h4 className="font-bold text-gray-500"><Translate>No Diagnosis Yet</Translate></h4>
                <p className="text-sm max-w-xs mx-auto mt-2"><Translate>Upload an image and click diagnose to see the AI analysis results here.</Translate></p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
