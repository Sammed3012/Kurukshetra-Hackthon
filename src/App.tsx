/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CropAdvisor from "./components/CropAdvisor";
import AgriDoctor from "./components/AgriDoctor";
import MarketWidget from "./components/MarketWidget";
import Community from "./components/Community";
import FarmMap from "./components/FarmMap";
import AgriVoice from "./components/AgriVoice";
import AgriFinance from "./components/AgriFinance";
import AgriAcademy from "./components/AgriAcademy";
import AgriLocator from "./components/AgriLocator";
import AgriWeather from "./components/AgriWeather";
import AgroMart from "./components/AgriMart";
import UserProfile from "./components/UserProfile";
import SplashScreen from "./components/SplashScreen";
import LanguageSelection from "./components/LanguageSelection";
import RoleSelection from "./components/RoleSelection";
import AuthScreen from "./components/AuthScreen";
import VoiceAssistant from "./components/VoiceAssistant";
import Background from "./components/Background";
import { Toaster } from "@/components/ui/sonner";
import { Mic } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function App() {
  const DEFAULT_USER = {
    uid: "demo-farmer",
    displayName: "Kisan Ramesh",
    email: "ramesh@agrodhan.com",
    photoURL: ""
  } as User;

  const [activeTab, setActiveTab] = useState("home");
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>("Farmer");
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isAuthReady, setIsAuthReady] = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // 1. Handle Splash Screen Duration
    const splashTimer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);

    // 2. Listen for Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore if needed
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setSelectedRole(userDoc.data().role || "Farmer");
          }
        } catch (e) {
          console.error("Firestore fetch error", e);
        }
        setUser(firebaseUser);
      } else {
        setUser(DEFAULT_USER);
      }
      setIsAuthReady(true);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, []);

  if (isAppLoading || !isAuthReady) {
    return <SplashScreen />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
    setUser(DEFAULT_USER);
    setActiveTab("home");
  };

  const handleAppBack = () => {
    if (activeTab !== "home") {
      setActiveTab("home");
    }
  };

  return (
    <>
      <Background />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onBack={handleAppBack} onLogout={handleLogout}>
        {(() => {
          switch (activeTab) {
            case "home": return <Dashboard setActiveTab={setActiveTab} />;
            case "voice": return <AgriVoice />;
            case "finance": return <AgriFinance />;
            case "doctor": return <AgriDoctor />;
            case "academy": return <AgriAcademy />;
            case "community": return <Community />;
            case "map": return <FarmMap />;
            case "locator": return <AgriLocator />;
            case "weather": return <AgriWeather />;
            case "market": return <MarketWidget />;
            case "mart": return <AgroMart />;
            case "profile": return <UserProfile />;
            default: return <Dashboard setActiveTab={setActiveTab} />;
          }
        })()}
      </Layout>

      {/* Global Voice Assistant Trigger - Available after Splash */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#5A5A40] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[60]"
      >
        <Mic className="w-6 h-6" />
      </button>

      <VoiceAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
        language={language}
      />
      
      <Toaster position="top-center" />
    </>
  );
}

