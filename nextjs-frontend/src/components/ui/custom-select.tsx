"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  className?: string;
  label?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-2xs font-mono tracking-widest uppercase text-text-muted block">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-dark/30 border border-border/60 px-4 py-2.5 text-xs text-text-main flex items-center justify-between transition-all duration-300 hover:border-gold/40 focus:outline-none focus:border-gold",
            isOpen && "border-gold"
          )}
        >
          <span
            className={cn(
              !selectedOption &&
                "text-text-muted/40 uppercase font-mono text-2xs"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronRight
            size={12}
            className={cn(
              "text-gold/40 transition-transform duration-300",
              isOpen ? "rotate-270" : "rotate-90"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-dark/95 border border-gold/20 backdrop-blur-xl max-h-60 overflow-y-auto scrollbar-hide shadow-2xl shadow-black"
            >
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-2xs uppercase font-mono tracking-wider transition-colors flex items-center justify-between",
                      option.value === value
                        ? "bg-gold/10 text-gold"
                        : "text-text-muted hover:bg-white/5 hover:text-text-main"
                    )}
                  >
                    {option.label}
                    {option.value === value && <Check size={10} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
