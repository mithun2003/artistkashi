import { type HomePageSettings } from "@/lib/home-customization";
import { apiClient } from "@/lib/api-client";

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiClient.getConfig().baseURL}${path}`, {
    cache: "force-cache",
    next: { tags: ["home-page"] },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export async function fetchHomeSettingsCached(): Promise<HomePageSettings> {
  return requestJson<HomePageSettings>("/api/admin/config/home");
}
