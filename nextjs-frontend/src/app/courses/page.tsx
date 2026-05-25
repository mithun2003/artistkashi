"use client";

import { useState } from "react";
import { RevealBlock } from "@/components/ui/misc";
import { CourseCardGrid } from "@/components/lms/CourseCard";
import { COURSES } from "@/data/constants";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState("All");
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = activeLevel === "All" ? COURSES : COURSES.filter((c) => c.level === activeLevel);

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <RevealBlock>
          <div className="border-b border-[#2A2A2A] pb-16 mb-16">
            <div className="text-[11px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-4">Masterclass Series</div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <h1 className="text-[clamp(48px,7vw,96px)] font-extrabold tracking-[-0.03em] text-[#F5F5F5] leading-[0.9]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                All Courses
              </h1>
              <p className="text-[#8B8B8B] max-w-xs text-sm leading-relaxed">
                Curriculum developed by working artists and gallery professionals. Every lesson earns lifetime access.
              </p>
            </div>
          </div>
        </RevealBlock>

        <div className="flex gap-px bg-[#2A2A2A] mb-12 w-fit">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={cn(
                "px-6 py-3 text-[12px] font-mono tracking-widest uppercase transition-colors",
                activeLevel === l
                  ? "bg-[#F5F5F5] text-[#0A0A0A]"
                  : "bg-[#0A0A0A] text-[#8B8B8B] hover:text-[#F5F5F5]"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A]">
          {filtered.map((c, i) => (
            <CourseCardGrid key={c.id} course={c} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </main>
  );
}
