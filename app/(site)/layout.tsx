import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Socials } from "@/components/site/Socials";
import { SoundProvider } from "@/components/site/SoundProvider";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const sameAs = [settings.instagram, settings.youtube, settings.spotify, settings.soundcloud].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    genre: ["Funk", "Pop", "House", "International"],
    sameAs,
  };

  return (
    <SoundProvider>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header socials={<Socials settings={settings} />} />
      <main id="conteudo">{children}</main>
      <Footer settings={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </SoundProvider>
  );
}
