"use client";

import { useState } from "react";
import { Grid, List, ArrowRight } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { ProductCard } from "@/components/shop/ProductCard";
import { PrimaryBtn } from "@/components/ui/buttons";
import { PAINTINGS } from "@/data/constants";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <RevealBlock>
          <div className="border-b border-[#2A2A2A] pb-16 mb-12">
            <div className="text-[11px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-4">The Gallery Shop</div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <h1 className="text-[clamp(48px,7vw,96px)] font-extrabold tracking-[-0.03em] text-[#F5F5F5] leading-[0.9]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Original Works<br />& Art Prints
              </h1>
              <div className="flex items-center gap-4">
                <button onClick={() => setView("grid")} className={cn("p-2 border", view === "grid" ? "border-[#F5F5F5] text-[#F5F5F5]" : "border-[#2A2A2A] text-[#8B8B8B]")}>
                  <Grid size={16} />
                </button>
                <button onClick={() => setView("list")} className={cn("p-2 border", view === "list" ? "border-[#F5F5F5] text-[#F5F5F5]" : "border-[#2A2A2A] text-[#8B8B8B]")}>
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </RevealBlock>

        <div className={cn("gap-px bg-[#2A2A2A]", view === "grid" ? "grid grid-cols-2 lg:grid-cols-4" : "grid grid-cols-1 md:grid-cols-2")}>
          {PAINTINGS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.08} view={view} />
          ))}
        </div>

        {/* Custom commission CTA */}
        <RevealBlock>
          <div className="mt-24 border border-[#2A2A2A] p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-[11px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-4">Bespoke</div>
              <h2 className="text-[clamp(28px,3vw,48px)] font-extrabold tracking-tight text-[#F5F5F5] mb-4" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Commission a Custom Work
              </h2>
              <p className="text-[#8B8B8B] leading-relaxed text-sm mb-8">
                Work directly with an artist from our roster to bring a specific vision to canvas. We manage the brief, timeline, and secure delivery.
              </p>
              <PrimaryBtn>
                Begin a Commission <ArrowRight size={16} />
              </PrimaryBtn>
            </div>
            <div className="relative aspect-video overflow-hidden bg-[#111111]">
              <img src="https://images.unsplash.com/photo-1762463464555-baf824f1e601?w=600&h=400&fit=crop&auto=format" alt="Framed art" className="w-full h-full object-cover grayscale opacity-60" />
            </div>
          </div>
        </RevealBlock>
      </div>
    </main>
  );
}
