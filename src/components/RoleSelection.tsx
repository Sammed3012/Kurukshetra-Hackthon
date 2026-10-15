import React from "react";
import { motion } from "motion/react";
import { Sprout, User, Store, ArrowRight, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppLogo from "./AppLogo";
import { Translate } from "../contexts/LanguageContext";

interface RoleSelectionProps {
  onSelect: (role: string) => void;
  language: string;
  onBack: () => void;
}

export default function RoleSelection({ onSelect, onBack }: RoleSelectionProps) {
  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      description: "Get AI advice, market prices, and disease diagnosis.",
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      color: "bg-green-50",
      hoverColor: "group-hover:bg-green-100",
      borderColor: "hover:border-green-400",
    },
    {
      id: "customer",
      title: "Customer",
      description: "Buy fresh produce directly from local farms.",
      icon: <User className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50",
      hoverColor: "group-hover:bg-blue-100",
      borderColor: "hover:border-blue-400",
    },
    {
      id: "vendor",
      title: "Vendor",
      description: "Supply seeds, fertilizers, and machinery.",
      icon: <Store className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50",
      hoverColor: "group-hover:bg-orange-100",
      borderColor: "hover:border-orange-400",
    },
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
              <Translate>Choose Your Role</Translate>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              <Translate>Select how you want to use the AgroDhan platform.</Translate>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-white/60 text-sm font-medium tracking-widest uppercase">
              <Users className="w-5 h-5" />
              <span><Translate>Connecting the Ecosystem</Translate></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Selection Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-3xl space-y-8 glass-card p-8 rounded-3xl border-white/20"
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
            <h2 className="text-3xl font-bold text-gray-900"><Translate>Choose Your Role</Translate></h2>
            <p className="text-gray-500"><Translate>Select how you want to use the AgroDhan platform.</Translate></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-white ${role.borderColor} bg-white/50 hover:bg-white overflow-hidden h-full flex flex-col`}
                  onClick={() => onSelect(role.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
                    <div className={`w-16 h-16 ${role.color} ${role.hoverColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      {role.icon}
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-800"><Translate>{role.title}</Translate></h3>
                      <p className="text-sm text-gray-500 leading-relaxed"><Translate>{role.description}</Translate></p>
                    </div>
                    <div className="pt-4 mt-auto w-full">
                      <Button variant="ghost" className="w-full text-[#5A5A40] group-hover:bg-gray-50 transition-colors">
                        <Translate>Select</Translate> <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
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
