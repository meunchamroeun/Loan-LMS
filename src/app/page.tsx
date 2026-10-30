"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import DashboardPage from "./dashboard/page";
import { LoginView } from "@/components/auth/login-view";
import { AppLoader } from "@/components/ui/app-loader";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader label="Initializing Loan-LMS" />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <DashboardPage />;
}
