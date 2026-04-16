import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInspectorDashboard } from "../api/dashboard";
import { getActivities, getActivityTeachers } from "../api/activities";

export default function InspectorHome() {
  const [data, setData] = useState(null);
  const [activityCount, setActivityCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const [dashboardRes, activitiesRes, teachersRes] = await Promise.all([
          getInspectorDashboard(),
          getActivities(),
          getActivityTeachers(),
        ]);

        setData(dashboardRes.data?.data ?? dashboardRes.data);
        setActivityCount((activitiesRes.data?.data || []).length);
        setTeacherCount((teachersRes.data?.data || []).length);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load inspector workspace.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Inspector dashboard</div>
          <div className="page-subtitle">
            Overview of inspections, visits and assigned institutions.
          </div>
        </div>
        <div className="pill">
          <span>Role</span>
          <strong>INSPECTOR</strong>
        </div>
      </header>

      {error && <div className="auth-error">{error}</div>}

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Workspace status</div>
              <div className="card-subtitle">
                {loading ? "Loading your inspector data..." : data?.message || "Ready to plan activities."}
              </div>
            </div>
            <span className="tag">{data?.status || "ACTIVE"}</span>
          </div>

          <div className="metric-list">
            <div>
              <span>Activities</span>
              <strong>{activityCount}</strong>
            </div>
            <div>
              <span>Available teachers</span>
              <strong>{teacherCount}</strong>
            </div>
            <div>
              <span>Serial code</span>
              <strong>{data?.serialCode || "N/A"}</strong>
            </div>
          </div>
        </section>

        <section className="card calendar-entry-card">
          <div className="card-header">
            <div>
              <div className="card-title">Activity calendar</div>
              <div className="card-subtitle">
                Open the calendar page to plan inspections and training sessions.
              </div>
            </div>
            <span className="tag">Calendar</span>
          </div>

          <p className="muted">
            Use the calendar page for month, week and day planning.
          </p>

          <Link className="primary-link-button" to="/inspector/calendar">
            Open calendar
          </Link>
        </section>

        <section className="card calendar-entry-card">
          <div className="card-header">
            <div>
              <div className="card-title">Power BI analytics</div>
              <div className="card-subtitle">
                Open activity and report indicators for Power BI.
              </div>
            </div>
            <span className="tag">Analytics</span>
          </div>

          <p className="muted">
            Use this page to embed a Power BI report or connect Power BI to the analytics API.
          </p>

          <Link className="primary-link-button" to="/inspector/powerbi">
            Open Power BI
          </Link>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Messenger</div>
              <div className="card-subtitle">
                Secure professional chat with teachers in your area.
              </div>
            </div>
            <span className="tag">New</span>
          </div>

          <p className="muted">
            Communicate directly and share files securely with teachers.
          </p>

          <Link className="primary-link-button" to="/messages">
            Go to Messenger
          </Link>
        </section>
      </div>
    </div>
  );
}
