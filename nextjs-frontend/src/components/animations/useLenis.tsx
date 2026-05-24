"use client";
import { useEffect } from "react";

export default function useLenis() {
  useEffect(() => {
    let lenis: any;
    let rafId: number;

    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({ duration: 1.2, smooth: true });

        function raf(time: number) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (e) {
        // Lenis not available — silently skip in environments without it.
        // This keeps the app safe during SSR and CI runs.
      }
    })();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis && typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);
}
