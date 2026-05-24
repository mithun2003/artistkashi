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

import { register } from "@/features/auth/actions/register-action";
import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submitButton";
import Link from "next/link";
import { FieldError, FormError } from "@/components/ui/FormError";

export default function Page() {
  const [state, dispatch] = useActionState(register, undefined);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-16">
      <form action={dispatch}>
        <Card className="w-full max-w-sm rounded-none border border-border/60 bg-card shadow-none">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold uppercase tracking-[0.2em]">
              Join ArtistKashi
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Begin your premium artist journey.
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
              <FieldError state={state} field="email" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="rounded-none border-border/60"
              />
              <FieldError state={state} field="password" />
            </div>
            <SubmitButton text="Sign Up" />
            <FormError state={state} />
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
