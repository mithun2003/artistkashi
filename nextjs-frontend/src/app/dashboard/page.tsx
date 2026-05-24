export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="border border-border/60 bg-card p-8">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.08em]">
          Your studio is ready
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          This space will soon host your enrolled courses, active purchases, and
          private artist updates. The foundation is prepared for the premium
          ArtistKashi experience.
        </p>
      </div>
      <div className="border border-border/60 bg-background/60 p-8 text-sm text-muted-foreground">
        Course progress, order history, and video library modules will be wired
        here as features launch.
      </div>
    </div>
  );
}
