import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { translateBatch } from '../lib/geminiTranslator';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
  queueForTranslation: (text: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('appTranslations');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationQueue, setTranslationQueue] = useState<Set<string>>(new Set());
  const [isRateLimited, setIsRateLimited] = useState(false);
  const pendingTranslationsRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRateLimited) {
      const timer = setTimeout(() => setIsRateLimited(false), 30000); // 30s cooldown
      return () => clearTimeout(timer);
    }
  }, [isRateLimited]);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('appTranslations', JSON.stringify(translations));
  }, [translations]);

  const t = useCallback((text: string): string => {
    if (language === 'en') return text;
    return translations[language]?.[text] || text;
  }, [language, translations]);

  const queueForTranslation = useCallback((text: string) => {
    if (language === 'en' || !text || translations[language]?.[text] || isRateLimited || pendingTranslationsRef.current.has(text)) return;
    
    setTranslationQueue(prev => {
      if (prev.has(text)) return prev;
      const newQueue = new Set(prev);
      newQueue.add(text);
      return newQueue;
    });
  }, [language, translations, isRateLimited]);

  useEffect(() => {
    if (translationQueue.size === 0 || language === 'en' || isRateLimited) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsTranslating(true);
      const textsToTranslate = Array.from(translationQueue) as string[];
      setTranslationQueue(new Set<string>());
      
      // Mark as pending
      textsToTranslate.forEach(t => pendingTranslationsRef.current.add(t));

      try {
        const chunkSize = 15; // Reduced chunk size
        const results: Record<string, string> = {};

        for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
          const chunk = textsToTranslate.slice(i, i + chunkSize);
          
          // Add a small delay between chunks to avoid hitting rate limits
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

          const translatedChunk = await translateBatch(chunk, language);
          
          chunk.forEach((original, index) => {
            results[original] = translatedChunk[index];
            pendingTranslationsRef.current.delete(original);
          });
        }

        setTranslations(prev => ({
          ...prev,
          [language]: {
            ...(prev[language] || {}),
            ...results
          }
        }));
      } catch (error: any) {
        console.error("Translation processing failed:", error);
        const isRateLimitedError = 
          error?.message?.includes('429') || 
          error?.status === 429 || 
          error?.error?.code === 429 ||
          error?.error?.status === "RESOURCE_EXHAUSTED";

        if (isRateLimitedError) {
          setIsRateLimited(true);
          // Put back in queue and remove from pending
          textsToTranslate.forEach(t => pendingTranslationsRef.current.delete(t));
          setTranslationQueue(prev => new Set([...prev, ...textsToTranslate]));
        }
      } finally {
        setIsTranslating(false);
      }
    }, 1500); // Increased debounce to 1500ms

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [translationQueue, language, isRateLimited]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating, queueForTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function Translate({ children }: { children: string }) {
  const { language, t, queueForTranslation } = useLanguage();
  
  useEffect(() => {
    if (typeof children === 'string') {
      queueForTranslation(children);
    }
  }, [children, queueForTranslation]);

  if (typeof children !== 'string') return <>{children}</>;
  return <>{t(children)}</>;
}
