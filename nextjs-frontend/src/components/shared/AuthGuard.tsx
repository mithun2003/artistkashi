"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: ("user" | "admin")[];
  guestOnly?: boolean;
}

/**
 * Route protection component
 * - Redirects guests to login if accessing protected routes
 * - Redirects logged-in users away from guest-only routes
 * - Redirects users without proper roles
 */
export function AuthGuard({
  children,
  allowedRoles,
  guestOnly,
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user && !guestOnly) {
      // Not logged in, trying to access protected route
      const returnTo = encodeURIComponent(pathname);
      router.push(`/login?returnTo=${returnTo}`);
    } else if (user && guestOnly) {
      // Logged in, trying to access guest-only route (login/signup)
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Logged in, but doesn't have required role
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, guestOnly, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-gold font-mono animate-pulse">
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  // Handle flash of content before redirect
  if (!user && !guestOnly) return null;
  if (user && guestOnly) return null;
  if (user && allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
