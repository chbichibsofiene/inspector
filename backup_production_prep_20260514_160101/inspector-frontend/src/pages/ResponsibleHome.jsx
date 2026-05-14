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

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Supervision overview</div>
              <div className="card-subtitle">
                {data?.message || "Your responsible workspace is ready."}
              </div>
            </div>
            <span className="tag">{data?.status || "ACTIVE"}</span>
          </div>

          <div className="metric-list">
            <div>
              <span>Teachers</span>
              <strong>{data?.totalTeachers ?? 0}</strong>
            </div>
            <div>
              <span>Inspectors</span>
              <strong>{data?.totalInspectors ?? 0}</strong>
            </div>
            <div>
              <span>Serial code</span>
              <strong>{data?.serialCode || "N/A"}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Active staff</div>
              <div className="card-subtitle">
                Verified teachers and inspectors in the platform.
              </div>
            </div>
            <span className="badge">People</span>
          </div>

          <div className="people-list">
            {[...(data?.inspectors || []), ...(data?.teachers || [])].length === 0 ? (
              <p className="muted">No active staff found.</p>
            ) : (
              [...(data?.inspectors || []), ...(data?.teachers || [])].map((user) => (
                <div className="people-row" key={user.id}>
                  <span>{user.email}</span>
                  <strong>{user.role}</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="card activity-list-card">
        <div className="card-header">
          <div>
            <div className="card-title">Technical payload</div>
            <div className="card-subtitle">
              Useful during the demo to show the backend response.
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
