import type { Metadata } from "next";
import { GalleryView } from "@/features/gallery/gallery-view";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Imágenes",
  description: "Platos, cocina y atmósfera de Casa Bruma.",
};

export default async function GalleryPage() {
  const images = await db.galleryImage.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">Cuaderno visual</p>
          <h1>
            Materia,
            <br />
            luz y fuego.
          </h1>
        </div>
        <p>
          Fragmentos del servicio: el plato que llega, la mano que termina y el
          fuego que permanece.
        </p>
      </header>
      <GalleryView images={images} />
    </>
  );
}
