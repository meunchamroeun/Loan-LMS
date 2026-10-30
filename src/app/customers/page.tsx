"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "@/components/layout/app-layout";
import { api } from "@/lib/api-client";
import {
  CustomerResponse,
  CreateCustomerRequest,
  EmploymentResponse,
  EmploymentRequest,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, AnimatedButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCatalogCard } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GsapCounter } from "@/components/ui/gsap-counter";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");

  // Selected customer for profile drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const [employments, setEmployments] = useState<EmploymentResponse[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Create Customer Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateCustomerRequest>({
    firstName: "",
    lastName: "",
    dateOfBirth: "1992-05-15",
    gender: "FEMALE",
    phoneNumber: "+855 12 ",
    email: "",
    nationalId: "KH-",
    address: "Phnom Penh",
  });

  // Add Employment Dialog
  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [empForm, setEmpForm] = useState<EmploymentRequest>({
    employerName: "",
    occupation: "",
    monthlyIncome: 1200,
    employmentStatus: "FULL_TIME",
    employmentType: "SALARIED",
    companyAddress: "Phnom Penh",
    companyPhone: "+855 23 888 999",
    yearsOfService: 3,
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (err: any) {
      toast.error("Failed to fetch customers", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openProfile = async (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setIsProfileOpen(true);
    try {
      const emp = await api.customers.getEmployment(customer.customerId);
      setEmployments(emp);
    } catch {
      setEmployments([]);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.customers.create(createForm);
      toast.success("Customer Registered", {
        description: `${created.firstName || createForm.firstName} ${created.lastName || createForm.lastName} profile created.`,
      });
      setIsCreateOpen(false);
      loadCustomers();
    } catch (err: any) {
      toast.error("Failed to register customer", { description: err.message });
    }
  };

  const handleAddEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await api.customers.addEmployment(selectedCustomer.customerId, empForm);
      toast.success("Employment Record Added");
      setIsAddEmpOpen(false);
      const emp = await api.customers.getEmployment(selectedCustomer.customerId);
      setEmployments(emp);
    } catch (err: any) {
      toast.error("Failed to save employment", { description: err.message });
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const natId = (c.nationalId || "").toLowerCase();
    const phone = c.phoneNumber || "";
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      natId.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesGender = genderFilter === "ALL" || c.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Customer Directory
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <GsapCounter value={customers.length} duration={1} /> Verified
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage client KYC, verified national IDs, employment profiles, and creditworthiness records.
            </p>
          </div>
          <AnimateShine>
            <AnimatedButton
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 text-xs shadow-md shadow-blue-500/20"
            >
              <PlusCircle className="h-4 w-4" />
              Register Customer
            </AnimatedButton>
          </AnimateShine>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, National ID, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {["ALL", "MALE", "FEMALE"].map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  genderFilter === gender
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {gender === "ALL" ? "All Genders" : gender}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCatalogCard key={i} />
            ))
          ) : (
            filteredCustomers.map((customer, idx) => (
            <motion.div
              key={customer.customerId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="h-full"
            >
              <AnimateTiltCard maxTilt={4}>
              <Card
                className="p-5 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {customer.firstName?.[0] || "C"}
                        {customer.lastName?.[0] || ""}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap truncate">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <span className="text-xs text-slate-400 font-mono whitespace-nowrap block">
                          {customer.nationalId || "No ID Recorded"}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={customer.status || "ACTIVE_KYC"} className="shrink-0" />
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="whitespace-nowrap font-mono">{customer.phoneNumber}</span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Date of Birth</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                      {formatDate(customer.dateOfBirth)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openProfile(customer)}
                    className="w-full h-8 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium whitespace-nowrap gap-1 cursor-pointer"
                  >
                    <span>View Profile & Employment</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
              </AnimateTiltCard>
            </motion.div>
          ))
        )}
        </div>
      </div>

      {/* --- Customer Profile & Employment Modal --- */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Customer Dossier & Employment</DialogTitle>
            <DialogDescription>
              Verified identification & verified income stream
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base">
                  {selectedCustomer.firstName[0]}
                  {selectedCustomer.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>ID: {selectedCustomer.nationalId}</span>
                    <span>•</span>
                    <span>Gender: {selectedCustomer.gender}</span>
                    <span>•</span>
                    <span>DOB: {formatDate(selectedCustomer.dateOfBirth)}</span>
                  </div>
                </div>
              </div>

              {/* Employment Records Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employment & Verified Monthly Income
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddEmpOpen(true)}
                    className="h-7 text-xs gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Employment
                  </Button>
                </div>

                {employments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No employment record registered yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employments.map((emp) => (
                      <div
                        key={emp.employmentId}
                        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span>{emp.employerName}</span>
                          </div>
                          <Badge variant="success">
                            {formatCurrency(emp.monthlyIncome)} / mo
                          </Badge>
                        </div>
                        <div className="text-slate-500">
                          Role: <strong>{emp.occupation}</strong> • Status: {emp.employmentStatus} ({emp.employmentType})
                        </div>
                        {emp.companyAddress && (
                          <div className="text-slate-400 text-[11px]">
                            Address: {emp.companyAddress} • Tel: {emp.companyPhone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Add Employment Dialog --- */}
      <Dialog open={isAddEmpOpen} onOpenChange={setIsAddEmpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Employment Verification</DialogTitle>
            <DialogDescription>
              Record verified salary & employer for credit underwriting
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEmployment} className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label>Company / Employer Name</Label>
              <Input
                required
                value={empForm.employerName}
                onChange={(e) => setEmpForm((p) => ({ ...p, employerName: e.target.value }))}
                placeholder="e.g. ABA Bank, Chip Mong Group, Smart Axiata"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Occupation / Title</Label>
                <Input
                  required
                  value={empForm.occupation}
                  onChange={(e) => setEmpForm((p) => ({ ...p, occupation: e.target.value }))}
                  placeholder="Sales Director"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Monthly Income ($)</Label>
                <Input
                  type="number"
                  required
                  value={empForm.monthlyIncome}
                  onChange={(e) => setEmpForm((p) => ({ ...p, monthlyIncome: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Employment Type</Label>
                <Select
                  value={empForm.employmentType}
                  onValueChange={(val) => setEmpForm((p) => ({ ...p, employmentType: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALARIED">Salaried Employee</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Self-Employed / Business Owner</SelectItem>
                    <SelectItem value="CONTRACT">Contractual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Years of Service</Label>
                <Input
                  type="number"
                  value={empForm.yearsOfService}
                  onChange={(e) => setEmpForm((p) => ({ ...p, yearsOfService: Number(e.target.value) }))}
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddEmpOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Register Customer Dialog --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register New Customer</DialogTitle>
            <DialogDescription>
              Register borrower identity, national ID card, and contact information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input
                  required
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="Dara"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input
                  required
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Sok"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>National ID Card #</Label>
                <Input
                  required
                  value={createForm.nationalId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, nationalId: e.target.value }))}
                  placeholder="KH-098273612"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  required
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phoneNumber: e.target.value }))}
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
                  value={createForm.dateOfBirth}
                  onChange={(e) => setCreateForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select
                  value={createForm.gender}
                  onValueChange={(val) => setCreateForm((p) => ({ ...p, gender: val }))}
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
                value={createForm.address}
                onChange={(e) => setCreateForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="St 271, Sangkat Boeng Tumpun, Phnom Penh"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Customer Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
