"use server";

import { revalidateTag } from "next/cache";

import { type HomePageSettings } from "@/lib/home-customization";
import { updateHomePageSettings } from "@/api/openapi-client";
import { unwrap } from "@/api/client-service";

export async function saveHomeSettingsAction(settings: HomePageSettings) {
  const saved = await unwrap(
    updateHomePageSettings({
      body: settings,
    })
  );
  await revalidateTag("home-page", {});
  return saved;
}
