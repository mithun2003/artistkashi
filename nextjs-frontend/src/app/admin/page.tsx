"use client";

import { useState } from "react";
import {
  BarChart2, BookOpen, Package, ShoppingBag,
  MessageSquare, Users, Upload, ShieldCheck,
  Bell, User, Search, TrendingUp, ArrowUpRight,
  Lock, Layers, CreditCard, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES, PAINTINGS } from "@/data/constants";
import { PrimaryBtn } from "@/components/ui/buttons";

import { useAuth } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getRoleLabel } from "@/lib/auth-api";

const navItems = [
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "products", label: "Shop Items", icon: Package },
  { id: "orders", label: "Sales & Orders", icon: ShoppingBag },
  { id: "whatsapp", label: "WhatsApp Chat", icon: MessageCircle },
  { id: "users", label: "Students", icon: Users },
  { id: "media", label: "Media Library", icon: Upload },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const stats = [
  { label: "Total Revenue", value: "€124,500", change: "+12.5%", up: true },
  { label: "New Students", value: "1,240", change: "+18.2%", up: true },
  { label: "Originals Sold", value: "12", change: "+2", up: true },
  { label: "Avg. Session", value: "24m", change: "-2.4%", up: false },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("analytics");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#B89D5C] font-mono animate-pulse">VERIFYING PERMISSIONS...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <main className="pt-20 min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 shrink-0 border-r border-[#2A2A2A] bg-[#0D0D0D] lg:fixed lg:top-20 lg:bottom-0 overflow-y-auto flex flex-col">
        <div className="px-6 py-8 border-b border-[#2A2A2A] hidden lg:block">
          <div className="text-[10px] font-mono text-[#B89D5C] tracking-[0.2em] uppercase mb-1">Instructor Console</div>
          <div className="text-[#F5F5F5] font-bold" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Artist Kashi</div>
        </div>
        <nav className="flex-1 py-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "whitespace-nowrap flex items-center gap-4 px-6 py-3.5 text-sm text-left transition-colors",
                activeNav === item.id
                  ? "bg-[#171717] text-[#F5F5F5] border-r-2 border-[#B89D5C]"
                  : "text-[#8B8B8B] hover:text-[#F5F5F5] hover:bg-[#131313]"
              )}
            >
              <item.icon size={16} className={activeNav === item.id ? "text-[#B89D5C]" : ""} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-[#2A2A2A] hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#171717] border border-[#2A2A2A] flex items-center justify-center text-[#B89D5C] text-xs font-bold">
              {user.name?.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="text-[#F5F5F5] text-sm font-medium">{user.name}</div>
              <div className="text-[#8B8B8B] text-[11px] font-mono">{getRoleLabel(user)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 px-8 lg:px-12 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-mono text-[#B89D5C] tracking-widest uppercase mb-1">
              {navItems.find((n) => n.id === activeNav)?.label}
            </div>
            <h1 className="text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight text-[#F5F5F5]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {activeNav === "analytics" ? "Platform Overview" : navItems.find((n) => n.id === activeNav)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center text-[#8B8B8B] hover:text-[#F5F5F5] transition-colors relative">
              <Bell size={16} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#B89D5C]" />
            </button>
            <button className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center text-[#8B8B8B] hover:text-[#F5F5F5] transition-colors">
              <User size={16} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A] mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#111111] p-6">
              <div className="text-[11px] font-mono text-[#8B8B8B] tracking-widest uppercase mb-3">{s.label}</div>
              <div className="text-[#F5F5F5] font-extrabold text-3xl mb-2" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{s.value}</div>
              <div className={cn("text-[11px] font-mono flex items-center gap-1", s.up ? "text-[#B89D5C]" : "text-[#8B8B8B]")}>
                <TrendingUp size={11} /> {s.change} vs last month
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="border border-[#2A2A2A] bg-[#111111]">
          <div className="px-8 py-6 border-b border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[#F5F5F5] font-bold text-xl" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {activeNav === "analytics" && "Recent Transactions"}
              {activeNav === "courses" && "All Courses"}
              {activeNav === "products" && "All Products"}
              {activeNav === "orders" && "All Orders"}
              {activeNav === "whatsapp" && "WhatsApp Orders"}
              {activeNav === "users" && "All Users"}
              {activeNav === "media" && "Media Library"}
              {activeNav === "security" && "Security Events"}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-[#2A2A2A] px-4 py-2">
                <Search size={14} className="text-[#8B8B8B]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-[#F5F5F5] text-sm outline-none placeholder:text-[#8B8B8B] w-24 sm:w-36"
                />
              </div>
              <PrimaryBtn className="px-5 py-2.5 text-xs">
                + Add New
              </PrimaryBtn>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {(activeNav === "analytics"
                    ? ["ID", "Item", "Customer", "Date", "Amount", "Status"]
                    : activeNav === "users"
                    ? ["User", "Email", "Role", "Joined", "Status"]
                    : activeNav === "security"
                    ? ["Event", "IP Address", "User", "Time", "Severity"]
                    : ["Title", "Category", "Price", "Date", "Status"]
                  ).map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-mono text-[#8B8B8B] tracking-widest uppercase bg-[#0D0D0D]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="hover:bg-[#171717] transition-colors">
                    {activeNav === "analytics" ? (
                      <>
                        <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">#TXN-{1200 + i}</td>
                        <td className="px-6 py-4 text-[#F5F5F5]">{["Oil Painting Fundamentals", "Nocturne No. 7", "Abstract Workshop", "Solitude in Ochre"][i % 4]}</td>
                        <td className="px-6 py-4 text-[#8B8B8B]">{["Amara Nwosu", "Hugo D.", "Yuki T.", "Sofia R.", "James O.", "Maya K.", "Lena V.", "Carlos M."][i]}</td>
                        <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">{`${20 - i} May 2026`}</td>
                        <td className="px-6 py-4 text-[#F5F5F5] font-semibold">€{[280, 4800, 195, 420, 2200, 280, 6400, 195][i]}</td>
                        <td className="px-6 py-4">
                          <span className={cn("text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border", i % 3 === 0 ? "text-[#B89D5C] border-[#B89D5C]/30 bg-[#B89D5C]/5" : "text-[#8B8B8B] border-[#8B8B8B]/20 bg-[#8B8B8B]/5")}>
                            {i % 3 === 0 ? "Pending" : "Complete"}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-[#F5F5F5]">{[...COURSES, ...PAINTINGS][i % 6].title}</td>
                        <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">{["Course", "Painting", "Print"][i % 3]}</td>
                        <td className="px-6 py-4 text-[#F5F5F5]">€{[280, 4800, 195, 420, 2200, 6400, 280, 195][i]}</td>
                        <td className="px-6 py-4 text-[#8B8B8B] font-mono text-xs">{`${15 - i} May 2026`}</td>
                        <td className="px-6 py-4">
                          <span className={cn("text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border", i % 4 === 0 ? "text-[#B89D5C] border-[#B89D5C]/30" : "text-[#8B8B8B] border-[#8B8B8B]/20")}>
                            {i % 4 === 0 ? "Draft" : "Published"}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A] mt-8">
          {[
            { label: "Add Course", icon: BookOpen },
            { label: "Upload Artwork", icon: Layers },
            { label: "View Reports", icon: BarChart2 },
            { label: "Security Audit", icon: Lock },
          ].map((a) => (
            <button key={a.label} className="group bg-[#111111] hover:bg-[#171717] transition-colors flex items-center gap-4 p-6">
              <a.icon size={18} className="text-[#8B8B8B] group-hover:text-[#B89D5C] transition-colors" />
              <span className="text-sm text-[#8B8B8B] group-hover:text-[#F5F5F5] transition-colors">{a.label}</span>
              <ArrowUpRight size={14} className="ml-auto text-[#8B8B8B] opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
