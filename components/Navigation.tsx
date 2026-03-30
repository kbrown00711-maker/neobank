"use client";

import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, History, User, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  adminOnly?: boolean;
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("neobank_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("neobank_user");
    router.push("/");
  };

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <History className="w-5 h-5" />, label: "Transactions", href: "/transactions" },
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
    { icon: <Shield className="w-5 h-5" />, label: "Admin", href: "/admin", adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-bold cursor-pointer"
            >
              NeoBank
            </motion.div>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-muted hover:text-primary hover:bg-secondary"
                }`}
              >
                {item.icon}
                <span className="hidden md:inline font-medium">{item.label}</span>
              </Link>
            ))}

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-muted" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
