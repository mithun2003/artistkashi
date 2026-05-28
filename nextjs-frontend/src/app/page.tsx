import { defaultHomeSettings } from "@/lib/home-customization";
import { fetchHomeSettingsCached } from "@/api/home.server";
import { HomePageClient } from "@/components/home/HomePageClient";

export default async function HomePage() {
  try {
    const settings = await fetchHomeSettingsCached();
    return <HomePageClient initialSettings={settings} />;
  } catch {
    return <HomePageClient initialSettings={defaultHomeSettings} />;
  }
}
