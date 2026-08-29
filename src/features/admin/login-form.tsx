"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const result = (await response.json()) as { error?: { message?: string } };
    setLoading(false);
    if (!response.ok) {
      setError(result.error?.message ?? "No pudimos iniciar sesión.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };
  return (
    <form className="admin-login-form" onSubmit={submit}>
      <p className="eyebrow">Administración</p>
      <h1>
        Bienvenido
        <br />a la casa.
      </h1>
      <p>Ingresa con una cuenta autorizada.</p>
      <div className="field">
        <label htmlFor="login-email">Correo</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </div>
      {error && (
        <div className="form-status error" role="alert">
          {error}
        </div>
      )}
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Ingresando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
