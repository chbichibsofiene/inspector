import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherDashboard } from "../api/dashboard";

export default function TeacherHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await getTeacherDashboard();
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
          <div className="page-title">Teacher dashboard</div>
          <div className="page-subtitle">
            Quick snapshot of your timetable and inspections.
          </div>
        </div>
        <div className="pill">
          <span>Role</span>
          <strong>TEACHER</strong>
        </div>
      </header>

      {error && <div className="auth-error">{error}</div>}

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Account status</div>
              <div className="card-subtitle">
                {data?.message || "Your teacher workspace is ready."}
              </div>
            </div>
            <span className="tag">{data?.status || "ACTIVE"}</span>
          </div>

          <div className="metric-list">
            <div>
              <span>Email</span>
              <strong>{data?.email || "N/A"}</strong>
            </div>
            <div>
              <span>Serial code</span>
              <strong>{data?.serialCode || "N/A"}</strong>
            </div>
            <div>
              <span>Profile</span>
              <strong>{data?.profileCompleted ? "Completed" : "Pending"}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Messenger</div>
              <div className="card-subtitle">
                Chat with your assigned inspector and colleagues.
              </div>
            </div>
            <span className="tag">New</span>
          </div>

          <p className="muted">
            Communicate directly and share files securely with your inspector.
          </p>

          <Link className="primary-link-button" to="/messages">
            Go to Messenger
          </Link>
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
