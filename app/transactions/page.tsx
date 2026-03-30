"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Navigation from "@/components/Navigation";
import TransactionList from "@/components/TransactionList";
import { motion } from "framer-motion";
import { Filter, Download } from "lucide-react";

export default function TransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("neobank_user");
    if (!storedUser) {
      router.push("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const transactions = useQuery(
    api.transactions.getTransactions,
    user ? { userId: user.userId as Id<"users">, limit: 100 } : "skip"
  );

  const filteredTransactions = transactions?.filter((t) => {
    if (filter === "all") return true;
    if (filter === "credit") return t.isCredit;
    if (filter === "debit") return t.isDebit;
    return true;
  });

  if (!user) {
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Transaction History
            </h1>
            <p className="text-muted text-lg">
              View and manage all your transactions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-muted" />
                <div className="flex gap-2">
                  {["all", "credit", "debit"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === f
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted hover:bg-border"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-border transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredTransactions && filteredTransactions.length > 0 ? (
              <TransactionList transactions={filteredTransactions} />
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-display font-bold mb-2">
                  No transactions found
                </h3>
                <p className="text-muted">
                  {filter === "all"
                    ? "You haven't made any transactions yet"
                    : `No ${filter} transactions found`}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
