"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import {
  ApplicationResponse,
  CustomerResponse,
  LoanProductResponse,
  RiskAssessmentResponse,
  GuarantorResponse,
  CollateralResponse,
  DocumentResponse,
  ApplicationStatusHistoryResponse,
  CreateApplicationRequest,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonTableRows } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  FileText,
  Search,
  Filter,
  PlusCircle,
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Banknote,
  Send,
  Eye,
  FileCheck,
  Calendar,
  DollarSign,
  UserCheck,
  Building,
  HelpCircle,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { GsapCreditGauge } from "@/components/ui/gsap-gauge";
import { BaseProgressBar } from "@/components/ui/base-progress";
import { InfoTooltip } from "@/components/ui/tooltip";
import { TechBadgeShowcase } from "@/components/ui/tech-badge-showcase";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [products, setProducts] = useState<LoanProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Selected Detail Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessmentResponse | null>(null);
  const [guarantors, setGuarantors] = useState<GuarantorResponse[]>([]);
  const [collaterals, setCollaterals] = useState<CollateralResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [history, setHistory] = useState<ApplicationStatusHistoryResponse[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // New Application Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateApplicationRequest>({
    customerId: 101,
    loanProductId: 1,
    requestedAmount: 15000,
    requestedTermMonths: 18,
    loanPurpose: "Inventory procurement and commercial expansion",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, custs, prods] = await Promise.all([
        api.applications.getAll(),
        api.customers.getAll(),
        api.loanProducts.getAll(),
      ]);
      setApplications(apps);
      setCustomers(custs);
      setProducts(prods);
    } catch (err: any) {
      toast.error("Failed to load applications", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openApplicationDetail = async (app: ApplicationResponse) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const [risk, guar, coll, docs, hist] = await Promise.all([
        api.applications.getRiskAssessment(app.applicationId),
        api.applications.getGuarantors(app.applicationId),
        api.applications.getCollaterals(app.applicationId),
        api.applications.getDocuments(app.applicationId),
        api.applications.getHistory(app.applicationId),
      ]);
      setRiskAssessment(risk);
      setGuarantors(guar);
      setCollaterals(coll);
      setDocuments(docs);
      setHistory(hist);
    } catch (err: any) {
      console.warn("Could not load full detail components", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Workflow Handlers
  const handleSubmitToReview = async (appId: number) => {
    try {
      await api.applications.submit(appId);
      toast.success("Application Submitted", {
        description: `Application #${selectedApp?.applicationNumber} is now UNDER_REVIEW.`,
      });
      setIsDetailOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Action failed", { description: err.message });
    }
  };

  const handleApprove = async (appId: number) => {
    try {
      await api.applications.approve(appId, {
        applicationId: appId,
        approvalStatus: "APPROVED",
        decisionReason: "Meets debt-service ratio and collateral coverage requirements.",
      });
      toast.success("Application Approved", {
        description: `Credit facility approved for disbursement.`,
      });
      setIsDetailOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Approval failed", { description: err.message });
    }
  };

  const handleDisburse = async (appId: number) => {
    try {
      const res = await api.applications.disburse(appId, {
        disbursementMethod: "BANK_TRANSFER",
        notes: "Funds transferred to customer account via central gateway",
      });
      toast.success("Loan Disbursed!", {
        description: `Loan #${res.loanNumber || "LN-ACTIVE"} created with approved amount ${formatCurrency(res.approvedAmount || selectedApp?.requestedAmount)}.`,
      });
      setIsDetailOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Disbursement failed", { description: err.message });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.applications.create(createForm);
      toast.success("Application Created", {
        description: `Application #${created.applicationNumber || "APP-NEW"} generated.`,
      });
      setIsCreateOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Creation failed", { description: err.message });
    }
  };

  // Filtered Apps
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.applicationNumber && app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.customerName && app.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.loanPurpose && app.loanPurpose.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "ALL" || app.applicationStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Loan Applications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage underwriting pipelines, risk appraisals, collateral verification, and approval decrees.
            </p>
          </div>
          <AnimatedButton
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            New Application
          </AnimatedButton>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by App #, Customer, or Purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {status === "ALL"
                    ? "All Statuses"
                    : status
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              )
            )}
          </div>
        </div>

        {/* Applications Table Card */}
        <Card className="border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">Application #</th>
                  <th className="py-3 px-4 whitespace-nowrap">Applicant</th>
                  <th className="py-3 px-4 whitespace-nowrap">Product</th>
                  <th className="py-3 px-4 whitespace-nowrap">Requested</th>
                  <th className="py-3 px-4 whitespace-nowrap">Duration</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Created Date</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <SkeletonTableRows rows={6} columns={8} />
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No loan applications match your current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app, idx) => (
                    <motion.tr
                      key={app.applicationId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {app.customerName || `Customer #${app.customerId}`}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs whitespace-nowrap">
                          {app.loanPurpose}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {app.productName || "Standard Facility"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(app.requestedAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {app.requestedTermMonths} Months
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(app.applicationStatus)}</td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(app.createdAt || app.submittedAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openApplicationDetail(app)}
                          className="h-8 gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:border-blue-300 whitespace-nowrap"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect & Decide
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* --- Detail Modal with Multi-Tabs --- */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-6">
              <div>
                <DialogTitle className="text-xl">
                  Application {selectedApp?.applicationNumber}
                </DialogTitle>
                <DialogDescription>
                  Applicant: <strong>{selectedApp?.customerName}</strong> • {selectedApp?.productName}
                </DialogDescription>
              </div>
              <div>{selectedApp && getStatusBadge(selectedApp.applicationStatus)}</div>
            </div>
          </DialogHeader>

          {selectedApp && (
            <Tabs defaultValue="overview" className="mt-2">
              <TabsList className="flex items-center overflow-x-auto w-full text-xs h-auto p-1 gap-1 bg-slate-100 dark:bg-slate-800/80">
                <TabsTrigger value="overview" className="flex-1 shrink-0 py-1.5 px-2 text-[11px] sm:text-xs">Overview</TabsTrigger>
                <TabsTrigger value="risk" className="flex-1 shrink-0 py-1.5 px-2 text-[11px] sm:text-xs">Risk Score</TabsTrigger>
                <TabsTrigger value="guarantors" className="flex-1 shrink-0 py-1.5 px-2 text-[11px] sm:text-xs">Guarantors</TabsTrigger>
                <TabsTrigger value="collaterals" className="flex-1 shrink-0 py-1.5 px-2 text-[11px] sm:text-xs">Collaterals</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 shrink-0 py-1.5 px-2 text-[11px] sm:text-xs">Documents</TabsTrigger>
              </TabsList>

              {/* Tab 1: Overview */}
              <TabsContent value="overview" className="space-y-4 pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400">Requested Capital</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(selectedApp.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Term Duration</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {selectedApp.requestedTermMonths} Months
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Submission Date</span>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1 whitespace-nowrap">
                      {formatDate(selectedApp.submittedAt || selectedApp.createdAt)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Facility ID</span>
                    <div className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1 whitespace-nowrap">
                      #{selectedApp.applicationId}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Loan Purpose & Business Context:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedApp.loanPurpose}
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Audit Status Trail
                  </span>
                  <div className="space-y-2">
                    {history.map((h) => (
                      <div
                        key={h.historyId}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {h.fromStatus} → {h.toStatus}
                          </span>
                          {h.comments && (
                            <span className="text-slate-400 italic">({h.comments})</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(h.changedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Risk Assessment */}
              <TabsContent value="risk" className="space-y-4 pt-3">
                {riskAssessment ? (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200/60 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 uppercase font-semibold">
                            Automated Underwriting Score
                          </span>
                          <InfoTooltip content="Calculated using credit bureau history, monthly debt service ratio (DSR), and verified collateral coverage.">
                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                          </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {riskAssessment.riskScore}
                            <span className="text-base font-normal text-slate-400"> / 1000</span>
                          </div>
                          <Badge variant="success">Risk Level: {riskAssessment.riskLevel}</Badge>
                        </div>
                        <BaseProgressBar
                          value={riskAssessment.riskScore / 10}
                          label="Credit Solvency Confidence"
                          indicatorClassName="bg-emerald-500"
                        />
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Recommendation: <strong>{riskAssessment.assessmentResult}</strong>
                        </div>
                      </div>

                      {/* GSAP Speedometer Gauge */}
                      <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <GsapCreditGauge score={riskAssessment.riskScore} maxScore={1000} label="Credit Score" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Credit Underwriter Analysis:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {riskAssessment.assessmentComment}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No credit risk assessment record found.
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Guarantors */}
              <TabsContent value="guarantors" className="space-y-3 pt-3">
                {guarantors.map((g) => (
                  <div
                    key={g.guarantorId}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {g.firstName} {g.lastName}
                        </span>
                        <Badge variant={g.verificationStatus === "VERIFIED" ? "success" : "warning"}>
                          {g.verificationStatus}
                        </Badge>
                      </div>
                      <div className="text-slate-500">
                        {g.relationshipToCustomer} • National ID: {g.nationalId} • Tel: {g.phoneNumber}
                      </div>
                      <div className="text-slate-500">
                        Employer: {g.employer || "N/A"} • Monthly Income: {formatCurrency(g.monthlyIncome || 0)}
                      </div>
                    </div>
                    {g.verificationStatus !== "VERIFIED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await api.applications.verifyGuarantor(selectedApp.applicationId, g.guarantorId, "VERIFIED");
                          setGuarantors((prev) =>
                            prev.map((item) =>
                              item.guarantorId === g.guarantorId ? { ...item, verificationStatus: "VERIFIED" } : item
                            )
                          );
                          toast.success("Guarantor Verified");
                        }}
                      >
                        Verify Identity
                      </Button>
                    )}
                  </div>
                ))}
              </TabsContent>

              {/* Tab 4: Collaterals */}
              <TabsContent value="collaterals" className="space-y-3 pt-3">
                {collaterals.map((c) => (
                  <div
                    key={c.collateralId}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {c.collateralType.replace(/_/g, " ")}
                        </span>
                        <Badge variant="success">Pledged & Verified</Badge>
                      </div>
                      <p className="text-slate-500">{c.description}</p>
                      <div className="text-slate-600 dark:text-slate-400">
                        Owner: {c.ownerName} ({c.ownerNationalId || "N/A"})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Estimated Value</span>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(c.estimatedValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 5: Documents */}
              <TabsContent value="documents" className="space-y-3 pt-3">
                {documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {doc.documentType.replace(/_/g, " ")}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {doc.originalFileName || "document.pdf"} • {Math.round((doc.fileSize || 1024) / 1024)} KB
                        </div>
                      </div>
                    </div>
                    <Badge variant={doc.verificationStatus === "VERIFIED" ? "success" : "default"}>
                      {doc.verificationStatus}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}

          {/* Workflow Action Bar */}
          <DialogFooter className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>

            {selectedApp && (
              <>
                {(selectedApp.applicationStatus === "DRAFT" || selectedApp.applicationStatus === "PENDING") && (
                  <Button
                    onClick={() => handleSubmitToReview(selectedApp.applicationId)}
                    className="gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit to Credit Committee
                  </Button>
                )}

                {(selectedApp.applicationStatus === "SUBMITTED" || selectedApp.applicationStatus === "UNDER_REVIEW") && (
                  <Button
                    onClick={() => handleApprove(selectedApp.applicationId)}
                    variant="emerald"
                    className="gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve Credit
                  </Button>
                )}

                {selectedApp.applicationStatus === "APPROVED" && (
                  <Button
                    onClick={() => handleDisburse(selectedApp.applicationId)}
                    variant="indigo"
                    className="gap-1.5"
                  >
                    <Banknote className="h-3.5 w-3.5" /> Disburse Loan Funds
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Create Application Wizard Dialog --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Credit Facility Application</DialogTitle>
            <DialogDescription>
              Launch new underwriting file for risk scoring, collateral audit, and approval decree
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Borrower Customer</Label>
              <Select
                value={String(createForm.customerId)}
                onValueChange={(val) => setCreateForm((p) => ({ ...p, customerId: Number(val) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer" />
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
              <Label>Loan Product Model</Label>
              <Select
                value={String(createForm.loanProductId)}
                onValueChange={(val) => setCreateForm((p) => ({ ...p, loanProductId: Number(val) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={prod.loanProductId} value={String(prod.loanProductId)}>
                      {prod.productName} ({prod.interestRate}% APR)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Principal Amount ($)</Label>
                <Input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={createForm.requestedAmount}
                  onChange={(e) => setCreateForm((p) => ({ ...p, requestedAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tenure (Months)</Label>
                <Input
                  type="number"
                  min="3"
                  max="60"
                  required
                  value={createForm.requestedTermMonths}
                  onChange={(e) => setCreateForm((p) => ({ ...p, requestedTermMonths: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Loan Purpose / Capital Expenditure Details</Label>
              <Input
                required
                value={createForm.loanPurpose}
                onChange={(e) => setCreateForm((p) => ({ ...p, loanPurpose: e.target.value }))}
                placeholder="e.g. Bulk purchasing, expansion of agricultural crop equipment"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Credit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
