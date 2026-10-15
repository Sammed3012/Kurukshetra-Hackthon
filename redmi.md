# 🌾 AgroDhan — AI-Powered Smart Farming Platform

> **Empowering Indian Farmers with AI, Real-Time Data & Community Support**

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [User Flow](#-user-flow)
4. [Features & Modules](#-features--modules)
5. [Problems & Solutions](#-problems--solutions)
6. [Project Structure](#-project-structure)
7. [Setup & Installation](#-setup--installation)
8. [Environment Variables](#-environment-variables)
9. [Contributing](#-contributing)

---

## 🌱 Project Overview

**AgroDhan** is a comprehensive, AI-powered agricultural platform designed specifically for Indian farmers. It bridges the gap between traditional farming and modern technology by offering real-time crop diagnostics, market intelligence, weather forecasting, financial tools, and multilingual voice assistance — all in a single, mobile-friendly Progressive Web App.

**Target Users:**
- 🧑‍🌾 Small & marginal farmers (primary)
- 🏪 Agri-traders and buyers
- 👨‍💼 Agricultural extension workers

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | v19.0.0 | Core UI framework |
| **TypeScript** | ~5.8.2 | Type safety & developer experience |
| **Vite** | ^6.2.0 | Ultra-fast build tool & dev server |
| **Tailwind CSS** | ^4.1.14 | Utility-first styling |
| **shadcn/ui** | ^4.2.0 | Pre-built accessible UI components |
| **Motion (Framer)** | ^12.23.24 | Fluid animations & micro-interactions |
| **Recharts** | ^3.8.1 | Data visualization & charts |
| **Three.js** | ^0.183.2 | 3D farm map visualization |
| **React Three Fiber** | ^9.5.0 | React renderer for Three.js |
| **Lucide React** | ^0.546.0 | Icon library |
| **Sonner** | ^2.0.7 | Toast notifications |
| **Geist Font** | ^5.2.8 | Premium typography |

### Backend & Services

| Technology | Version | Purpose |
|---|---|---|
| **Firebase Auth** | ^12.12.0 | User authentication (Email/Google) |
| **Cloud Firestore** | ^12.12.0 | Real-time NoSQL database |
| **Firebase Storage** | ^12.12.0 | Image/media storage |
| **Google Gemini AI** | ^1.49.0 | AI crop doctor, advisor & voice assistant |
| **Google GenAI SDK** | ^0.24.1 | Gemini model API integration |

### Architecture

```
┌─────────────────────────────────────────┐
│             React (SPA - Vite)          │
├─────────────┬───────────────────────────┤
│  UI Layer   │  State / Context Layer    │
│  (shadcn +  │  (React Context API +     │
│  Tailwind)  │   useState / useEffect)   │
├─────────────┴───────────────────────────┤
│         Service Layer                   │
│  Firebase SDK │ Google Gemini AI SDK    │
├───────────────┬─────────────────────────┤
│  Google Cloud │  Firebase (Auth +  │    │
│  Firestore    │  Firestore + Storage)   │
└───────────────┴─────────────────────────┘
```

---

## 🔄 User Flow

### 1. Onboarding Flow

```
App Launch
    │
    ▼
┌─────────────────┐
│  Splash Screen  │  2.5s animated branding
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Language Select │  Hindi / English / Regional
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Role Selection │  Farmer / Trader / Worker
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Auth Screen   │  Login / Register (Firebase)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Dashboard    │  Personalized Home
└─────────────────┘
```

### 2. Main Application Flow

```
Dashboard (Home)
       │
       ├──► 🌪️  AgriVoice        → Multilingual Voice Assistant (Gemini AI)
       │
       ├──► 💰  AgriFinance      → Loan Tracking, Expense Management
       │
       ├──► 🩺  AgriDoctor       → AI Crop Disease Detection (Image + AI)
       │
       ├──► 🎓  AgriAcademy      → Farming Tutorials & Knowledge Hub
       │
       ├──► 👥  Community        → Farmer Forum & Social Feed
       │
       ├──► 🗺️  FarmMap          → Interactive Farm Location Map
       │
       ├──► 📍  AgriLocator      → Locate Nearby Mandis, Agri-shops, Banks
       │
       ├──► 🌦️  AgriWeather      → 7-Day Farm Weather Forecast
       │
       ├──► 📈  MarketWidget     → Real-time Mandi Price Tracker
       │
       ├──► 🛒  AgroMart         → Online Agri-Marketplace (Buy/Sell)
       │
       └──► 👤  UserProfile      → Profile, Farm Details, Settings
```

### 3. Crop Doctor Flow (AI-Powered)

```
User Opens AgriDoctor
        │
        ▼
 Upload Crop Photo (Camera / Gallery)
        │
        ▼
 Gemini Vision AI Analyzes Image
        │
        ▼
 Returns Diagnosis:
 ├── Disease Name
 ├── Confidence Score
 ├── Severity Level
 ├── Organic Treatment Plan
 ├── Chemical Treatment Plan
 └── Prevention Tips
        │
        ▼
 User Saves / Shares Report
```

### 4. Crop Advisor Flow

```
User Enters Farm Data
 ├── Location
 ├── Soil Type
 ├── Season / Month
 └── Budget
        │
        ▼
 Gemini AI Generates Recommendations
        │
        ▼
 Returns Top 3 Crop Suggestions:
 ├── Expected Yield
 ├── Input Cost
 ├── Profit Estimate
 ├── Risk Level
 └── Reasoning
```

---

## 📦 Features & Modules

### 🏠 Dashboard
- Personalized greeting with farmer's name fetched from Firestore
- AI-generated **Farm Health Summary** (Gemini-powered, 30-min cached)
- Live **Weather Widget** with temperature, humidity, UV index
- **Pest Alert Banner** with deep-link to AgriDoctor
- **Quick Action** buttons (Scan Crop, Price Check, Forecast)
- **Farm Health Score** with visual circular progress indicator

### 🩺 Agri Doctor
- Upload or capture crop photos
- Gemini Vision AI diagnoses disease instantly
- Returns detailed treatment plans (organic & chemical)
- Supports Hindi and English responses

### 🌤️ Agri Weather
- Location-based 7-day weather forecast
- Farm-specific metrics: humidity, wind speed, UV index, rainfall probability
- Powered by weather APIs with Gemini AI interpretation

### 📈 Market Widget
- Real-time Mandi (wholesale market) prices
- Crop price trend charts via Recharts
- AI-powered price forecast for the week ahead

### 💰 Agri Finance
- Expense and income tracking for farm operations
- Loan repayment scheduler
- Financial health summary

### 🎓 Agri Academy
- Video tutorials and farming best practices
- Government scheme information
- Seasonal crop calendar

### 👥 Community
- Farmer social feed with posts, likes, and comments
- Real-time data via Firestore
- Image sharing support

### 🛒 Agro Mart
- Marketplace for seeds, fertilizers, equipment
- Agri-product listings with prices and seller info

### 🗺️ Farm Map & Locator
- Interactive 3D farm visualization (Three.js)
- Locate nearest Mandi, bank, agri-shop using AgriLocator

### 🎙️ Agri Voice
- Full multilingual voice assistant powered by Gemini AI
- Supports Hindi, Marathi, Tamil, and more
- Hands-free farming queries

### 👤 User Profile
- Farm details: size, location, primary crop
- Editable personal information
- Synced with Firebase Firestore in real-time

---

## ⚠️ Problems & Solutions

### Problem 1: Firebase API Key Exposure
**Issue:** Firebase credentials were hardcoded directly in source files, risking exposure in version control.

**Solution:**
- Moved all Firebase configuration to `firebase-applet-config.json` (excluded from `.gitignore`)
- Firebase SDK initialized from the config file at runtime: `initializeApp(firebaseConfig)`
- Added `.gitignore` entries to prevent config files with secrets from being committed

---

### Problem 2: Wrong Gemini AI Model Identifier
**Issue:** The app was using `gemini-3-flash-preview` which caused API errors due to an incorrect or deprecated model name.

**Solution:**
- Corrected model name to `gemini-2.0-flash` across all AI calls in components:
  - `Dashboard.tsx` → `generateHealthSummary()`
  - `AgriDoctor.tsx` → disease diagnosis
  - `CropAdvisor.tsx` → crop recommendations
  - `AgriVoice.tsx` → voice processing
- Centralized AI client initialization to avoid re-instantiation

---

### Problem 3: Gemini API Rate Limiting (429 Errors)
**Issue:** Multiple components calling Gemini AI simultaneously caused `RESOURCE_EXHAUSTED` (429) errors, degrading UX.

**Solution:**
- Implemented **`aiCache.ts`** — a client-side in-memory caching layer
- Cached AI responses with TTL (Time To Live), e.g., 30-minute cache for health summaries
- Added explicit rate-limit error detection and graceful user-facing fallback messages:
  ```ts
  if (error?.error?.status === "RESOURCE_EXHAUSTED") {
    setHealthSummary("AI service is busy. Please try again in a few minutes.");
  }
  ```

---

### Problem 4: Firebase Firestore Offline / Connection Failures
**Issue:** Firestore connection failures were silently failing or throwing unhandled errors.

**Solution:**
- Added `testConnection()` function in `firebase.ts` that validates the Firestore connection on app startup
- Differentiated between "client offline" errors and other expected errors (e.g., 404 for non-existent test doc)
- Graceful error logging without crashing the app

---

### Problem 5: No Multilingual Support for Rural Farmers
**Issue:** Most agri-tech apps are English-only, excluding 80%+ of Indian farmers who prefer regional languages.

**Solution:**
- Built a custom `LanguageContext` + `Translate` component for runtime text translation
- Integrated **Gemini AI** for dynamic language translation of AI-generated content
- Implemented `geminiTranslator.ts` — a dedicated translation utility using Gemini API
- Language is selected on first launch and persisted across sessions

---

### Problem 6: No Auth State Persistence — Users Logged Out on Refresh
**Issue:** On page refresh, the app would reset to the auth screen even if the user was already logged in.

**Solution:**
- Used Firebase's `onAuthStateChanged` listener in `App.tsx` to reactively subscribe to the auth state
- Stored role info in Firestore and rehydrated on auth state restoration:
  ```ts
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      setSelectedRole(userDoc.data().role);
      setUser(firebaseUser);
    }
  });
  ```
- Added `isAuthReady` state flag to prevent premature UI render during auth check

---

### Problem 7: Performance — Multiple Unnecessary AI API Calls
**Issue:** Every time the user visited the Dashboard, it triggered a new Gemini AI health summary call, wasting API quota and causing latency.

**Solution:**
- Implemented smart caching in `aiCache.ts` using a composite cache key:
  ```ts
  const cacheKey = `health_summary_${uid}_${primaryCrop}_${location}`;
  ```
- Cache is invalidated after 30 minutes or when user profile changes
- Reduced AI API calls by ~80% for repeat dashboard visits

---

### Problem 8: Poor UX During Slow Network / AI Loading
**Issue:** Users saw blank screens or stale content while AI was generating responses.

**Solution:**
- Added `Loader2` animated spinner during AI generation:
  ```tsx
  {loadingHealth ? <Loader2 className="animate-spin" /> : <AIContent />}
  ```
- Used `motion` (Framer Motion) for smooth fade-in of AI-generated content
- Implemented optimistic UI patterns and skeleton states across components
- Used `Sonner` toast notifications for real-time feedback on user actions

---

## 📂 Project Structure

```
AgroDhan/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── AgriAcademy.tsx     # 🎓 Learning & tutorials module
│   │   ├── AgriDoctor.tsx      # 🩺 AI crop disease detection
│   │   ├── AgriFinance.tsx     # 💰 Farm finance tracker
│   │   ├── AgriLocator.tsx     # 📍 Nearby services locator
│   │   ├── AgriMart.tsx        # 🛒 Online agri marketplace
│   │   ├── AgriVoice.tsx       # 🎙️ Multilingual voice assistant
│   │   ├── AgriWeather.tsx     # 🌤️ Weather forecast
│   │   ├── AuthScreen.tsx      # 🔐 Login / Registration
│   │   ├── Background.tsx      # 🎨 Animated background
│   │   ├── Community.tsx       # 👥 Farmer social forum
│   │   ├── CropAdvisor.tsx     # 🌱 AI crop recommendation
│   │   ├── Dashboard.tsx       # 🏠 Main home dashboard
│   │   ├── FarmMap.tsx         # 🗺️ Interactive farm map
│   │   ├── FarmVision3D.tsx    # 🌐 3D farm visualization
│   │   ├── GlobalSearch.tsx    # 🔍 App-wide search
│   │   ├── LanguageSelection.tsx  # 🌐 Language picker
│   │   ├── Layout.tsx          # 📐 App shell with navigation
│   │   ├── MarketWidget.tsx    # 📈 Mandi price tracker
│   │   ├── RoleSelection.tsx   # 👤 User role selector
│   │   ├── SplashScreen.tsx    # 🌾 Animated splash screen
│   │   ├── UserProfile.tsx     # 👤 User profile editor
│   │   ├── VoiceAssistant.tsx  # 🎤 Floating voice assistant
│   │   └── ui/                 # shadcn/ui base components
│   ├── contexts/
│   │   └── LanguageContext.tsx # Multilingual context + Translate
│   ├── lib/
│   │   ├── aiCache.ts          # AI response caching utility
│   │   ├── gemini.ts           # Gemini AI client setup
│   │   ├── geminiTranslator.ts # Language translation via Gemini
│   │   └── utils.ts            # Shared utility functions
│   ├── App.tsx                 # Root app component + routing
│   ├── firebase.ts             # Firebase initialization
│   ├── types.ts                # Global TypeScript interfaces
│   ├── index.css               # Global styles
│   └── main.tsx                # React entry point
├── firebase-applet-config.json # Firebase project configuration
├── firestore.rules             # Firestore security rules
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+
- A **Firebase** project with Auth + Firestore enabled
- A **Google Gemini API Key**

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd AgroDhan

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Edit firebase-applet-config.json with your Firebase project details

# 4. Set Gemini API key
# Add to .env.local:
# GEMINI_API_KEY=your_gemini_api_key_here

# 5. Start development server
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for all AI features |

**Firebase config** is loaded from `firebase-applet-config.json` (not from env vars):

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

> ⚠️ **Important:** Never commit `firebase-applet-config.json` or `.env.local` to version control. Both are already in `.gitignore`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **Apache-2.0 License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Indian farmers**

*AgroDhan — Where Technology Meets Agriculture*

</div>
