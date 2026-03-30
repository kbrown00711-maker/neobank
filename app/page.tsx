"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/30 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold"
          >
            NeoBank
          </motion.div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-muted hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/auth" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Modern Banking Reimagined
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-display font-bold mb-6 tracking-tight">
              Banking
              <br />
              <span className="text-muted">Simplified</span>
            </h1>

            <p className="text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience seamless digital banking with real-time updates, 
              zero fees, and complete control over your finances.
            </p>

            <Link href="/auth" className="inline-flex items-center gap-2 btn-primary text-lg">
              Open Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="glass-card rounded-[2.5rem] p-8 max-w-4xl mx-auto shadow-2xl">
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-12 text-center">
                <div className="text-sm font-medium text-muted mb-2">Total Balance</div>
                <div className="text-6xl font-display font-bold mb-4">$12,430.50</div>
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div>
                    <div className="text-2xl font-bold text-green-600">+12.5%</div>
                    <div className="text-sm text-muted">This month</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-muted">Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Transfers",
                description: "Send and receive money in real-time with zero processing delays",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Bank-Level Security",
                description: "Your data is encrypted and protected with enterprise-grade security",
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Smart Insights",
                description: "Get intelligent spending insights and personalized recommendations",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:border-accent/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2.5rem] p-12 md:p-16"
          >
            <h2 className="text-5xl font-display font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted mb-8">
              Join thousands of users who trust NeoBank for their financial needs
            </p>
            <Link href="/auth" className="btn-primary text-lg inline-flex items-center gap-2">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-muted">
          <p>© 2024 NeoBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
