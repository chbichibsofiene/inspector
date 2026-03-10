import { useEffect, useState } from "react";
import { getResponsibleDashboard } from "../api/dashboard";

export default function ResponsibleHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await getResponsibleDashboard();
        setData(res.data?.data ?? res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Pedagogical responsible</div>
          <div className="page-subtitle">
            Monitor establishments, staff and academic indicators.
          </div>
        </div>
        <div className="pill">
          <span>Role</span>
          <strong>PEDAGOGICAL_RESPONSIBLE</strong>
        </div>
      </header>

      {error && <div className="auth-error">{error}</div>}

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Dashboard data</div>
            <div className="card-subtitle">
              Raw payload from the pedagogical responsible dashboard endpoint.
            </div>
          </div>
          <span className="tag">JSON payload</span>
        </div>
        <div className="json-preview">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
}
