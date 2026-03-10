import { useEffect, useState } from "react";
import { getInspectorDashboard } from "../api/dashboard";

export default function InspectorHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getInspectorDashboard().then((r) => setData(r.data?.data ?? r.data));
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

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Current workload</div>
            <div className="card-subtitle">
              Raw data returned by the inspector dashboard endpoint.
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