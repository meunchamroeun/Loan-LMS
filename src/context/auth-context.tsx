"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserResponse } from "@/types/api";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleDemoMode: (enabled?: boolean) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.auth.getMe();
      setUser(profile);
      api.saveUser(profile);
    } catch {
      // If fetching me fails, check if we have saved user
      const saved = api.getSavedUser();
      if (saved) {
        setUser(saved as UserResponse);
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const demo = api.isDemoMode();
      setIsDemoMode(demo);

      const token = api.getAccessToken();
      if (token) {
        await refreshProfile();
      } else if (demo) {
        // Auto-login with mock user if in demo mode
        setUser({
          userId: 1,
          username: "admin_demo",
          email: "demo@loanlms.com",
          firstName: "Executive",
          lastName: "Admin",
          role: "ROLE_ADMIN",
          status: "ACTIVE",
          phoneNumber: "+855 12 345 678",
          createdAt: "2026-01-01T00:00:00Z",
        });
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authData = await api.auth.login(username, password);
      await refreshProfile();
      toast.success("Welcome back!", {
        description: `Logged in as ${authData.username} (${authData.role})`,
      });
      return true;
    } catch (err: any) {
      toast.error("Login failed", {
        description: err.message || "Please check your username and password",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
      toast.info("Logged out successfully");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDemoMode = (enabled?: boolean) => {
    const nextVal = enabled !== undefined ? enabled : !isDemoMode;
    api.setDemoMode(nextVal);
    setIsDemoMode(nextVal);
    if (nextVal) {
      setUser({
        userId: 1,
        username: "admin_demo",
        email: "demo@loanlms.com",
        firstName: "Executive",
        lastName: "Admin",
        role: "ROLE_ADMIN",
        status: "ACTIVE",
        phoneNumber: "+855 12 345 678",
        createdAt: "2026-01-01T00:00:00Z",
      });
      toast.success("Demo Mode Activated", {
        description: "Exploring LMS with rich mock data and interactive features.",
      });
    } else {
      api.clearAuth();
      setUser(null);
      toast.info("Switched to Live Backend Mode", {
        description: "Connecting directly to https://loan.cavkim.tech",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || !!api.getAccessToken(),
        isLoading,
        isDemoMode,
        login,
        logout,
        toggleDemoMode,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
