import { HomeView } from "@/components/site/HomeView";
import { getPhotos, getSettings, getUpcomingEvents } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const [events, photos, settings] = await Promise.all([
    getUpcomingEvents(3),
    getPhotos({ featured: true }),
    getSettings(),
  ]);
  return <HomeView events={events} photos={photos} settings={settings} />;
}
