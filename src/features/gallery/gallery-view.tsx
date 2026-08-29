"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useRef, useState } from "react";

type GalleryImage = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  imageUrl: string;
  altText: string;
};

export function GalleryView({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const open = (image: GalleryImage) => {
    setSelected(image);
    dialogRef.current?.showModal();
  };
  return (
    <>
      <div className="gallery-list">
        {images.map((image) => (
          <button
            type="button"
            className="gallery-item"
            key={image.id}
            onClick={() => open(image)}
            aria-label={`Ampliar ${image.title}`}
          >
            <Image
              src={image.imageUrl}
              alt={image.altText}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <span className="gallery-caption">
              <span>{image.category}</span>
              <strong>{image.title}</strong>
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="gallery-dialog-image">
            <button
              type="button"
              className="dialog-close"
              onClick={() => dialogRef.current?.close()}
            >
              <span className="sr-only">Cerrar imagen</span>
              <X aria-hidden="true" />
            </button>
            <Image
              src={selected.imageUrl}
              alt={selected.altText}
              fill
              sizes="92vw"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
