"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Painting } from "@/types";
import { RevealBlock } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface ProductCardProps {
  product: Painting;
  delay?: number;
  view?: "grid" | "list";
}

export function ProductCard({ product, delay = 0, view = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <RevealBlock delay={delay}>
      <div className="group bg-[#0A0A0A] relative h-full flex flex-col">
        <Link href={`/shop/${product.id}`} className="block w-full">
          <div className={cn("relative overflow-hidden bg-[#111111]", view === "grid" ? "aspect-[3/4]" : "aspect-[16/9]")}>
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
              <span className="text-[#F5F5F5] text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
                View Artwork <ArrowUpRight size={12} />
              </span>
            </div>
            {product.sold && (
              <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 text-[#8B8B8B] text-[10px] font-mono tracking-widest uppercase px-2.5 py-1">SOLD</div>
            )}
          </div>
        </Link>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-4 right-4 w-8 h-8 bg-[#0A0A0A]/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Heart size={14} fill={wishlisted ? "#B89D5C" : "none"} className={wishlisted ? "text-[#B89D5C]" : "text-[#8B8B8B]"} />
        </button>
        <div className="p-5 border-t border-[#2A2A2A] flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#8B8B8B] tracking-widest uppercase mb-1">{product.medium}</div>
            <div className="text-[#F5F5F5] font-semibold mb-2">{product.title}</div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-[#B89D5C] font-bold text-lg" style={{ fontFamily: "'Inter Tight', sans-serif" }}>€{product.price.toLocaleString()}</span>
            {!product.sold && (
              <button className="text-[10px] font-mono text-[#8B8B8B] tracking-widest uppercase hover:text-[#F5F5F5] transition-colors flex items-center gap-1">
                <ShoppingBag size={11} /> Inquire
              </button>
            )}
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

export function BestSellerCard({ product, delay = 0 }: { product: Painting; delay?: number }) {
    return (
      <RevealBlock delay={delay}>
        <Link
          href={`/shop/${product.id}`}
          className="group bg-[#0A0A0A] flex gap-6 p-6 w-full text-left hover:bg-[#111111] transition-colors"
        >
          <div className="w-24 h-32 shrink-0 overflow-hidden bg-[#171717]">
            <ImageWithFallback src={product.image} alt={product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="text-[10px] font-mono text-[#8B8B8B] tracking-[0.15em] uppercase mb-2">{product.medium}</div>
              <div className="text-[#F5F5F5] font-bold text-xl leading-tight">{product.title}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B89D5C] font-bold text-xl">€{product.price.toLocaleString()}</span>
              <span className="text-[#8B8B8B] text-xs font-mono flex items-center gap-1 group-hover:text-[#F5F5F5] transition-colors">
                View <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </Link>
      </RevealBlock>
    );
  }
