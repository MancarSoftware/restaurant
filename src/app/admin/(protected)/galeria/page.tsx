import { GalleryManager } from "@/features/admin/gallery-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function AdminGalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Galería.</h1>
          <p>Imágenes, textos alternativos, orden y visibilidad.</p>
        </div>
      </header>
      <GalleryManager
        images={images.map((image) => ({
          ...image,
          createdAt: image.createdAt.toISOString(),
          updatedAt: image.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}
