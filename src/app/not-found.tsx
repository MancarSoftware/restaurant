import Link from "next/link";
export default function NotFound() {
  return (
    <main className="privacy">
      <p className="eyebrow">404</p>
      <h1>Esta mesa no existe.</h1>
      <p>La página que buscas cambió de lugar o ya no está disponible.</p>
      <Link className="button" href="/">
        Volver a la casa
      </Link>
    </main>
  );
}
