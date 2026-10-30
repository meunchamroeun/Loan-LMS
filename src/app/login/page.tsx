"use client";

import React from "react";
import { LoginView } from "@/components/auth/login-view";
import { Toaster } from "sonner";

export default function LoginPage() {
  return (
    <>
      <LoginView />
      <Toaster richColors position="top-right" />
    </>
  );
}
