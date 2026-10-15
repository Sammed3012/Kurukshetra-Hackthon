import React, { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, Calendar, Camera, Save, LogOut, Shield, Tractor, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Translate } from "../contexts/LanguageContext";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "Kisan Ramesh",
    email: "ramesh@agrodhan.com",
    phone: "+91 98765 43210",
    location: "Maharashtra, India",
    farmSize: "5.5",
    primaryCrop: "Wheat",
    role: "Farmer"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            displayName: data.displayName || auth.currentUser.displayName || "Kisan Ramesh",
            email: data.email || auth.currentUser.email || "ramesh@agrodhan.com",
            phone: data.phone || "+91 98765 43210",
            location: data.location || "Maharashtra, India",
            farmSize: data.farmSize || "5.5",
            primaryCrop: data.primaryCrop || "Wheat",
            role: data.role || "Farmer"
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName
      });

      // Update Firestore document
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        farmSize: profile.farmSize,
        primaryCrop: profile.primaryCrop
      });

      toast.success("Profile updated successfully!");
      // Reload to ensure changes reflect everywhere
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A5A40]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>User Dashboard</Translate></h2>
          <p className="text-gray-500"><Translate>Manage your profile, farm details, and account settings.</Translate></p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => auth.signOut()}
          className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 font-bold"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <Translate>Sign Out</Translate>
        </Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <div className="h-32 bg-[#5A5A40] relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center relative group">
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                  <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="pt-16 pb-8 text-center">
            <h3 className="text-xl font-bold text-gray-900">{profile.displayName || "Farmer"}</h3>
            <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
            <div className="flex justify-center gap-2">
              <Badge className="bg-[#5A5A40]/10 text-[#5A5A40] border-none font-bold capitalize">
                {profile.role || "User"}
              </Badge>
              <Badge variant="outline" className="border-green-200 text-green-600 font-bold">
                <Shield className="w-3 h-3 mr-1" /> <Translate>Verified</Translate>
              </Badge>
            </div>
          </CardContent>
          <div className="border-t border-gray-50 p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#5A5A40]" />
              <span>{profile.location || "Location not set"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-[#5A5A40]" />
              <span>{profile.phone || "Phone not set"}</span>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 border-none shadow-xl bg-white rounded-3xl p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-bold text-[#5A5A40]"><Translate>Edit Profile</Translate></CardTitle>
            <CardDescription><Translate>Update your personal and farm information.</Translate></CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Full Name</Translate></Label>
                <Input 
                  id="name" 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="rounded-xl border-gray-100 focus:ring-[#5A5A40]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Email Address</Translate></Label>
                <Input 
                  id="email" 
                  value={profile.email} 
                  disabled 
                  className="rounded-xl border-gray-100 bg-gray-50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Phone Number</Translate></Label>
                <Input 
                  id="phone" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="rounded-xl border-gray-100 focus:ring-[#5A5A40]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Location</Translate></Label>
                <Input 
                  id="location" 
                  value={profile.location} 
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="Maharashtra, India"
                  className="rounded-xl border-gray-100 focus:ring-[#5A5A40]" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h4 className="font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
                <Tractor className="w-5 h-5" />
                <Translate>Farm Details</Translate>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farmSize" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Farm Size (Acres)</Translate></Label>
                  <Input 
                    id="farmSize" 
                    value={profile.farmSize} 
                    onChange={(e) => setProfile({...profile, farmSize: e.target.value})}
                    placeholder="5.5"
                    className="rounded-xl border-gray-100 focus:ring-[#5A5A40]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryCrop" className="text-xs font-bold uppercase text-gray-400 tracking-widest"><Translate>Primary Crop</Translate></Label>
                  <Input 
                    id="primaryCrop" 
                    value={profile.primaryCrop} 
                    onChange={(e) => setProfile({...profile, primaryCrop: e.target.value})}
                    placeholder="Wheat / Cotton"
                    className="rounded-xl border-gray-100 focus:ring-[#5A5A40]" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-8 font-bold h-12 shadow-lg shadow-[#5A5A40]/20"
              >
                {saving ? <Translate>Saving...</Translate> : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <Translate>Save Changes</Translate>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
