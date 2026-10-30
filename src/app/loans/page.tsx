"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import {
  PaginatedLoanScheduleResponse,
  LoanScheduleItemResponse,
  LoanScheduleDetailResponse,
  RepaymentRequest,
  SchedulePaymentItemResponse,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseProgressBar } from "@/components/ui/base-progress";
import { InfoTooltip } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Banknote,
  Search,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Receipt,
  User,
  Building,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LoansPage() {
  const [schedules, setSchedules] = useState<LoanScheduleItemResponse[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<number>(8001);
  const [scheduleDetail, setScheduleDetail] = useState<LoanScheduleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Repayment Dialog
  const [isRepayOpen, setIsRepayOpen] = useState(false);
  const [repayForm, setRepayForm] = useState<RepaymentRequest>({
    loanId: 8001,
    scheduleId: 901,
    paymentMethod: "BANK_TRANSFER",
    totalAmount: 1085.5,
    paidAt: new Date().toISOString(),
    bankReference: "ABA-TRX-" + Math.floor(100000 + Math.random() * 900000),
    notes: "Monthly installment amortization settlement",
  });

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getSchedules();
      setSchedules(res.items || []);
      if (res.items?.length > 0 && !selectedLoanId) {
        setSelectedLoanId(res.items[0].loanId);
      }
    } catch (err: any) {
      toast.error("Failed to load loan schedules", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loadScheduleDetail = async (loanId: number) => {
    try {
      const detail = await api.loans.getScheduleDetail(loanId);
      setScheduleDetail(detail);
      setRepayForm((prev) => ({
        ...prev,
        loanId: detail.loanId,
        scheduleId: detail.scheduleId,
        totalAmount: detail.installmentAmount,
      }));
    } catch (err: any) {
      console.warn("Could not load detail for loan", loanId, err);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    if (selectedLoanId) {
      loadScheduleDetail(selectedLoanId);
    }
  }, [selectedLoanId]);

  const handlePayInstallmentDirectly = async (payment: SchedulePaymentItemResponse) => {
    try {
      await api.loans.createRepayment({
        loanId: selectedLoanId,
        scheduleId: scheduleDetail?.scheduleId,
        paymentMethod: "BANK_TRANSFER",
        totalAmount: payment.totalDue,
        paidAt: new Date().toISOString(),
        bankReference: "QR-" + Math.floor(100000 + Math.random() * 900000),
        notes: `Installment #${payment.installmentNumber} direct settlement`,
      });
      toast.success("Installment Paid", {
        description: `Installment #${payment.installmentNumber} (${formatCurrency(payment.totalDue)}) recorded successfully.`,
      });
      loadScheduleDetail(selectedLoanId);
      loadSchedules();
    } catch (err: any) {
      toast.error("Payment failed", { description: err.message });
    }
  };

  const handleRecordRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.loans.createRepayment(repayForm);
      toast.success("Repayment Processed", {
        description: `Collected ${formatCurrency(repayForm.totalAmount)} for Loan #${repayForm.loanId}`,
      });
      setIsRepayOpen(false);
      loadScheduleDetail(selectedLoanId);
      loadSchedules();
    } catch (err: any) {
      toast.error("Failed to process repayment", { description: err.message });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Amortization Schedules & Repayments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Inspect installment breakdowns, principal/interest allocation, and record borrower collections.
            </p>
          </div>
          <AnimatedButton
            variant="emerald"
            onClick={() => setIsRepayOpen(true)}
            className="gap-2 text-xs shadow-md shadow-emerald-500/20"
          >
            <CreditCard className="h-4 w-4" />
            Post Repayment
          </AnimatedButton>
        </div>

        {/* Active Loan Facilities Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((item, idx) => {
            const isSelected = item.loanId === selectedLoanId;
            return (
              <motion.div
                key={item.loanId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedLoanId(item.loanId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    {item.loanNumber}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">
                  {item.customerName || `Loan #${item.loanId}`}
                </div>

                {/* Base UI Progress bar */}
                <div className="mt-3">
                  <BaseProgressBar
                    value={item.progressPercentage}
                    label={`Installments: ${item.paidSchedules} of ${item.totalSchedules}`}
                    indicatorClassName={item.progressPercentage >= 80 ? "bg-emerald-500" : "bg-blue-600"}
                  />
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400">Remaining Bal:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.totalRemainingAmount)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Loan Amortization Schedule Detail Table */}
        {scheduleDetail && (
          <Card className="border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">
                    Schedule: {scheduleDetail.loanNumber}
                  </CardTitle>
                  <Badge variant="info">{scheduleDetail.repaymentFrequency}</Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Borrower: <strong>{scheduleDetail.customerName}</strong> ({scheduleDetail.customerPhone}) • Officer: {scheduleDetail.employeeName}
                </CardDescription>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400">Monthly Installment</span>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(scheduleDetail.installmentAmount)}
                  </div>
                </div>
                <div className="text-right pl-4 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Total Collected</span>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(scheduleDetail.totalPaidAmount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Installment #</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Principal Due</th>
                    <th className="py-3 px-4">Interest Due</th>
                    <th className="py-3 px-4">Total Installment</th>
                    <th className="py-3 px-4">Paid Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scheduleDetail.payments?.map((payment, idx) => {
                    const isPaid = payment.paymentStatus === "PAID";
                    return (
                      <motion.tr
                        key={payment.paymentId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                          isPaid ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold">
                          #{payment.installmentNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {formatDate(payment.dueDate)}
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                          {formatCurrency(payment.principalDue)}
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                          {formatCurrency(payment.interestDue)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(payment.totalDue)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(payment.amountPaid)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={payment.paymentStatus} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isPaid ? (
                            <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Settled
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="emerald"
                              onClick={() => handlePayInstallmentDirectly(payment)}
                              className="h-7 text-xs px-2.5"
                            >
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* --- Record Repayment Dialog --- */}
      <Dialog open={isRepayOpen} onOpenChange={setIsRepayOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Post Loan Repayment</DialogTitle>
            <DialogDescription>
              Record installment settlement, reconciliation reference, and transaction ledger details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecordRepayment} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Loan ID</Label>
              <Input
                type="number"
                required
                value={repayForm.loanId}
                onChange={(e) => setRepayForm((p) => ({ ...p, loanId: Number(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Repayment Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={repayForm.totalAmount}
                  onChange={(e) => setRepayForm((p) => ({ ...p, totalAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Channel</Label>
                <Select
                  value={repayForm.paymentMethod}
                  onValueChange={(val) => setRepayForm((p) => ({ ...p, paymentMethod: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer (ABA/Wing)</SelectItem>
                    <SelectItem value="CASH">Cash Over-the-Counter</SelectItem>
                    <SelectItem value="MOBILE_BANKING">Mobile Banking QR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Bank Reference / Transfer Receipt #</Label>
              <Input
                value={repayForm.bankReference || ""}
                onChange={(e) => setRepayForm((p) => ({ ...p, bankReference: e.target.value }))}
                placeholder="ABA-TRX-948210"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Officer Settlement Notes</Label>
              <Input
                value={repayForm.notes || ""}
                onChange={(e) => setRepayForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Received installment in full"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRepayOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="emerald">
                Execute Repayment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
