"use client";

import { RevealBlock } from "@/components/shared/RevealBlock";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Info, Send, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function CustomOrderPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="pt-32 pb-24 px-6 bg-dark min-h-screen">
      <div className="max-w-480 mx-auto px-6 md:px-12 lg:px-24 max-w-5xl">
        <RevealBlock direction="down">
          <div className="text-center mb-24">
            <span className="text-gold text-2xs uppercase tracking-[0.5em] mb-4 font-bold block">
              Exclusive Commissions
            </span>
            <h1 className="text-7xl italic uppercase tracking-tighter mb-8">
              CUSTOM MASTERPIECE
            </h1>
            <p className="max-w-2xl mx-auto text-text-muted text-sm uppercase tracking-[0.2em] leading-loose">
              Direct a vision. Kashi Master accepts a limited number of private
              commissions annually to create site-specific cinematic works for
              elite collections.
            </p>
          </div>
        </RevealBlock>

        <div className="flex flex-col lg:flex-row gap-24">
          {/* Progress Sidebar */}
          <div className="lg:w-1/4 space-y-12">
            {[
              {
                num: 1,
                label: "Vision",
                desc: "Define the core subject and mood",
              },
              {
                num: 2,
                label: "Scale",
                desc: "Canvas dimensions and spatial context",
              },
              {
                num: 3,
                label: "Review",
                desc: "Submit for Kashi's personal vetting",
              },
            ].map((s) => (
              <div key={s.num} className="flex gap-6 items-start">
                <div
                  className={cn(
                    "w-12 h-12 border flex items-center justify-center font-black italic transition-all",
                    step >= s.num
                      ? "border-gold bg-gold text-dark"
                      : "border-white/10 text-text-muted"
                  )}
                >
                  {s.num}
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest",
                      step === s.num ? "text-text-main" : "text-text-muted"
                    )}
                  >
                    {s.label}
                  </h4>
                  <p className="text-2xs text-text-muted uppercase tracking-widest mt-1">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="lg:w-3/4 bg-white/2 border border-white/10 p-12">
            <form
              className="space-y-12"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 3) setStep(step + 1);
              }}
            >
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <label className="text-2xs uppercase tracking-widest font-black text-gold">
                        The Visionary Prompt
                      </label>
                      <textarea
                        placeholder="Describe the desired mood, color palette, and core subject of the piece..."
                        className="w-full bg-dark border border-white/10 p-8 text-xs tracking-widest uppercase focus:border-gold outline-none h-48 resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 border border-white/10 border-dashed flex flex-col items-center justify-center gap-4 hover:border-gold transition-colors cursor-pointer group">
                        <Upload className="w-8 h-8 text-text-muted group-hover:text-gold" />
                        <span className="text-2xs uppercase tracking-widest text-text-muted">
                          Upload Reference Visuals
                        </span>
                      </div>
                      <div className="p-8 border border-white/10 bg-white/1">
                        <div className="flex gap-2 items-start text-text-muted">
                          <Info className="w-4 h-4 text-gold shrink-0" />
                          <p className="text-2xs uppercase tracking-widest leading-loose">
                            Providing architectural photos of the destination
                            wall helps Kashi visualize the cinematic impact.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      {[
                        '48x60"',
                        '60x72"',
                        '72x96"',
                        "Custom Large",
                        "Mural",
                      ].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className="p-8 border border-white/10 bg-dark text-2xs uppercase tracking-widest font-black hover:border-gold hover:text-gold transition-all italic"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="p-8 border border-gold/20 bg-gold/5 flex gap-6 items-center">
                      <CheckCircle2 className="w-8 h-8 text-gold" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold">
                          Global Shipping Included
                        </h4>
                        <p className="text-2xs text-text-muted uppercase tracking-widest">
                          Commissioned works include white-glove delivery and
                          professional installation consultation.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-12 text-center py-12"
                  >
                    <div className="w-24 h-24 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto mb-8">
                      <Send className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-4xl italic uppercase tracking-tighter">
                      Ready for Review
                    </h3>
                    <p className="text-text-muted text-xs uppercase tracking-widest leading-loose max-w-lg mx-auto">
                      Your vision will be personally vetted by Kashi Master.
                      Expect a private communication within 5-7 business days
                      for further alignment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row gap-6 justify-between items-center pt-8 border-t border-white/10">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-2xs uppercase tracking-widest font-black text-text-muted hover:text-text-main transition-colors"
                  >
                    Go Back
                  </button>
                )}
                <div className="flex-1" />
                <div className="flex gap-4 w-full md:w-auto">
                  <a
                    href="https://wa.me/919999988888?text=Hello%20ArtistKashi,%20I%20am%20interested%20in%20a%20custom%20commission."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none border border-gold text-gold px-12 py-5 text-2xs uppercase tracking-[0.4em] font-black hover:bg-gold hover:text-dark transition-all flex items-center justify-center gap-3"
                  >
                    WHATSAPP DIRECT
                  </a>
                  <button
                    type="submit"
                    className="flex-1 md:flex-none bg-text-main text-dark px-12 py-5 text-2xs uppercase tracking-[0.4em] font-black hover:bg-gold transition-all flex items-center justify-center gap-3"
                  >
                    {step === 3 ? "SUBMIT PROPOSAL" : "NEXT STEP"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
