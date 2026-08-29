"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  reservationSchema,
  type ReservationInput,
} from "@/features/reservations/schema";
import type { z } from "zod";

type ApiError = { error?: { message?: string } };

export function ReservationForm({
  maxPartySize = 12,
  minDate,
}: {
  maxPartySize?: number;
  minDate: string;
}) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  type ReservationFormInput = z.input<typeof reservationSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormInput, unknown, ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2, website: "" },
  });
  const onSubmit = async (input: ReservationInput) => {
    setStatus(null);
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as ApiError;
    if (!response.ok) {
      setStatus({
        type: "error",
        message: result.error?.message ?? "No pudimos registrar la reserva.",
      });
      return;
    }
    setStatus({
      type: "success",
      message:
        "Recibimos tu solicitud. Nuestro equipo confirmará la mesa por teléfono o correo.",
    });
    reset({ guests: 2, website: "" });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <div className="field">
        <label htmlFor="customerName">Nombre completo</label>
        <input
          id="customerName"
          autoComplete="name"
          {...register("customerName")}
        />
        {errors.customerName && (
          <span className="field-error">Ingresa tu nombre.</span>
        )}
      </div>
      <div className="field">
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="field-error">Ingresa un correo válido.</span>
        )}
      </div>
      <div className="field">
        <label htmlFor="phone">Teléfono</label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
        />
        {errors.phone && (
          <span className="field-error">{errors.phone.message}</span>
        )}
      </div>
      <div className="field">
        <label htmlFor="guests">Personas</label>
        <select id="guests" {...register("guests")}>
          {Array.from({ length: maxPartySize }, (_, i) => i + 1).map(
            (value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "persona" : "personas"}
              </option>
            ),
          )}
        </select>
      </div>
      <div className="field">
        <label htmlFor="reservationDate">Fecha</label>
        <input
          id="reservationDate"
          type="date"
          min={minDate}
          {...register("reservationDate")}
        />
        {errors.reservationDate && (
          <span className="field-error">Elige una fecha válida.</span>
        )}
      </div>
      <div className="field">
        <label htmlFor="reservationTime">Hora</label>
        <select
          id="reservationTime"
          {...register("reservationTime")}
          defaultValue=""
        >
          <option value="" disabled>
            Elegir hora
          </option>
          <option>19:00</option>
          <option>19:30</option>
          <option>20:00</option>
          <option>20:30</option>
          <option>21:00</option>
          <option>21:30</option>
        </select>
        {errors.reservationTime && (
          <span className="field-error">Elige una hora.</span>
        )}
      </div>
      <div className="field full">
        <label htmlFor="specialRequests">
          Algo que debamos saber <span>(opcional)</span>
        </label>
        <textarea
          id="specialRequests"
          placeholder="Alergias, celebración o requerimiento de accesibilidad"
          {...register("specialRequests")}
        />
        {errors.specialRequests && (
          <span className="field-error">El mensaje es demasiado largo.</span>
        )}
      </div>
      {status && (
        <div
          className={`form-status ${status.type === "error" ? "error" : ""}`}
          role="status"
        >
          {status.message}
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Solicitar reserva"}
        </button>
        <small>La reserva queda sujeta a confirmación.</small>
      </div>
    </form>
  );
}
