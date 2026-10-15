import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout, LogIn, ShieldCheck, Globe, Zap, ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLogo from "./AppLogo";
import { toast } from "sonner";
import { Translate } from "../contexts/LanguageContext";
import { auth, db } from "@/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface AuthScreenProps {
  role: string;
  language: string;
  onBack: () => void;
  onLogin: () => void;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AuthScreen({ role, onBack, onLogin }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const saveUserProfile = async (user: any, name?: string) => {
    const userRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: name || user.displayName || "",
          photoURL: user.photoURL || "",
          role: role,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserProfile(result.user);
      toast.success("Logged in successfully!");
      onLogin();
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked! Please allow popups for this site or open the app in a new tab.");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("Google login is not enabled in Firebase Console.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Silent or mild warning
        console.log("Popup closed by user");
      } else {
        toast.error(error.message || "Failed to login with Google");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !displayName) {
      toast.error("Please enter your name");
      return;
    }

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        await saveUserProfile(result.user, displayName);
        toast.success("Account created successfully!");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await saveUserProfile(result.user);
        toast.success("Logged in successfully!");
      }
      onLogin();
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/operation-not-allowed") {
        toast.error("Email/Password authentication is not enabled. Please enable it in the Firebase Console.");
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

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
              <Translate>Revolutionizing Agriculture with AI.</Translate>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              <Translate>Join thousands of users using AgroDhan to optimize their operations and connect with the ecosystem.</Translate>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="space-y-1">
            <p className="text-3xl font-bold">10k+</p>
            <p className="text-white/50 text-xs uppercase tracking-widest font-bold"><Translate>Active Farmers</Translate></p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">98%</p>
            <p className="text-white/50 text-xs uppercase tracking-widest font-bold"><Translate>Accuracy</Translate></p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border-white/20"
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
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? <Translate>Create Account</Translate> : <Translate>Welcome Back</Translate>}
            </h2>
            <p className="text-gray-500">
              <Translate>Sign in as a</Translate> <span className="text-[#5A5A40] font-bold"><Translate>{roleLabel}</Translate></span> <Translate>to continue.</Translate>
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Full Name</Translate></label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#5A5A40] bg-white/50"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Email Address</Translate></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#5A5A40] bg-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Password</Translate></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#5A5A40] bg-white/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Confirm Password</Translate></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#5A5A40] bg-white/50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold text-lg shadow-lg shadow-[#5A5A40]/20"
            >
              {isLoading ? <Translate>Processing...</Translate> : (isSignUp ? <Translate>Sign Up</Translate> : <Translate>Sign In</Translate>)}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-400 font-bold tracking-widest"><Translate>Or continue with</Translate></span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-gray-200 bg-white/50 hover:bg-white flex items-center justify-center gap-3 font-bold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <Translate>Google Account</Translate>
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-500 hover:text-[#5A5A40] font-medium"
            >
              {isSignUp ? <Translate>Already have an account? Sign In</Translate> : <Translate>Don't have an account? Sign Up</Translate>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

