"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { PrimaryBtn } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { signupSchema, type SignupFormValues } from "@/lib/auth-validation";
import {
  getAuthErrorMessage,
  getSafeReturnTo,
  type AuthErrorInput,
} from "@/api/auth-api";
import { toast } from "sonner";
import { AuthGuard } from "@/components/shared/AuthGuard";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const user = await signup(data);
      toast.success("Welcome to Artist Kashi!", {
        description: "Your membership has been activated.",
      });

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(returnTo ?? "/dashboard");
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error as AuthErrorInput));
    }
  };

  return (
    <AuthGuard guestOnly>
      <main className="flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-md">
          <RevealBlock>
            <div className="mb-8 text-center sm:mb-10">
              <div className="text-text-main text-2xl font-extrabold tracking-widest uppercase">
                Artist
              </div>
              <div className="text-gold text-tiny font-mono tracking-[0.25em] uppercase">
                Kashi
              </div>
              <h1 className="mt-6 text-3xl font-bold text-text-main sm:mt-8">
                Sign Up
              </h1>
              <p className="text-text-muted text-sm mt-2">
                Join a global community of collectors and artists.
              </p>
            </div>
            <form
              className="space-y-5 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block text-label font-mono text-text-muted tracking-widest uppercase mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  className={cn(
                    "w-full bg-muted-light border text-text-main px-4 py-3 focus:outline-none focus:border-gold transition-colors",
                    errors.fullName ? "border-red-500" : "border-border"
                  )}
                  placeholder="Elena Marchetti"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500 font-mono">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-label font-mono text-text-muted tracking-widest uppercase mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full bg-muted-light border text-text-main px-4 py-3 focus:outline-none focus:border-gold transition-colors",
                    errors.email ? "border-red-500" : "border-border"
                  )}
                  placeholder="collector@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-mono">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-label font-mono text-text-muted tracking-widest uppercase mb-1.5 sm:mb-2">
                  Password
                </label>
                <p className="mb-2 text-label font-mono text-text-muted">
                  Use 8+ characters with one uppercase letter and one special
                  character.
                </p>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={cn(
                      "w-full bg-muted-light border text-text-main px-4 py-3 pr-12 focus:outline-none focus:border-gold transition-colors",
                      errors.password ? "border-red-500" : "border-border"
                    )}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-text-muted hover:text-text-main transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 font-mono">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <PrimaryBtn type="submit" className="w-full justify-center">
                Sign Up <ArrowRight size={16} />
              </PrimaryBtn>
            </form>
            <div className="mt-6 text-center text-sm text-text-muted sm:mt-8">
              Already a member?{" "}
              <Link
                href={
                  returnTo
                    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
                    : "/login"
                }
                className="text-gold hover:text-text-main transition-colors"
              >
                Sign in
              </Link>
            </div>
          </RevealBlock>
        </div>
      </main>
    </AuthGuard>
  );
}
