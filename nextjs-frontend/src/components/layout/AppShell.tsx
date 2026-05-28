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
  const isAdminRoute = pathname.startsWith("/admin");
  const hideNavFooter = isAuthRoute || isAdminRoute;

  return (
    <>
      <GalaxyBackground />
      {!isAuthRoute && <CustomCursor />}
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-muted-light)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-main)",
            borderRadius: "0",
          },
        }}
      />
    </>
  );
}
