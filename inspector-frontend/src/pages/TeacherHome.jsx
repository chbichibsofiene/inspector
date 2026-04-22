import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherDashboard } from "../api/dashboard";
import TimetableSection from "../components/TimetableSection";
import InspectorActivitiesTimetable from "../components/InspectorActivitiesTimetable";

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

      <TimetableSection />
      
      <InspectorActivitiesTimetable />

      <div className="dashboard-grid">
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

        <section className="card highlight-card">
          <div className="card-header">
            <div>
              <div className="card-title">Pedagogical Quizzes</div>
              <div className="card-subtitle">
                Test your knowledge and get AI feedback.
              </div>
            </div>
            <span className="tag">Action Required</span>
          </div>

          <p className="muted">
            Complete quizzes assigned by your inspector and view your automated training suggestions.
          </p>

          <Link className="primary-link-button" to="/teacher/quizzes">
            View My Quizzes
          </Link>
        </section>
      </div>
    </div>
  );
}
