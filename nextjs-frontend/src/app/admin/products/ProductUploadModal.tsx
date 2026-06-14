"use client";

import {
  createProduct,
  listCategories,
  listMediums,
  listVariantTypes,
  updateProduct,
} from "@/api/openapi-client";
import {
  DimensionUnit,
  ProductCategoryRead,
  ProductCreate,
  ProductDetailRead,
  ProductImageRead,
  ProductMediumRead,
  ProductStatus,
  ProductVariantCreate,
  ProductVariantUpdate,
  VariantTypeRead,
} from "@/api/openapi-client/types.gen";
import { PrimaryBtn } from "@/components/ui/buttons";
import { CustomSelect } from "@/components/ui/custom-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Image as ImageIcon,
  Info,
  Layers,
  Layout,
  Plus,
  Save,
  Settings,
  Star,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { unwrap, unwrapPaginated } from "@/api/client-service";

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: ProductDetailRead | null;
}

interface ExternalImage {
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

const PRODUCT_STATUSES: ProductStatus[] = [
  "draft",
  "published",
  "sold_out",
  "archived",
];

const DEFAULT_VARIANT: ProductVariantCreate = {
  variant_type_id: 0,
  price: "0.00",
  width: "0.00",
  height: "0.00",
  dimension_unit: "cm",
  stock_quantity: 0,
  is_default: true,
  is_available: true,
  sku: null,
};

export default function ProductUploadModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductUploadModalProps) {
  const [formData, setFormData] = useState<ProductCreate>({
    title: "",
    slug: null,
    medium_id: null,
    short_description: null,
    description: null,
    style: null,
    subject: null,
    year_created: null,
    is_original_available: false,
    is_framed: false,
    certificate_of_authenticity: false,
    category_id: null,
    weight_grams: null,
    is_featured: false,
    sort_order: 0,
    status: "draft",
    meta_title: null,
    meta_description: null,
  });

  const [variants, setVariants] = useState<ProductVariantUpdate[]>([
    { ...DEFAULT_VARIANT },
  ]);
  const [categories, setCategories] = useState<ProductCategoryRead[]>([]);
  const [mediums, setMediums] = useState<ProductMediumRead[]>([]);
  const [variantTypes, setVariantTypes] = useState<VariantTypeRead[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [externalImages, setExternalImages] = useState<ExternalImage[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImageRead[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState<number[]>([]);
  const [primaryNewIndex, setPrimaryNewIndex] = useState<{
    type: "file" | "external";
    index: number;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSlugManuallyModified, setIsSlugManuallyModified] = useState(false);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      slug: null,
      medium_id: null,
      short_description: null,
      description: null,
      style: null,
      subject: null,
      year_created: null,
      is_original_available: true,
      is_framed: false,
      certificate_of_authenticity: false,
      category_id: null,
      weight_grams: null,
      is_featured: false,
      sort_order: 0,
      status: "draft",
      meta_title: null,
      meta_description: null,
    });
    setVariants([{ ...DEFAULT_VARIANT }]);
    setPreviews([]);
    setImages([]);
    setExternalImages([]);
    setExistingImages([]);
    setDeletedImageIds([]);
    setDeletedVariantIds([]);
    setPrimaryNewIndex(null);
    setIsSlugManuallyModified(false);
    setActiveTab("general");
  }, []);

  useEffect(() => {
    if (!isSlugManuallyModified && !product) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.title ? slugify(prev.title) : "",
      }));
    }
  }, [formData.title, isSlugManuallyModified, product]);

  const fetchMetadata = useCallback(async () => {
    const [
      { data: categoriesData },
      { data: mediumsData },
      { data: variantTypesData },
    ] = await Promise.all([
      unwrapPaginated(listCategories()),
      unwrapPaginated(listMediums()),
      unwrapPaginated(listVariantTypes()),
    ]);

    setCategories(categoriesData);
    setMediums(mediumsData);
    setVariantTypes(variantTypesData);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
      if (product) {
        setFormData({
          title: product.title,
          slug: product.slug,
          medium_id: product.medium?.id ?? null,
          short_description: product.short_description,
          description: product.description,
          style: product.style,
          subject: product.subject,
          year_created: product.year_created,
          is_original_available: product.is_original_available,
          is_framed: product.is_framed,
          certificate_of_authenticity: product.certificate_of_authenticity,
          category_id: product.category?.id ?? null,
          weight_grams: product.weight_grams,
          is_featured: product.is_featured,
          sort_order: product.sort_order,
          status: product.status,
          meta_title: product.meta_title,
          meta_description: product.meta_description,
        });

        if (product.variants && product.variants.length > 0) {
          setVariants(
            product.variants.map((v) => ({
              id: v.id,
              variant_type_id: v.variant_type_id ?? 0,
              price: v.price,
              width: v.width ?? "0.00",
              height: v.height ?? "0.00",
              dimension_unit: v.dimension_unit,
              stock_quantity: v.stock_quantity,
              is_default: v.is_default,
              is_available: v.is_available,
              sku: v.sku,
            }))
          );
        }

        if (product.images) {
          setExistingImages(product.images);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, product, resetForm, fetchMetadata]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      if (
        updated.length > 0 &&
        primaryNewIndex === null &&
        !existingImages.some((img) => img.is_primary) &&
        externalImages.length === 0
      ) {
        setPrimaryNewIndex({ type: "file", index: prev.length });
      }
      return updated;
    });
  };

  const addExternalImage = () => {
    setExternalImages((prev) => {
      const updated = [
        ...prev,
        {
          image_url: "",
          alt_text: "",
          is_primary: false,
          sort_order: prev.length + existingImages.length + previews.length,
        },
      ];
      if (
        updated.length === 1 &&
        primaryNewIndex === null &&
        !existingImages.some((img) => img.is_primary) &&
        previews.length === 0
      ) {
        setPrimaryNewIndex({ type: "external", index: 0 });
      }
      return updated;
    });
  };

  const removeExternalImage = (index: number) => {
    setExternalImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (
        primaryNewIndex?.type === "external" &&
        primaryNewIndex.index === index
      ) {
        setPrimaryNewIndex(null);
      } else if (
        primaryNewIndex?.type === "external" &&
        primaryNewIndex.index > index
      ) {
        setPrimaryNewIndex({
          ...primaryNewIndex,
          index: primaryNewIndex.index - 1,
        });
      }
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      const updated = prev.filter((_, i) => i !== index);
      if (primaryNewIndex?.type === "file" && primaryNewIndex.index === index) {
        setPrimaryNewIndex(null);
      } else if (
        primaryNewIndex?.type === "file" &&
        primaryNewIndex.index > index
      ) {
        setPrimaryNewIndex({
          ...primaryNewIndex,
          index: primaryNewIndex.index - 1,
        });
      }
      return updated;
    });
  };

  const setPrimaryExisting = (id: number) => {
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: img.id === id }))
    );
    setPrimaryNewIndex(null);
    setExternalImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: false }))
    );
  };

  const setPrimaryNew = (index: number) => {
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: false }))
    );
    setExternalImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: false }))
    );
    setPrimaryNewIndex({ type: "file", index });
  };

  const setPrimaryExternal = (index: number) => {
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: false }))
    );
    setPrimaryNewIndex({ type: "external", index });
    setExternalImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index }))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...DEFAULT_VARIANT, is_default: false }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => {
      // If we are editing a product, we need to track which variants were removed
      // Note: this logic assumes the variants array index matches the product.variants array index
      // which is true initially. If we add new variants, they won't have an ID.
      const variantToRemove = product?.variants?.[index];
      if (variantToRemove?.id) {
        setDeletedVariantIds((d) => [...d, variantToRemove.id]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setDeletedImageIds((prev) => [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const externalImagesWithPrimary = externalImages.map((img, i) => ({
        ...img,
        is_primary:
          primaryNewIndex?.type === "external" && primaryNewIndex.index === i,
      }));

      // When updating, we might want to preserve which existing image is primary
      const bodyProduct = { ...formData };

      if (product) {
        await unwrap(
          updateProduct({
            path: { product_id: product.id },
            body: {
              payload: {
                product: bodyProduct,
                variants: variants,
                external_images: externalImagesWithPrimary,
                deleted_variant_ids: deletedVariantIds,
                deleted_image_ids: deletedImageIds,
              },
              files: images,
            },
          })
        );
      } else {
        await unwrap(
          createProduct({
            body: {
              payload: {
                product: bodyProduct,
                variants: variants as ProductVariantCreate[],
                external_images: externalImagesWithPrimary,
              },
              files: images,
            },
          })
        );
      }

      toast.success(product ? "Piece Preserved" : "Piece Added to Archive");
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const TABS = [
    { value: "general", icon: <Info size={14} />, label: "Essence" },
    { value: "description", icon: <Layout size={14} />, label: "Narrative" },
    { value: "variants", icon: <Layers size={14} />, label: "Formats" },
    { value: "media", icon: <ImageIcon size={14} />, label: "Gallery" },
    { value: "settings", icon: <Settings size={14} />, label: "Meta" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-dark/95 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full h-full md:h-auto md:max-w-5xl bg-muted-light border-x md:border border-border shadow-2xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-dark/40 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <ImageIcon className="text-gold" size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-[0.2em] text-text-main uppercase">
                      {product ? "Curate Piece" : "New Acquisition"}
                    </h2>
                    <p className="hidden md:block text-2xs text-gold/60 font-mono tracking-[0.3em] uppercase mt-0.5">
                      Refining the Artist's Legacy
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-all rounded-full text-text-muted hover:text-gold"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="bg-dark/10 border-b border-border overflow-x-auto scrollbar-hide shrink-0">
                  <TabsList className="bg-transparent h-auto p-0 flex min-w-max">
                    {TABS.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-2xs font-mono tracking-widest uppercase border-r border-border last:border-r-0 data-[state=active]:bg-gold/10 data-[state=active]:text-gold rounded-none transition-all duration-500 min-w-30 md:min-w-0"
                        )}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto modal-pad gap-stack scrollbar-hide"
                >
                  <TabsContent
                    value="general"
                    className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label>Piece Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Compelling title..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL Slug</Label>
                        <Input
                          value={formData.slug || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFormData((p) => ({
                              ...p,
                              slug: e.target.value,
                            }));
                            setIsSlugManuallyModified(true);
                          }}
                          placeholder="the-masterpiece-slug"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <CustomSelect
                        label="Collection"
                        placeholder="Select Collection"
                        options={categories.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        value={formData.category_id || ""}
                        onChange={(val) =>
                          setFormData((p) => ({
                            ...p,
                            category_id: val ? Number(val) : null,
                          }))
                        }
                      />
                      <CustomSelect
                        label="Artistic Medium"
                        placeholder="Select Medium"
                        options={mediums.map((m) => ({
                          value: m.id,
                          label: m.name,
                        }))}
                        value={formData.medium_id || ""}
                        onChange={(val) =>
                          setFormData((p) => ({
                            ...p,
                            medium_id: val ? Number(val) : null,
                          }))
                        }
                      />
                      <div className="space-y-2">
                        <Label>Year of Creation</Label>
                        <Input
                          type="number"
                          value={formData.year_created || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((p) => ({
                              ...p,
                              year_created: e.target.value
                                ? Number(e.target.value)
                                : null,
                            }))
                          }
                          placeholder={new Date().getFullYear().toString()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-3">
                        <Label>Curatorial Status</Label>
                        <div className="flex flex-wrap gap-2">
                          {PRODUCT_STATUSES.map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setFormData((p) => ({ ...p, status }))
                              }
                              className={cn(
                                "px-4 py-2 text-2xs font-mono tracking-widest uppercase border transition-all duration-300",
                                formData.status === status
                                  ? "bg-gold border-gold text-dark font-bold shadow-lg shadow-gold/20"
                                  : "border-border/60 text-text-muted hover:border-gold/40 hover:text-gold"
                              )}
                            >
                              {status.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 pt-6">
                        <Checkbox
                          id="is_featured"
                          checked={formData.is_featured ?? false}
                          onCheckedChange={(c) =>
                            setFormData((p) => ({ ...p, is_featured: !!c }))
                          }
                        />
                        <label
                          htmlFor="is_featured"
                          className="text-label font-bold text-text-main cursor-pointer uppercase tracking-[0.2em] hover:text-gold transition-colors"
                        >
                          Designate as Featured Piece
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="description"
                    className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="space-y-2">
                      <Label>Curator's Premise (Short Description)</Label>
                      <TextArea
                        value={formData.short_description || ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData((p) => ({
                            ...p,
                            short_description: e.target.value,
                          }))
                        }
                        placeholder="A concise, poetic summary for listings..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>The Artist's Journey (Full Description)</Label>
                      <TextArea
                        value={formData.description || ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Detail the inspiration, technical process, and narrative depth..."
                        rows={10}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="variants"
                    className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border/40">
                      <div>
                        <h3 className="text-lg font-bold text-text-main tracking-tight uppercase">
                          Valuation & Dimensions
                        </h3>
                        <p className="text-xs text-gold/60 font-mono tracking-[0.2em] uppercase mt-0.5">
                          Offering varied perspectives of your art
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center gap-2.5 text-2xs font-mono uppercase tracking-[0.2em] text-gold hover:text-text-main transition-all group"
                      >
                        <div className="w-6 h-6 border border-gold/40 group-hover:border-gold flex items-center justify-center transition-all">
                          <Plus size={12} />
                        </div>
                        Add Format
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {variants.map((variant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-card rounded-lg border border-border/60 bg-dark/20 relative group hover:border-gold/30 transition-all shadow-inner"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 md:gap-8">
                            <CustomSelect
                              label="Format Type"
                              placeholder="Select Format"
                              options={variantTypes.map((vt) => ({
                                value: vt.id,
                                label: vt.name,
                              }))}
                              value={variant.variant_type_id ?? ""}
                              onChange={(val) =>
                                setVariants((prev) => {
                                  const n = [...prev];
                                  n[index].variant_type_id = Number(val);
                                  return n;
                                })
                              }
                            />
                            <div className="space-y-2">
                              <Label>Valuation ($)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.price ?? ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  setVariants((prev) => {
                                    const n = [...prev];
                                    n[index].price = e.target.value;
                                    return n;
                                  })
                                }
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Width</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.width ?? ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  setVariants((prev) => {
                                    const n = [...prev];
                                    n[index].width = e.target.value;
                                    return n;
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Height</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.height ?? ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  setVariants((prev) => {
                                    const n = [...prev];
                                    n[index].height = e.target.value;
                                    return n;
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-end justify-between mt-6 md:mt-8 gap-6">
                            <CustomSelect
                              label="Unit"
                              placeholder="Unit"
                              options={[
                                { value: "cm", label: "cm" },
                                { value: "inch", label: "inch" },
                                { value: "mm", label: "mm" },
                              ]}
                              value={variant.dimension_unit ?? ""}
                              onChange={(val) =>
                                setVariants((prev) => {
                                  const n = [...prev];
                                  n[index].dimension_unit =
                                    val as DimensionUnit;
                                  return n;
                                })
                              }
                              className="w-32"
                            />
                            <div className="space-y-2 w-32">
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                value={variant.stock_quantity ?? ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  setVariants((prev) => {
                                    const n = [...prev];
                                    n[index].stock_quantity = Number(
                                      e.target.value
                                    );
                                    return n;
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-3 mb-2.5">
                              <Checkbox
                                id={`default-${index}`}
                                checked={variant.is_default ?? false}
                                onCheckedChange={(c) =>
                                  setVariants((prev) =>
                                    prev.map((v, i) => ({
                                      ...v,
                                      is_default: i === index ? !!c : false,
                                    }))
                                  )
                                }
                              />
                              <label
                                htmlFor={`default-${index}`}
                                className="text-label font-mono uppercase tracking-[0.2em] text-text-muted cursor-pointer hover:text-gold transition-colors"
                              >
                                Principal
                              </label>
                            </div>
                            <div className="flex items-center justify-end mb-1">
                              {variants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  className="w-8 h-8 flex items-center justify-center text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-full"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="media"
                    className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-border/40 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-text-main tracking-tight uppercase">
                            Visual Gallery
                          </h3>
                          <p className="text-xs text-gold/60 font-mono tracking-[0.2em] uppercase mt-0.5">
                            Capturing the essence of your creation
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={addExternalImage}
                          className="flex items-center gap-2.5 text-2xs font-mono uppercase tracking-[0.2em] text-gold hover:text-text-main transition-all group"
                        >
                          <div className="w-6 h-6 border border-gold/40 group-hover:border-gold flex items-center justify-center transition-all">
                            <Plus size={12} />
                          </div>
                          Add URL
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {/* Existing Images */}
                        {existingImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative aspect-4/5 border border-border/60 overflow-hidden group shadow-lg transition-all duration-500 hover:border-gold/40 rounded-md bg-dark/20"
                          >
                            <img
                              src={img.image_url}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPrimaryExisting(img.id)}
                                className={cn(
                                  "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500",
                                  img.is_primary
                                    ? "bg-gold text-dark shadow-xl shadow-gold/20 scale-110"
                                    : "bg-dark/80 text-white hover:text-gold"
                                )}
                                title="Set as Primary"
                              >
                                <Star
                                  size={16}
                                  fill={
                                    img.is_primary ? "currentColor" : "none"
                                  }
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeExistingImage(img.id)}
                                className="w-10 h-10 flex items-center justify-center bg-red-600/80 text-white rounded-full hover:bg-red-600 transition-all shadow-xl"
                                title="Delete Archive"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {img.is_primary && (
                              <div className="absolute top-0 left-0 bg-gold text-dark text-2xs font-extrabold uppercase px-3 py-1.5 shadow-lg tracking-widest">
                                Principal
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Uploaded Previews */}
                        {previews.map((preview, i) => (
                          <div
                            key={`new-${i}`}
                            className="relative aspect-4/5 border border-gold/40 overflow-hidden group shadow-lg transition-all duration-500 hover:border-gold/60 rounded-md bg-dark/20"
                          >
                            <img
                              src={preview}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPrimaryNew(i)}
                                className={cn(
                                  "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500",
                                  primaryNewIndex?.type === "file" &&
                                    primaryNewIndex.index === i
                                    ? "bg-gold text-dark shadow-xl shadow-gold/20 scale-110"
                                    : "bg-dark/80 text-white hover:text-gold"
                                )}
                                title="Set as Primary"
                              >
                                <Star
                                  size={16}
                                  fill={
                                    primaryNewIndex?.type === "file" &&
                                    primaryNewIndex.index === i
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="w-10 h-10 flex items-center justify-center bg-red-600/80 text-white rounded-full hover:bg-red-600 transition-all shadow-xl"
                                title="Remove Vision"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {primaryNewIndex?.type === "file" &&
                              primaryNewIndex.index === i && (
                                <div className="absolute top-0 left-0 bg-gold text-dark text-2xs font-extrabold uppercase px-3 py-1.5 shadow-lg tracking-widest">
                                  Principal
                                </div>
                              )}
                          </div>
                        ))}

                        {/* File Upload Trigger */}
                        <label className="relative aspect-4/5 border-2 border-dashed border-border/60 hover:border-gold/60 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer bg-dark/10 group overflow-hidden rounded-md">
                          <motion.div
                            whileHover={{ y: -3 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all duration-500">
                              <Plus
                                className="text-text-muted group-hover:text-gold transition-colors duration-500"
                                size={24}
                              />
                            </div>
                            <span className="text-2xs font-mono uppercase tracking-[0.2em] text-text-muted group-hover:text-text-main transition-colors text-center px-2">
                              Upload Piece
                            </span>
                          </motion.div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* External Images Section */}
                    {externalImages.length > 0 && (
                      <div className="space-y-6 pt-6 border-t border-border/20">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                          <h4 className="text-label font-bold text-gold uppercase tracking-[0.2em]">
                            External Visions (URLs)
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {externalImages.map((extImg, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-5 border border-border/40 bg-dark/20 rounded-lg group hover:border-gold/30 transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                            >
                              <div className="flex-1 w-full space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label>Image URL</Label>
                                    <Input
                                      value={extImg.image_url}
                                      onChange={(e) => {
                                        const updated = [...externalImages];
                                        updated[index].image_url =
                                          e.target.value;
                                        setExternalImages(updated);
                                      }}
                                      placeholder="https://..."
                                      className="py-2"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label>Alt Text</Label>
                                    <Input
                                      value={extImg.alt_text || ""}
                                      onChange={(e) => {
                                        const updated = [...externalImages];
                                        updated[index].alt_text =
                                          e.target.value;
                                        setExternalImages(updated);
                                      }}
                                      placeholder="Descriptive text..."
                                      className="py-2"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setPrimaryExternal(index)}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-2xs font-mono uppercase tracking-widest",
                                    primaryNewIndex?.type === "external" &&
                                      primaryNewIndex.index === index
                                      ? "bg-gold border-gold text-dark font-bold"
                                      : "border-border/60 text-text-muted hover:border-gold/40 hover:text-gold"
                                  )}
                                >
                                  <Star
                                    size={12}
                                    fill={
                                      primaryNewIndex?.type === "external" &&
                                      primaryNewIndex.index === index
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                  Principal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeExternalImage(index)}
                                  className="w-8 h-8 flex items-center justify-center text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="settings"
                    className="mt-0 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <div className="pb-3 border-b border-gold/20">
                          <h4 className="text-label font-bold text-gold uppercase tracking-[0.3em]">
                            Tangible Attributes
                          </h4>
                        </div>
                        <div className="space-y-6">
                          <SwitchField
                            label="Original Masterpiece Available"
                            checked={formData.is_original_available || false}
                            onChange={(c: boolean) =>
                              setFormData((p) => ({
                                ...p,
                                is_original_available: c,
                              }))
                            }
                          />
                          <SwitchField
                            label="Exquisite Framing Included"
                            checked={formData.is_framed || false}
                            onChange={(c: boolean) =>
                              setFormData((p) => ({ ...p, is_framed: c }))
                            }
                          />
                          <SwitchField
                            label="Certificate of Authenticity"
                            checked={
                              formData.certificate_of_authenticity || false
                            }
                            onChange={(c: boolean) =>
                              setFormData((p) => ({
                                ...p,
                                certificate_of_authenticity: c,
                              }))
                            }
                          />
                          <div className="space-y-3 pt-4">
                            <Label>Total Mass (Grams)</Label>
                            <Input
                              type="number"
                              value={formData.weight_grams || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setFormData((p) => ({
                                  ...p,
                                  weight_grams: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }))
                              }
                              placeholder="e.g. 1500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="pb-3 border-b border-gold/20">
                          <h4 className="text-label font-bold text-gold uppercase tracking-[0.3em]">
                            Archival Metadata (SEO)
                          </h4>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label>Curated Search Title</Label>
                            <Input
                              value={formData.meta_title || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setFormData((p) => ({
                                  ...p,
                                  meta_title: e.target.value,
                                }))
                              }
                              placeholder="Luxury Title for Discovery"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>Archival Summary</Label>
                            <TextArea
                              value={formData.meta_description || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) =>
                                setFormData((p) => ({
                                  ...p,
                                  meta_description: e.target.value,
                                }))
                              }
                              placeholder="Detailed archive summary..."
                              rows={5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border bg-dark/40 flex justify-between items-center shrink-0 backdrop-blur-md">
                  <div className="flex items-center gap-6">
                    {activeTab !== "general" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs = [
                            "general",
                            "description",
                            "variants",
                            "media",
                            "settings",
                          ];
                          const currIdx = tabs.indexOf(activeTab);
                          setActiveTab(tabs[currIdx - 1]);
                        }}
                        className="text-2xs font-mono uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-all flex items-center gap-3"
                      >
                        <ChevronLeft size={16} /> Preceding
                      </button>
                    ) : (
                      <div className="w-20" />
                    )}
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={onClose}
                      type="button"
                      className="hidden sm:block text-2xs font-mono tracking-[0.3em] uppercase text-text-muted hover:text-white transition-colors"
                    >
                      Dismiss
                    </button>

                    {activeTab !== "settings" ? (
                      <PrimaryBtn
                        type="button"
                        onClick={() => {
                          const tabs = [
                            "general",
                            "description",
                            "variants",
                            "media",
                            "settings",
                          ];
                          const currIdx = tabs.indexOf(activeTab);
                          setActiveTab(tabs[currIdx + 1]);
                        }}
                        className="px-10 py-4 text-2xs"
                      >
                        Proceed
                      </PrimaryBtn>
                    ) : (
                      <PrimaryBtn
                        disabled={submitting}
                        type="submit"
                        className="px-10 py-4 text-2xs shadow-xl shadow-gold/10"
                      >
                        {submitting ? (
                          <div className="luxury-loader scale-75 mr-10" />
                        ) : (
                          <>
                            <Save className="mr-3" size={18} />{" "}
                            {product ? "Preserve Record" : "Archive Piece"}
                          </>
                        )}
                      </PrimaryBtn>
                    )}
                  </div>
                </div>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Local Components ────────────────────────────────────────────────────────

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-label font-mono tracking-widest uppercase text-text-muted mb-2 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
function Input({ className, type, ...rest }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full bg-dark/40 border border-border/60 px-4 py-3 text-sm text-text-main rounded-md focus:outline-none focus:border-gold/50 focus:bg-dark/60 transition-all duration-300 placeholder:text-text-muted/30",
        type === "number" &&
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
      {...rest}
    />
  );
}

function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full bg-dark/40 border border-border/60 px-4 py-3 text-sm text-text-main rounded-md focus:outline-none focus:border-gold/50 focus:bg-dark/60 transition-all duration-300 resize-none placeholder:text-text-muted/30",
        className
      )}
      {...props}
    />
  );
}

function Checkbox({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="peer h-5 w-5 shrink-0 rounded-sm border border-border hover:border-gold/50 transition-all duration-300 data-[state=checked]:border-gold data-[state=checked]:bg-gold/10 flex items-center justify-center bg-dark/40"
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between group py-1">
      <Label className="mb-0 text-2xs group-hover:text-text-main transition-colors duration-300">
        {label}
      </Label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "w-10 h-5 rounded-full relative transition-all duration-500 border border-border/60",
          checked
            ? "bg-gold/20 border-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]"
            : "bg-dark/40"
        )}
      >
        <motion.div
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full shadow-sm",
            checked ? "bg-gold shadow-gold/40" : "bg-text-muted/40"
          )}
        />
      </button>
    </div>
  );
}
