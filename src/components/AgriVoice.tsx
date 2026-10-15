import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Globe, MessageSquare, Send, Loader2, Bot, User, MicOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { GoogleGenAI } from "@google/genai";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function AgriVoice() {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Namaste! I am your AgriVoice assistant. How can I help you with your farm today?" }
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
          { role: "user", parts: [{ text: `You are AgriVoice, an AI agriculture assistant. Help the farmer with their query in ${language} language. Query: ${text}` }] }
        ],
        config: {
          systemInstruction: "You are a helpful and knowledgeable agriculture assistant named AgriVoice. Provide practical advice on crops, pests, weather, and market prices. Keep responses concise and helpful for farmers."
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
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-12rem)] flex flex-col">
      <section className="shrink-0">
        <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>AgriVoice Connect</Translate></h2>
        <p className="text-gray-500"><Translate>Multi-language voice assistance for effortless farm management.</Translate></p>
      </section>

      <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
        <Card className="flex-1 bg-white border-none shadow-xl rounded-3xl flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-[#5A5A40]/10 text-[#5A5A40]"
                  )}>
                    {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed shadow-sm",
                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
                  )}>
                    <Translate>{msg.content}</Translate>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center shadow-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-[#5A5A40]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <div className="max-w-2xl mx-auto flex gap-3 items-center">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={cn("rounded-full w-14 h-14 shrink-0 shadow-lg transition-all", isListening && "animate-pulse scale-110")}
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
                  placeholder={isListening ? "Listening..." : "Ask AgriVoice anything..."}
                  className="w-full h-14 px-6 rounded-full border-gray-200 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#5A5A40] pr-14 text-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 w-10 h-10 text-[#5A5A40] hover:bg-[#5A5A40]/5 rounded-full"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || loading}
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="hidden md:flex w-80 flex-col gap-6">
          <Card className="bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] text-white border-none shadow-xl rounded-3xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold"><Translate>Voice Commands</Translate></h3>
              <p className="text-white/70 text-sm"><Translate>Try saying "What is the price of wheat?" or "How is the weather today?"</Translate></p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-3xl flex-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#5A5A40]" />
                <Translate>Language Support</Translate>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {["Hindi", "Marathi", "Punjabi", "Telugu", "Tamil", "Kannada"].map((lang) => (
                <div key={lang} className="p-2.5 bg-gray-50 rounded-xl text-center text-xs font-bold text-gray-500 hover:bg-[#5A5A40]/5 hover:text-[#5A5A40] transition-colors cursor-default">
                  {lang}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
