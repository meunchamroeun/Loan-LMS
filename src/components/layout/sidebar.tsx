"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Layers,
  Banknote,
  CalendarCheck2,
  BarChart3,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
    badge: "Active",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    badge: null,
  },
  {
    name: "Loan Products",
    href: "/products",
    icon: Layers,
    badge: null,
  },
  {
    name: "Schedules & Repayments",
    href: "/loans",
    icon: Banknote,
    badge: null,
  },
  {
    name: "Daily Collections",
    href: "/collections",
    icon: CalendarCheck2,
    badge: null,
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
    badge: null,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout, isDemoMode } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md h-screen sticky top-0 shrink-0",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Banknote className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Loan-LMS
            </span>
            <Badge
              variant={isDemoMode ? "warning" : "success"}
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {isDemoMode ? "DEMO" : "LIVE"}
            </Badge>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Microfinance & Credit Suite
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && !isActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-4 w-4 opacity-75" />}
            </Link>
          );
        })}
      </nav>

      {/* API status badge */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            API Gateway
          </span>
          <span className="ml-auto text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
            200 OK
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          loan.cavkim.tech
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.firstName?.[0] || user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username : "Guest Admin"}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.role || "Loan Officer"}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
