"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface EditModalProps {
  user: any;
  onClose: () => void;
  onUpdate: () => void;
  adminId: string;
}

function EditUserModal({ user, onClose, onUpdate, adminId }: EditModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [accountNumber, setAccountNumber] = useState(user.accountNumber || "");
  const [balanceAdjustment, setBalanceAdjustment] = useState("");
  const [adjustmentDescription, setAdjustmentDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const adminUpdateUser = useMutation(api.admin.adminUpdateUser);
  const adminAdjustBalance = useMutation(api.admin.adminAdjustBalance);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await adminUpdateUser({
        adminId: adminId as Id<"users">,
        targetUserId: user.id,
        name,
        email,
        role,
        status,
        accountNumber,
      });

      if (balanceAdjustment && parseFloat(balanceAdjustment) !== 0) {
        await adminAdjustBalance({
          adminId: adminId as Id<"users">,
          targetUserId: user.id,
          amount: parseFloat(balanceAdjustment),
          description: adjustmentDescription || "Admin balance adjustment",
        });
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-display font-bold mb-6">Edit User: {user.name}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-medium mb-4">Balance Adjustment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (use + or - to add/subtract)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={balanceAdjustment}
                  onChange={(e) => setBalanceAdjustment(e.target.value)}
                  className="input-field"
                  placeholder="e.g., +100 or -50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={adjustmentDescription}
                  onChange={(e) => setAdjustmentDescription(e.target.value)}
                  className="input-field"
                  placeholder="Reason for adjustment"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleUpdate} disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [processingTransferId, setProcessingTransferId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("neobank_user");
    if (!storedUser) {
      router.push("/auth");
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setUser(userData);
  }, [router]);

  const allUsers = useQuery(
    api.admin.getAllUsers,
    user ? { adminId: user.userId as Id<"users"> } : "skip"
  );

  const analytics = useQuery(
    api.admin.getAnalytics,
    user ? { adminId: user.userId as Id<"users"> } : "skip"
  );

  const adminActions = useQuery(
    api.admin.getAdminActions,
    user ? { adminId: user.userId as Id<"users">, limit: 10 } : "skip"
  );

  const pendingTransfers = useQuery(
    api.admin.getPendingTransfers,
    user ? { adminId: user.userId as Id<"users"> } : "skip"
  );

  const approveTransfer = useMutation(api.admin.approveTransfer);

  const deleteUser = useMutation(api.admin.adminDeleteUser);

  const filteredUsers = allUsers?.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.accountNumber.includes(searchQuery)
  );

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteUser({
        adminId: user.userId as Id<"users">,
        targetUserId: userId as Id<"users">,
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleApproveTransfer = async (transactionId: string) => {
    setProcessingTransferId(transactionId);
    try {
      await approveTransfer({
        adminId: user.userId as Id<"users">,
        transactionId: transactionId as Id<"transactions">,
        approve: true,
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Approve failed:", error);
      alert("Failed to approve transfer: " + (error as any).message);
    } finally {
      setProcessingTransferId(null);
    }
  };

  const handleRejectTransfer = async (transactionId: string) => {
    if (!confirm("Are you sure you want to reject this transfer? The funds will be refunded to the sender.")) {
      return;
    }
    setProcessingTransferId(transactionId);
    try {
      await approveTransfer({
        adminId: user.userId as Id<"users">,
        transactionId: transactionId as Id<"transactions">,
        approve: false,
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject transfer: " + (error as any).message);
    } finally {
      setProcessingTransferId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <Navigation />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted text-lg">Full control over users and system analytics</p>
          </motion.div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  label: "Total Users",
                  value: analytics.totalUsers,
                  color: "accent",
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  label: "Active Users",
                  value: analytics.activeUsers,
                  color: "green",
                },
                {
                  icon: <DollarSign className="w-6 h-6" />,
                  label: "Total Balance",
                  value: `$${analytics.totalBalance.toLocaleString()}`,
                  color: "blue",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  label: "Transactions",
                  value: analytics.totalTransactions,
                  color: "purple",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pending Transfers Section */}
          {pendingTransfers && pendingTransfers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Pending Transfers</h2>
                    <p className="text-sm text-muted">{pendingTransfers.length} transfer(s) awaiting approval</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingTransfers.map((transfer) => (
                    <div
                      key={transfer._id}
                      className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium mb-2">{transfer.description}</div>
                        <div className="text-sm text-muted space-y-1">
                          <div>Amount: <span className="font-bold text-yellow-600">${transfer.amount.toFixed(2)}</span></div>
                          <div>To Account: <span className="font-mono">{transfer.recipientAccountNumber}</span></div>
                          <div>Requested: {new Date(transfer.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRejectTransfer(transfer._id)}
                          disabled={processingTransferId === transfer._id}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {processingTransferId === transfer._id ? "Processing..." : "Reject"}
                        </button>
                        <button
                          onClick={() => handleApproveTransfer(transfer._id)}
                          disabled={processingTransferId === transfer._id}
                          className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {processingTransferId === transfer._id ? "Processing..." : "Approve"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Users Table */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Users Table */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">All Users</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 rounded-full border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Account</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Balance</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((u) => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{u.name}</div>
                              <div className="text-sm text-muted">{u.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-mono">{u.accountNumber}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold">${u.balance.toFixed(2)}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.role === "admin" 
                                ? "bg-accent/10 text-accent" 
                                : "bg-secondary text-muted"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.status === "active" 
                                ? "bg-green-50 text-green-600" 
                                : "bg-red-50 text-red-600"
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Activity Log */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {adminActions?.map((action) => (
                    <div
                      key={action.id}
                      className="p-3 bg-secondary/50 rounded-2xl text-sm"
                    >
                      <div className="font-medium mb-1">{action.action.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted">
                        By: {action.adminName} → {action.targetUserName}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {new Date(action.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={() => setRefreshKey((prev) => prev + 1)}
          adminId={user.userId}
        />
      )}
    </div>
  );
}
