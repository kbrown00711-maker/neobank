# NeoBank - Features & Architecture

## 🎨 Design System

### Color Palette
- **Primary**: `#0A0A0A` (Deep Black)
- **Secondary**: `#F5F5F5` (Light Gray)
- **Accent**: `#6366F1` (Indigo)
- **Muted**: `#A3A3A3` (Gray)
- **Border**: `#E5E5E5` (Light Border)

### Typography
- **Display Font**: SF Pro Display (headings, titles)
- **Body Font**: SF Pro Text (paragraphs, UI text)
- **Weights**: Regular (400), Medium (500), Bold (700)

### Component Styles
- **Border Radius**: 1.5rem (24px) for cards, 2rem (32px) for inputs
- **Shadows**: Soft, subtle elevation
- **Transitions**: 300ms ease for hover states
- **Spacing**: 8px grid system

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         Next.js 14 App Router       │
│  (Server Components + Client Comps) │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐    ┌──────▼─────────┐
│  Pages     │    │  Components    │
│  - Landing │    │  - Navigation  │
│  - Auth    │    │  - Balance     │
│  - Dashboard│   │  - Transactions│
│  - Admin   │    │  - Modals      │
└────────────┘    └────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────────┐  ┌──────▼─────────┐
│ Convex React │  │  State Mgmt    │
│   Client     │  │  - Auth Context│
└──────────────┘  └────────────────┘
```

### Backend Architecture (Convex)

```
┌─────────────────────────────────────┐
│         Convex Real-time DB         │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐    ┌──────▼─────────┐
│  Schema    │    │   Functions    │
│  - users   │    │   - Queries    │
│  - accounts│    │   - Mutations  │
│  - trans...│    │   - Auth       │
└────────────┘    └────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────────┐  ┌──────▼─────────┐
│  Indexes     │  │  Validation    │
│  - by_email  │  │  - RBAC        │
│  - by_user   │  │  - Balance     │
└──────────────┘  └────────────────┘
```

## 🔐 Security Features

### Authentication
- Password hashing (base64 in demo, use bcrypt in production)
- Session management via localStorage
- Auto-redirect for unauthenticated users

### Authorization
- Role-based access control (RBAC)
- Admin-only endpoints with verification
- Function-level permission checks

### Data Validation
- Balance cannot go negative
- Positive amount validation
- Account existence verification
- Duplicate email prevention

### Audit Trail
- All admin actions logged
- Timestamp tracking
- Target user tracking
- Action detail recording

## 📊 Database Design

### Users Table
```typescript
{
  email: string (indexed)
  password: string (hashed)
  name: string
  role: "user" | "admin"
  status: "active" | "suspended"
  createdAt: number (timestamp)
  lastLogin?: number (timestamp)
}
```

### Accounts Table
```typescript
{
  userId: Id<"users"> (indexed)
  balance: number
  accountNumber: string (indexed, unique)
  currency: string
  createdAt: number (timestamp)
}
```

### Transactions Table
```typescript
{
  fromAccountId?: Id<"accounts"> (indexed)
  toAccountId?: Id<"accounts"> (indexed)
  amount: number
  type: "deposit" | "withdrawal" | "transfer" | "adjustment"
  status: "pending" | "completed" | "failed"
  description: string
  createdAt: number (indexed, timestamp)
  createdBy: Id<"users">
}
```

### Admin Actions Table
```typescript
{
  adminId: Id<"users"> (indexed)
  action: string
  targetUserId?: Id<"users">
  details: string
  timestamp: number (indexed)
}
```

## 🎯 Key Features

### User Dashboard
- **Balance Card**: 
  - Real-time balance display
  - Show/hide balance toggle
  - Card-style design with gradient
  - Account number display

- **Quick Actions**:
  - Send money (transfer)
  - Receive money (deposit)
  - Modal-based workflows

- **Recent Transactions**:
  - Last 5 transactions
  - Credit/debit indicators
  - Type and status badges
  - Formatted dates

- **Quick Stats**:
  - Monthly summary
  - Transaction count
  - Account details

### Transaction System
- **Types**:
  - Deposit: Add funds to account
  - Withdrawal: Remove funds from account
  - Transfer: Send to another account
  - Adjustment: Admin balance changes

- **Validation**:
  - Positive amounts only
  - Sufficient balance checks
  - Account existence verification
  - Concurrent transaction handling

- **Real-time Updates**:
  - Instant balance updates
  - Live transaction feed
  - Automatic UI refresh

### Admin God Mode
- **User Management**:
  - View all users in table
  - Search by name/email/account
  - Edit any user profile
  - Change roles and status
  - Delete users

- **Balance Control**:
  - Add funds to any account
  - Subtract funds from any account
  - Adjustment logging
  - Balance change history

- **System Analytics**:
  - Total users count
  - Active vs suspended
  - Total system balance
  - Transaction volume
  - Average balance

- **Activity Monitoring**:
  - Real-time action log
  - Admin name tracking
  - Target user tracking
  - Timestamp recording

## 🎨 UI/UX Features

### Animations
- Page transitions (fade, slide)
- Card hover effects
- Button interactions
- Modal entry/exit
- Staggered list items

### Responsive Design
- Mobile-first approach
- Tablet breakpoints
- Desktop optimization
- Touch-friendly controls

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast

### User Feedback
- Success messages
- Error notifications
- Loading states
- Empty states
- Confirmation dialogs

## 🔄 Data Flow

### User Transaction Flow
```
User Action
    ↓
Modal Form
    ↓
Validation
    ↓
Convex Mutation
    ↓
Database Update
    ↓
Real-time Sync
    ↓
UI Update
```

### Admin Action Flow
```
Admin Edit
    ↓
Permission Check
    ↓
Mutation Call
    ↓
Database Update
    ↓
Action Logging
    ↓
Real-time Sync
    ↓
UI Refresh
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Wide**: > 1280px

## 🚀 Performance

### Optimization Strategies
- Server-side rendering (Next.js)
- Real-time subscriptions (Convex)
- Optimistic UI updates
- Lazy loading
- Code splitting
- Image optimization

### Loading States
- Skeleton screens
- Spinners for async operations
- Progress indicators
- Shimmer effects

## 🧪 Testing Recommendations

### Unit Tests
- Component rendering
- Form validation
- Utility functions
- State management

### Integration Tests
- Authentication flow
- Transaction creation
- Admin operations
- API endpoints

### E2E Tests
- User signup/login
- Send/receive money
- Admin CRUD operations
- Navigation flows

## 🔮 Future Enhancements

### Phase 2
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Transaction receipts
- [ ] Export to PDF/CSV
- [ ] Multi-currency support

### Phase 3
- [ ] 2FA authentication
- [ ] Bill payments
- [ ] Savings goals
- [ ] Spending insights
- [ ] Budget tracking

### Phase 4
- [ ] Mobile apps (React Native)
- [ ] API webhooks
- [ ] Third-party integrations
- [ ] Advanced analytics
- [ ] ML-based fraud detection

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Patterns](https://reactpatterns.com)
