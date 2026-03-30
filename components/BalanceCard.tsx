"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
  accountNumber: string;
  currency?: string;
}

export default function BalanceCard({ 
  balance, 
  accountNumber, 
  currency = "USD" 
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-accent p-8 text-white shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm opacity-80 mb-1">Total Balance</div>
            <div className="text-xs opacity-60">{accountNumber}</div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="text-5xl font-display font-bold mb-2">
            {showBalance ? formatCurrency(balance) : "••••••"}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+2.5% from last month</span>
          </div>
        </div>

        {/* Card Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <div className="text-xs opacity-60 mb-1">Card Holder</div>
            <div className="text-sm font-medium">Account Owner</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-60 mb-1">Valid Thru</div>
            <div className="text-sm font-medium">12/28</div>
          </div>
        </div>
      </div>

      {/* Chip Design */}
      <div className="absolute top-8 right-8 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg opacity-80" />
    </motion.div>
  );
}
