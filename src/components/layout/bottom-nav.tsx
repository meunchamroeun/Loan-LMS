"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Banknote,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface BottomNavProps {
  onOpenMenu: () => void;
}

const BOTTOM_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Loans & Repay",
    href: "/loans",
    icon: Banknote,
  },
];

export function BottomNav({ onOpenMenu }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 shadow-lg px-2 py-1.5 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {BOTTOM_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 select-none",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "scale-110" : ""
                  )}
                />
                {isActive && (
                  <motion.span
                    layoutId="bottomNavDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* More Menu Trigger (Opens Sidebar Drawer) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-all duration-200 cursor-pointer select-none"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] tracking-tight mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
}
