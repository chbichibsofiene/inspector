import { useEffect, useState } from "react";
import { getAllUsers, getPendingUsers, verifyUser, assignRole } from "../api/admin";
import { getAdminDashboard } from "../api/dashboard";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [dash, setDash] = useState(null);
  const [err, setErr] = useState("");
  const [roleUpdating, setRoleUpdating] = useState(null);

  async function load() {
    setErr("");
    try {
      const [u, p, d] = await Promise.all([
        getAllUsers(),
        getPendingUsers(),
        getAdminDashboard(),
      ]);

      setUsers(u.data?.data || []);
      setPending(p.data?.data || []);
      setDash(d.data?.data || null);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  }

  async function onVerify(id) {
    await verifyUser(id);
    load();
  }

  async function onChangeRole(userId, role) {
    try {
      setRoleUpdating(userId);
      await assignRole(userId, role);
      load();
    } finally {
      setRoleUpdating(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Admin workspace</div>
          <div className="page-subtitle">
            Manage users and monitor platform activity.
          </div>
        </div>
        <div className="pill">
          <span>Role</span>
          <strong>ADMIN</strong>
        </div>
      </header>

      {err && <div className="auth-error">{err}</div>}

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Platform snapshot</div>
              <div className="card-subtitle">
                High level metrics computed from dashboard API.
              </div>
            </div>
            <span className="tag">Dashboard API</span>
          </div>

          <div className="json-preview">
            <pre>{JSON.stringify(dash, null, 2)}</pre>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending accounts</div>
              <div className="card-subtitle">
                New users waiting for manual verification.
              </div>
            </div>
            <span className="badge-pill">
              {pending.length} pending
            </span>
          </div>

          {pending.length === 0 ? (
            <p className="muted">No accounts are pending validation.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Requested role</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge">{u.role}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => onVerify(u.id)}>Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <div>
            <div className="card-title">All users</div>
            <div className="card-subtitle">
              Full list of active users and their roles.
            </div>
          </div>
          <span className="badge">{users.length} users</span>
        </div>

        {users.length === 0 ? (
          <p className="muted">No users found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: "right" }}>Change role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td style={{ textAlign: "right" }}>
                    <select
                      value={u.role}
                      onChange={(e) => onChangeRole(u.id, e.target.value)}
                      disabled={roleUpdating === u.id}
                      style={{
                        borderRadius: "999px",
                        padding: "0.25rem 0.65rem",
                        fontSize: "0.8rem",
                        marginRight: "0.5rem",
                      }}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="INSPECTOR">INSPECTOR</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="PEDAGOGICAL_RESPONSIBLE">
                        PEDAGOGICAL_RESPONSIBLE
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}