// Small runtime helpers for client-side animation libraries (GSAP, Framer Motion, Lenis)
// These helpers use dynamic imports to avoid SSR issues and keep entry bundles small.

export async function initLenis(options?: Record<string, unknown>) {
  try {
    const { default: Lenis } = await import("lenis");
    const lenis = new Lenis({ duration: 1.2, smooth: true, ...(options || {}) });
    return lenis;
  } catch (e) {
    // library not installed or running in SSR
    return null;
  }
}

export async function importGsap() {
  try {
    const gsap = await import("gsap");
    return gsap;
  } catch (e) {
    return null;
  }
}

export async function importFramer() {
  try {
    const fm = await import("framer-motion");
    return fm;
  } catch (e) {
    return null;
  }
}
