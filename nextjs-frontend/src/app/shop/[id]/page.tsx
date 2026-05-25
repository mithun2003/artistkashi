"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Heart, ArrowRight, X } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { PrimaryBtn, GhostBtn } from "@/components/ui/buttons";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { PAINTINGS } from "@/data/constants";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { getSafeReturnTo } from "@/lib/auth-api";
import { toast } from "sonner";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const paintingId = parseInt(resolvedParams.id);
  const painting = PAINTINGS.find((p) => p.id === paintingId) || PAINTINGS[0];

  const [zoomed, setZoomed] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = getSafeReturnTo(pathname) ?? "/";
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;

  if (!painting) notFound();

  const handleInquire = () => {
    if (!user) {
      router.push(loginHref);
      return;
    }

    toast.info("Purchase flow coming soon.");
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#2A2A2A]">
          {/* Image */}
          <div className="bg-[#0A0A0A] relative">
            <button
              onClick={() => setZoomed(true)}
              className="group w-full block relative overflow-hidden aspect-[4/5] cursor-zoom-in"
            >
              <ImageWithFallback
                src={painting.image}
                alt={painting.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 right-6 bg-[#0A0A0A]/70 backdrop-blur text-[#F5F5F5] text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <Eye size={11} /> Zoom
              </div>
            </button>
          </div>

          {/* Details */}
          <div className="bg-[#0A0A0A] p-10 lg:p-14">
            <div className="text-[11px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-4">Original Oil Painting</div>
            <h1 className="text-[clamp(28px,3vw,48px)] font-extrabold tracking-[-0.02em] text-[#F5F5F5] leading-tight mb-3" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {painting.title}
            </h1>
            <div className="text-[#8B8B8B] text-sm font-mono mb-8">{painting.medium}</div>
            <div className="text-[#F5F5F5] font-extrabold text-5xl mb-10" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              €{painting.price.toLocaleString()}
            </div>

            <div className="space-y-4 mb-10 text-sm">
              {[
                { label: "Artist", value: "Elena Marchetti" },
                { label: "Year", value: "2025" },
                { label: "Medium", value: "Oil on linen" },
                { label: "Dimensions", value: "120 × 90 cm" },
                { label: "Provenance", value: "Direct from artist studio" },
                { label: "Certificate", value: "Included with purchase" },
              ].map((d) => (
                <div key={d.label} className="flex gap-6 border-b border-[#1A1A1A] pb-4">
                  <span className="text-[#8B8B8B] font-mono text-[12px] uppercase tracking-widest w-28 shrink-0">{d.label}</span>
                  <span className="text-[#F5F5F5]">{d.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <PrimaryBtn type="button" onClick={handleInquire} className="w-full justify-center">
                Inquire to Purchase <ArrowRight size={16} />
              </PrimaryBtn>
              <GhostBtn className="w-full justify-center">
                <Heart size={16} /> Save to Wishlist
              </GhostBtn>
            </div>

            <div className="mt-10 p-6 bg-[#111111] border border-[#2A2A2A]">
              <p className="text-[#8B8B8B] text-sm leading-relaxed">
                All original works ship in bespoke archival packaging with a certificate of provenance, artist statement, and full documentation. Insured worldwide shipping included.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 flex items-center justify-center cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-6 right-8 text-[#8B8B8B] hover:text-[#F5F5F5]">
              <X size={24} />
            </button>
            <ImageWithFallback src={painting.image} alt={painting.title} className="max-w-[90vw] max-h-[90vh] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
