"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { LoginView } from "@/components/auth/login-view";
import { Toaster } from "sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isDemoMode } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Loading Loan-LMS Console...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isDemoMode) {
    return (
      <>
        <LoginView />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Navbar />
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
