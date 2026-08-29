"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="privacy">
      <p className="eyebrow">Algo interrumpió el servicio</p>
      <h1>No pudimos cargar esta página.</h1>
      <p>
        Intenta nuevamente. Si el problema continúa, escríbenos y te ayudaremos
        directamente.
      </p>
      <button className="button" onClick={reset}>
        Intentar otra vez
      </button>
    </main>
  );
}
