"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { RevealBlock } from "@/components/ui/misc";
import { PAINTINGS, COURSES } from "@/data/constants";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = [...PAINTINGS, ...COURSES].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="pt-32 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <RevealBlock>
          <div className="relative mb-16">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8B8B8B]" size={32} />
            <input 
              autoFocus
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artists, artworks, courses..." 
              className="w-full bg-transparent border-b-2 border-[#2A2A2A] focus:border-[#B89D5C] text-[#F5F5F5] text-[clamp(24px,4vw,48px)] font-bold py-6 pl-14 outline-none transition-colors"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            />
          </div>
          
          {query && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
              {results.length > 0 ? results.map((item, i) => (
                <Link 
                  key={i} 
                  href={'price' in item && item.price > 1000 ? `/shop/${item.id}` : `/courses/${item.id}`}
                  className="group bg-[#0A0A0A] p-6 hover:bg-[#111111] transition-colors cursor-pointer"
                >
                  <div className="aspect-[4/3] mb-4 overflow-hidden bg-[#171717]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="text-[10px] font-mono text-[#B89D5C] uppercase tracking-widest mb-1">
                    {'price' in item && item.price > 1000 ? 'Original Work' : 'Course'}
                  </div>
                  <div className="text-[#F5F5F5] font-semibold">{item.title}</div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center text-[#8B8B8B]">
                  No results found for "{query}".
                </div>
              )}
            </div>
          )}
        </RevealBlock>
      </div>
    </main>
  );
}
