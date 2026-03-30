import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple password hash (use bcrypt in production)
function simpleHash(password: string): string {
  return btoa(password);
}

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: simpleHash(args.password),
      name: args.name,
      role: "user",
      status: "active",
      createdAt: Date.now(),
    });

    // Create account with random account number
    const accountNumber = `ACC${Math.random().toString().slice(2, 12)}`;
    await ctx.db.insert("accounts", {
      userId,
      balance: 1000.0, // Starting balance
      accountNumber,
      currency: "USD",
      createdAt: Date.now(),
    });

    return { userId, message: "User created successfully" };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.password !== simpleHash(args.password)) {
      throw new Error("Invalid credentials");
    }

    if (user.status === "suspended") {
      throw new Error("Account suspended");
    }

    // Update last login
    await ctx.db.patch(user._id, {
      lastLogin: Date.now(),
    });

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

export const getCurrentUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  },
});
