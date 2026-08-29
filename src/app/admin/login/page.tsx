import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/admin/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};
export default async function AdminLoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  return (
    <main className="admin-login">
      <div className="admin-login-art">
        <Image
          src="/images/restaurant-interior.webp"
          alt=""
          fill
          priority
          sizes="50vw"
        />
      </div>
      <div className="admin-login-panel">
        <LoginForm />
      </div>
    </main>
  );
}
