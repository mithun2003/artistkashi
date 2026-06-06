"use client";

import { RevealBlock } from "@/components/shared/RevealBlock";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-dark min-h-screen">
      <div className="max-w-480 mx-auto px-6 md:px-12 lg:px-24">
        <RevealBlock direction="down">
          <header className="mb-24 border-b border-white/10 pb-12">
            <span className="text-gold text-2xs uppercase tracking-[0.5em] mb-4 font-bold block">
              Direct Alignment
            </span>
            <h1 className="text-7xl italic uppercase tracking-tighter">
              Studio Contact
            </h1>
          </header>
        </RevealBlock>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-4 space-y-12">
            <RevealBlock>
              <div className="space-y-8">
                <h3 className="text-gold text-2xs uppercase tracking-[0.4em] font-black">
                  HEADQUARTERS
                </h3>
                <div className="space-y-4">
                  <p className="flex items-center gap-4 text-xs uppercase tracking-widest text-text-muted">
                    <MapPin className="w-5 h-5 text-gold" /> Banaras Art District,
                    India
                  </p>
                  <p className="flex items-center gap-4 text-xs uppercase tracking-widest text-text-muted">
                    <Phone className="w-5 h-5 text-gold" /> +91 99999 88888
                  </p>
                  <p className="flex items-center gap-4 text-xs uppercase tracking-widest text-text-muted">
                    <Mail className="w-5 h-5 text-gold" /> studio@artistkashi.com
                  </p>
                </div>
              </div>

              <div className="space-y-8 pt-12 border-t border-white/5">
                <h3 className="text-gold text-2xs uppercase tracking-[0.4em] font-black">
                  SALON HOURS
                </h3>
                <div className="space-y-2 text-2xs uppercase tracking-widest text-text-muted">
                  <p className="flex justify-between">
                    <span>Mon — Fri</span>{" "}
                    <span className="text-text-main">10:00 - 18:00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sat</span>{" "}
                    <span className="text-text-main">12:00 - 16:00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sun</span>{" "}
                    <span className="text-text-main italic font-bold">
                      By Appointment Only
                    </span>
                  </p>
                </div>
              </div>
            </RevealBlock>
          </div>

          <div className="lg:col-span-8 bg-white/2 border border-white/10 p-12 relative overflow-hidden group">
            <RevealBlock>
              <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="relative group/field">
                    <label className="text-[8px] uppercase tracking-widest font-black text-text-muted group-focus-within/field:text-gold transition-colors">
                      IDENTIFIER
                    </label>
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-xs tracking-widest uppercase focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="relative group/field">
                    <label className="text-[8px] uppercase tracking-widest font-black text-text-muted group-focus-within/field:text-gold transition-colors">
                      COMMUNICATION
                    </label>
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-xs tracking-widest uppercase focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="relative group/field">
                  <label className="text-[8px] uppercase tracking-widest font-black text-text-muted group-focus-within/field:text-gold transition-colors">
                    INQUIRY TYPE
                  </label>
                  <select className="w-full bg-transparent border-b border-white/10 py-4 text-xs tracking-widest uppercase focus:border-gold outline-none transition-colors appearance-none cursor-pointer">
                    <option className="bg-dark">Private Acquisition</option>
                    <option className="bg-dark">Academy Support</option>
                    <option className="bg-dark">Exhibition Invitation</option>
                    <option className="bg-dark">Press & Media</option>
                  </select>
                </div>

                <div className="relative group/field">
                  <label className="text-[8px] uppercase tracking-widest font-black text-text-muted group-focus-within/field:text-gold transition-colors">
                    MESSAGE
                  </label>
                  <textarea
                    placeholder="HOW CAN WE ASSIST YOUR VISION?"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-xs tracking-widest uppercase focus:border-gold outline-none transition-colors h-32 resize-none"
                    required
                  />
                </div>

                <button className="w-full bg-text-main text-dark py-6 text-2xs font-black uppercase tracking-[0.4em] hover:bg-gold transition-all flex items-center justify-center gap-4">
                  DISPATCH MESSAGE <Send className="w-4 h-4" />
                </button>
              </form>
            </RevealBlock>
          </div>
        </div>
      </div>
    </div>
  );
}
