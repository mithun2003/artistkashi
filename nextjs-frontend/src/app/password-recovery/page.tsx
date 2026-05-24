"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { passwordReset } from "@/features/auth/actions/password-reset-action";
import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submitButton";
import Link from "next/link";
import { FormError } from "@/components/ui/FormError";

export default function Page() {
  const [state, dispatch] = useActionState(passwordReset, undefined);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-16">
      <form action={dispatch}>
        <Card className="w-full max-w-sm rounded-none border border-border/60 bg-card shadow-none">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold uppercase tracking-[0.2em]">
              Reset Access
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              We&apos;ll send a private reset link to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="rounded-none border-border/60"
              />
            </div>
            <SubmitButton text="Send" />
            <FormError state={state} />
            <div className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-accent">
              {state?.message && <p>{state.message}</p>}
            </div>
            <div className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Link
                href="/login"
                className="text-foreground"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
