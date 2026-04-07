import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // In production, use proper hashing
    name: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    status: v.union(v.literal("active"), v.literal("suspended")),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),

  accounts: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    accountNumber: v.string(),
    routingNumber: v.string(),
    currency: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_account_number", ["accountNumber"]),

  transactions: defineTable({
    fromAccountId: v.optional(v.id("accounts")),
    toAccountId: v.optional(v.id("accounts")),
    recipientAccountNumber: v.optional(v.string()),
    recipientRoutingNumber: v.optional(v.string()),
    recipientAccountHolderName: v.optional(v.string()),
    amount: v.number(),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("transfer"),
      v.literal("adjustment")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    description: v.string(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
  })
    .index("by_from_account", ["fromAccountId"])
    .index("by_to_account", ["toAccountId"])
    .index("by_created_at", ["createdAt"]),

  adminActions: defineTable({
    adminId: v.id("users"),
    action: v.string(),
    targetUserId: v.optional(v.id("users")),
    details: v.string(),
    timestamp: v.number(),
  }).index("by_admin", ["adminId"]).index("by_timestamp", ["timestamp"]),
});
