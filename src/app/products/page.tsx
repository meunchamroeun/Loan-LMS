"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import { LoanProductResponse, CreateLoanProductRequest } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCatalogCard } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseToggleSwitch } from "@/components/ui/base-switch";
import { InfoTooltip } from "@/components/ui/tooltip";
import { AnimateTiltCard, AnimateShine } from "@/components/ui/animate-ui-suite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers,
  PlusCircle,
  Percent,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Edit,
  Power,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LoanProductsPage() {
  const [products, setProducts] = useState<LoanProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateLoanProductRequest>({
    productName: "",
    maxLoanAmount: 20000,
    minimumIncome: 700,
    interestRate: 8.0,
    minimumTermMonths: 6,
    maximumTermMonths: 24,
    processingFee: 1.5,
    description: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.loanProducts.getAll();
      setProducts(data);
    } catch (err: any) {
      toast.error("Failed to load loan products", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.loanProducts.updateStatus(id, nextStatus);
      toast.success(`Product status changed to ${nextStatus}`);
      setProducts((prev) =>
        prev.map((p) => (p.loanProductId === id ? { ...p, status: nextStatus } : p))
      );
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.loanProducts.create(form);
      toast.success("Loan Product Configured", {
        description: `${created.productName || form.productName} is now ready for borrower underwriting.`,
      });
      setIsCreateOpen(false);
      loadProducts();
    } catch (err: any) {
      toast.error("Failed to create product", { description: err.message });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Loan Products & Credit Modeling
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure product APRs, minimum income thresholds, maximum ceilings, and processing margins.
            </p>
          </div>
          <AnimatedButton
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            New Loan Product
          </AnimatedButton>
        </div>

        {/* Product Catalog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCatalogCard key={i} />
            ))
          ) : (
            products.map((product, idx) => {
              const isActive = product.status === "ACTIVE";
              return (
              <motion.div
                key={product.loanProductId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="h-full"
              >
                <AnimateTiltCard maxTilt={5}>
                <Card className="p-6 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {product.productName}
                          </h3>
                          <span className="text-xs text-slate-400 whitespace-nowrap font-mono">
                            Product Code: #LP-{product.loanProductId.toString().padStart(3, "0")}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={product.status} />
                    </div>

                    <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[3rem]">
                      {product.description || "Comprehensive credit facility tailored for retail or agricultural borrowers."}
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800/60">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Interest (APR)</span>
                          <InfoTooltip content="Annual Percentage Rate calculated on declining balance.">
                            <span className="text-slate-400 text-[10px] cursor-pointer">ⓘ</span>
                          </InfoTooltip>
                        </div>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {product.interestRate}%
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400">Max Facility</span>
                        <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 whitespace-nowrap">
                          {formatCurrency(product.maxLoanAmount)}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Min Income</span>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 whitespace-nowrap">
                          {formatCurrency(product.minimumIncome)}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Tenure Range</span>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 whitespace-nowrap">
                          {product.minimumTermMonths} - {product.maximumTermMonths} Mo
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 whitespace-nowrap">
                      Processing Fee: <strong>{product.processingFee}%</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-medium">Status</span>
                      <BaseToggleSwitch
                        checked={isActive}
                        onCheckedChange={() => handleToggleStatus(product.loanProductId, product.status)}
                      />
                    </div>
                  </div>
                </Card>
                </AnimateTiltCard>
              </motion.div>
            );
          })
        )}
        </div>
      </div>

      {/* --- Create Product Dialog --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Loan Product</DialogTitle>
            <DialogDescription>
              Define APR tiers, maximum financing ceilings, and repayment tenure constraints
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Product Name</Label>
              <Input
                required
                value={form.productName}
                onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))}
                placeholder="e.g. Clean Energy Micro Loan"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Maximum Loan Amount ($)</Label>
                <Input
                  type="number"
                  required
                  value={form.maxLoanAmount}
                  onChange={(e) => setForm((p) => ({ ...p, maxLoanAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Minimum Monthly Income ($)</Label>
                <Input
                  type="number"
                  required
                  value={form.minimumIncome}
                  onChange={(e) => setForm((p) => ({ ...p, minimumIncome: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Annual Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={form.interestRate}
                  onChange={(e) => setForm((p) => ({ ...p, interestRate: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Processing Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={form.processingFee}
                  onChange={(e) => setForm((p) => ({ ...p, processingFee: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Min Term (Months)</Label>
                <Input
                  type="number"
                  required
                  value={form.minimumTermMonths}
                  onChange={(e) => setForm((p) => ({ ...p, minimumTermMonths: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Term (Months)</Label>
                <Input
                  type="number"
                  required
                  value={form.maximumTermMonths}
                  onChange={(e) => setForm((p) => ({ ...p, maximumTermMonths: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Product Description</Label>
              <Input
                value={form.description || ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Product eligibility criteria, target demographic, disbursement rules"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Deploy Loan Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
