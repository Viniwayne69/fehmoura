import type { Metadata } from "next";
import { GalleryFilter } from "@/components/site/GalleryFilter";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { getPhotos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Fotos dos sets da DJ Feh Moura em clubes, festivais e eventos privados.",
  alternates: { canonical: "/galeria" },
};
export const revalidate = 300;

export default async function GaleriaPage() {
  const photos = await getPhotos();
  return (
    <>
      <PageHero eyebrow="Galeria" title="Registros da pista" lead="Momentos de pista cheia, luz baixa e muita conexão." />
      <section className="section section--ink">
        <div className="wrap">
          {photos.length > 0 ? (
            <Reveal><GalleryFilter photos={photos} /></Reveal>
          ) : (
            <p className="lead">As fotos chegam em breve.</p>
          )}
        </div>
      </section>
    </>
  );
}
