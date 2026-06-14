"use client";

import { use, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Heart,
  ArrowRight,
  X,
  Ruler,
  ShieldCheck,
  Award,
  Image as ImageIcon,
} from "lucide-react";
import { PrimaryBtn, GhostBtn } from "@/components/ui/buttons";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { getProductBySlug } from "@/api/openapi-client";
import { ProductDetailRead } from "@/api/openapi-client/types.gen";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { getSafeReturnTo } from "@/lib/auth-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { unwrap } from "@/api/client-service";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductDetailRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = getSafeReturnTo(pathname) ?? "/";
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      // In the public shop, 'id' in the URL is actually the slug
      const data = await unwrap(getProductBySlug({ path: { slug: id } }));
      setProduct(data);
      setActiveImage(
        data.primary_image || (data.images?.[0]?.image_url ?? null)
      );
    } catch (err) {
      console.error("Error fetching product:", err);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-dark">
        <div className="luxury-loader" />
        <p className="text-2xs font-mono uppercase tracking-[0.5em] text-gold animate-pulse">
          Illuminating Masterpiece
        </p>
      </div>
    );
  }

  if (!product) notFound();

  const handleInquire = () => {
    if (!user) {
      router.push(loginHref);
      return;
    }
    toast.info("Purchase flow is being curated.");
  };

  return (
    <main className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Sidebar */}
          <div className="lg:col-span-1 flex lg:flex-col gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0">
            {product.images?.map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => setActiveImage(img.image_url)}
                className={cn(
                  "w-16 h-20 flex-shrink-0 border transition-all duration-500 overflow-hidden",
                  activeImage === img.image_url
                    ? "border-gold scale-105"
                    : "border-border/40 grayscale hover:grayscale-0"
                )}
              >
                <img
                  src={img.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Visual */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.div
              layoutId="main-image"
              className="relative aspect-[4/5] bg-muted-light/5 border border-border/40 overflow-hidden group cursor-zoom-in"
              onClick={() => activeImage && setZoomed(true)}
            >
              {activeImage ? (
                <ImageWithFallback
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-dark/40 text-text-muted/20 gap-4">
                  <ImageIcon size={48} strokeWidth={1} />
                  <span className="text-2xs font-mono uppercase tracking-widest">
                    Image under curation
                  </span>
                </div>
              )}
              {activeImage && (
                <div className="absolute bottom-6 right-6 bg-dark/80 backdrop-blur-md px-4 py-2 border border-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-2xs font-mono text-gold uppercase tracking-widest flex items-center gap-2">
                    <Eye size={12} /> Expand Vision
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Narrative & Valuation */}
          <div className="lg:col-span-5 order-3 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1 bg-gold/5 border border-gold/10 text-2xs font-mono text-gold uppercase tracking-[0.3em]">
                {product.medium?.name || "Original Work"}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-text-main uppercase tracking-tight leading-none">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-mono text-text-muted uppercase tracking-widest">
                <span>{product.category?.name}</span>
                <span className="w-1 h-1 bg-border/40 rounded-full" />
                <span>By Elena Marchetti</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-gold tracking-tighter">
              ${parseFloat(product.price || "0").toLocaleString()}
            </div>

            <p className="text-text-muted text-sm leading-relaxed font-light">
              {product.short_description}
            </p>

            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <InfoItem
                  icon={<Ruler size={14} />}
                  label="Dimensions"
                  value={product.variants?.[0]?.dimensions || "120 × 90 cm"}
                />
                <InfoItem
                  icon={<ShieldCheck size={14} />}
                  label="Provenance"
                  value="Certified Original"
                />
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryBtn
                  onClick={handleInquire}
                  className="w-full justify-center py-5"
                >
                  Inquire to Acquire <ArrowRight size={16} className="ml-2" />
                </PrimaryBtn>
                <GhostBtn className="w-full justify-center py-5 border-border/20">
                  <Heart size={16} className="mr-2" /> Preserve to Wishlist
                </GhostBtn>
              </div>
            </div>

            <div className="pt-10 border-t border-border/20 space-y-6">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-[0.2em]">
                Archival Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <DetailRow
                  label="Style"
                  value={product.style || "Contemporary"}
                />
                <DetailRow
                  label="Subject"
                  value={product.subject || "Celestial"}
                />
                <DetailRow
                  label="Created"
                  value={product.year_created?.toString() || "2024"}
                />
                <DetailRow label="Shipping" value="Insured Worldwide" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Narrative Section */}
        {product.description && (
          <div className="mt-32 max-w-3xl mx-auto space-y-10">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-gold/20" />
              <Award className="text-gold opacity-40" size={24} />
              <div className="h-px flex-1 bg-gold/20" />
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-text-main uppercase tracking-widest text-center">
                Artist's Narrative
              </h2>
              <div className="text-text-muted leading-loose text-base font-light first-letter:text-5xl first-letter:font-bold first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                {product.description}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Immersive Zoom */}
      <AnimatePresence>
        {zoomed && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/98 flex items-center justify-center p-8 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-8 right-8 text-text-muted hover:text-gold transition-colors">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={activeImage}
              alt=""
              className="max-w-full max-h-full object-contain shadow-2xl shadow-gold/5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-2xs font-mono text-gold/60 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="text-xs text-text-main font-medium">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border/10 last:border-0">
      <span className="text-2xs font-mono text-text-muted uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xs text-text-main font-medium">{value}</span>
    </div>
  );
}
