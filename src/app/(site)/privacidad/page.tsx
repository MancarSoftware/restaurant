import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacidad" };
export default function PrivacyPage() {
  return (
    <article className="privacy">
      <p className="eyebrow">Información legal</p>
      <h1>Privacidad.</h1>
      <p>Última actualización: 28 de agosto de 2026.</p>
      <h2>Datos que recopilamos</h2>
      <p>
        Cuando solicitas una reserva o envías un mensaje, recopilamos únicamente
        los datos necesarios para atender tu solicitud: nombre, correo,
        teléfono, fecha, número de personas y el contenido que decidas
        compartir.
      </p>
      <h2>Uso y conservación</h2>
      <p>
        Usamos esta información para gestionar reservas, responder consultas y
        mantener un registro operativo. No vendemos datos personales ni los
        usamos para campañas sin consentimiento.
      </p>
      <h2>Seguridad y derechos</h2>
      <p>
        Aplicamos controles de acceso, cifrado en tránsito y registro de
        acciones administrativas. Puedes solicitar acceso, corrección o
        eliminación escribiendo a privacidad@casabruma.ec.
      </p>
    </article>
  );
}
