import { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/schools");
        const json = await res.json();
        if (json.ok) setSchools(json.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Schools</h1>

        {loading ? (
          <p>Loading...</p>
        ) : schools.length === 0 ? (
          <p>No schools found. Add one on <a href="/addSchool">Add School</a>.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {schools.map((s) => (
              <article key={s.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                  <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
                <div style={{ padding: 12 }}>
                  <h2 style={{ fontSize: 16, margin: 0 }}>{s.name}</h2>
                  <p style={{ margin: "8px 0 0", color: "#374151", fontSize: 13 }}>{s.address}</p>
                  <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 12 }}>{s.city}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
