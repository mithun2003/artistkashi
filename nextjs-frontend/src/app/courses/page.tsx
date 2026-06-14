"use client";

import { useState } from "react";
import { RevealBlock } from "@/components/ui/misc";
import { CourseCardGrid } from "@/components/lms/CourseCard";
import { COURSES } from "@/data/constants";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState("All");
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered =
    activeLevel === "All"
      ? COURSES
      : COURSES.filter((c) => c.level === activeLevel);

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-360 mx-auto px-8 lg:px-16">
        <RevealBlock>
          <div className="border-b border-border pb-16 mb-16">
            <div className="text-label font-mono text-gold tracking-[0.2em] uppercase mb-4">
              Masterclass Series
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <h1 className="text-h1 font-extrabold tracking-[-0.03em] text-text-main leading-[0.9]">
                MASTERCLASSES
              </h1>
              <p className="text-text-muted max-w-xs text-sm leading-relaxed">
                Curriculum developed by working artists and gallery
                professionals. Every lesson earns lifetime access.
              </p>
            </div>
          </div>
        </RevealBlock>

        <div className="flex gap-px bg-border mb-12 w-fit">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={cn(
                "px-6 py-3 text-xs font-mono tracking-widest uppercase transition-colors",
                activeLevel === l
                  ? "bg-text-main text-dark"
                  : "bg-dark text-text-muted hover:text-text-main"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {filtered.map((c, i) => (
            <CourseCardGrid key={c.id} course={c} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </main>
  );
}
