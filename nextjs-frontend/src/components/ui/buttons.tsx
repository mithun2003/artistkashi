"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryBtn({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center gap-3 px-8 py-4 bg-[#F5F5F5] text-[#0A0A0A] text-sm font-semibold tracking-[0.08em] uppercase overflow-hidden transition-all duration-300 hover:bg-[#B89D5C] hover:text-[#0A0A0A]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-3 px-8 py-4 border border-[#2A2A2A] text-[#F5F5F5] text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-300 hover:border-[#B89D5C] hover:text-[#B89D5C]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
