import { useEffect, useState } from "react";
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

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Dashboard data</div>
            <div className="card-subtitle">
              Content coming directly from the teacher dashboard API.
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
