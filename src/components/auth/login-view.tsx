"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  Banknote,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Server,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export function LoginView() {
  const { login, toggleDemoMode, isLoading } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  const handleQuickDemo = () => {
    toggleDemoMode(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 py-12">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden relative z-10">
        {/* Left Side: Brand & Feature Presentation */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/40 border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Banknote className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Loan-LMS</h1>
                <p className="text-xs text-blue-300">Enterprise Loan Management System</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight">
                Modern Credit Lifecycle & Amortization Suite
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamless end-to-end management for microfinance: loan product modeling, automated risk scoring, multi-tier approvals, disbursement, and daily collections.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>Secured with JWT OAuth2 & Role-Based Access Control</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <span>Real-time Repayments & Amortization Scheduling</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Server className="h-3.5 w-3.5" />
                </div>
                <span>Live backend API: <code className="text-blue-300 font-mono">loan.cavkim.tech</code></span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>v2.4.0 Production Build</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Service
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">System Sign In</h3>
            <p className="text-xs text-slate-400">
              Enter credentials or launch the interactive preview demo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername("admin");
                  setPassword("password");
                }}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer"
              >
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername("officer");
                  setPassword("password");
                }}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer"
              >
                Fill Officer
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername("cashier");
                  setPassword("password");
                }}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 cursor-pointer"
              >
                Fill Cashier
              </button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or loan_officer"
                  className="pl-9 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-300">Password</Label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 h-10"
                />
              </div>
            </div>

            <AnimatedButton
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm mt-2 shadow-lg shadow-blue-600/30"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Console"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </form>

          {/* Quick Demo Access Option */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-xs text-slate-400 mb-2 font-medium">
              Want to test without login?
            </div>
            <button
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-medium transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Explore with Demo Mode</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-400 text-[11px]">
                <span>Launch preview</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
