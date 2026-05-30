"use client";

import {
  BookOpen,
  Users,
  TrendingUp,
  ArrowUpRight,
  Lock,
  Layers,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryBtn } from "@/components/ui/buttons";

const stats = [
  { label: "Total Revenue", value: "€124,500", change: "+12.5%", up: true },
  { label: "New Students", value: "1,240", change: "+18.2%", up: true },
  { label: "Originals Sold", value: "12", change: "+2", up: true },
  { label: "Avg. Session", value: "24m", change: "-2.4%", up: false },
];

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-h3 font-extrabold tracking-tight text-text-main">
            Platform Overview
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Welcome back to the instructor command center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryBtn className="px-5 py-2.5 text-xs">
            Generate Report
          </PrimaryBtn>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-muted-light border border-border p-6"
          >
            <div className="text-label font-mono text-text-muted tracking-widest uppercase mb-3">
              {s.label}
            </div>
            <div className="text-text-main font-extrabold text-3xl mb-2">
              {s.value}
            </div>
            <div
              className={cn(
                "text-label font-mono flex items-center gap-1",
                s.up ? "text-gold" : "text-text-muted"
              )}
            >
              <TrendingUp size={11} /> {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="border border-border bg-muted-light">
        <div className="px-8 py-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-text-main font-bold text-xl">
            Recent Transactions
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-border bg-dark px-4 py-2">
              <Search size={14} className="text-text-muted" />
              <input
                type="text"
                placeholder="Filter by ID..."
                className="bg-transparent text-text-main text-sm outline-none placeholder:text-text-muted w-24 sm:w-36"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Item", "Customer", "Date", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-tiny font-mono text-text-muted tracking-widest uppercase bg-dark-soft"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-muted transition-colors">
                  <td className="px-6 py-4 text-text-muted font-mono text-xs">
                    #TXN-{1200 + i}
                  </td>
                  <td className="px-6 py-4 text-text-main font-medium">
                    {
                      [
                        "Oil Painting Fundamentals",
                        "Nocturne No. 7",
                        "Abstract Workshop",
                        "Solitude in Ochre",
                      ][i % 4]
                    }
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {
                      [
                        "Amara Nwosu",
                        "Hugo D.",
                        "Yuki T.",
                        "Sofia R.",
                        "James O.",
                        "Maya K.",
                      ][i]
                    }
                  </td>
                  <td className="px-6 py-4 text-text-muted font-mono text-xs">{`${20 - i} May 2026`}</td>
                  <td className="px-6 py-4 text-text-main font-semibold">
                    €{[280, 4800, 195, 420, 2200, 280][i]}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-tiny font-mono tracking-widest uppercase px-2 py-0.5 border",
                        i % 3 === 0
                          ? "text-gold border-gold/30 bg-gold/5"
                          : "text-text-muted border-text-muted/20 bg-text-muted/5"
                      )}
                    >
                      {i % 3 === 0 ? "Pending" : "Complete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 border-t border-border bg-dark-soft">
          <button className="text-gold text-xs font-mono tracking-widest uppercase hover:text-text-main transition-colors flex items-center gap-1">
            View All Transactions <ArrowUpRight size={12} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-text-main font-bold text-xl mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Add New Course", icon: BookOpen },
            { label: "Inventory Upload", icon: Layers },
            { label: "User Management", icon: Users },
            { label: "Platform Security", icon: Lock },
          ].map((a) => (
            <button
              key={a.label}
              className="group bg-muted-light border border-border hover:border-gold transition-all flex items-center gap-4 p-6 text-left"
            >
              <div className="w-10 h-10 bg-dark border border-border group-hover:border-gold flex items-center justify-center transition-colors">
                <a.icon
                  size={18}
                  className="text-text-muted group-hover:text-gold transition-colors"
                />
              </div>
              <span className="text-sm font-medium text-text-main">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
