"use client";

import { ProductCardRead } from "@/api/openapi-client";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { RevealBlock } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: ProductCardRead;
  delay?: number;
  view?: "grid" | "list";
}

export function ProductCard({
  product,
  delay = 0,
  view = "grid",
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : (product.price ?? 0);

  return (
    <RevealBlock delay={delay}>
      <div className="group bg-dark relative h-full flex flex-col">
        <Link href={`/shop/${product.id}`} className="block w-full">
          <div
            className={cn(
              "relative overflow-hidden bg-muted-light",
              view === "grid" ? "aspect-3/4" : "aspect-video"
            )}
          >
            <ImageWithFallback
              src={product.primary_image || ""}
              alt={product.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
              <span className="text-text-main text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
                View Artwork <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </Link>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-4 right-4 w-8 h-8 bg-dark/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Heart
            size={14}
            fill={wishlisted ? "var(--color-gold)" : "none"}
            className={wishlisted ? "text-gold" : "text-text-muted"}
          />
        </button>
        <div className="p-5 border-t border-border flex-1 flex flex-col justify-between">
          <div>
            <div className="text-tiny font-mono text-text-muted tracking-widest uppercase mb-1">
              {product.medium?.name || "Original Work"}
            </div>
            <div className="text-text-main font-semibold mb-2">
              {product.title}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-gold font-bold text-lg">
              €{price.toLocaleString()}
            </span>
            <button className="text-tiny font-mono text-text-muted tracking-widest uppercase hover:text-text-main transition-colors flex items-center gap-1">
              <ShoppingBag size={11} /> Inquire
            </button>
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

export function BestSellerCard({
  product,
  delay = 0,
}: {
  product: ProductCardRead;
  delay?: number;
}) {
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : (product.price ?? 0);

  return (
    <RevealBlock delay={delay}>
      <Link
        href={`/shop/${product.id}`}
        className="group bg-dark flex gap-6 p-6 w-full text-left hover:bg-muted-light transition-colors"
      >
        <div className="w-24 h-32 shrink-0 overflow-hidden bg-muted">
          <ImageWithFallback
            src={product.primary_image || ""}
            alt={product.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <div className="text-tiny font-mono text-text-muted tracking-[0.15em] uppercase mb-2">
              {product.medium?.name || "Original Work"}
            </div>
            <div className="text-text-main font-bold text-xl leading-tight">
              {product.title}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gold font-bold text-xl">
              €{price.toLocaleString()}
            </span>
            <span className="text-text-muted text-xs font-mono flex items-center gap-1 group-hover:text-text-main transition-colors">
              View <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
}
