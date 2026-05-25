"use client";

import { useState } from "react";
import { Play, Check, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/data/constants";

import { useAuth } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LessonPlayerPage() {
  const [progress, setProgress] = useState(34);
  const [activeLesson, setActiveLesson] = useState(3);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#B89D5C] font-mono animate-pulse">LOADING CURRICULUM...</div>
      </div>
    );
  }

  if (!user) return null;

  const lessons = [
    { n: 1, title: "Introduction to the Artist method", duration: "8:20", done: true },
    { n: 2, title: "Understanding your materials", duration: "14:05", done: true },
    { n: 3, title: "Color theory for oil painters", duration: "22:47", done: false, active: true },
    { n: 4, title: "The value study system", duration: "18:30", done: false },
    { n: 5, title: "Dynamic vs static arrangements", duration: "11:15", done: false },
  ];

  return (
    <main className="pt-20 h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          <div className="relative flex-1 flex items-center justify-center bg-[#080808]">
            <img
              src="https://images.unsplash.com/photo-1775346098886-72ab6697b331?w=1200&h=680&fit=crop&auto=format"
              alt="Lesson video"
              className="max-w-full max-h-full object-contain grayscale opacity-60"
            />
            {/* Watermark */}
            <div className="absolute bottom-10 right-10 text-[10px] font-mono text-[#F5F5F5]/20 text-right leading-relaxed pointer-events-none">
              <div>{user.email}</div>
              <div>IP: 192.168.1.xxx · {new Date().toLocaleDateString()}</div>
            </div>
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-[#F5F5F5]/10 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-[#B89D5C]/20 hover:border-[#B89D5C]/30 transition-all">
                <Play size={28} fill="white" className="text-white ml-1.5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#111111] border-t border-[#2A2A2A] px-8 py-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-mono text-[#8B8B8B]">8:04</span>
              <div className="flex-1 h-1 bg-[#2A2A2A] relative cursor-pointer group">
                <div className="h-full bg-[#B89D5C]" style={{ width: `${progress}%` }} />
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F5F5F5] border-2 border-[#B89D5C] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: "translateX(-50%) translateY(-50%)" }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#8B8B8B]">22:47</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-[#8B8B8B] hover:text-[#F5F5F5] transition-colors">
                  <Play size={20} fill="currentColor" />
                </button>
                <div className="text-[13px] font-mono text-[#F5F5F5]">Lesson {activeLesson}: {lessons.find(l => l.n === activeLesson)?.title}</div>
              </div>
              <div className="flex items-center gap-4 text-[#8B8B8B]">
                <button className="text-xs font-mono hover:text-[#F5F5F5] transition-colors">1× Speed</button>
                <button className="hover:text-[#F5F5F5] transition-colors"><Eye size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-[#2A2A2A] flex flex-col hidden lg:flex">
          <div className="p-6 border-b border-[#2A2A2A]">
            <div className="text-[11px] font-mono text-[#B89D5C] tracking-widest uppercase mb-1">Section 01 · Foundation</div>
            <div className="text-[#F5F5F5] font-semibold">{COURSES[0].title}</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1 bg-[#2A2A2A]">
                <div className="h-full bg-[#B89D5C]" style={{ width: "34%" }} />
              </div>
              <span className="text-[11px] font-mono text-[#8B8B8B]">34%</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {lessons.map((l) => (
              <button
                key={l.n}
                onClick={() => setActiveLesson(l.n)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 text-left border-b border-[#2A2A2A] transition-colors",
                  activeLesson === l.n ? "bg-[#171717]" : "hover:bg-[#111111]"
                )}
              >
                <div className={cn("w-7 h-7 shrink-0 border flex items-center justify-center", l.done ? "border-[#B89D5C] bg-[#B89D5C]/10" : activeLesson === l.n ? "border-[#F5F5F5]" : "border-[#2A2A2A]")}>
                  {l.done ? <Check size={12} className="text-[#B89D5C]" /> : <Play size={10} className={activeLesson === l.n ? "text-[#F5F5F5] ml-0.5" : "text-[#8B8B8B] ml-0.5"} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm truncate", l.done ? "text-[#8B8B8B]" : activeLesson === l.n ? "text-[#F5F5F5] font-semibold" : "text-[#8B8B8B]")}>
                    {l.title}
                  </div>
                  <div className="text-[11px] font-mono text-[#8B8B8B] mt-0.5">{l.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
