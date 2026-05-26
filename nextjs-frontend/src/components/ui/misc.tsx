"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function GoldDivider({ className }: { className?: string }) {
  return <div className={cn("w-12 h-px bg-gold my-6", className)} />;
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="text-label tracking-[0.15em] uppercase font-mono text-text-muted border border-border px-3 py-1">
      {label}
    </span>
  );
}
