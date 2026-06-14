"use client";

import { RevealBlock } from "@/components/shared/RevealBlock";
import {
  ArrowLeft,
  Award,
  Calendar,
  FileText,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function VerificationPage() {
  const [certId, setCertId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    title: string;
    artist: string;
    date: string;
    medium: string;
    status: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate secure verification delay
    setTimeout(() => {
      setResult({
        id: certId,
        title: "Shadows of Banaras",
        artist: "Kashi Master",
        date: "May 12, 2026",
        medium: "Oil on Archival Canvas",
        status: "Verified Authentic",
      });
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-dark min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 max-w-4xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xs uppercase tracking-widest text-text-muted hover:text-text-main mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </Link>

        <RevealBlock direction="down">
          <div className="text-center mb-20">
            <ShieldCheck className="w-16 h-16 text-gold mx-auto mb-8 animate-pulse" />
            <h1 className="text-6xl italic uppercase tracking-tighter mb-6">
              Provenance Ledger
            </h1>
            <p className="text-text-muted text-xs uppercase tracking-widest leading-loose">
              Every Kashi masterwork is a unique identifier in the history of
              cinematic art. <br />
              Enter your certificate ID below to verify authenticity and
              ownership.
            </p>
          </div>
        </RevealBlock>

        <div className="bg-white/2 border border-white/10 p-8 md:p-12 mb-12 relative overflow-hidden">
          <form onSubmit={handleVerify} className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors" />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="ENTER MASTERWORK ID (E.G. AK-2026-1024)"
                  className="w-full bg-black border border-white/10 py-6 pl-16 pr-8 text-xs tracking-[0.3em] font-black uppercase focus:border-gold outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-text-main text-dark px-12 py-6 text-2xs font-black uppercase tracking-[0.4em] hover:bg-gold transition-all disabled:opacity-50"
              >
                {isVerifying ? "VERIFYING..." : "AUTHENTICATE"}
              </button>
            </div>
          </form>

          {/* Decorative scanner line */}
          {isVerifying && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gold/30 blur-sm z-20"
            />
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/2 border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="bg-gold text-dark p-4 text-center">
                <span className="text-2xs font-black uppercase tracking-[0.6em] flex items-center justify-center gap-3">
                  <ShieldCheck className="w-4 h-4" /> OFFICIAL PROVENANCE
                  VERIFIED
                </span>
              </div>
              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-square bg-black border border-white/5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600"
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="space-y-8">
                  {[
                    {
                      icon: Award,
                      label: "Artwork Title",
                      value: result.title,
                    },
                    {
                      icon: User,
                      label: "Primary Artist",
                      value: result.artist,
                    },
                    {
                      icon: Calendar,
                      label: "Creation Date",
                      value: result.date,
                    },
                    { icon: FileText, label: "Medium", value: result.medium },
                  ].map((info) => (
                    <div
                      key={info.label}
                      className="border-b border-white/5 pb-4"
                    >
                      <span className="text-2xs text-text-muted uppercase tracking-widest font-black flex items-center gap-2 mb-1">
                        <info.icon className="w-3 h-3 text-gold" /> {info.label}
                      </span>
                      <p className="text-xl font-bold uppercase tracking-tight italic">
                        {info.value}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4">
                    <button className="text-2xs uppercase tracking-widest font-black text-gold border border-gold/30 px-6 py-2 hover:bg-gold hover:text-dark transition-all">
                      DOWNLOAD DIGITAL CERTIFICATE (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
