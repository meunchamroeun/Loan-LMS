"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type LoanStatus =
  | "APPROVED"
  | "DISBURSED"
  | "UNDER_REVIEW"
  | "PENDING"
  | "SUBMITTED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "COMPLETED"
  | "PAID"
  | "OVERDUE"
  | "DRAFT"
  | string;

interface StatusConfig {
  label: string;
  dotColor: string;
  pillClass: string;
  animatePulse?: boolean;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  APPROVED: {
    label: "Approved",
    dotColor: "bg-emerald-500",
    pillClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  },
  DISBURSED: {
    label: "Disbursed",
    dotColor: "bg-blue-500",
    pillClass:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    dotColor: "bg-amber-500",
    animatePulse: true,
    pillClass:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  },
  SUBMITTED: {
    label: "Submitted",
    dotColor: "bg-indigo-500",
    animatePulse: true,
    pillClass:
      "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
  },
  PENDING: {
    label: "Pending",
    dotColor: "bg-sky-500",
    animatePulse: true,
    pillClass:
      "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
  },
  REJECTED: {
    label: "Rejected",
    dotColor: "bg-rose-500",
    pillClass:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  },
  ACTIVE: {
    label: "Active",
    dotColor: "bg-emerald-500",
    pillClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  },
  INACTIVE: {
    label: "Inactive",
    dotColor: "bg-slate-400",
    pillClass:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
  },
  PAID: {
    label: "Paid",
    dotColor: "bg-teal-500",
    pillClass:
      "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
  },
  COMPLETED: {
    label: "Completed",
    dotColor: "bg-teal-500",
    pillClass:
      "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
  },
  OVERDUE: {
    label: "Overdue",
    dotColor: "bg-rose-500",
    animatePulse: true,
    pillClass:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  },
  DRAFT: {
    label: "Draft",
    dotColor: "bg-slate-400",
    pillClass:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
  },
  ACTIVE_KYC: {
    label: "Active KYC",
    dotColor: "bg-emerald-500",
    pillClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  },
  VERIFIED: {
    label: "Verified",
    dotColor: "bg-emerald-500",
    pillClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  },
  UNVERIFIED: {
    label: "Unverified",
    dotColor: "bg-amber-500",
    pillClass:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  },
  SETTLED: {
    label: "Settled",
    dotColor: "bg-teal-500",
    pillClass:
      "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
  },
  DEFAULTED: {
    label: "Defaulted",
    dotColor: "bg-rose-600",
    pillClass:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  },
  CLOSED: {
    label: "Closed",
    dotColor: "bg-slate-400",
    pillClass:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: LoanStatus;
  className?: string;
}) {
  const normalizedKey = (status || "").toUpperCase().replace(/[\s-]/g, "_");
  const config = STATUS_CONFIG[normalizedKey] || {
    label: status
      ? status
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unknown",
    dotColor: "bg-slate-400",
    pillClass:
      "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors shadow-2xs select-none whitespace-nowrap shrink-0",
        config.pillClass,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          config.dotColor,
          config.animatePulse ? "animate-pulse" : ""
        )}
      />
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
}
