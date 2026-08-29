import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";
import { AppError } from "@/lib/http";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function hasValidSignature(bytes: Uint8Array, mime: string) {
  if (mime === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (mime === "image/png")
    return bytes
      .slice(0, 8)
      .every(
        (value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index],
      );
  if (mime === "image/webp")
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  if (mime === "image/avif")
    return String.fromCharCode(...bytes.slice(4, 12)).includes("ftypavif");
  return false;
}

async function uploadToCloudinary(file: File, bytes: Uint8Array) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "casa-bruma";
  const signature = createHash("sha1")
    .update(
      `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`,
    )
    .digest("hex");
  const form = new FormData();
  form.set(
    "file",
    new Blob([bytes.buffer as ArrayBuffer], { type: file.type }),
    file.name,
  );
  form.set("api_key", env.CLOUDINARY_API_KEY!);
  form.set("timestamp", String(timestamp));
  form.set("folder", folder);
  form.set("signature", signature);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!response.ok)
    throw new AppError(
      502,
      "El servicio de imágenes no respondió correctamente.",
      "IMAGE_STORAGE_ERROR",
    );
  const result = (await response.json()) as { secure_url: string };
  return result.secure_url;
}

export async function storeImage(file: File) {
  if (!MIME_EXTENSIONS[file.type])
    throw new AppError(
      415,
      "Formato no permitido. Usa JPG, PNG, WebP o AVIF.",
      "INVALID_FILE_TYPE",
    );
  if (file.size > MAX_FILE_SIZE)
    throw new AppError(
      413,
      "La imagen no puede superar 5 MB.",
      "FILE_TOO_LARGE",
    );
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type))
    throw new AppError(
      415,
      "El contenido del archivo no coincide con su formato.",
      "INVALID_FILE_SIGNATURE",
    );

  if (
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ) {
    return uploadToCloudinary(file, bytes);
  }

  const uploadsPath = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsPath, { recursive: true });
  const filename = `${randomUUID()}.${MIME_EXTENSIONS[file.type]}`;
  await writeFile(path.join(uploadsPath, filename), bytes);
  return `/uploads/${filename}`;
}
