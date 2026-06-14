"use client";

import React from "react";
import Link from "next/link";
import { Play, Clock, Star } from "lucide-react";
import { CourseRead } from "@/api/openapi-client";
import { RevealBlock } from "@/components/ui/misc";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface CourseCardProps {
  course: CourseRead;
  delay?: number;
}

export function CourseCard({ course, delay = 0 }: CourseCardProps) {
  return (
    <RevealBlock delay={delay}>
      <Link
        href={`/courses/${course.id}`}
        className="group bg-dark block w-full text-left hover:bg-muted-light transition-colors"
      >
        <div className="relative overflow-hidden aspect-video">
          <ImageWithFallback
            src={course.image_url || ""}
            alt={course.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-dark/80 backdrop-blur-sm text-gold text-tiny font-mono tracking-widest uppercase px-2.5 py-1 border border-gold/30">
              {course.category || "Masterclass"}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-14 h-14 bg-text-main/10 backdrop-blur-md border border-text-main/20 flex items-center justify-center">
              <Play
                size={20}
                fill="var(--color-text-main)"
                className="text-text-main ml-1"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border">
          <div className="text-label font-mono text-text-muted tracking-[0.15em] mb-3">
            {course.instructor}
          </div>
          <h3 className="text-text-main font-bold text-xl leading-tight mb-2">
            {course.title}
          </h3>
          <p className="text-text-muted text-sm mb-5 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {course.duration || "Self-paced"}
              </span>
            </div>
            <span className="text-text-main font-bold text-lg">
              €{course.price}
            </span>
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
        className="group bg-dark hover:bg-muted-light transition-colors block w-full text-left"
      >
        <div className="relative overflow-hidden aspect-video">
          <ImageWithFallback
            src={course.image_url || ""}
            alt={course.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark to-transparent" />
          <div className="absolute top-4 right-4 bg-dark/70 backdrop-blur text-text-main text-tiny font-mono tracking-widest px-2.5 py-1 border border-border">
            {course.category || "Masterclass"}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-text-main/10 border border-white/20 flex items-center justify-center">
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={10}
                  fill={
                    j < Math.floor(course.rating) ? "var(--color-gold)" : "none"
                  }
                  className={
                    j < Math.floor(course.rating) ? "text-gold" : "text-border"
                  }
                />
              ))}
            </div>
            <span className="text-text-muted text-label font-mono">
              {course.rating} ({course.students_count.toLocaleString()})
            </span>
          </div>
          <h3 className="text-text-main font-bold text-lg mb-1">
            {course.title}
          </h3>
          <p className="text-text-muted text-sm mb-5 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center gap-3 text-label font-mono text-text-muted mb-5">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {course.duration || "Self-paced"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-text-main font-bold text-2xl">
              €{course.price}
            </span>
            <span className="text-text-muted text-xs font-mono uppercase tracking-widest flex items-center gap-1 group-hover:text-gold transition-colors">
              Enroll <Play size={12} />
            </span>
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
}
