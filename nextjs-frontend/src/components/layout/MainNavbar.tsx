import Link from "next/link";

import { Button } from "@/components/ui/button";

export function MainNavbar() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em]">
          ArtistKashi
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
          <Button asChild className="rounded-none">
            <Link href="/register">Join</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
