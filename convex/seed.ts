import { mutation } from "./_generated/server";

function simpleHash(password: string): string {
  return btoa(password);
}

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Database already seeded" };
    }

    // Create admin user
    const adminId = await ctx.db.insert("users", {
      email: "admin@neobank.com",
      password: simpleHash("admin123"),
      name: "Admin User",
      role: "admin",
      status: "active",
      createdAt: Date.now(),
    });

    await ctx.db.insert("accounts", {
      userId: adminId,
      balance: 50000.0,
      accountNumber: "ACC0000000001",
      currency: "USD",
      createdAt: Date.now(),
    });

    // Create regular users
    const users = [
      { name: "Alice Johnson", email: "alice@example.com", balance: 5430.0 },
      { name: "Bob Smith", email: "bob@example.com", balance: 12890.5 },
      { name: "Carol Williams", email: "carol@example.com", balance: 3200.0 },
      { name: "David Brown", email: "david@example.com", balance: 8750.25 },
      { name: "Emma Davis", email: "emma@example.com", balance: 15600.0 },
    ];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userId = await ctx.db.insert("users", {
        email: user.email,
        password: simpleHash("password123"),
        name: user.name,
        role: "user",
        status: "active",
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      });

      const accountId = await ctx.db.insert("accounts", {
        userId,
        balance: user.balance,
        accountNumber: `ACC000000000${i + 2}`,
        currency: "USD",
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      });

      // Create sample transactions
      const transactionTypes = ["deposit", "withdrawal", "deposit", "withdrawal"];
      const descriptions = [
        "Salary deposit",
        "ATM withdrawal",
        "Freelance payment",
        "Online purchase",
        "Subscription payment",
      ];

      for (let j = 0; j < 3; j++) {
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const amount = Math.random() * 500 + 50;
        
        await ctx.db.insert("transactions", {
          fromAccountId: type === "withdrawal" ? accountId : undefined,
          toAccountId: type === "deposit" ? accountId : undefined,
          amount,
          type: type as "deposit" | "withdrawal",
          status: "completed",
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          createdAt: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000,
          createdBy: userId,
        });
      }
    }

    return { 
      message: "Database seeded successfully",
      credentials: {
        admin: { email: "admin@neobank.com", password: "admin123" },
        user: { email: "alice@example.com", password: "password123" }
      }
    };
  },
});
