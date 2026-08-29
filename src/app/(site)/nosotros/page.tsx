import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "La casa",
  description: "La historia, filosofía y equipo detrás de Casa Bruma.",
};

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">La historia</p>
          <h1>
            Una casa
            <br />
            con memoria.
          </h1>
        </div>
        <p>
          Casa Bruma nació para mirar la cocina ecuatoriana desde el presente,
          sin borrar las manos, los lugares ni las historias que la sostienen.
        </p>
      </header>
      <section className="about-editorial">
        <div className="about-image">
          <div className="about-image-inner">
            <Image
              src="/images/chef-valentina.webp"
              alt="Chef Valentina Cedeño en la cocina de Casa Bruma"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="about-copy">
          <section>
            <p className="eyebrow">01 · Origen</p>
            <h2>De la costa hacia adentro.</h2>
            <p>
              La chef Valentina Cedeño creció entre mercados de Guayaquil y
              huertos familiares en Manabí. Después de trabajar en cocinas de
              Lima, Ciudad de México y Madrid, volvió con una pregunta: ¿cómo
              puede una cocina contemporánea seguir perteneciendo a su lugar?
            </p>
          </section>
          <section>
            <p className="eyebrow">02 · Filosofía</p>
            <h2>Menos intervención. Más escucha.</h2>
            <p>
              Trabajamos con una red pequeña de productores y elegimos la
              técnica según el ingrediente, no al revés. Fermentamos, ahumamos y
              maduramos para ampliar el sabor, nunca para ocultarlo.
            </p>
          </section>
          <section>
            <p className="eyebrow">03 · Oficio</p>
            <h2>El detalle también alimenta.</h2>
            <p>
              La vajilla está hecha por ceramistas locales. La madera fue
              carbonizada a mano. La luz acompaña el ritmo del servicio. Cada
              decisión busca que la experiencia se sienta precisa y humana.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
