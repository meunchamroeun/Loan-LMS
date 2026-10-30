"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import {
  DashboardResponse,
  ApplicationResponse,
  LoanProductResponse,
  CustomerResponse,
  CreateApplicationRequest,
  CreateCustomerRequest,
  RepaymentRequest,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GsapCounter } from "@/components/ui/gsap-counter";
import { BaseLoanSlider } from "@/components/ui/base-slider";
import { BaseProgressBar } from "@/components/ui/base-progress";
import { BaseAccordionGroup } from "@/components/ui/base-accordion";
import { InfoTooltip } from "@/components/ui/tooltip";
import { TechBadgeShowcase } from "@/components/ui/tech-badge-showcase";
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
  TrendingUp,
  CreditCard,
  Users,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  DollarSign,
  FileText,
  HelpCircle,
  ShieldCheck,
  Layers,
  Info,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { motion } from "motion/react";

const MONTHLY_TREND_DATA = [
  { month: "May", disbursed: 850000, collected: 620000 },
  { month: "Jun", disbursed: 1100000, collected: 790000 },
  { month: "Jul", disbursed: 950000, collected: 810000 },
  { month: "Aug", disbursed: 1300000, collected: 940000 },
  { month: "Sep", disbursed: 1450000, collected: 1050000 },
  { month: "Oct", disbursed: 1600000, collected: 1180000 },
];

const PORTFOLIO_STATUS_DATA = [
  { name: "Active / Performing", value: 284, color: "#10b981" },
  { name: "Completed / Settled", value: 35, color: "#3b82f6" },
  { name: "Grace Period", value: 12, color: "#f59e0b" },
  { name: "Overdue / NPL", value: 7, color: "#f43f5e" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [products, setProducts] = useState<LoanProductResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Loan Calculator State
  const [calcAmount, setCalcAmount] = useState(12000);
  const [calcTerm, setCalcTerm] = useState(18);
  const [calcRate, setCalcRate] = useState(8.5);

  // Dialog States
  const [isAppDialogOpen, setIsAppDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);

  // Forms
  const [appForm, setAppForm] = useState<CreateApplicationRequest>({
    customerId: 101,
    loanProductId: 1,
    requestedAmount: 10000,
    requestedTermMonths: 12,
    loanPurpose: "Inventory acquisition and retail shop restocking",
  });

  const [customerForm, setCustomerForm] = useState<CreateCustomerRequest>({
    firstName: "",
    lastName: "",
    dateOfBirth: "1990-01-01",
    gender: "MALE",
    phoneNumber: "+855 ",
    email: "",
    nationalId: "KH-",
    address: "Phnom Penh",
  });

  const [repaymentForm, setRepaymentForm] = useState<RepaymentRequest>({
    loanId: 8001,
    paymentMethod: "BANK_TRANSFER",
    totalAmount: 1085.5,
    paidAt: new Date().toISOString(),
    bankReference: "ABA-TRX-" + Math.floor(100000 + Math.random() * 900000),
    notes: "Regular scheduled monthly installment payment",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashData, appsData, prodsData, custData] = await Promise.all([
          api.reports.getDashboard(),
          api.applications.getAll(),
          api.loanProducts.getAll(),
          api.customers.getAll(),
        ]);
        setStats(dashData);
        setApplications(appsData);
        setProducts(prodsData);
        setCustomers(custData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Loan calculation logic
  const monthlyRate = calcRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (calcAmount * (monthlyRate * Math.pow(1 + monthlyRate, calcTerm))) /
        (Math.pow(1 + monthlyRate, calcTerm) - 1)
      : calcAmount / calcTerm;
  const totalPayable = monthlyPayment * calcTerm;
  const totalInterest = totalPayable - calcAmount;

  // Handlers
  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.applications.create(appForm);
      toast.success("Loan application created successfully", {
        description: `Application #${created.applicationNumber || "APP-NEW"} is now recorded.`,
      });
      setIsAppDialogOpen(false);
      const updatedApps = await api.applications.getAll();
      setApplications(updatedApps);
    } catch (err: any) {
      toast.error("Failed to submit application", { description: err.message });
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.customers.create(customerForm);
      toast.success("Customer registered", {
        description: `${created.firstName || customerForm.firstName} ${created.lastName || customerForm.lastName} has been added.`,
      });
      setIsCustomerDialogOpen(false);
      const updatedCust = await api.customers.getAll();
      setCustomers(updatedCust);
    } catch (err: any) {
      toast.error("Failed to register customer", { description: err.message });
    }
  };

  const handleRecordRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.loans.createRepayment(repaymentForm);
      toast.success("Payment recorded", {
        description: `Successfully collected ${formatCurrency(repaymentForm.totalAmount)} for Loan #${repaymentForm.loanId}`,
      });
      setIsRepaymentDialogOpen(false);
      const dashData = await api.reports.getDashboard();
      setStats(dashData);
    } catch (err: any) {
      toast.error("Repayment processing failed", { description: err.message });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Credit Overview & Operations
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time portfolio metrics, live amortization schedule tracking, and branch dispatches.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setIsCustomerDialogOpen(true)}
              className="gap-2 text-xs"
            >
              <Users className="h-4 w-4" />
              New Customer
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsRepaymentDialogOpen(true)}
              className="gap-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 border-emerald-200 dark:border-emerald-800"
            >
              <CreditCard className="h-4 w-4" />
              Record Repayment
            </Button>
            <AnimatedButton
              onClick={() => setIsAppDialogOpen(true)}
              className="gap-2 text-xs shadow-md shadow-blue-500/20"
            >
              <PlusCircle className="h-4 w-4" />
              New Application
            </AnimatedButton>
          </div>
        </div>

        {/* 4 Metric KPI Cards with GSAP Counters, Motion Hover & Radix Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Disbursed */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Disbursed
                  </span>
                  <InfoTooltip content="Cumulative principal amount issued to active verified borrowers.">
                    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </InfoTooltip>
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <GsapCounter
                    value={stats?.totalDisbursed || 14500000}
                    prefix="$"
                    duration={1.5}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="font-medium">+14.2%</span>
                  <span className="text-slate-400">vs last quarter</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Total Collected */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Collected
                  </span>
                  <InfoTooltip content="Gross principal + interest repayments collected via bank transfers and cash drawers.">
                    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </InfoTooltip>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <GsapCounter
                    value={stats?.totalCollected || 9820450}
                    prefix="$"
                    duration={1.5}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="font-medium">96.8%</span>
                  <span className="text-slate-400">collection efficiency</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Active Loans */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Active Loans
                  </span>
                  <InfoTooltip content="Total credit facilities actively undergoing scheduled monthly installments.">
                    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </InfoTooltip>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <GsapCounter
                    value={stats?.activeLoans || 284}
                    duration={1.2}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Total files: {stats?.totalLoans || 326}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{stats?.completedLoans || 35} completed</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Overdue Installments */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Overdue / Delinquent
                  </span>
                  <InfoTooltip content="Portfolio-at-Risk (PAR 30) - Installments unpaid past grace period.">
                    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </InfoTooltip>
                </div>
                <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  <GsapCounter
                    value={stats?.overduePayments || 19}
                    duration={1.2}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-500">
                  <span className="font-medium">2.1%</span>
                  <span className="text-slate-400">portfolio at risk (PAR 30)</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section: Area Trend & Portfolio Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart: Disbursements vs Collections */}
          <Card className="lg:col-span-2 p-6 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <CardTitle className="text-base font-bold">
                  Disbursements vs Repayments Trend
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly liquidity flow across active micro-credit branches
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span>Disbursed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Collected</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="disbursedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderRadius: "12px",
                        border: "1px solid rgba(51, 65, 85, 0.5)",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="disbursed"
                      name="Disbursed"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#disbursedGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      name="Collected"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#collectedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-xl bg-slate-100/50 dark:bg-slate-800/40 animate-pulse flex items-center justify-center text-xs text-slate-400">
                  Initializing liquidity chart...
                </div>
              )}
            </div>
          </Card>

          {/* Donut Chart: Portfolio Health */}
          <Card className="p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                Portfolio Health Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Active risk profile distribution
              </CardDescription>

              <div className="h-52 w-full mt-2 relative flex items-center justify-center">
                {isMounted ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PORTFOLIO_STATUS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {PORTFOLIO_STATUS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            borderRadius: "8px",
                            border: "1px solid #334155",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">96.8%</span>
                      <span className="text-[10px] text-slate-400">Health</span>
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full rounded-xl bg-slate-100/50 dark:bg-slate-800/40 animate-pulse flex items-center justify-center text-xs text-slate-400">
                    Loading portfolio...
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {PORTFOLIO_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Interactive Loan Amortization Estimator using Base UI Slider */}
        <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Interactive Loan Amortization Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Dynamic installment modeling, interest calculation, and debt service ratios
              </CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Sliders (2 cols) */}
            <div className="md:col-span-2 space-y-6">
              {/* Amount Slider */}
              <BaseLoanSlider
                label="Requested Loan Amount"
                value={calcAmount}
                min={1000}
                max={50000}
                step={500}
                formatValue={(v) => formatCurrency(v)}
                onValueChange={(v) => setCalcAmount(v)}
              />

              {/* Term Slider */}
              <BaseLoanSlider
                label="Tenure / Duration"
                value={calcTerm}
                min={3}
                max={36}
                step={1}
                formatValue={(v) => `${v} Months`}
                onValueChange={(v) => setCalcTerm(v)}
              />

              {/* Interest Rate Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Select Loan Product Benchmark:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Agri (6.8%)", rate: 6.8 },
                    { label: "SME (7.2%)", rate: 7.2 },
                    { label: "Micro (8.5%)", rate: 8.5 },
                    { label: "Personal (9.0%)", rate: 9.0 },
                  ].map((p) => (
                    <button
                      key={p.rate}
                      type="button"
                      onClick={() => setCalcRate(p.rate)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                        calcRate === p.rate
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Monthly Payment Output */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-md flex flex-col justify-between space-y-4">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Estimated Repayment
              </span>
              <div>
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {formatCurrency(monthlyPayment)}
                </div>
                <span className="text-xs text-slate-500">per month ({calcTerm} installments)</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <BaseProgressBar
                  value={(calcAmount / (totalPayable || 1)) * 100}
                  label="Principal Capital Share"
                  indicatorClassName="bg-blue-600"
                />
                <div className="flex justify-between text-slate-500 pt-1">
                  <span>Total Principal:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(calcAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Interest:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold pt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <span>Total Repayable:</span>
                  <span>{formatCurrency(totalPayable)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setAppForm((prev) => ({
                    ...prev,
                    requestedAmount: calcAmount,
                    requestedTermMonths: calcTerm,
                  }));
                  setIsAppDialogOpen(true);
                }}
                className="w-full text-xs"
              >
                Apply with These Terms
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Applications Table */}
        <Card className="border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold">Recent Credit Applications</CardTitle>
              <CardDescription className="text-xs">
                Pipeline of underwriting decisions and credit approvals
              </CardDescription>
            </div>
            <a
              href="/applications"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All Applications</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Loan Product</th>
                  <th className="py-3 px-4">Requested</th>
                  <th className="py-3 px-4">Tenure</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.slice(0, 5).map((app, idx) => {
                  const statusColors: Record<string, "success" | "warning" | "info" | "default" | "destructive"> = {
                    APPROVED: "success",
                    DISBURSED: "info",
                    UNDER_REVIEW: "warning",
                    PENDING: "default",
                    REJECTED: "destructive",
                  };
                  return (
                    <motion.tr
                      key={app.applicationId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {app.customerName || `Customer #${app.customerId}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {app.productName || "Micro Loan"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(app.requestedAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {app.requestedTermMonths} Months
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={statusColors[app.applicationStatus] || "default"}>
                          {app.applicationStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`/applications`}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                        >
                          Review <ChevronRight className="h-3 w-3" />
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Regulatory Guidelines & Credit Policies */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Underwriting Policies & Credit Guidelines
              </h3>
              <p className="text-xs text-slate-500">
                National Bank regulatory standards, risk threshold compliance, and collateral limits
              </p>
            </div>
            <Badge variant="info" className="text-[10px] w-fit">NBC Standard Compliant</Badge>
          </div>

          <BaseAccordionGroup
            items={[
              {
                value: "eligibility",
                title: "Borrower Eligibility Criteria & Debt-to-Income (DTI) Ratios",
                icon: <Users className="h-4 w-4 text-blue-500" />,
                content: (
                  <p>
                    Applicants must have a minimum verified monthly income of $400 for microfinance and $1,200 for SME business lines. Total monthly debt obligations including the requested facility must not exceed 45% of verified net cash flows.
                  </p>
                ),
              },
              {
                value: "collateral",
                title: "Collateral Valuation & Loan-to-Value (LTV) Thresholds",
                icon: <Layers className="h-4 w-4 text-emerald-500" />,
                content: (
                  <p>
                    Real estate and hard title deeds qualify for up to 70% LTV of forced sale valuation. Vehicle registrations and soft titles qualify for up to 50% LTV, requiring physical inspection and lien registration.
                  </p>
                ),
              },
              {
                value: "collection",
                title: "Early Repayment, Grace Periods & Delinquency Escalation (PAR 30)",
                icon: <Clock className="h-4 w-4 text-amber-500" />,
                content: (
                  <p>
                    Borrowers enjoy a 5-day grace period post installment due date. Overdue accounts exceeding 30 days are automatically escalated to field collection officers and trigger automated SMS and email reminders.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* --- Dialog 1: New Loan Application Wizard --- */}
      <Dialog open={isAppDialogOpen} onOpenChange={setIsAppDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Loan Application</DialogTitle>
            <DialogDescription>
              Submit borrower credit facility request for risk scoring and committee appraisal
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateApplication} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Borrower Customer</Label>
              <Select
                value={String(appForm.customerId)}
                onValueChange={(val) => setAppForm((p) => ({ ...p, customerId: Number(val) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select existing customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.customerId} value={String(c.customerId)}>
                      {c.firstName} {c.lastName} ({c.nationalId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Loan Product</Label>
              <Select
                value={String(appForm.loanProductId)}
                onValueChange={(val) => setAppForm((p) => ({ ...p, loanProductId: Number(val) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={prod.loanProductId} value={String(prod.loanProductId)}>
                      {prod.productName} ({prod.interestRate}% interest, max ${prod.maxLoanAmount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Requested Amount ($)</Label>
                <Input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={appForm.requestedAmount}
                  onChange={(e) => setAppForm((p) => ({ ...p, requestedAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Term (Months)</Label>
                <Input
                  type="number"
                  min="3"
                  max="60"
                  required
                  value={appForm.requestedTermMonths}
                  onChange={(e) => setAppForm((p) => ({ ...p, requestedTermMonths: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Loan Purpose / Business Case</Label>
              <Input
                required
                value={appForm.loanPurpose}
                onChange={(e) => setAppForm((p) => ({ ...p, loanPurpose: e.target.value }))}
                placeholder="e.g. Working capital, inventory stock, machinery lease"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAppDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Credit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 2: Register Customer --- */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register New Customer</DialogTitle>
            <DialogDescription>
              Create borrower KYC profile, verified national ID, and contact details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input
                  required
                  value={customerForm.firstName}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="Dara"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input
                  required
                  value={customerForm.lastName}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Sok"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>National ID Card #</Label>
                <Input
                  required
                  value={customerForm.nationalId}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, nationalId: e.target.value }))}
                  placeholder="KH-098273612"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  required
                  value={customerForm.phoneNumber}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="+855 12 889 001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  required
                  value={customerForm.dateOfBirth}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select
                  value={customerForm.gender}
                  onValueChange={(val) => setCustomerForm((p) => ({ ...p, gender: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Permanent Address</Label>
              <Input
                value={customerForm.address}
                onChange={(e) => setCustomerForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="St 271, Sangkat Boeng Tumpun, Phnom Penh"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Customer Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 3: Record Repayment --- */}
      <Dialog open={isRepaymentDialogOpen} onOpenChange={setIsRepaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Loan Repayment</DialogTitle>
            <DialogDescription>
              Execute installment payment against amortization schedule and issue receipt
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecordRepayment} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Target Loan ID / Number</Label>
              <Input
                type="number"
                required
                value={repaymentForm.loanId}
                onChange={(e) => setRepaymentForm((p) => ({ ...p, loanId: Number(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={repaymentForm.totalAmount}
                  onChange={(e) => setRepaymentForm((p) => ({ ...p, totalAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Select
                  value={repaymentForm.paymentMethod}
                  onValueChange={(val) => setRepaymentForm((p) => ({ ...p, paymentMethod: val }))}
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
              <Label>Bank / Transaction Reference #</Label>
              <Input
                value={repaymentForm.bankReference || ""}
                onChange={(e) => setRepaymentForm((p) => ({ ...p, bankReference: e.target.value }))}
                placeholder="ABA-TRX-948271"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cashier / Officer Notes</Label>
              <Input
                value={repaymentForm.notes || ""}
                onChange={(e) => setRepaymentForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Installment payment received"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRepaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="emerald">
                Confirm & Post Repayment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
