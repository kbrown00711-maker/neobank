import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      account: account
        ? {
            id: account._id,
            accountNumber: account.accountNumber,
            balance: account.balance,
            currency: account.currency,
          }
        : null,
    };
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Only allow limited fields for regular users
    const allowedUpdates: any = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.email) allowedUpdates.email = updates.email;

    await ctx.db.patch(userId, allowedUpdates);
    return { success: true };
  },
});

export const getAccountBalance = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!account) throw new Error("Account not found");

    return {
      balance: account.balance,
      accountNumber: account.accountNumber,
      currency: account.currency,
    };
  },
});
