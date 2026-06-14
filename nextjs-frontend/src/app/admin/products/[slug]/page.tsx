"use client";

import { getProductBySlug, listReviews } from "@/api/openapi-client";
import {
  ProductDetailRead,
  ReviewReadPublic,
} from "@/api/openapi-client/types.gen";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { Tag } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Edit3,
  ExternalLink,
  Info,
  Layers,
  MessageSquare,
  Package,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { unwrap, unwrapPaginated } from "@/api/client-service";

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductDetailRead | null>(null);
  const [reviews, setReviews] = useState<ReviewReadPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unwrap(getProductBySlug({ path: { slug } }));
      setProduct(data);
      // Once product is loaded, fetch reviews using its ID
      fetchReviews(data.id);
    } catch (err: unknown) {
      console.error("Error fetching product:", err);
      setError((err as Error).message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchReviews = async (productId: number) => {
    try {
      setReviewsLoading(true);
      const { data } = await unwrapPaginated(
        listReviews({
          query: {
            entity_id: productId,
            review_type: "product",
          },
        })
      );
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-red-500 font-mono uppercase tracking-widest">
          {error}
        </p>
        <button
          onClick={fetchProduct}
          className="text-2xs font-mono uppercase tracking-widest text-gold hover:text-text-main transition-colors"
        >
          Retry Access
        </button>
        <Link
          href="/admin/products"
          className="text-2xs font-mono uppercase tracking-widest text-text-muted hover:text-gold transition-colors"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gold/10 pb-6">
        <div className="space-y-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-2xs font-mono uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Archive
          </Link>
          <div className="space-y-1">
            {loading ? (
              <Skeleton className="h-10 w-64 mb-2" />
            ) : (
              <h1 className="text-h3 font-bold tracking-widest text-text-main uppercase">
                {product?.title}
              </h1>
            )}
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <Tag label={product?.status || "Draft"} />
              )}
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="text-2xs font-mono uppercase tracking-widest text-text-muted">
                  Slug: {product?.slug}
                </span>
              )}
            </div>
          </div>
        </div>
        {!loading && (
          <div className="flex gap-3">
            <Link
              href={`/admin/products?edit=${product?.id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold text-dark text-2xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-all"
            >
              <Edit3 size={14} /> Refine Piece
            </Link>
            <Link
              href={`/shop/${product?.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-muted-light border border-border text-text-main text-2xs font-bold uppercase tracking-widest hover:border-gold/30 transition-all"
            >
              <ExternalLink size={14} /> Public View
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xs font-mono uppercase tracking-[0.3em] text-gold/60 flex items-center gap-2">
              <Package size={14} /> Primary Visual
            </h3>
            <div className="aspect-4/5 border border-border bg-dark/5 overflow-hidden rounded-sm">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ImageWithFallback
                  src={product?.primary_image || "/placeholder-image.jpg"}
                  alt={product?.title || "Product"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xs font-mono uppercase tracking-[0.3em] text-gold/60">
              Supporting Gallery
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-sm" />
                  ))
                : product?.images
                    ?.filter((img) => !img.is_primary)
                    .map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square border border-border bg-dark/5 overflow-hidden rounded-sm"
                      >
                        <ImageWithFallback
                          src={img.image_url}
                          alt="Gallery"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
              {!loading &&
                product?.images?.filter((img) => !img.is_primary).length ===
                  0 && (
                  <div className="col-span-3 py-8 border border-dashed border-border/40 flex items-center justify-center">
                    <p className="text-2xs font-mono uppercase tracking-widest text-text-muted opacity-40">
                      No supporting visuals
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* General Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gold border-b border-gold/10 pb-2 flex items-center gap-2">
              <Info size={14} /> Archival Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <DetailItem
                label="Medium"
                value={product?.medium?.name || undefined}
                loading={loading}
              />
              <DetailItem
                label="Category"
                value={product?.category?.name || undefined}
                loading={loading}
              />
              <DetailItem
                label="Style"
                value={product?.style || undefined}
                loading={loading}
              />
              <DetailItem
                label="Subject"
                value={product?.subject || undefined}
                loading={loading}
              />
              <DetailItem
                label="Year Created"
                value={product?.year_created?.toString() || undefined}
                loading={loading}
              />
              <DetailItem
                label="Weight"
                value={
                  product?.weight_grams ? `${product.weight_grams}g` : undefined
                }
                loading={loading}
              />
              <DetailItem
                label="Original Available"
                value={product?.is_original_available ? "Yes" : "No"}
                loading={loading}
              />
              <DetailItem
                label="Framed"
                value={product?.is_framed ? "Yes" : "No"}
                loading={loading}
              />
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-2xs font-mono uppercase tracking-widest text-text-muted">
                Description
              </p>
              {loading ? (
                <SkeletonText lines={4} />
              ) : (
                <p className="text-sm text-text-main leading-relaxed font-light">
                  {product?.description || "No description provided."}
                </p>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gold border-b border-gold/10 pb-2 flex items-center gap-2">
              <Layers size={14} /> Curated Variants
            </h3>
            <div className="overflow-x-auto border border-border/40 bg-dark/5 rounded-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark/20 border-b border-border/40">
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Type
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Dimensions
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Stock
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-5 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-5 py-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-5 py-4">
                            <Skeleton className="h-4 w-12" />
                          </td>
                          <td className="px-5 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                        </tr>
                      ))
                    : product?.variants?.map((v, i) => (
                        <tr
                          key={i}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-text-main">
                            {v.variant_type_name || "Standard"}
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-text-muted">
                            {v.dimensions || "N/A"}
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-text-main">
                            {v.stock_quantity}
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-gold font-bold">
                            ${v.price}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gold border-b border-gold/10 pb-2 flex items-center gap-2">
              <Search size={14} /> Discoverability (SEO)
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-2xs font-mono uppercase tracking-widest text-text-muted">
                  Meta Title
                </p>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div className="p-4 bg-dark/20 border border-border text-xs text-text-main font-mono">
                    {product?.meta_title || "Not Set"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-2xs font-mono uppercase tracking-widest text-text-muted">
                  Meta Description
                </p>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="p-4 bg-dark/20 border border-border text-xs text-text-main font-mono leading-relaxed">
                    {product?.meta_description || "Not Set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6 pt-12">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gold border-b border-gold/10 pb-2 flex items-center gap-2">
              <MessageSquare size={14} /> Archival Feedback (Reviews)
            </h3>
            <div className="space-y-4">
              {reviewsLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border border-border/40 bg-dark/5 space-y-3"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <SkeletonText lines={2} />
                  </div>
                ))
              ) : reviews.length === 0 ? (
                <div className="py-12 border border-dashed border-border/40 flex flex-col items-center justify-center gap-2">
                  <p className="text-2xs font-mono uppercase tracking-widest text-text-muted opacity-40">
                    No archival feedback recorded
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-border bg-dark/10 space-y-4 hover:border-gold/20 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-text-main uppercase tracking-widest">
                          Anonymous Curator
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={cn(
                                i < review.rating
                                  ? "text-gold fill-gold"
                                  : "text-border"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-2xs font-mono text-text-muted uppercase">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted italic leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  loading,
}: {
  label: string;
  value?: string;
  loading: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-2xs font-mono uppercase tracking-widest text-text-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-5 w-32" />
      ) : (
        <p className="text-xs font-bold uppercase tracking-widest text-text-main">
          {value || "Not Recorded"}
        </p>
      )}
    </div>
  );
}
