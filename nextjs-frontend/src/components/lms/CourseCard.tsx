"use client";

import React from "react";
import Link from "next/link";
import { Play, BookOpen, Clock, Star } from "lucide-react";
import { Course } from "@/types";
import { RevealBlock } from "@/components/ui/misc";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  delay?: number;
}

export function CourseCard({ course, delay = 0 }: CourseCardProps) {
  return (
    <RevealBlock delay={delay}>
      <Link
        href={`/courses/${course.id}`}
        className="group bg-[#0A0A0A] block w-full text-left hover:bg-[#111111] transition-colors"
      >
        <div className="relative overflow-hidden aspect-video">
          <ImageWithFallback
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-[#0A0A0A]/80 backdrop-blur-sm text-[#B89D5C] text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border border-[#B89D5C]/30">
              {course.level}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-14 h-14 bg-[#F5F5F5]/10 backdrop-blur-md border border-[#F5F5F5]/20 flex items-center justify-center">
              <Play size={20} fill="#F5F5F5" className="text-[#F5F5F5] ml-1" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[#2A2A2A]">
          <div className="text-[11px] font-mono text-[#8B8B8B] tracking-[0.15em] mb-3">{course.instructor}</div>
          <h3 className="text-[#F5F5F5] font-bold text-xl leading-tight mb-2" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{course.title}</h3>
          <p className="text-[#8B8B8B] text-sm mb-5 line-clamp-2">{course.subtitle}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[12px] font-mono text-[#8B8B8B]">
              <span className="flex items-center gap-1.5"><BookOpen size={12} />{course.lessons} lessons</span>
              <span className="flex items-center gap-1.5"><Clock size={12} />{course.hours}</span>
            </div>
            <span className="text-[#F5F5F5] font-bold text-lg">€{course.price}</span>
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
}

export function CourseCardGrid({ course, delay = 0 }: CourseCardProps) {
    return (
      <RevealBlock delay={delay}>
        <Link
          href={`/courses/${course.id}`}
          className="group bg-[#0A0A0A] hover:bg-[#111111] transition-colors block w-full text-left"
        >
          <div className="relative overflow-hidden aspect-video">
            <ImageWithFallback src={course.image} alt={course.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/70 backdrop-blur text-[#F5F5F5] text-[10px] font-mono tracking-widest px-2.5 py-1 border border-[#2A2A2A]">
              {course.level}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-[#F5F5F5]/10 border border-white/20 flex items-center justify-center">
                <Play size={18} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={10} fill={j < Math.floor(course.rating) ? "#B89D5C" : "none"} className={j < Math.floor(course.rating) ? "text-[#B89D5C]" : "text-[#2A2A2A]"} />)}</div>
              <span className="text-[#8B8B8B] text-[11px] font-mono">{course.rating} ({course.students.toLocaleString()})</span>
            </div>
            <h3 className="text-[#F5F5F5] font-bold text-lg mb-1" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{course.title}</h3>
            <p className="text-[#8B8B8B] text-sm mb-5 line-clamp-2">{course.subtitle}</p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#8B8B8B] mb-5">
              <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{course.hours}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
              <span className="text-[#F5F5F5] font-bold text-2xl" style={{ fontFamily: "'Inter Tight', sans-serif" }}>€{course.price}</span>
              <span className="text-[#8B8B8B] text-xs font-mono uppercase tracking-widest flex items-center gap-1 group-hover:text-[#B89D5C] transition-colors">
                Enroll <Play size={12} />
              </span>
            </div>
          </div>
        </Link>
      </RevealBlock>
    );
  }
