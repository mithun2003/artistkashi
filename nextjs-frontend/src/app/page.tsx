"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Play, ArrowRight, ArrowUpRight, Minus, Plus,
  Star, BookOpen, Clock,
} from "lucide-react";
import { PrimaryBtn, GhostBtn } from "@/components/ui/buttons";
import { RevealBlock, GoldDivider } from "@/components/ui/misc";
import { GalaxyBackground } from "@/components/shared/GalaxyBackground";
import { PAINTINGS, COURSES, TESTIMONIALS, FAQ_ITEMS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { defaultHomeSettings as settings } from "@/lib/home-customization";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-200 flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-dark">
          <ImageWithFallback
            src={settings.hero.bgImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-35 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/50 to-transparent" />
        </div>

        {/* Edition label */}
        <div className="relative z-10 max-w-360 mx-auto w-full px-8 lg:px-16 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-label font-mono tracking-[0.25em] uppercase">Artist Kashi | Fine Art & Academy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-h1 font-extrabold leading-[0.9] tracking-[-0.03em] text-text-main max-w-225"
          >
            Paint.<br />
            <span className="text-gold">Collect.</span><br />
            Master.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-text-muted text-lg max-w-md leading-relaxed"
          >
            {settings.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link href="/courses">
              <PrimaryBtn>
                {settings.hero.primaryBtnText} <ArrowRight size={16} />
              </PrimaryBtn>
            </Link>
            <Link href="/shop">
              <GhostBtn>
                {settings.hero.ghostBtnText}
              </GhostBtn>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex flex-wrap items-center gap-6 mt-12 sm:mt-16 pt-8 border-t border-border"
          >
            {[
              { value: "340+", label: "Original Works" },
              { value: "12K+", label: "Enrolled Students" },
              { value: "94", label: "Lesson Hours" },
              { value: "4.9", label: "Avg. Rating" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-text-main">{s.value}</span>
                <span className="text-label font-mono text-text-muted tracking-[0.15em] uppercase mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-20 right-4 lg:bottom-24 lg:right-16 flex flex-col items-center gap-2 scale-75 lg:scale-100 origin-bottom-right"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-linear-to-b from-gold to-transparent"
          />
          <span className="text-tiny font-mono text-text-muted tracking-[0.2em] uppercase rotate-90 origin-center mt-4">Scroll</span>
        </motion.div>
      </section>

      {/* ── Featured Paintings ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
            <div>
              <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">{settings.featuredPaintings.label}</div>
              <h2 className="text-h2 font-extrabold leading-tight tracking-[-0.02em] text-text-main whitespace-pre-line">
                {settings.featuredPaintings.title}
              </h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm font-mono tracking-widest uppercase">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
        </RevealBlock>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {PAINTINGS.map((p, i) => (
            <RevealBlock key={p.id} delay={i * 0.1}>
              <Link
                href={`/shop/${p.id}`}
                className="group relative bg-dark overflow-hidden block w-full text-left"
              >
                <div className="relative overflow-hidden aspect-3/4">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark via-transparent to-transparent opacity-80" />
                  {p.sold && (
                    <div className="absolute top-4 left-4 bg-text-muted/20 backdrop-blur-sm text-text-muted text-tiny font-mono tracking-[0.2em] uppercase px-3 py-1.5 border border-text-muted/30">
                      Sold
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-tiny font-mono text-gold tracking-[0.15em] uppercase mb-1">{p.medium}</div>
                    <div className="text-text-main font-bold text-base leading-tight">{p.title}</div>
                    <div className="text-text-muted text-sm mt-1">€{p.price.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
            <div>
              <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">{settings.featuredCourses.label}</div>
              <h2 className="text-h2 font-extrabold leading-tight tracking-[-0.02em] text-text-main whitespace-pre-line">
                {settings.featuredCourses.title}
              </h2>
            </div>
            <Link href="/courses" className="hidden md:flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm font-mono tracking-widest uppercase">
              All Courses <ArrowUpRight size={16} />
            </Link>
          </div>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {COURSES.map((c, i) => (
            <RevealBlock key={c.id} delay={i * 0.12}>
              <Link
                href={`/courses/${c.id}`}
                className="group bg-dark block w-full text-left hover:bg-muted-light transition-colors"
              >
                <div className="relative overflow-hidden aspect-video">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-dark/80 backdrop-blur-sm text-gold text-tiny font-mono tracking-widest uppercase px-2.5 py-1 border border-gold/30">
                      {c.level}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 bg-text-main/10 backdrop-blur-md border border-text-main/20 flex items-center justify-center">
                      <Play size={20} fill="var(--color-text-main)" className="text-text-main ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-border">
                  <div className="text-label font-mono text-text-muted tracking-[0.15em] mb-3">{c.instructor}</div>
                  <h3 className="text-text-main font-bold text-xl leading-tight mb-2">{c.title}</h3>
                  <p className="text-text-muted text-sm mb-5">{c.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[12px] font-mono text-text-muted">
                      <span className="flex items-center gap-1.5"><BookOpen size={12} />{c.lessons} lessons</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} />{c.hours}</span>
                    </div>
                    <span className="text-text-main font-bold text-lg">€{c.price}</span>
                  </div>
                </div>
              </Link>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── About Instructor ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealBlock>
            <div className="relative aspect-4/5 overflow-hidden bg-muted-light border border-border">
              <ImageWithFallback
                src={settings.about.image}
                alt="Artist Kashi"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-dark to-transparent">
                <div className="text-gold font-mono text-xs tracking-widest uppercase mb-2">{settings.about.instructorRole}</div>
                <div className="text-text-main text-2xl font-bold">{settings.about.instructorName}</div>
              </div>
            </div>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <div>
              <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-6">{settings.about.label}</div>
              <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main leading-tight mb-8">
                {settings.about.title}
              </h2>
              <div className="space-y-6 text-text-muted leading-relaxed">
                <p>{settings.about.description1}</p>
                <p>{settings.about.description2}</p>
                <p>{settings.about.description3}</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-8">
                {[
                  { label: "Experience", value: "20+ Yrs" },
                  { label: "Students", value: "12K+" },
                  { label: "Exhibitions", value: "45+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-text-main text-xl font-bold">{stat.value}</div>
                    <div className="text-text-muted text-tiny font-mono tracking-widest uppercase mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <Link href="/courses">
                  <GhostBtn className="px-0 hover:pl-4 transition-all">
                    View Masterclass Curriculum <ArrowRight size={16} className="ml-2" />
                  </GhostBtn>
                </Link>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ── Gallery Mosaic ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="text-center mb-16">
            <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">The Gallery</div>
            <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main">
              Works in the Collection
            </h2>
          </div>
        </RevealBlock>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {[
            { src: "https://images.unsplash.com/photo-1582721691120-d1db3852893e?w=600&h=700&fit=crop&auto=format", span: "md:row-span-2", aspect: "aspect-[4/5] md:aspect-auto md:h-full" },
            { src: "https://images.unsplash.com/photo-1612733399020-e2194e3dbfda?w=600&h=350&fit=crop&auto=format", span: "", aspect: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1570475754561-4effe71c5084?w=600&h=350&fit=crop&auto=format", span: "", aspect: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1556139930-c23fa4a4f934?w=600&h=400&fit=crop&auto=format", span: "", aspect: "aspect-[4/3]" },
            { src: "https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?w=600&h=400&fit=crop&auto=format", span: "", aspect: "aspect-[4/3]" },
          ].map((item, i) => (
            <RevealBlock key={i} delay={i * 0.08} className={item.span}>
              <Link
                href="/shop"
                className={cn("group relative overflow-hidden block w-full bg-muted-light", item.aspect)}
              >
                <Image
                  src={item.src}
                  alt={`Gallery work ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors duration-500 flex items-center justify-center">
                  <div className="text-text-main text-sm font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                    View <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── Video CTA ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="relative overflow-hidden aspect-21/9">
            <ImageWithFallback
              src={settings.videoCta.bgImage}
              alt="Studio Video"
              fill
              className="object-cover grayscale opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-r from-dark via-dark/60 to-dark/40 flex flex-col items-start justify-center px-12 lg:px-20">
              <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-6">{settings.videoCta.label}</div>
              <h2 className="text-h3 font-extrabold tracking-[-0.02em] text-text-main max-w-lg leading-tight mb-8">
                {settings.videoCta.title}
              </h2>
              <Link
                href="/lesson-player"
                className="group flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-text-main/10 backdrop-blur-md border border-text-main/20 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                  <Play size={22} fill="var(--color-text-main)" className="text-text-main ml-1" />
                </div>
                <div>
                  <div className="text-text-main font-semibold">Watch Demo Lesson</div>
                  <div className="text-text-muted text-sm font-mono">12 min preview</div>
                </div>
              </Link>
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* ── Best Sellers ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="mb-16 border-b border-border pb-10">
            <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">Most Collected</div>
            <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main">
              Best Sellers
            </h2>
          </div>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {PAINTINGS.slice(0, 2).map((p, i) => (
            <RevealBlock key={p.id} delay={i * 0.1}>
              <Link
                href={`/shop/${p.id}`}
                className="group bg-dark flex gap-6 p-6 w-full text-left hover:bg-muted-light transition-colors"
              >
                <div className="relative w-24 h-32 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="96px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="text-tiny font-mono text-text-muted tracking-[0.15em] uppercase mb-2">{p.medium}</div>
                    <div className="text-text-main font-bold text-xl leading-tight">{p.title}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-xl">€{p.price.toLocaleString()}</span>
                    <span className="text-text-muted text-xs font-mono flex items-center gap-1 group-hover:text-text-main transition-colors">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pt-32">
        <div className="max-w-360 mx-auto px-8 lg:px-16">
          <RevealBlock>
            <div className="text-center mb-20">
              <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">Voices</div>
              <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main">
                What Our Community Says
              </h2>
            </div>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {TESTIMONIALS.map((t, i) => (
              <RevealBlock key={t.name} delay={i * 0.12}>
                <div className="bg-dark p-10 h-full flex flex-col">
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={12} fill="var(--color-gold)" className="text-gold" />
                    ))}
                  </div>
                  <p className="text-text-main text-base leading-relaxed flex-1 mb-10 italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center text-gold text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-text-main text-sm font-semibold">{t.name}</div>
                      <div className="text-text-muted text-xs font-mono">{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <RevealBlock className="lg:col-span-4">
            <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">{settings.faq.label}</div>
            <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main leading-tight">
              {settings.faq.title}
            </h2>
            <GoldDivider />
            <p className="text-text-muted leading-relaxed text-sm">
              {settings.faq.description}
            </p>
          </RevealBlock>
          <div className="lg:col-span-8">
            {FAQ_ITEMS.map((item, i) => (
              <RevealBlock key={i} delay={i * 0.06}>
                <div className="border-b border-border">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="text-text-main font-semibold text-base pr-8 group-hover:text-gold transition-colors">{item.q}</span>
                    <div className="shrink-0 w-6 h-6 border border-border flex items-center justify-center">
                      {faqOpen === i ? <Minus size={12} className="text-gold" /> : <Plus size={12} className="text-text-muted" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {faqOpen === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-text-muted text-sm leading-relaxed pb-6">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-360 mx-auto px-8 lg:px-16 pt-32">
        <RevealBlock>
          <div className="bg-muted-light border border-border p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_39px,var(--color-gold)_39px,var(--color-gold)_40px),repeating-linear-gradient(90deg,transparent,transparent_39px,var(--color-gold)_39px,var(--color-gold)_40px)]" />
            </div>
            <div className="relative z-10">
              <div className="text-label font-mono text-gold tracking-[0.25em] uppercase mb-6">{settings.banner.label}</div>
              <h2 className="text-h2 font-extrabold tracking-[-0.02em] text-text-main mb-6">
                {settings.banner.title}
              </h2>
              <p className="text-text-muted max-w-md mx-auto mb-10 text-sm leading-relaxed">
                {settings.banner.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/courses">
                  <PrimaryBtn>
                    {settings.banner.primaryBtnText} <ArrowRight size={16} />
                  </PrimaryBtn>
                </Link>
                <Link href="/shop">
                  <GhostBtn>
                    {settings.banner.ghostBtnText}
                  </GhostBtn>
                </Link>
              </div>
            </div>
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
