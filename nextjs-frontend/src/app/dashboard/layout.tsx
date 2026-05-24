import { logout } from "@/features/auth/actions/logout-action";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Member Studio
            </p>
            <h1 className="text-3xl font-semibold uppercase tracking-[0.1em]">
              Dashboard
            </h1>
          </div>
          <form action={logout}>
            <Button variant="outline" className="rounded-none">
              Sign out
            </Button>
          </form>
        </header>
        <section className="grid gap-6">{children}</section>
      </div>
    </section>
  );
}
