# Project Structure

```
neobank-app/
│
├── 📱 app/                          # Next.js App Router
│   ├── admin/
│   │   └── page.tsx                # Admin Dashboard (God Mode)
│   ├── auth/
│   │   └── page.tsx                # Authentication (Sign In/Up)
│   ├── dashboard/
│   │   └── page.tsx                # User Dashboard
│   ├── profile/
│   │   └── page.tsx                # Profile Settings
│   ├── transactions/
│   │   └── page.tsx                # Transaction History
│   ├── globals.css                 # Global Styles
│   ├── layout.tsx                  # Root Layout
│   └── page.tsx                    # Landing Page
│
├── 🎨 components/                   # React Components
│   ├── BalanceCard.tsx             # Balance Display Card
│   ├── ConvexProvider.tsx          # Convex Client Provider
│   ├── Navigation.tsx              # Main Navigation Bar
│   ├── SendReceiveModal.tsx        # Transaction Modal
│   └── TransactionList.tsx         # Transaction List Component
│
├── 🔧 convex/                       # Backend (Convex)
│   ├── _generated/                 # Auto-generated types
│   ├── admin.ts                    # Admin God Mode Functions
│   ├── auth.ts                     # Authentication Functions
│   ├── schema.ts                   # Database Schema
│   ├── seed.ts                     # Seed Data Function
│   ├── transactions.ts             # Transaction Functions
│   └── users.ts                    # User Management Functions
│
├── 📚 lib/                          # Utilities
│   └── auth-context.tsx            # Authentication Context
│
├── 📄 Configuration Files
│   ├── .env.local.example          # Environment Variables Template
│   ├── .gitignore                  # Git Ignore Rules
│   ├── next.config.js              # Next.js Configuration
│   ├── package.json                # Dependencies
│   ├── postcss.config.js           # PostCSS Configuration
│   ├── tailwind.config.js          # Tailwind Configuration
│   └── tsconfig.json               # TypeScript Configuration
│
└── 📖 Documentation
    ├── API.md                      # API Documentation
    ├── FEATURES.md                 # Features & Architecture
    ├── README.md                   # Main Documentation
    └── setup.sh                    # Setup Script

```

## Key Directories Explained

### `/app` - Frontend Pages
All user-facing pages using Next.js App Router:
- **Landing**: Marketing page with features
- **Auth**: Login and registration
- **Dashboard**: User home with balance and transactions
- **Transactions**: Full transaction history
- **Profile**: User settings and info
- **Admin**: God mode for admins only

### `/components` - Reusable UI
React components used across pages:
- **BalanceCard**: Displays account balance with card design
- **Navigation**: Top navigation bar with user menu
- **TransactionList**: Renders transaction history
- **SendReceiveModal**: Modal for money transfers
- **ConvexProvider**: Wraps app with Convex client

### `/convex` - Backend Logic
Serverless backend functions:
- **schema.ts**: Defines database tables
- **auth.ts**: Handles login/signup
- **users.ts**: User CRUD operations
- **transactions.ts**: Transaction processing
- **admin.ts**: Admin god mode operations
- **seed.ts**: Creates demo data

### `/lib` - Utilities
Helper functions and contexts:
- **auth-context.tsx**: Global auth state management

## File Counts

- **Pages**: 6 (Landing, Auth, Dashboard, Transactions, Profile, Admin)
- **Components**: 5 (BalanceCard, Navigation, TransactionList, Modal, Provider)
- **Backend Functions**: 6 files (Schema, Auth, Users, Transactions, Admin, Seed)
- **Total Files**: ~30 files
- **Lines of Code**: ~3,500 lines

## Tech Stack Summary

```
┌─────────────────────────────────────┐
│         Next.js 14 (Frontend)       │
│  TypeScript + React + Tailwind CSS  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Convex (Backend & Database)    │
│    Real-time, Serverless Platform   │
└─────────────────────────────────────┘
```

## Data Models

### 4 Main Tables

1. **users** - User accounts and auth
2. **accounts** - Bank accounts with balances
3. **transactions** - All money movements
4. **adminActions** - Audit log for admin activities

### 10+ Indexes

- Email lookup
- User → Account mapping
- Transaction history queries
- Admin action logs
- Timestamp-based sorting

## Routes

### Public Routes
- `/` - Landing page
- `/auth` - Authentication

### Protected Routes (User)
- `/dashboard` - User dashboard
- `/transactions` - Transaction history
- `/profile` - Profile settings

### Protected Routes (Admin)
- `/admin` - Admin dashboard (god mode)

## Scripts

```json
{
  "dev": "next dev",              // Start dev server
  "build": "next build",          // Build for production
  "start": "next start",          // Start production server
  "convex:dev": "convex dev",     // Start Convex dev
  "convex:deploy": "convex deploy" // Deploy Convex
}
```

## Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

## Styling System

- **Tailwind CSS**: Utility-first styling
- **Custom Classes**: `.btn-primary`, `.card`, `.input-field`
- **CSS Variables**: Color palette in globals.css
- **Framer Motion**: Animation library
- **Responsive**: Mobile-first approach

## State Management

- **Convex Queries**: Real-time data subscriptions
- **React Context**: Authentication state
- **Local Storage**: Session persistence
- **URL State**: Navigation and routing
