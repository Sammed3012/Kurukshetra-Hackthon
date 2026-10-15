import { ReactNode, useState, useEffect } from "react";
import { Home, Sprout, Stethoscope, TrendingUp, Users, Settings, Bell, Mic, Map as MapIcon, LogOut, ArrowLeft, Wallet, GraduationCap, MapPin, CloudSun, ShoppingBag, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import VoiceAssistant from "./VoiceAssistant";
import AppLogo from "./AppLogo";
import { toast } from "sonner";
import { Translate } from "../contexts/LanguageContext";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import GlobalSearch from "./GlobalSearch";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack?: () => void;
  onLogout: () => void;
}

export default function Layout({ children, activeTab, setActiveTab, onBack, onLogout }: LayoutProps) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ displayName: string; role: string; photoURL: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            displayName: data.displayName || auth.currentUser.displayName || "Farmer",
            role: data.role || "User",
            photoURL: data.photoURL || auth.currentUser.photoURL || ""
          });
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    onLogout();
    toast.info("Logged out successfully!");
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "voice", label: "AgriVoice Connect", icon: Mic },
    { id: "finance", label: "AgriFinance Advisor", icon: Wallet },
    { id: "doctor", label: "AgriDoctor Pro", icon: Stethoscope },
    { id: "academy", label: "AgriProfit Academy", icon: GraduationCap },
    { id: "community", label: "AgriCommunity Network", icon: Users },
    { id: "map", label: "FarmVision 3D", icon: MapIcon },
    { id: "locator", label: "AgriMatch Locator", icon: MapPin },
    { id: "weather", label: "AgriWeather Insights", icon: CloudSun },
    { id: "market", label: "AgriMarket Intelligence", icon: TrendingUp },
    { id: "mart", label: "AgroMart Exchange", icon: ShoppingBag },
    { id: "profile", label: "User Dashboard", icon: User },
  ];

  const mobileNavItems = navItems.filter(item => ["home", "doctor", "market", "community", "map"].includes(item.id));

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo size="sm" />
          <h1 className="text-xl font-bold tracking-tight text-[#5A5A40]">AgroDhan</h1>
        </div>
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" 
                  : "text-gray-500 hover:bg-[#5A5A40]/5 hover:text-[#5A5A40]"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 shrink-0", isActive && "scale-110")} />
              <span className="font-semibold text-sm text-left flex-1"><Translate>{item.label}</Translate></span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <Translate>Logout</Translate>
        </button>
        <button 
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex items-center gap-3 p-3 rounded-2xl transition-all w-full text-left",
            activeTab === "profile" ? "bg-[#5A5A40]/10 ring-1 ring-[#5A5A40]/20" : "bg-gray-50 hover:bg-gray-100"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] border-2 border-white shadow-sm shrink-0 overflow-hidden">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {userData?.displayName?.charAt(0) || "F"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{userData?.displayName || "Farmer"}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider capitalize">{userData?.role || "User"}</p>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1a1a1a] font-sans flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white z-[101] transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 text-gray-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          {onBack && activeTab !== "home" && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-[#5A5A40] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <AppLogo size="sm" />
          <h1 className="text-xl font-semibold tracking-tight text-[#5A5A40]">AgroDhan</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] border-2 border-white shadow-sm overflow-hidden"
          >
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                {userData?.displayName?.charAt(0) || "F"}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#5A5A40]">
              <Translate>{navItems.find(i => i.id === activeTab)?.label || "Dashboard"}</Translate>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <GlobalSearch setActiveTab={setActiveTab} />
            <button className="p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-[#5A5A40] transition-all relative shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

