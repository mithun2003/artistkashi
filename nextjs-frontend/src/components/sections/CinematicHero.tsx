import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CinematicHero() {
  return (
    <section className="relative overflow-hidden border border-border/60 bg-card px-6 py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Cinematic Artist Platform
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold uppercase tracking-[0.12em] sm:text-5xl">
            ArtistKashi
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            A luxury LMS and gallery commerce experience for premium painting
            courses, immersive storytelling, and curated art drops.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild className="rounded-none">
            <Link href="/register">Become a Member</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/login">Enter Studio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
