# API Documentation

## Authentication Functions

### `signUp`
Create a new user account.

**Arguments:**
- `email: string` - User email
- `password: string` - User password
- `name: string` - Full name

**Returns:**
```typescript
{
  userId: Id<"users">,
  message: string
}
```

### `signIn`
Authenticate a user.

**Arguments:**
- `email: string`
- `password: string`

**Returns:**
```typescript
{
  userId: Id<"users">,
  email: string,
  name: string,
  role: "user" | "admin"
}
```

## User Functions

### `getUserProfile`
Get user profile and account details.

**Arguments:**
- `userId: Id<"users">`

**Returns:**
```typescript
{
  id: Id<"users">,
  email: string,
  name: string,
  role: "user" | "admin",
  status: "active" | "suspended",
  account: {
    id: Id<"accounts">,
    accountNumber: string,
    balance: number,
    currency: string
  } | null
}
```

### `updateUserProfile`
Update user information (limited fields).

**Arguments:**
- `userId: Id<"users">`
- `name?: string`
- `email?: string`

**Returns:**
```typescript
{ success: boolean }
```

## Transaction Functions

### `createTransaction`
Create a new transaction (deposit, withdrawal, or transfer).

**Arguments:**
- `userId: Id<"users">`
- `type: "deposit" | "withdrawal" | "transfer"`
- `amount: number` - Must be positive
- `description: string`
- `toAccountNumber?: string` - Required for transfers

**Returns:**
```typescript
{
  transactionId: Id<"transactions">,
  success: boolean
}
```

**Errors:**
- "Amount must be positive"
- "Insufficient balance"
- "Recipient account required" (for transfers)
- "Recipient account not found"

### `getTransactions`
Get transaction history for a user.

**Arguments:**
- `userId: Id<"users">`
- `limit?: number` - Default: 50

**Returns:**
```typescript
Array<{
  id: Id<"transactions">,
  amount: number,
  type: string,
  status: string,
  description: string,
  createdAt: number,
  isCredit: boolean,
  isDebit: boolean
}>
```

### `getRecentTransactions`
Get last 5 transactions for a user.

**Arguments:**
- `userId: Id<"users">`

**Returns:** Same as `getTransactions` but limited to 5 items.

## Admin Functions (God Mode)

All admin functions verify that the caller has admin role before executing.

### `getAllUsers`
Get all users with their account information.

**Arguments:**
- `adminId: Id<"users">` - Must be admin

**Returns:**
```typescript
Array<{
  id: Id<"users">,
  email: string,
  name: string,
  role: "user" | "admin",
  status: "active" | "suspended",
  createdAt: number,
  lastLogin?: number,
  balance: number,
  accountNumber: string
}>
```

### `adminUpdateUser`
Update any user's profile (admin only).

**Arguments:**
- `adminId: Id<"users">`
- `targetUserId: Id<"users">`
- `name?: string`
- `email?: string`
- `role?: "user" | "admin"`
- `status?: "active" | "suspended"`

**Returns:**
```typescript
{ success: boolean }
```

### `adminAdjustBalance`
Add or subtract funds from any account.

**Arguments:**
- `adminId: Id<"users">`
- `targetUserId: Id<"users">`
- `amount: number` - Can be positive (add) or negative (subtract)
- `description: string`

**Returns:**
```typescript
{
  success: boolean,
  newBalance: number
}
```

**Errors:**
- "Cannot set negative balance"
- "Account not found"

### `adminDeleteUser`
Delete a user and their account.

**Arguments:**
- `adminId: Id<"users">`
- `targetUserId: Id<"users">`

**Returns:**
```typescript
{ success: boolean }
```

### `getAdminActions`
View admin activity log.

**Arguments:**
- `adminId: Id<"users">`
- `limit?: number` - Default: 50

**Returns:**
```typescript
Array<{
  id: Id<"adminActions">,
  action: string,
  adminName: string,
  targetUserName: string,
  details: string,
  timestamp: number
}>
```

### `getAnalytics`
Get system-wide analytics.

**Arguments:**
- `adminId: Id<"users">`

**Returns:**
```typescript
{
  totalUsers: number,
  activeUsers: number,
  suspendedUsers: number,
  totalBalance: number,
  totalTransactions: number,
  avgBalance: number
}
```

## Utility Functions

### `seedDatabase`
Populate database with demo data.

**Arguments:** None

**Returns:**
```typescript
{
  message: string,
  credentials?: {
    admin: { email: string, password: string },
    user: { email: string, password: string }
  }
}
```

## Error Handling

All functions may throw errors with descriptive messages:
- "Unauthorized: Admin access required"
- "User not found"
- "Invalid credentials"
- "Account suspended"
- "Insufficient balance"
- etc.

Catch these errors in your frontend:

```typescript
try {
  await createTransaction({...});
} catch (error) {
  console.error(error.message);
  // Show error to user
}
```

## Real-time Subscriptions

Convex automatically provides real-time updates. Use `useQuery` to subscribe:

```typescript
const transactions = useQuery(api.transactions.getTransactions, { 
  userId: user.id 
});
// transactions updates automatically when data changes
```
