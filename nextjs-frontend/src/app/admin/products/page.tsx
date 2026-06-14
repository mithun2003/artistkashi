"use client";

import { deleteProduct, getProduct, listProducts } from "@/api/openapi-client";
import {
  ProductCardRead,
  ProductDetailRead,
  ProductStatus,
} from "@/api/openapi-client/types.gen";
import { PrimaryBtn } from "@/components/ui/buttons";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit3,
  ExternalLink,
  Filter,
  Grid,
  Info,
  List,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProductUploadModal from "./ProductUploadModal";
import { unwrap, unwrapPaginated } from "@/api/client-service";

type ProductFilter = ProductStatus | "all";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [products, setProducts] = useState<ProductCardRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductFilter>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductDetailRead | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await unwrapPaginated(
        listProducts({
          query: {
            search: searchTerm || undefined,
          },
        })
      );

      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (editId) {
      handleEditProduct(parseInt(editId));
    }
  }, [editId]);

  const handleDeleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Are you certain you wish to remove this masterpiece from the archival records?"
    );
    if (!confirmed) return;

    await unwrap(deleteProduct({ path: { product_id: id } }));
    toast.success("Piece successfully de-accessioned");
    fetchProducts();
  };

  const handleEditProduct = async (id: number) => {
    const data = await unwrap(getProduct({ path: { product_id: id } }));
    setEditingProduct(data);
    setIsUploadModalOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gold/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-widest text-text-main uppercase">
            Collection <span className="text-gold">Archive</span>
          </h1>
          <p className="text-label text-text-muted font-mono tracking-[0.3em] uppercase">
            Curating artistic boundaries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-dark/20 border border-border p-1">
            <ViewToggle
              active={view === "list"}
              onClick={() => setView("list")}
              icon={<List size={14} />}
            />
            <ViewToggle
              active={view === "grid"}
              onClick={() => setView("grid")}
              icon={<Grid size={14} />}
            />
          </div>
          <PrimaryBtn
            onClick={() => {
              setEditingProduct(null);
              setIsUploadModalOpen(true);
            }}
            className="px-5 py-2.5 text-2xs"
          >
            <Plus size={16} className="mr-2" /> New Piece
          </PrimaryBtn>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:max-w-sm group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search Archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark/10 border border-border/60 pl-10 pr-4 py-2 text-xs text-text-main focus:outline-none focus:border-gold transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
          <Filter size={12} className="text-gold/40 mr-1" />
          {["all", "draft", "published", "sold_out", "archived"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as ProductFilter)}
                className={cn(
                  "px-4 py-1.5 text-2xs font-mono tracking-widest uppercase border transition-all whitespace-nowrap",
                  statusFilter === status
                    ? "bg-gold/10 border-gold text-gold"
                    : "border-border/40 text-text-muted hover:border-gold/30 hover:text-text-main"
                )}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-100">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <div className="luxury-loader" />
              <p className="text-2xs font-mono uppercase tracking-[0.4em] text-gold/60">
                Searching Records
              </p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border border-dashed border-border/40 bg-dark/5"
            >
              <p className="text-xs text-text-muted uppercase tracking-widest font-light">
                No records found
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-2xs font-mono uppercase tracking-widest text-gold hover:text-text-main transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEditProduct(product.id)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto border border-border/40 bg-dark/5"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark/20 border-b border-border/40">
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      The Piece
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Provenance
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60">
                      Value
                    </th>
                    <th className="px-5 py-3 text-2xs font-mono uppercase tracking-widest text-gold/60 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={() => handleEditProduct(product.id)}
                      onDelete={() => handleDeleteProduct(product.id)}
                    />
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <ProductUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          setEditingProduct(null);
          fetchProducts();
        }}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="luxury-loader mx-auto my-20" />}>
      <AdminProductsContent />
    </Suspense>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ViewToggle({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1.5 transition-all duration-300",
        active ? "bg-gold text-dark" : "text-text-muted hover:text-text-main"
      )}
    >
      {icon}
    </button>
  );
}

function ProductGridCard({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductCardRead;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-muted-light border border-border overflow-hidden flex flex-col hover:border-gold/30 transition-all duration-500 rounded-sm"
    >
      <div className="aspect-4/5 relative overflow-hidden bg-dark">
        <ImageWithFallback
          src={product.primary_image || "/placeholder-image.jpg"}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/admin/products/${product.slug}`}
            className="p-2 bg-white text-dark hover:bg-gold transition-colors"
          >
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={onEdit}
            className="p-2 bg-white text-dark hover:bg-gold transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-widest line-clamp-1">
            {product.title}
          </h3>
          <p className="text-2xs text-text-muted font-mono uppercase tracking-widest">
            {product.category?.name || "Collection"}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-border/10 flex justify-between items-center">
          <span className="text-2xs font-mono text-gold font-bold">
            ${product.price}
          </span>
          <Link
            href={`/admin/products/${product.slug}`}
            className="text-text-muted hover:text-gold transition-colors"
          >
            <Info size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductCardRead;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border border-border overflow-hidden bg-dark shrink-0 rounded-sm">
            <ImageWithFallback
              src={product.primary_image || "/placeholder-image.jpg"}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <Link
              href={`/admin/products/${product.slug}`}
              className="text-xs font-bold text-text-main uppercase tracking-widest hover:text-gold transition-colors"
            >
              {product.title}
            </Link>
            <div className="text-2xs text-text-muted font-mono uppercase tracking-widest opacity-60">
              {product.slug}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="text-label font-mono uppercase tracking-widest text-text-main">
          {product.medium?.name || "Original"}
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="text-xs font-mono text-gold font-bold">
          ${product.price}
        </span>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/products/${product.slug}`}
            className="p-1.5 text-text-muted hover:text-gold"
            title="View Details"
          >
            <Info size={14} />
          </Link>
          <button
            onClick={onEdit}
            className="p-1.5 text-text-muted hover:text-gold"
            title="Refine"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-text-muted hover:text-red-500"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
