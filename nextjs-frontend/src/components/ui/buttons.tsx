"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryBtn({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center gap-3 px-8 py-4 bg-text-main text-dark text-sm font-semibold tracking-[0.08em] uppercase overflow-hidden transition-all duration-300 hover:bg-gold hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed",
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
        "inline-flex items-center gap-3 px-8 py-4 border border-border text-text-main text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
