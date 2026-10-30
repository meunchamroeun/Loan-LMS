"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Moon,
  Sun,
  Laptop,
  Download,
  WifiOff,
  LogIn,
  Menu,
  Banknote,
  Building2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { usePWA } from "@/components/pwa/pwa-provider";
import { TechBadgeShowcase } from "@/components/ui/tech-badge-showcase";
import { MobileSidebar } from "./sidebar";
import { api } from "@/lib/api-client";
import { NotificationResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseToggleSwitch } from "@/components/ui/base-switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Navbar() {
  const { user, isDemoMode, toggleDemoMode, logout } = useAuth();
  const { isInstallable, installPwa, isOnline } = usePWA();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }

    const fetchNotifications = async () => {
      try {
        const notifs = await api.notifications.getAll();
        setNotifications(notifs);
      } catch {}
    };
    fetchNotifications();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    for (const n of notifications) {
      if (!n.isRead) {
        await api.notifications.markAsRead(n.notificationId);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-3 sm:px-6 border-b border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Banknote className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden xs:inline">
              Loan-LMS
            </span>
          </Link>
        </div>

        {/* Search Input (Desktop) */}
        <div className="relative w-64 max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search loans, customers, IDs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 text-slate-900 dark:text-slate-100 transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
          {/* Branch & FX Telemetry */}
          <Badge variant="outline" className="hidden xl:inline-flex items-center gap-1.5 text-[11px] h-7 px-2.5 font-medium border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <Building2 className="h-3 w-3 text-blue-500" />
            <span>HQ Branch #001</span>
          </Badge>
          <Badge variant="outline" className="hidden 2xl:inline-flex items-center gap-1.5 text-[11px] h-7 px-2.5 font-mono text-slate-500">
            <span>FX: $1 = 4,100 KHR</span>
          </Badge>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors shadow-xs"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Staff Sign In</span>
          </Link>

          <TechBadgeShowcase />

          {!isOnline && (
            <Badge variant="warning" className="gap-1 text-[11px] h-7 px-2.5">
              <WifiOff className="h-3 w-3" /> <span className="hidden sm:inline">Offline Mode</span>
            </Badge>
          )}

          {isInstallable && (
            <Button
              size="sm"
              onClick={installPwa}
              className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </Button>
          )}

          {/* Demo Mode Toggle (hidden on tiny screens to avoid overflow) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Demo Mode</span>
            <BaseToggleSwitch
              checked={isDemoMode}
              onCheckedChange={(checked) => toggleDemoMode(checked)}
            />
          </div>

        {/* Swagger Docs Link */}
        <a
          href="https://loan.cavkim.tech/webjars/swagger-ui/index.html"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Swagger API</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.notificationId}
                    className={`p-3 text-xs ${n.isRead ? "opacity-75" : "bg-blue-50/50 dark:bg-blue-950/20"}`}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {n.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.message}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.firstName?.[0] || user?.username?.[0]?.toUpperCase() || "A"}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username : "Administrator"}
                </span>
                <span className="text-xs text-slate-500 font-normal truncate">
                  {user?.email || "admin@loanlms.com"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer font-medium text-blue-600 dark:text-blue-400">
                <LogIn className="h-3.5 w-3.5 mr-2" />
                Login / Switch Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/customers" className="cursor-pointer">
                Manage Customers
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/reports" className="cursor-pointer">
                View Reports
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-rose-600 dark:text-rose-400 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    {/* Mobile Slide-Over Navigation Drawer */}
    <MobileSidebar
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
    />
  </>
  );
}
