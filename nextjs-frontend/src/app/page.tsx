import {
  defaultHomeSettings,
  type HomePageSettings,
} from "@/lib/home-customization";
import { getHomePageSettings } from "@/api/openapi-client";
import { HomePageClient } from "@/components/home/HomePageClient";
import { unwrap } from "@/api/client-service";

export default async function HomePage() {
  try {
    const settings = await unwrap(getHomePageSettings());
    return (
      <HomePageClient
        initialSettings={(settings || defaultHomeSettings) as HomePageSettings}
      />
    );
  } catch {
    return <HomePageClient initialSettings={defaultHomeSettings} />;
  }
}
