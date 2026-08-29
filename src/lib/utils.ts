import { clsx, type ClassValue } from "clsx";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(
  value: Date | string,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
    timeZone: "UTC",
  }).format(new Date(value));
}

export function toDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function getTodayInEcuador() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getMinimumReservationDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
