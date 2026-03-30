"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Navigation from "@/components/Navigation";
import BalanceCard from "@/components/BalanceCard";
import TransactionList from "@/components/TransactionList";
import SendReceiveModal from "@/components/SendReceiveModal";
import { motion } from "framer-motion";
import { Send, Download, History, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const recentTransactions = useQuery(
    api.transactions.getRecentTransactions,
    user ? { userId: user.userId as Id<"users"> } : "skip"
  );

  const handleTransactionSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <Navigation />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-muted text-lg">
              Here's what's happening with your money today
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              {userProfile.account && (
                <BalanceCard
                  balance={userProfile.account.balance}
                  accountNumber={userProfile.account.accountNumber}
                  currency={userProfile.account.currency}
                />
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSendModalOpen(true)}
                  className="card hover:border-accent/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Send className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <div className="font-display font-bold text-xl">Send</div>
                      <div className="text-sm text-muted">Transfer money</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setReceiveModalOpen(true)}
                  className="card hover:border-accent/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Download className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <div className="font-display font-bold text-xl">Receive</div>
                      <div className="text-sm text-muted">Add funds</div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Recent Transactions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold">Recent Activity</h2>
                  <button
                    onClick={() => router.push("/transactions")}
                    className="text-accent hover:underline text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <TransactionList transactions={recentTransactions || []} limit={5} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h3 className="text-lg font-display font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted">This Month</div>
                        <div className="font-bold">+$1,250</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted">Transactions</div>
                        <div className="font-bold">{recentTransactions?.length || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-accent/5 to-accent/10"
              >
                <h3 className="text-lg font-display font-bold mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Account Number</span>
                    <span className="font-medium">{userProfile.account?.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Account Type</span>
                    <span className="font-medium">Checking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendReceiveModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        userId={user.userId}
        type="send"
        onSuccess={handleTransactionSuccess}
      />
      <SendReceiveModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        userId={user.userId}
        type="receive"
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
