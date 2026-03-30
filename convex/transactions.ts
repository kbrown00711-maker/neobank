import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTransaction = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("transfer")
    ),
    amount: v.number(),
    description: v.string(),
    toAccountNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const userAccount = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!userAccount) throw new Error("Account not found");

    let transactionData: any = {
      amount: args.amount,
      type: args.type,
      status: "completed",
      description: args.description,
      createdAt: Date.now(),
      createdBy: args.userId,
    };

    if (args.type === "deposit") {
      transactionData.toAccountId = userAccount._id;
      await ctx.db.patch(userAccount._id, {
        balance: userAccount.balance + args.amount,
      });
    } else if (args.type === "withdrawal") {
      if (userAccount.balance < args.amount) {
        throw new Error("Insufficient balance");
      }
      transactionData.fromAccountId = userAccount._id;
      await ctx.db.patch(userAccount._id, {
        balance: userAccount.balance - args.amount,
      });
    } else if (args.type === "transfer") {
      if (!args.toAccountNumber) {
        throw new Error("Recipient account required");
      }
      if (userAccount.balance < args.amount) {
        throw new Error("Insufficient balance");
      }

      transactionData.fromAccountId = userAccount._id;
      transactionData.recipientAccountNumber = args.toAccountNumber;
      transactionData.status = "pending";

      // Reserve the amount from user's account (deduct immediately but mark as pending)
      await ctx.db.patch(userAccount._id, {
        balance: userAccount.balance - args.amount,
      });
    }

    const transactionId = await ctx.db.insert("transactions", transactionData);
    return { transactionId, success: true };
  },
});

export const getTransactions = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!account) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    const userTransactions = transactions.filter(
      (t) =>
        t.fromAccountId === account._id || t.toAccountId === account._id
    );

    const limit = args.limit || 50;
    return userTransactions.slice(0, limit).map((t) => ({
      id: t._id,
      amount: t.amount,
      type: t.type,
      status: t.status,
      description: t.description,
      createdAt: t.createdAt,
      isCredit: t.toAccountId === account._id,
      isDebit: t.fromAccountId === account._id,
    }));
  },
});

export const getRecentTransactions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!account) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_created_at")
      .order("desc")
      .take(5);

    return transactions
      .filter(
        (t) =>
          t.fromAccountId === account._id || t.toAccountId === account._id
      )
      .map((t) => ({
        id: t._id,
        amount: t.amount,
        type: t.type,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
        isCredit: t.toAccountId === account._id,
        isDebit: t.fromAccountId === account._id,
      }));
  },
});
