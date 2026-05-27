"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Save, 
  RotateCcw, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  MousePointer2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryBtn } from "@/components/ui/buttons";
import { 
  homePageSchema, 
  defaultHomeSettings, 
  type HomePageSettings 
} from "@/lib/home-customization";
import { toast } from "sonner";

export default function HomeCustomizerPage() {
  const [activeSection, setActiveSection] = useState<string | null>("hero");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<HomePageSettings>({
    resolver: zodResolver(homePageSchema),
    defaultValues: defaultHomeSettings,
    mode: "onBlur",
  });

  const onSubmit = (data: HomePageSettings) => {
    // In a real app, this would be an API call
    console.log("Saving Home Settings:", data);
    toast.success("Home page settings saved!", {
      description: "Changes will be visible to users immediately.",
    });
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className={cn(
        "w-full flex items-center justify-between p-6 transition-colors border-b border-border",
        activeSection === id ? "bg-muted" : "hover:bg-muted-light"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 flex items-center justify-center border transition-colors",
          activeSection === id ? "bg-gold border-gold text-dark" : "border-border text-text-muted"
        )}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <h3 className={cn("font-bold text-lg", activeSection === id ? "text-text-main" : "text-text-muted")}>{title}</h3>
        </div>
      </div>
      {activeSection === id ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-text-muted" />}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-h3 font-extrabold tracking-tight text-text-main">Home Page Customizer</h1>
          <p className="text-text-muted text-sm mt-1">Design and refine the landing experience of Artist Kashi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest uppercase text-text-muted hover:text-text-main transition-colors"
            disabled={!isDirty}
          >
            <RotateCcw size={14} /> Reset Changes
          </button>
          <PrimaryBtn onClick={handleSubmit(onSubmit)} className="px-6 py-3">
            <Save size={16} /> Save Changes
          </PrimaryBtn>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="border border-border bg-muted-light divide-y divide-border">
        {/* --- Hero Section --- */}
        <div className="overflow-hidden">
          <SectionHeader id="hero" title="Hero / Landing" icon={Layout} />
          {activeSection === "hero" && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Main Headline (supports \n)</label>
                  <textarea 
                    {...register("hero.title")}
                    className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-32"
                  />
                  {errors.hero?.title && <p className="text-xs text-red-500 font-mono">{errors.hero.title.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Subtitle Description</label>
                  <textarea 
                    {...register("hero.subtitle")}
                    className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-32"
                  />
                  {errors.hero?.subtitle && <p className="text-xs text-red-500 font-mono">{errors.hero.subtitle.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Primary Button</label>
                  <input {...register("hero.primaryBtnText")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  {errors.hero?.primaryBtnText && <p className="text-xs text-red-500 font-mono">{errors.hero.primaryBtnText.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Secondary Button</label>
                  <input {...register("hero.ghostBtnText")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  {errors.hero?.ghostBtnText && <p className="text-xs text-red-500 font-mono">{errors.hero.ghostBtnText.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Background Image URL</label>
                  <input {...register("hero.bgImage")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  {errors.hero?.bgImage && <p className="text-xs text-red-500 font-mono">{errors.hero.bgImage.message}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Featured Sections --- */}
        <div className="overflow-hidden">
          <SectionHeader id="featured" title="Featured Collections" icon={Type} />
          {activeSection === "featured" && (
            <div className="p-8 space-y-10">
              <div className="space-y-6">
                <h4 className="text-gold font-mono text-xs tracking-[0.2em] uppercase border-b border-border pb-2">Paintings Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Small Label</label>
                    <input {...register("featuredPaintings.label")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Main Title</label>
                    <textarea {...register("featuredPaintings.title")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-24" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-gold font-mono text-xs tracking-[0.2em] uppercase border-b border-border pb-2">Courses Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Small Label</label>
                    <input {...register("featuredCourses.label")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Main Title</label>
                    <textarea {...register("featuredCourses.title")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-24" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- About Section --- */}
        <div className="overflow-hidden">
          <SectionHeader id="about" title="About Instructor" icon={ImageIcon} />
          {activeSection === "about" && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Small Label</label>
                  <input {...register("about.label")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Main Title</label>
                  <input {...register("about.title")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Instructor Name</label>
                  <input {...register("about.instructorName")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Description Paragraph 1</label>
                <textarea {...register("about.description1")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-24" />
                {errors.about?.description1 && <p className="text-xs text-red-500 font-mono">{errors.about.description1.message}</p>}
              </div>
              <div className="space-y-4">
                <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Description Paragraph 2</label>
                <textarea {...register("about.description2")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-24" />
                {errors.about?.description2 && <p className="text-xs text-red-500 font-mono">{errors.about.description2.message}</p>}
              </div>
              <div className="space-y-4">
                <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Description Paragraph 3</label>
                <textarea {...register("about.description3")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-24" />
                {errors.about?.description3 && <p className="text-xs text-red-500 font-mono">{errors.about.description3.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Instructor Role</label>
                  <input {...register("about.instructorRole")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
                <div className="space-y-4">
                  <label className="block text-tiny font-mono text-text-muted uppercase tracking-widest">Instructor Image URL</label>
                  <input {...register("about.image")} className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Video / FAQ / Banner --- */}
        <div className="overflow-hidden">
          <SectionHeader id="extra" title="Extra Sections (Video, FAQ, Banner)" icon={MousePointer2} />
          {activeSection === "extra" && (
            <div className="p-8 space-y-12">
              <div className="space-y-6">
                <h4 className="text-gold font-mono text-xs tracking-[0.2em] uppercase border-b border-border pb-2">Video CTA</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <input {...register("videoCta.label")} placeholder="Label" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  <input {...register("videoCta.title")} placeholder="Title" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  <input {...register("videoCta.bgImage")} placeholder="Background Image URL" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-gold font-mono text-xs tracking-[0.2em] uppercase border-b border-border pb-2">FAQ Header</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <input {...register("faq.label")} placeholder="Label" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  <input {...register("faq.title")} placeholder="Title" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  <textarea {...register("faq.description")} placeholder="Description" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-20" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-gold font-mono text-xs tracking-[0.2em] uppercase border-b border-border pb-2">Bottom Banner</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input {...register("banner.label")} placeholder="Label" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                    <input {...register("banner.title")} placeholder="Title" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  </div>
                  <div className="space-y-4">
                    <textarea {...register("banner.description")} placeholder="Description" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none h-32" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input {...register("banner.primaryBtnText")} placeholder="Primary Button" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                  <input {...register("banner.ghostBtnText")} placeholder="Ghost Button" className="w-full bg-dark border border-border p-4 text-text-main focus:border-gold outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Safety Info */}
      <div className="mt-8 p-6 bg-gold/5 border border-gold/20 flex items-start gap-4">
        <AlertCircle className="text-gold shrink-0 mt-0.5" size={18} />
        <div>
          <h5 className="text-gold font-bold text-sm mb-1">Visual Safety Enabled</h5>
          <p className="text-text-muted text-xs leading-relaxed">
            All text fields have character limits enforced to ensure the home page design remains consistent across all screen sizes. 
            URLs are validated to prevent broken image references.
          </p>
        </div>
      </div>
    </div>
  );
}
