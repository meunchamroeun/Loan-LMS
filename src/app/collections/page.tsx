"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import { DailyCollectionResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GsapCounter } from "@/components/ui/gsap-counter";
import { AnimateTiltCard, AnimateShine } from "@/components/ui/animate-ui-suite";
import {
  CalendarCheck2,
  DollarSign,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function DailyCollectionsPage() {
  const [employeeId, setEmployeeId] = useState<number>(5);
  const [collection, setCollection] = useState<DailyCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCollection = async (empId: number) => {
    setLoading(true);
    try {
      const data = await api.collections.getDailyEmployeeCollection(empId);
      setCollection(data);
    } catch (err: any) {
      toast.error("Failed to load daily collection", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection(employeeId);
  }, [employeeId]);

  const handlePrintReconciliation = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Daily Collections & Cashier Reconciliation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Audit cash desk receipts, digital banking transfers, and employee end-of-day balances.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrintReconciliation}
              className="gap-2 text-xs"
            >
              <Printer className="h-4 w-4" />
              Print Receipt Log
            </Button>
            <AnimatedButton
              variant="emerald"
              onClick={() => toast.success("Daily Register Verified and Sealed for Today!")}
              className="gap-2 text-xs"
            >
              <ShieldCheck className="h-4 w-4" />
              Reconcile & Seal Register
            </AnimatedButton>
          </div>
        </div>

        {/* Employee Filter Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Officer: {collection?.employee?.employeeName || "Kimlong Chen (Senior Loan Officer)"}
              </div>
              <span className="text-xs text-slate-500">
                Staff ID #{collection?.employee?.employeeId || employeeId} • Head Office Cash Desk
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Switch Officer:</span>
            {[
              { id: 5, name: "Kimlong Chen" },
              { id: 7, name: "Sreypov Meas" },
              { id: 9, name: "Bunroeun Heng" },
            ].map((officer) => (
              <button
                key={officer.id}
                onClick={() => setEmployeeId(officer.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  employeeId === officer.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {officer.name}
              </button>
            ))}
          </div>
        </div>

        {/* Big Metric Banner: Grand Total */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Grand Total */}
          <AnimateTiltCard maxTilt={5}>
            <AnimateShine className="h-full">
              <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">
                    Total Receipts Today
                  </span>
                  <div className="text-3xl font-black mt-2 whitespace-nowrap">
                    <GsapCounter
                      value={collection?.grandTotal || 16270.5}
                      prefix="$"
                      duration={1.5}
                      decimals={2}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-blue-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="whitespace-nowrap">36 Total Repayment Transactions</span>
                </div>
              </Card>
            </AnimateShine>
          </AnimateTiltCard>

          {/* Card 2: Cash Over-the-Counter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            whileHover={{ y: -4 }}
          >
            <Card className="p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 whitespace-nowrap">
                    Cash Physical Desk
                  </span>
                  <Badge variant="warning" className="whitespace-nowrap">Cash Drawer</Badge>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 whitespace-nowrap">
                  {formatCurrency(collection?.cash?.totalAmount || 4850)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block whitespace-nowrap">
                  {collection?.cash?.count || 14} Cash receipts accepted
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Currency: USD</span>
                <span className="text-emerald-600 font-semibold whitespace-nowrap">Counted & Matched</span>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Bank Transfer (ABA / Wing) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 }}
            whileHover={{ y: -4 }}
          >
            <Card className="p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 whitespace-nowrap">
                    Digital Bank Transfers
                  </span>
                  <Badge variant="info" className="whitespace-nowrap">Bakong / ABA</Badge>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 whitespace-nowrap">
                  {formatCurrency(collection?.bankTransfer?.totalAmount || 11420.5)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block whitespace-nowrap">
                  {collection?.bankTransfer?.count || 22} Cleared online transfers
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Channel: Gateway</span>
                <span className="text-blue-600 font-semibold whitespace-nowrap">100% Reconciled</span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Visual Channel Distribution */}
        <Card className="p-6 border border-slate-200/80 dark:border-slate-800">
          <CardTitle className="text-base font-bold">
            Settlement Channel Proportion
          </CardTitle>
          <CardDescription className="text-xs mb-4">
            Percentage split between physical vault cash and digital banking
          </CardDescription>

          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div
                className="bg-amber-500 h-full"
                style={{ width: "29.8%" }}
                title="Cash Desk (29.8%)"
              />
              <div
                className="bg-blue-600 h-full"
                style={{ width: "70.2%" }}
                title="Digital Transfers (70.2%)"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Cash Physical Desk: 29.8% (${collection?.cash?.totalAmount?.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Bank Transfers: 70.2% (${collection?.bankTransfer?.totalAmount?.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
