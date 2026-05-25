"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowRight, Check, Minus, Plus, Star, Users, BookOpen } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { PrimaryBtn, GhostBtn } from "@/components/ui/buttons";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { COURSES, CURRICULUM } from "@/data/constants";
import Link from "next/link";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { getSafeReturnTo } from "@/lib/auth-api";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = parseInt(resolvedParams.id);
  const course = COURSES.find((c) => c.id === courseId) || COURSES[0]; // Fallback for demo

  const [openSection, setOpenSection] = useState<number | null>(0);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = getSafeReturnTo(pathname) ?? "/";
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  const goToLesson = () => {
    if (!user) {
      router.push(loginHref);
      return;
    }

    router.push("/lesson-player");
  };

  if (!course) notFound();

  return (
    <main className="pt-24 min-h-screen">
      {/* Banner */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <ImageWithFallback src={course.image} alt={course.title} className="w-full h-full object-cover grayscale opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-8 lg:px-16 pb-14 max-w-[1440px] mx-auto">
          <div className="text-[11px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-4">Masterclass</div>
          <h1 className="text-[clamp(32px,5vw,72px)] font-extrabold tracking-[-0.02em] text-[#F5F5F5] leading-tight max-w-2xl mb-4" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            {course.title}
          </h1>
          <p className="text-[#8B8B8B] max-w-md mb-6">{course.subtitle}</p>
          <div className="flex items-center gap-6 text-sm font-mono text-[#8B8B8B]">
            <span className="flex items-center gap-1.5"><Star size={12} fill="#B89D5C" className="text-[#B89D5C]" />{course.rating}</span>
            <span className="flex items-center gap-1.5"><Users size={12} />{course.students.toLocaleString()} students</span>
            <span className="flex items-center gap-1.5"><BookOpen size={12} />{course.lessons} lessons · {course.hours}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Content */}
          <div className="lg:col-span-8">
            <RevealBlock>
              <div className="mb-16">
                <h2 className="text-[#F5F5F5] font-bold text-3xl mb-6" style={{ fontFamily: "'Inter Tight', sans-serif" }}>About This Course</h2>
                <p className="text-[#8B8B8B] leading-relaxed mb-4">
                  {course.title} is a comprehensive entry into the classical tradition of art. Over {course.lessons} lessons spanning studio practice, technique, and compositional thinking, you will build a solid technical foundation alongside an expressive personal voice.
                </p>
                <p className="text-[#8B8B8B] leading-relaxed">
                  Each module moves from concept to creation. You will work through foundational exercises and advanced techniques — building fluency with the medium while developing your artistic eye.
                </p>
              </div>
            </RevealBlock>

            <RevealBlock>
              <div className="mb-16">
                <h2 className="text-[#F5F5F5] font-bold text-3xl mb-8" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Curriculum</h2>
                <div className="border border-[#2A2A2A]">
                  {CURRICULUM.map((s, i) => (
                    <div key={i} className="border-b border-[#2A2A2A] last:border-b-0">
                      <button
                        onClick={() => setOpenSection(openSection === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111111] transition-colors"
                      >
                        <div>
                          <div className="text-[11px] font-mono text-[#B89D5C] tracking-widest mb-1">Section {i + 1}</div>
                          <span className="text-[#F5F5F5] font-semibold">{s.section}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-mono text-[#8B8B8B]">{s.lessons.length} lessons</span>
                          {openSection === i ? <Minus size={14} className="text-[#8B8B8B]" /> : <Plus size={14} className="text-[#8B8B8B]" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openSection === i && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-[#0D0D0D] border-t border-[#2A2A2A]">
                              {s.lessons.map((l, j) => (
                                <Link
                                  key={j}
                                  href={user ? "/lesson-player" : loginHref}
                                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#111111] transition-colors border-b border-[#2A2A2A] last:border-b-0"
                                >
                                  <div className="w-8 h-8 bg-[#171717] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                                    <Play size={11} className="text-[#8B8B8B] ml-0.5" />
                                  </div>
                                  <span className="text-[#8B8B8B] text-sm hover:text-[#F5F5F5] transition-colors">{l}</span>
                                  <span className="ml-auto text-[11px] font-mono text-[#8B8B8B]">12:30</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>

            {/* Instructor */}
            <RevealBlock>
              <div className="p-8 border border-[#2A2A2A] bg-[#111111] flex gap-6 mb-16">
                <div className="w-20 h-20 bg-[#2A2A2A] shrink-0 overflow-hidden">
                  <ImageWithFallback src={course.image} alt={course.instructor} className="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#B89D5C] tracking-widest uppercase mb-1">Instructor</div>
                  <div className="text-[#F5F5F5] font-bold text-xl mb-2" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{course.instructor}</div>
                  <p className="text-[#8B8B8B] text-sm leading-relaxed">
                    A master in the field with decades of experience in the arts and education.
                  </p>
                </div>
              </div>
            </RevealBlock>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 border border-[#2A2A2A] bg-[#111111]">
              <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback src={course.image} alt={course.title} className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/lesson-player">
                    <button
                      className="w-16 h-16 bg-[#F5F5F5]/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#B89D5C]/20 hover:border-[#B89D5C]/40 transition-all"
                    >
                      <Play size={22} fill="white" className="text-white ml-1" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-8">
                <div className="text-[#F5F5F5] font-extrabold text-4xl mb-1" style={{ fontFamily: "'Inter Tight', sans-serif" }}>€{course.price}</div>
                <div className="text-[11px] font-mono text-[#8B8B8B] tracking-widest mb-8">Lifetime access · All devices</div>

                <PrimaryBtn type="button" onClick={goToLesson} className="w-full justify-center mb-4">
                  Enroll Now <ArrowRight size={16} />
                </PrimaryBtn>
                <GhostBtn type="button" onClick={goToLesson} className="w-full justify-center">
                  Preview Free Lesson
                </GhostBtn>
                <div className="mt-8 space-y-3">
                  {[
                    `${course.lessons} video lessons`,
                    course.hours + " of content",
                    "Downloadable reference PDFs",
                    "Private critique forum",
                    "Certificate of completion",
                    "Lifetime updates",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-[#8B8B8B]">
                      <Check size={14} className="text-[#B89D5C] shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
