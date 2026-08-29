"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/features/contact/schema";

export function ContactForm() {
  const [status, setStatus] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: "" },
  });
  const submit = async (input: ContactInput) => {
    setStatus(null);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as { error?: { message?: string } };
    if (!response.ok) {
      setStatus({
        error: true,
        message: result.error?.message ?? "No pudimos enviar tu mensaje.",
      });
      return;
    }
    setStatus({
      error: false,
      message:
        "Mensaje recibido. Te responderemos dentro de nuestro horario de atención.",
    });
    reset({ website: "" });
  };
  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Sitio web</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-name">Nombre</label>
        <input id="contact-name" autoComplete="name" {...register("name")} />
        {errors.name && <span className="field-error">Ingresa tu nombre.</span>}
      </div>
      <div className="field">
        <label htmlFor="contact-email">Correo</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="field-error">Ingresa un correo válido.</span>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-phone">
          Teléfono <span>(opcional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Asunto</label>
        <input id="contact-subject" {...register("subject")} />
        {errors.subject && (
          <span className="field-error">Cuéntanos brevemente el asunto.</span>
        )}
      </div>
      <div className="field full">
        <label htmlFor="contact-message">Mensaje</label>
        <textarea id="contact-message" {...register("message")} />
        {errors.message && (
          <span className="field-error">
            El mensaje debe tener al menos 10 caracteres.
          </span>
        )}
      </div>
      {status && (
        <div
          className={`form-status ${status.error ? "error" : ""}`}
          role="status"
        >
          {status.message}
        </div>
      )}
      <div className="form-actions">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
