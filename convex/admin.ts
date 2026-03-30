import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to verify admin role
async function verifyAdmin(ctx: any, userId: string) {
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Helper to log admin actions
async function logAdminAction(
  ctx: any,
  adminId: string,
  action: string,
  targetUserId?: string,
  details?: string
) {
  await ctx.db.insert("adminActions", {
    adminId,
    action,
    targetUserId,
    details: details || "",
    timestamp: Date.now(),
  });
}

export const getAllUsers = query({
  args: { adminId: v.id("users") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const users = await ctx.db.query("users").collect();
    const usersWithAccounts = await Promise.all(
      users.map(async (user) => {
        const account = await ctx.db
          .query("accounts")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          balance: account?.balance || 0,
          accountNumber: account?.accountNumber || "",
        };
      })
    );

    return usersWithAccounts;
  },
});

export const adminUpdateUser = mutation({
  args: {
    adminId: v.id("users"),
    targetUserId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    status: v.optional(v.union(v.literal("active"), v.literal("suspended"))),
    accountNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const { adminId, targetUserId, accountNumber, ...updates } = args;
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.role) updateData.role = updates.role;
    if (updates.status) updateData.status = updates.status;

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(targetUserId, updateData);
    }

    if (accountNumber) {
      const account = await ctx.db
        .query("accounts")
        .withIndex("by_user", (q) => q.eq("userId", targetUserId))
        .first();

      if (!account) {
        throw new Error("Account not found");
      }

      await ctx.db.patch(account._id, {
        accountNumber,
      });
    }

    await logAdminAction(
      ctx,
      adminId,
      "UPDATE_USER",
      targetUserId,
      JSON.stringify(updates)
    );

    return { success: true };
  },
});

export const adminAdjustBalance = mutation({
  args: {
    adminId: v.id("users"),
    targetUserId: v.id("users"),
    amount: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (!account) throw new Error("Account not found");

    const newBalance = account.balance + args.amount;
    if (newBalance < 0) {
      throw new Error("Cannot set negative balance");
    }

    await ctx.db.patch(account._id, { balance: newBalance });

    // Create adjustment transaction
    await ctx.db.insert("transactions", {
      toAccountId: args.amount > 0 ? account._id : undefined,
      fromAccountId: args.amount < 0 ? account._id : undefined,
      amount: Math.abs(args.amount),
      type: "adjustment",
      status: "completed",
      description: args.description,
      createdAt: Date.now(),
      createdBy: args.adminId,
    });

    await logAdminAction(
      ctx,
      args.adminId,
      "ADJUST_BALANCE",
      args.targetUserId,
      `Amount: ${args.amount}, New Balance: ${newBalance}`
    );

    return { success: true, newBalance };
  },
});

export const adminDeleteUser = mutation({
  args: {
    adminId: v.id("users"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    // Delete user's account
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (account) {
      await ctx.db.delete(account._id);
    }

    // Delete user
    await ctx.db.delete(args.targetUserId);

    await logAdminAction(
      ctx,
      args.adminId,
      "DELETE_USER",
      args.targetUserId,
      "User and associated data deleted"
    );

    return { success: true };
  },
});

export const getAdminActions = query({
  args: { adminId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const actions = await ctx.db
      .query("adminActions")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit || 50);

    return Promise.all(
      actions.map(async (action) => {
        const admin = await ctx.db.get(action.adminId);
        let targetUser = null;
        if (action.targetUserId) {
          targetUser = await ctx.db.get(action.targetUserId);
        }

        return {
          id: action._id,
          action: action.action,
          adminName: admin?.name || "Unknown",
          targetUserName: targetUser?.name || "Unknown",
          details: action.details,
          timestamp: action.timestamp,
        };
      })
    );
  },
});

export const getAnalytics = query({
  args: { adminId: v.id("users") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const users = await ctx.db.query("users").collect();
    const accounts = await ctx.db.query("accounts").collect();
    const transactions = await ctx.db.query("transactions").collect();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const activeUsers = users.filter((u) => u.status === "active").length;
    const totalTransactions = transactions.length;

    return {
      totalUsers: users.length,
      activeUsers,
      suspendedUsers: users.length - activeUsers,
      totalBalance,
      totalTransactions,
      avgBalance: accounts.length > 0 ? totalBalance / accounts.length : 0,
    };
  },
});

export const getPendingTransfers = query({
  args: { adminId: v.id("users") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const pendingTransactions = await ctx.db
      .query("transactions")
      .collect();

    return pendingTransactions.filter((t) => t.status === "pending" && t.type === "transfer");
  },
});

export const approveTransfer = mutation({
  args: {
    adminId: v.id("users"),
    transactionId: v.id("transactions"),
    approve: v.boolean(),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx, args.adminId);

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status !== "pending" || transaction.type !== "transfer") {
      throw new Error("Invalid transaction status or type");
    }

    if (args.approve) {
      // Validate recipient account exists
      const toAccount = await ctx.db
        .query("accounts")
        .withIndex("by_account_number", (q) =>
          q.eq("accountNumber", transaction.recipientAccountNumber!)
        )
        .first();

      if (!toAccount) {
        // If the recipient doesn't exist, complete as approved but leave toAccountId unset.
        await ctx.db.patch(args.transactionId, {
          status: "completed",
          approvedBy: args.adminId,
          approvedAt: Date.now(),
        });

        await logAdminAction(
          ctx,
          args.adminId,
          "APPROVE_TRANSFER",
          undefined,
          `Transaction ${args.transactionId}: Recipient account not found, marked completed`
        );

        return { success: true, message: "Recipient account not found; transfer marked completed." };
      }

      // Complete the transfer
      await ctx.db.patch(toAccount._id, {
        balance: toAccount.balance + transaction.amount,
      });

      await ctx.db.patch(args.transactionId, {
        toAccountId: toAccount._id,
        status: "completed",
        approvedBy: args.adminId,
        approvedAt: Date.now(),
      });

      await logAdminAction(
        ctx,
        args.adminId,
        "APPROVE_TRANSFER",
        undefined,
        `Transaction ${args.transactionId}: ${transaction.amount} to ${transaction.recipientAccountNumber}`
      );
    } else {
      // Reject transfer and refund amount
      const fromAccount = await ctx.db.get(transaction.fromAccountId!);
      if (fromAccount) {
        await ctx.db.patch(fromAccount._id, {
          balance: fromAccount.balance + transaction.amount,
        });
      }

      await ctx.db.patch(args.transactionId, {
        status: "failed",
        approvedBy: args.adminId,
        approvedAt: Date.now(),
      });

      await logAdminAction(
        ctx,
        args.adminId,
        "DENY_TRANSFER",
        undefined,
        `Transaction ${args.transactionId}: Admin rejected`
      );
    }

    return { success: true };
  },
});
