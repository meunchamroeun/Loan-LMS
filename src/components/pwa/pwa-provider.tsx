"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Download, WifiOff, Wifi, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installPwa: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isInstalled: false,
  isOnline: true,
  installPwa: async () => {},
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      });
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // App installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowBanner(false);
      setDeferredPrompt(null);
      toast.success("Loan-LMS Installed", {
        description: "The app is now available on your home screen or desktop.",
      });
    });

    // Online / Offline tracking
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Online Reconnected", {
        description: "Live connection restored to https://loan.cavkim.tech",
        icon: <Wifi className="h-4 w-4 text-emerald-500" />,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Working Offline", {
        description: "PWA cached mode active. Changes will sync when reconnected.",
        icon: <WifiOff className="h-4 w-4 text-amber-500" />,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOnline,
        installPwa,
      }}
    >
      {children}

      {/* Floating PWA Install Prompt Banner */}
      {showBanner && isInstallable && !isInstalled && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">Install Loan-LMS App</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Install as a standalone Progressive Web App for fast offline access and home screen launch.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={installPwa}
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-500 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowBanner(false)}
                  className="h-8 text-xs text-slate-400 hover:text-white"
                >
                  Maybe later
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}
