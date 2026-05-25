"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { PrimaryBtn } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { signupSchema, type SignupFormValues } from "@/lib/auth-validation";
import { getAuthErrorMessage, getSafeReturnTo, type AuthErrorInput } from "@/lib/auth-api";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnTo(getSafeReturnTo(params.get("returnTo")));
  }, []);
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const user = await signup(data);
      toast.success("Welcome to Artist Kashi!", {
        description: "Your membership has been activated.",
      });

      router.push(user.role === "admin" ? "/dashboard" : returnTo ?? "/");
    } catch (error) {
      toast.error(getAuthErrorMessage(error as AuthErrorInput));
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0A0A0A] px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-md">
        <RevealBlock>
          <div className="mb-8 text-center sm:mb-10">
            <div className="text-[#F5F5F5] text-2xl font-extrabold tracking-[0.1em] uppercase" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Artist</div>
            <div className="text-[#B89D5C] text-[10px] font-mono tracking-[0.25em] uppercase">Kashi</div>
            <h1 className="mt-6 text-3xl font-bold text-[#F5F5F5] sm:mt-8" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Sign Up</h1>
            <p className="text-[#8B8B8B] text-sm mt-2">Join a global community of collectors and artists.</p>
          </div>
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase mb-1.5 sm:mb-2">Full Name</label>
              <input 
                {...register("fullName")}
                type="text" 
                className={cn(
                  "w-full bg-[#111111] border text-[#F5F5F5] px-4 py-3 focus:outline-none focus:border-[#B89D5C] transition-colors",
                  errors.fullName ? "border-red-500" : "border-[#2A2A2A]"
                )} 
                placeholder="Elena Marchetti" 
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500 font-mono">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase mb-1.5 sm:mb-2">Email Address</label>
              <input 
                {...register("email")}
                type="email" 
                className={cn(
                  "w-full bg-[#111111] border text-[#F5F5F5] px-4 py-3 focus:outline-none focus:border-[#B89D5C] transition-colors",
                  errors.email ? "border-red-500" : "border-[#2A2A2A]"
                )} 
                placeholder="collector@email.com" 
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-mono">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase mb-1.5 sm:mb-2">Password</label>
              <p className="mb-2 text-[11px] font-mono text-[#8B8B8B]">
                Use 8+ characters with one uppercase letter and one special character.
              </p>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "w-full bg-[#111111] border text-[#F5F5F5] px-4 py-3 pr-12 focus:outline-none focus:border-[#B89D5C] transition-colors",
                    errors.password ? "border-red-500" : "border-[#2A2A2A]"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#8B8B8B] hover:text-[#F5F5F5] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-mono">{errors.password.message}</p>}
            </div>
            <PrimaryBtn type="submit" className="w-full justify-center">Sign Up <ArrowRight size={16} /></PrimaryBtn>
          </form>
          <div className="mt-6 text-center text-sm text-[#8B8B8B] sm:mt-8">
            Already a member? <Link href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"} className="text-[#B89D5C] hover:text-[#F5F5F5] transition-colors">Sign in</Link>
          </div>
        </RevealBlock>
      </div>
    </main>
  );
}
