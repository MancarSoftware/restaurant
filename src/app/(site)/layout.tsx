import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./site-v2.css";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
