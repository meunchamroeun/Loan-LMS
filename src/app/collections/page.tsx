"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import { DailyCollectionResponse } from "@/types/api";
import { MOCK_DAILY_COLLECTION } from "@/lib/mock-data";
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
  Calendar,
  Layers,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function DailyCollectionsPage() {
  const [employeeId, setEmployeeId] = useState<number>(1);
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [collection, setCollection] = useState<DailyCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSampleMode, setIsSampleMode] = useState(false);

  const loadCollection = async (empId: number, dateStr: string) => {
    setLoading(true);
    try {
      if (isSampleMode) {
        setCollection(MOCK_DAILY_COLLECTION);
      } else {
        const data = await api.collections.getDailyEmployeeCollection(empId, dateStr);
        setCollection(data);
      }
    } catch (err: any) {
      toast.error("Failed to load daily collection", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection(employeeId, targetDate);
  }, [employeeId, targetDate, isSampleMode]);

  const handlePrintReconciliation = () => {
    window.print();
  };

  const cashTotal = collection?.cash?.totalAmount ?? collection?.cash?.total ?? 0;
  const cashCount = collection?.cash?.count ?? collection?.cash?.transactionCount ?? 0;
  const bankTotal = collection?.bankTransfer?.totalAmount ?? collection?.bankTransfer?.total ?? 0;
  const bankCount = collection?.bankTransfer?.count ?? collection?.bankTransfer?.transactionCount ?? 0;
  const grandTotal = collection?.grandTotal ?? (cashTotal + bankTotal);
  const totalTransactions = cashCount + bankCount;

  const cashPct = grandTotal > 0 ? ((cashTotal / grandTotal) * 100).toFixed(1) : "0.0";
  const bankPct = grandTotal > 0 ? ((bankTotal / grandTotal) * 100).toFixed(1) : "0.0";

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
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSampleMode(!isSampleMode)}
              className="gap-1.5 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {isSampleMode ? "View Live Records" : "Preview Sample Audit Ledger"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintReconciliation}
              className="gap-2 text-xs"
            >
              <Printer className="h-4 w-4" />
              Print Log
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

        {/* Date & Officer Filter Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Officer: {collection?.employee?.employeeName || (employeeId === 1 ? "System Administrator" : `Officer #${employeeId}`)}
              </div>
              <span className="text-xs text-slate-500">
                Staff ID #{collection?.employee?.employeeId || employeeId} • Head Office Cash Desk
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Officer:</span>
              {[
                { id: 1, name: "Admin" },
                { id: 5, name: "Kimlong Chen" },
                { id: 7, name: "Sreypov Meas" },
              ].map((officer) => (
                <button
                  key={officer.id}
                  onClick={() => setEmployeeId(officer.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
        </div>

        {/* Big Metric Banner: Grand Total */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Grand Total */}
          <AnimateTiltCard maxTilt={5}>
            <AnimateShine className="h-full">
              <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">
                      Total Receipts Today
                    </span>
                    <Badge variant="outline" className="text-[10px] text-blue-100 border-blue-300/40">
                      {isSampleMode ? "Sample Demo" : "Live Backend"}
                    </Badge>
                  </div>
                  <div className="text-3xl font-black mt-2 whitespace-nowrap">
                    <GsapCounter
                      value={grandTotal}
                      prefix="$"
                      duration={1.2}
                      decimals={2}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-blue-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="whitespace-nowrap">{totalTransactions} Total Repayment Transactions</span>
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
                  {formatCurrency(cashTotal)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block whitespace-nowrap">
                  {cashCount} Cash receipts accepted
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Currency: USD</span>
                <span className="text-emerald-600 font-semibold whitespace-nowrap">
                  {cashTotal > 0 ? "Counted & Matched" : "No Cash Today"}
                </span>
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
                  {formatCurrency(bankTotal)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block whitespace-nowrap">
                  {bankCount} Cleared online transfers
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Channel: Gateway</span>
                <span className="text-blue-600 font-semibold whitespace-nowrap">
                  {bankTotal > 0 ? "100% Reconciled" : "No Transfers Today"}
                </span>
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
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${cashPct}%` }}
                title={`Cash Desk (${cashPct}%)`}
              />
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${bankPct}%` }}
                title={`Digital Transfers (${bankPct}%)`}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Cash Physical Desk: {cashPct}% ({formatCurrency(cashTotal)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Bank Transfers: {bankPct}% ({formatCurrency(bankTotal)})
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
