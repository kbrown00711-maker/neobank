"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Settings } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: number;
  isCredit?: boolean;
  isDebit?: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export default function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const getIcon = (type: string, status: string, isCredit?: boolean) => {
    if (status === "pending") return <ArrowRightLeft className="w-5 h-5 text-yellow-600" />;
    if (status === "failed") return <ArrowRightLeft className="w-5 h-5 text-red-600" />;
    if (type === "transfer") return <ArrowRightLeft className="w-5 h-5" />;
    if (isCredit) return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    return <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  const getTypeLabel = (type: string, status: string, isCredit?: boolean, isDebit?: boolean) => {
    if (status === "failed") return "Failed";
    if (status === "pending") return `${isDebit ? "Sent (Pending)" : "Pending"}`;
    if (type === "deposit") return "Deposit";
    if (type === "withdrawal") return "Withdrawal";
    if (type === "transfer") return isCredit ? "Received" : "Sent";
    if (type === "adjustment") return isCredit ? "Payment received" : "Balance Adjustment";
    return type;
  };

  if (displayTransactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowRightLeft className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">No transactions yet</h3>
        <p className="text-muted">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card hover:shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                transaction.status === "pending"
                  ? "bg-yellow-50 text-yellow-600"
                  : transaction.status === "failed"
                  ? "bg-red-50 text-red-600"
                  : transaction.isCredit 
                  ? "bg-green-50 text-green-600" 
                  : "bg-red-50 text-red-600"
              }`}>
                {getIcon(transaction.type, transaction.status, transaction.isCredit)}
              </div>
              <div>
                <div className="font-medium mb-1 flex items-center gap-2">
                  {transaction.description}
                  {transaction.status === "pending" && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                  {transaction.status === "failed" && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                      Failed
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted">
                  {getTypeLabel(transaction.type, transaction.status, transaction.isCredit, transaction.isDebit)} • {" "}
                  {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                transaction.status === "pending"
                  ? "text-yellow-600"
                  : transaction.status === "failed"
                  ? "text-red-600 line-through opacity-60"
                  : transaction.isCredit ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.isCredit || transaction.status === "pending" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
              </div>
              <div className="text-sm text-muted capitalize">
                {transaction.status === "pending" ? "pending" : transaction.status === "failed" ? "refunded" : transaction.type}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
