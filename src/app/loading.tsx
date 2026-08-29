export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#090908",
        color: "#c69a4b",
      }}
      role="status"
    >
      <span className="eyebrow">Preparando la mesa…</span>
    </div>
  );
}
