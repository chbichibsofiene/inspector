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

  useEffect(() => { load(); }, []);

  const roleBadgeColor = (role) =>
    ({ ADMIN: "#7c3aed", INSPECTOR: "#2563eb", TEACHER: "#059669", PEDAGOGICAL_RESPONSIBLE: "#d97706" }[role] || "#6b7280");

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Admin workspace</div>
          <div className="page-subtitle">Manage users and monitor platform activity.</div>
        </div>
        <div className="pill">
          <span>Role</span>
          <strong>ADMIN</strong>
        </div>
      </header>

      {err && <div className="auth-error">{err}</div>}

      <div className="dashboard-grid">

        {/* ── Platform Snapshot ── */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Platform snapshot</div>
              <div className="card-subtitle">High level metrics.</div>
            </div>
            <span className="tag">Dashboard API</span>
          </div>

          {/* Stat numbers */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Total users",  value: dash?.totalUsers,            color: "#111827" },
              { label: "Pending",      value: dash?.pendingVerifications,  color: "#d97706" },
              { label: "Verified",     value: dash?.verifiedUsers,         color: "#059669" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                flex: "1 1 130px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "1rem 1.2rem",
                display: "flex", flexDirection: "column", gap: "0.25rem",
              }}>
                <span style={{ fontSize: "0.72rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </span>
                <span style={{ fontSize: "1.9rem", fontWeight: 700, color, lineHeight: 1 }}>
                  {value ?? "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Users by role */}
          {dash?.usersByRole && Object.keys(dash.usersByRole).length > 0 && (
            <>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", marginBottom: "0.45rem" }}>
                Users by role
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1.1rem" }}>
                {Object.entries(dash.usersByRole).map(([role, count]) => (
                  <span key={role} style={{
                    background: roleBadgeColor(role) + "18",
                    color: roleBadgeColor(role),
                    border: `1px solid ${roleBadgeColor(role)}35`,
                    borderRadius: "999px",
                    padding: "0.2rem 0.75rem",
                    fontSize: "0.77rem",
                    fontWeight: 600,
                  }}>
                    {role} · {count}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Recently verified */}
          {dash?.recentlyVerified?.length > 0 && (
            <>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", marginBottom: "0.45rem" }}>
                Recently verified
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Serial code</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.recentlyVerified.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge" style={{
                          background: roleBadgeColor(u.role) + "18",
                          color: roleBadgeColor(u.role),
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.83rem" }}>{u.serialCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {!dash && <p className="muted">Loading dashboard data…</p>}
        </section>

        {/* ── Pending accounts ── */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending accounts</div>
              <div className="card-subtitle">New users waiting for manual verification.</div>
            </div>
            <span className="badge-pill">{pending.length} pending</span>
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
                    <td><span className="badge">{u.role}</span></td>
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

      {/* ── All users ── */}
      <section className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <div>
            <div className="card-title">All users</div>
            <div className="card-subtitle">Full list of active users and their roles.</div>
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
                  <td>
                    <span className="badge" style={{
                      background: roleBadgeColor(u.role) + "18",
                      color: roleBadgeColor(u.role),
                    }}>
                      {u.role}
                    </span>
                  </td>
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
                      <option value="PEDAGOGICAL_RESPONSIBLE">PEDAGOGICAL_RESPONSIBLE</option>
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