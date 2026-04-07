"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Download } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface SendReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: Id<"users">;
  type: "send" | "receive";
  onSuccess: () => void;
}

export default function SendReceiveModal({
  isOpen,
  onClose,
  userId,
  type,
  onSuccess,
}: SendReceiveModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTransaction = useMutation(api.transactions.createTransaction);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid amount");
      }

      if (type === "send" && !accountNumber) {
        throw new Error("Please enter recipient account number");
      }
      if (type === "send" && !routingNumber) {
        throw new Error("Please enter routing number");
      }
      if (type === "send" && !accountHolderName) {
        throw new Error("Please enter account holder name");
      }

      await createTransaction({
        userId,
        type: type === "send" ? "transfer" : "deposit",
        amount: amountNum,
        description: description || (type === "send" ? "Money Transfer" : "Deposit"),
        toAccountNumber: type === "send" ? accountNumber : undefined,
        toRoutingNumber: type === "send" ? routingNumber : undefined,
        toAccountHolderName: type === "send" ? accountHolderName : undefined,
      });

      onSuccess();
      onClose();
      setAmount("");
      setDescription("");
      setAccountNumber("");
      setRoutingNumber("");
      setAccountHolderName("");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-8 max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    type === "send" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  }`}>
                    {type === "send" ? <Send className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                  </div>
                  <h2 className="text-2xl font-display font-bold">
                    {type === "send" ? "Send Money" : "Receive Money"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 rounded-2xl p-4 mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {type === "send" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Recipient Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="input-field"
                        placeholder="ACC0000000002"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="input-field"
                        placeholder="000000000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        className="input-field"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    placeholder="What's this for?"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? "Processing..." : type === "send" ? "Send" : "Receive"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
