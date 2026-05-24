import { CinematicHero } from "@/components/sections/CinematicHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <CinematicHero />
      </div>
    </main>
  );
}
