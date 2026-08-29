import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisa los datos enviados.",
          fields: error.flatten().fieldErrors,
        },
      },
      { status: 422 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message: "Ya existe un registro con esos datos.",
          },
        },
        { status: 409 },
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: { code: "NOT_FOUND", message: "No se encontró el registro." },
        },
        { status: 404 },
      );
    }
  }

  console.error("Unhandled API error", error);
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "No pudimos completar la solicitud.",
      },
    },
    { status: 500 },
  );
}

export async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AppError(
      400,
      "El cuerpo de la solicitud no es JSON válido.",
      "INVALID_JSON",
    );
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return;

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    throw new AppError(
      403,
      "Origen de solicitud no permitido.",
      "INVALID_ORIGIN",
    );
  }
}
