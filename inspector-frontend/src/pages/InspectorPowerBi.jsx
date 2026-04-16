import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPowerBiDataset } from "../api/analytics";

const reportUrl = import.meta.env.VITE_POWER_BI_REPORT_URL;

export default function InspectorPowerBi() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const response = await getPowerBiDataset();
        setAnalytics(response.data?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load Power BI dataset.");
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Power BI dashboard</div>
          <div className="page-subtitle">
            Analyse activities, reports and teacher performance.
          </div>
        </div>
        <Link className="secondary-link-button" to="/inspector">
          Back to dashboard
        </Link>
      </header>

      {error && <div className="auth-error">{error}</div>}

      {reportUrl ? (
        <section className="powerbi-frame-shell">
          <iframe title="Power BI dashboard" src={reportUrl} allowFullScreen />
        </section>
      ) : (
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Power BI report URL needed</div>
              <div className="card-subtitle">
                Add your published Power BI report URL to embed it here.
              </div>
            </div>
            <span className="tag">Power BI</span>
          </div>

          <div className="setup-list">
            <div>
              <strong>Frontend env variable</strong>
              <span>VITE_POWER_BI_REPORT_URL</span>
            </div>
            <div>
              <strong>Dataset API</strong>
              <span>http://localhost:8081/api/inspector/analytics/powerbi</span>
            </div>
            <div>
              <strong>Power BI data source</strong>
              <span>Use the web API endpoint above with an inspector token.</span>
            </div>
          </div>
        </section>
      )}

      <div className="dashboard-grid activity-workspace">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">KPI summary</div>
              <div className="card-subtitle">
                Same data exposed to Power BI.
              </div>
            </div>
            <span className="badge">Analytics</span>
          </div>

          <div className="metric-list">
            <div>
              <span>Activities</span>
              <strong>{analytics?.totalActivities ?? 0}</strong>
            </div>
            <div>
              <span>Reports</span>
              <strong>{analytics?.totalReports ?? 0}</strong>
            </div>
            <div>
              <span>Average score</span>
              <strong>{analytics?.averageScore ?? 0}/20</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Teacher performance</div>
              <div className="card-subtitle">
                Average scores from report evaluations.
              </div>
            </div>
            <span className="badge">{analytics?.teacherPerformance?.length || 0} teachers</span>
          </div>

          <div className="people-list">
            {(analytics?.teacherPerformance || []).length === 0 ? (
              <p className="muted">No scored reports yet.</p>
            ) : (
              analytics.teacherPerformance.map((teacher) => (
                <div className="people-row" key={teacher.teacherId}>
                  <span>{teacher.teacherName}</span>
                  <strong>{teacher.averageScore}/20</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
