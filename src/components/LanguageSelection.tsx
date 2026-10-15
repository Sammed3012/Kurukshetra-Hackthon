import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppLogo from "./AppLogo";
import { Translate } from "../contexts/LanguageContext";

interface LanguageSelectionProps {
  onSelect: (lang: string) => void;
  onBack: () => void;
}

export default function LanguageSelection({ onSelect, onBack }: LanguageSelectionProps) {
  const languages = [
    { id: "en", name: "English", native: "English" },
    { id: "hi", name: "Hindi", native: "हिन्दी" },
    { id: "mr", name: "Marathi", native: "मराठी" },
    { id: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { id: "ta", name: "Tamil", native: "தமிழ்" },
    { id: "te", name: "Telugu", native: "తెలుగు" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden z-10">
      {/* Left Side - Branding (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-[#5A5A40] p-12 flex-col justify-between text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size="md" />
            <h2 className="text-2xl font-bold tracking-tight">AgroDhan</h2>
          </div>
          
          <div className="space-y-8 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              <Translate>Welcome to</Translate> <br/>
              <span className="text-[#00FF88]">AgroDhan</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              <Translate>Smart agriculture intelligence tailored for your region. Select your preferred language to continue.</Translate>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-white/60 text-sm font-medium tracking-widest uppercase">
              <Globe2 className="w-5 h-5" />
              <span><Translate>Supporting 6+ Languages</Translate></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Selection Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl space-y-8 glass-card p-8 rounded-3xl border-white/20"
        >
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-[#5A5A40] -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> <Translate>Back</Translate>
            </Button>
            <div className="md:hidden flex items-center gap-2">
              <AppLogo size="sm" />
              <span className="font-bold text-[#5A5A40]">AgroDhan</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900"><Translate>Choose Language</Translate></h2>
            <p className="text-gray-500">अपनी भाषा चुनें | आपली भाषा निवडा</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((lang, idx) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-white hover:border-[#00FF88] bg-white/50 hover:bg-white overflow-hidden h-full"
                  onClick={() => onSelect(lang.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center space-y-2 h-full">
                    <span className="text-xl md:text-2xl font-bold text-[#5A5A40] group-hover:scale-110 transition-transform duration-300">
                      {lang.native}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold group-hover:text-[#00FF88] transition-colors">
                      {lang.name}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
