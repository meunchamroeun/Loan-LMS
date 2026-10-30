"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Sidebar, MobileSidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { BottomNav } from "./bottom-nav";
import { LoginView } from "@/components/auth/login-view";
import { AppLoader } from "@/components/ui/app-loader";
import { Toaster } from "sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isDemoMode } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <AppLoader label="Initializing Loan-LMS" />;
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
    <div
      suppressHydrationWarning
      className="flex h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased"
    >
      {/* Desktop Persistent Sidebar (Permanently anchored on left, NEVER scrolls with page) */}
      <Sidebar />

      {/* Mobile Slide-Over Navigation Drawer */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Responsive Navbar (Permanently anchored at top, NEVER scrolls away) */}
        <Navbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

        {/* ONLY the main content area scrolls vertically! */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto overflow-x-hidden w-full pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile PWA Bottom Navigation Bar */}
        <BottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
