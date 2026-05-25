"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  LayoutDashboard, BookOpen, Package, Settings, 
  LogOut, Clock, Check, ShoppingBag, ArrowUpRight,
  ChevronRight, Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/data/constants";
import Link from "next/link";
import { PrimaryBtn } from "@/components/ui/buttons";

import { useAuth } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage, getRoleLabel, type AuthErrorInput } from "@/lib/auth-api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [greeting, setGreeting] = useState("Welcome");
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
      return;
    }

    if (hour < 18) {
      setGreeting("Good afternoon");
      return;
    }

    setGreeting("Good evening");
  }, []);

  const greetingLabel = useMemo(() => greeting, [greeting]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#B89D5C] font-mono animate-pulse">AUTHENTICATING...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="border border-[#2A2A2A] bg-[#111111] p-6 mb-6">
              <div className="w-14 h-14 bg-[#171717] border border-[#2A2A2A] flex items-center justify-center text-[#B89D5C] font-bold text-xl mb-4" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-[#F5F5F5] font-bold text-lg" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{user.name}</div>
              <div className="text-[#8B8B8B] text-sm font-mono">{user.email}</div>
              <div className="mt-4 flex items-center gap-2">
                <span className={cn(
                  "border text-[10px] font-mono tracking-widest uppercase px-2.5 py-1",
                  user.role === "admin" 
                    ? "bg-red-500/10 border-red-500/30 text-red-500" 
                    : "bg-[#B89D5C]/10 border-[#B89D5C]/30 text-[#B89D5C]"
                )}>
                  {getRoleLabel(user)}
                </span>
              </div>
            </div>

            <div className="border border-[#2A2A2A] bg-[#111111] overflow-hidden">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "courses", label: "My Courses", icon: BookOpen },
                { id: "orders", label: "Orders", icon: Package },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 text-sm text-left border-b border-[#2A2A2A] last:border-b-0 transition-colors",
                    activeTab === item.id ? "bg-[#1A1A1A] text-[#F5F5F5]" : "text-[#8B8B8B] hover:text-[#F5F5F5] hover:bg-[#171717]"
                  )}
                >
                  <item.icon size={16} className={activeTab === item.id ? "text-[#B89D5C]" : ""} />
                  {item.label}
                </button>
              ))}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-4 px-6 py-4 text-sm text-[#8B8B8B] hover:text-red-500 hover:bg-[#171717] transition-colors border-t border-[#2A2A2A]"
                >
                  <Settings size={16} /> Instructor Panel
                </Link>
              )}
              <button
                onClick={async () => {
                  try {
                    await logout();
                    router.push("/");
                  } catch (error) {
                    toast.error(getAuthErrorMessage(error as AuthErrorInput));
                    router.push("/");
                  }
                }}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm text-[#8B8B8B] hover:text-[#F5F5F5] transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {activeTab === "overview" && (
              <div>
                <div className="mb-8">
                  <div className="text-[11px] font-mono text-[#B89D5C] tracking-widest uppercase mb-2">Student Portal</div>
                  <h1 className="text-[clamp(28px,3vw,48px)] font-extrabold tracking-tight text-[#F5F5F5]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                    {greetingLabel}, Amara.
                  </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2A2A2A] mb-8">
                  {[
                    { label: "Enrolled Courses", value: "3", icon: BookOpen },
                    { label: "Hours Watched", value: "47h", icon: Clock },
                    { label: "Lessons Done", value: "84", icon: Check },
                    { label: "Art Purchases", value: "2", icon: ShoppingBag },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#111111] p-6">
                      <s.icon size={18} className="text-[#B89D5C] mb-3" />
                      <div className="text-[#F5F5F5] font-extrabold text-3xl" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{s.value}</div>
                      <div className="text-[#8B8B8B] text-[11px] font-mono mt-1 uppercase tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Continue Watching */}
                <div className="border border-[#2A2A2A] bg-[#111111] mb-6">
                  <div className="px-8 py-6 border-b border-[#2A2A2A] flex items-center justify-between">
                    <h2 className="text-[#F5F5F5] font-bold text-xl" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Continue Watching</h2>
                    <Link href="/lesson-player" className="text-[#B89D5C] text-xs font-mono tracking-widest uppercase hover:text-[#F5F5F5] transition-colors flex items-center gap-1">
                      Open <ArrowUpRight size={12} />
                    </Link>
                  </div>
                  <Link
                    href="/lesson-player"
                    className="group w-full flex items-center gap-6 p-6 hover:bg-[#171717] transition-colors"
                  >
                    <div className="w-28 h-16 shrink-0 overflow-hidden relative bg-[#0A0A0A]">
                      <img src={COURSES[0].image} alt={COURSES[0].title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={18} fill="white" className="text-white ml-0.5 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[10px] font-mono text-[#8B8B8B] uppercase tracking-widest mb-1">Lesson 3 of 42</div>
                      <div className="text-[#F5F5F5] font-semibold mb-2">Color theory for oil painters</div>
                      <div className="w-full h-1 bg-[#2A2A2A]">
                        <div className="h-full bg-[#B89D5C]" style={{ width: "34%" }} />
                      </div>
                      <div className="text-[11px] font-mono text-[#8B8B8B] mt-1">34% complete · 14 min remaining</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div>
                <h2 className="text-[#F5F5F5] font-bold text-3xl mb-8" style={{ fontFamily: "'Inter Tight', sans-serif" }}>My Courses</h2>
                <div className="space-y-px bg-[#2A2A2A]">
                  {COURSES.map((c) => (
                    <Link
                      key={c.id}
                      href="/lesson-player"
                      className="group w-full bg-[#111111] flex items-center gap-6 p-6 text-left hover:bg-[#171717] transition-colors"
                    >
                      <div className="w-20 h-14 shrink-0 overflow-hidden bg-[#0A0A0A]">
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#F5F5F5] font-semibold truncate">{c.title}</div>
                        <div className="text-[#8B8B8B] text-xs font-mono mt-1">{c.instructor}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-32 h-1 bg-[#2A2A2A]">
                            <div className="h-full bg-[#B89D5C]" style={{ width: `${Math.random() * 60 + 10}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-[#8B8B8B]">{Math.floor(Math.random() * 40 + 10)}%</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#8B8B8B] group-hover:text-[#F5F5F5] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-[#F5F5F5] font-bold text-3xl mb-8" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Purchase History</h2>
                <div className="border border-[#2A2A2A] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2A2A2A]">
                          {["Item", "Type", "Date", "Amount", "Status"].map((h) => (
                            <th key={h} className="text-left px-6 py-4 text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase bg-[#0D0D0D]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2A2A2A]">
                        {[
                          { item: "Oil Painting Fundamentals", type: "Course", date: "12 Apr 2026", amount: "€280", status: "Active" },
                          { item: "Solitude in Ochre", type: "Painting", date: "03 Mar 2026", amount: "€4,800", status: "Shipped" },
                          { item: "Abstract Expression Workshop", type: "Course", date: "18 Jan 2026", amount: "€195", status: "Active" },
                        ].map((r, i) => (
                          <tr key={i} className="hover:bg-[#111111] transition-colors">
                            <td className="px-6 py-4 text-[#F5F5F5]">{r.item}</td>
                            <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">{r.type}</td>
                            <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">{r.date}</td>
                            <td className="px-6 py-4 text-[#F5F5F5] font-semibold">{r.amount}</td>
                            <td className="px-6 py-4">
                              <span className={cn("text-[10px] font-mono tracking-widest uppercase px-2.5 py-1", r.status === "Active" ? "bg-[#B89D5C]/10 text-[#B89D5C] border border-[#B89D5C]/30" : "bg-[#8B8B8B]/10 text-[#8B8B8B] border border-[#8B8B8B]/20")}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-[#F5F5F5] font-bold text-3xl mb-8" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Profile Settings</h2>
                <div className="border border-[#2A2A2A] bg-[#111111] divide-y divide-[#2A2A2A]">
                  {[
                    { label: "Full Name", value: "Amara Mensah", type: "text" },
                    { label: "Email", value: "amara@studio.com", type: "email" },
                    { label: "Location", value: "Lagos, Nigeria", type: "text" },
                  ].map((f) => (
                    <div key={f.label} className="px-8 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <label className="text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase md:w-32 shrink-0">{f.label}</label>
                      <input
                        type={f.type}
                        defaultValue={f.value}
                        className="flex-1 bg-transparent text-[#F5F5F5] text-sm outline-none border-b border-[#2A2A2A] focus:border-[#B89D5C] pb-1 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <PrimaryBtn>Save Changes <Check size={16} /></PrimaryBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
