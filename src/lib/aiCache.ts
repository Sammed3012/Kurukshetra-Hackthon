
const CACHE_PREFIX = 'agridhan_ai_cache_';
const DEFAULT_EXPIRY = 1000 * 60 * 60; // 1 hour

export const getCachedAIResponse = (key: string): string | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const { value, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return value;
  } catch (e) {
    return null;
  }
};

export const setCachedAIResponse = (key: string, value: string, expiryMs: number = DEFAULT_EXPIRY) => {
  try {
    const data = {
      value,
      expiry: Date.now() + expiryMs
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to cache AI response', e);
  }
};

export const clearAICache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};
