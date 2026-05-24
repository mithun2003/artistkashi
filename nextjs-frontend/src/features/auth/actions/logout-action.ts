"use server";

import { cookies } from "next/headers";
import { authJwtLogout } from "@/services/api";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    // nothing to do — redirect to login
    redirect(`/login`);
    return;
  }

  const { error } = await authJwtLogout({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // On any error, route back to login and clear cookie
  cookieStore.delete("accessToken");
  redirect(`/login`);
}

