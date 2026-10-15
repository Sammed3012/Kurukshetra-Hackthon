import React from "react";
import { Sprout } from "lucide-react";

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AppLogo({ className = "", iconClassName = "", size = "md" }: AppLogoProps) {
  const [imgError, setImgError] = React.useState(false);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={`bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[#5A5A40]/10 overflow-hidden ${sizeClasses[size]} ${className}`}>
      {!imgError ? (
        <img 
          src="/logo.png" 
          alt="AgroDhan Logo" 
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <Sprout className={`text-[#5A5A40] ${iconClassName || (size === "xl" ? "w-14 h-14" : "w-2/3 h-2/3")}`} />
      )}
    </div>
  );
}
