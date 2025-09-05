export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif", display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 32 }}>School Directory</h1>
        <p style={{ color: "#6b7280" }}>Add schools and browse the list.</p>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <link href="/addSchool" style={{ padding: "8px 14px", background: "#000", color: "#fff", borderRadius: 8 }}>Add School</link>
          <link href="/showSchools" style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb" }}>Show Schools</link>
        </div>
      </div>
    </main>
  );
}
