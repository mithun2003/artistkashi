import { type HomePageSettings } from "@/lib/home-customization";
import { apiClient } from "@/lib/api-client";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiClient.getConfig().baseURL}${path}`, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
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

export async function fetchHomeSettings(): Promise<HomePageSettings> {
  return requestJson<HomePageSettings>("/admin/config/home");
}

export async function saveHomeSettings(
  settings: HomePageSettings
): Promise<HomePageSettings> {
  return requestJson<HomePageSettings>("/admin/config/home", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
