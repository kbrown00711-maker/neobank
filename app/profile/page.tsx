"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  useEffect(() => {
    const storedUser = localStorage.getItem("neobank_user");
    if (!storedUser) {
      router.push("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const userProfile = useQuery(
    api.users.getUserProfile,
    user ? { userId: user.userId as Id<"users"> } : "skip"
  );

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updateProfile({
        userId: user.userId,
        name,
        email,
      });

      // Update local storage
      const updatedUser = { ...user, name, email };
      localStorage.setItem("neobank_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <Navigation />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Profile Settings
            </h1>
            <p className="text-muted text-lg">
              Manage your account information and preferences
            </p>
          </motion.div>

          <div className="grid gap-6">
            {/* Account Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">
                    Account Information
                  </h2>
                  <p className="text-muted">Update your personal details</p>
                </div>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-600 rounded-2xl p-4 mb-6 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-muted" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </motion.div>

            {/* Account Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">
                    Account Status
                  </h2>
                  <p className="text-muted">Your account security information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                  <div>
                    <div className="font-medium">Account Type</div>
                    <div className="text-sm text-muted capitalize">{userProfile.role}</div>
                  </div>
                  <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    {userProfile.role === "admin" ? "Admin" : "Standard"}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                  <div>
                    <div className="font-medium">Account Status</div>
                    <div className="text-sm text-muted capitalize">{userProfile.status}</div>
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                  <div>
                    <div className="font-medium">Account Number</div>
                    <div className="text-sm text-muted">
                      {userProfile.account?.accountNumber}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
