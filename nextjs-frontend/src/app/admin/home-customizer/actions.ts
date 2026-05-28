"use server";

import { revalidateTag } from "next/cache";

import { type HomePageSettings } from "@/lib/home-customization";
import { saveHomeSettings } from "@/api/home";

export async function saveHomeSettingsAction(settings: HomePageSettings) {
  const saved = await saveHomeSettings(settings);
  await revalidateTag("home-page", {});
  return saved;
}
