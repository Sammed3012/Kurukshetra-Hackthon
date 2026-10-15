import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, X, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { GoogleGenAI } from "@google/genai";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string | null;
}

const INITIAL_MESSAGES: Record<string, string> = {
  en: "Namaste! I am your AgroDhan assistant. How can I help you today?",
  hi: "नमस्ते! मैं आपका एग्रोधन सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",
  mr: "नमस्ते! मी तुमचा एग्रोधन सहाय्यक आहे. मी तुम्हाला आज कशी मदत करू शकतो?"
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function VoiceAssistant({ isOpen, onClose, language = "en" }: VoiceAssistantProps) {
  const lang = language || "en";
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: INITIAL_MESSAGES[lang] || INITIAL_MESSAGES.en }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `You are AgroDhan, an AI agriculture assistant. Help the farmer with their query in ${lang} language. Query: ${text}` }] }
        ],
        config: {
          systemInstruction: "You are a helpful and knowledgeable agriculture assistant named AgroDhan. Provide practical advice on crops, pests, weather, and market prices. Keep responses concise and helpful for farmers."
        }
      });

      const botMessage = { role: "bot" as const, content: response.text || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    // In a real app, we'd use Web Speech API here.
    // For this demo, we'll simulate listening.
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        // Simulate a voice command
        // handleSend("What is the price of wheat today?");
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <header className="p-4 border-b flex justify-between items-center bg-[#5A5A40] text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h2 className="font-bold"><Translate>AgroDhan Assistant</Translate></h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </header>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4 max-w-md mx-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-[#5A5A40]/10 text-[#5A5A40]"
                  )}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed",
                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <footer className="p-4 border-t bg-gray-50">
            <div className="max-w-md mx-auto flex gap-2 items-center">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={cn("rounded-full w-12 h-12 shrink-0", isListening && "animate-pulse")}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder={isListening ? "Listening..." : "Type your question..."}
                  className="w-full h-12 px-4 rounded-full border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5A5A40] pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 text-[#5A5A40]"
                  onClick={() => handleSend(input)}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
