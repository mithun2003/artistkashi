"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { GalaxyBackground } from "@/components/shared/GalaxyBackground";

const authRoutes = new Set(["/login", "/signup"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.has(pathname);

  return (
    <>
      {!isAuthRoute && <GalaxyBackground />}
      {!isAuthRoute && <CustomCursor />}
      {!isAuthRoute && <Navbar />}
      {children}
      {!isAuthRoute && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid #2A2A2A",
            color: "#F5F5F5",
            borderRadius: "0",
            fontFamily: "'Inter Tight', sans-serif",
          },
        }}
      />
    </>
  );
}
