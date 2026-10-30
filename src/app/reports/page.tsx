"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import { LoanReportResponse, PaymentReportResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonTableRows } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  Download,
  Search,
  Filter,
  Printer,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ReportsPage() {
  const [loans, setLoans] = useState<LoanReportResponse[]>([]);
  const [payments, setPayments] = useState<PaymentReportResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [loanSearch, setLoanSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");

  const loadReports = async () => {
    setLoading(true);
    try {
      const [loansData, paymentsData] = await Promise.all([
        api.reports.getLoans(),
        api.reports.getPayments(),
      ]);
      setLoans(loansData);
      setPayments(paymentsData);
    } catch (err: any) {
      toast.error("Failed to load reports", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const exportLoansCSV = () => {
    const headers = "Loan Number,Customer Name,Approved Amount,Outstanding Balance,Status,Start Date,End Date\n";
    const rows = loans
      .map(
        (l) =>
          `"${l.loanNumber}","${l.customerName}",${l.approvedAmount},${l.outstandingBalance},"${l.loanStatus}","${l.startDate}","${l.endDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `loans_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Loans Report Exported to CSV");
  };

  const exportPaymentsCSV = () => {
    const headers = "Payment ID,Loan Number,Due Date,Amount Due,Amount Paid,Status,Payment Date\n";
    const rows = payments
      .map(
        (p) =>
          `"${p.paymentId}","${p.loanNumber}","${p.dueDate}",${p.amountDue},${p.amountPaid},"${p.paymentStatus}","${p.paymentDate || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payments_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payments Report Exported to CSV");
  };

  const filteredLoans = loans.filter(
    (l) =>
      l.loanNumber.toLowerCase().includes(loanSearch.toLowerCase()) ||
      l.customerName.toLowerCase().includes(loanSearch.toLowerCase())
  );

  const filteredPayments = payments.filter((p) =>
    p.loanNumber.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Financial Reports & Auditing
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate regulatory portfolio reports, export audit CSV sheets, and inspect cash flows.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2 text-xs"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Tabs for Loans Report vs Payments Report */}
        <Tabs defaultValue="loans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <TabsList className="text-xs">
              <TabsTrigger value="loans">Loan Portfolio Report</TabsTrigger>
              <TabsTrigger value="payments">Repayments Inflow Report</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Loans Report */}
          <TabsContent value="loans" className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Loan # or Customer..."
                  value={loanSearch}
                  onChange={(e) => setLoanSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <AnimatedButton
                onClick={exportLoansCSV}
                className="gap-2 text-xs whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                Export Loans CSV
              </AnimatedButton>
            </div>

            <Card className="border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[780px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">Loan Number</th>
                      <th className="py-3 px-4 whitespace-nowrap">Customer Name</th>
                      <th className="py-3 px-4 whitespace-nowrap">Approved Amount</th>
                      <th className="py-3 px-4 whitespace-nowrap">Outstanding Balance</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 whitespace-nowrap">Start Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">Maturity Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                      <SkeletonTableRows rows={6} columns={7} />
                    ) : (
                      filteredLoans.map((loan, idx) => (
                        <motion.tr
                          key={loan.loanId}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {loan.loanNumber}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {loan.customerName}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(loan.approvedAmount)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {formatCurrency(loan.outstandingBalance)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge status={loan.loanStatus} />
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(loan.startDate)}</td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(loan.endDate)}</td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: Payments Report */}
          <TabsContent value="payments" className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Loan #..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <AnimatedButton
                onClick={exportPaymentsCSV}
                className="gap-2 text-xs whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                Export Payments CSV
              </AnimatedButton>
            </div>

            <Card className="border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">Payment ID</th>
                      <th className="py-3 px-4 whitespace-nowrap">Loan Number</th>
                      <th className="py-3 px-4 whitespace-nowrap">Due Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">Amount Due</th>
                      <th className="py-3 px-4 whitespace-nowrap">Amount Paid</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 whitespace-nowrap">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                      <SkeletonTableRows rows={6} columns={7} />
                    ) : (
                      filteredPayments.map((p, idx) => {
                        const isPaid = p.paymentStatus === "PAID";
                        return (
                          <motion.tr
                            key={p.paymentId}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.03 }}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                              #{p.paymentId}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                              {p.loanNumber}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {formatDate(p.dueDate)}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                              {formatCurrency(p.amountDue)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              {formatCurrency(p.amountPaid)}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <StatusBadge status={p.paymentStatus} />
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                              {formatDate(p.paymentDate) || "-"}
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
