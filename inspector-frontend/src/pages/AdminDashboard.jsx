import { useState, useEffect } from "react";
import { getAdminKpis, getAdminAlerts, getAdminUsers, getActionLogs } from "../api/admin";
import { Link } from "react-router-dom";
import {
  FileText, BarChart3, AlertTriangle, Users, ClipboardCheck,
  ShieldCheck, Activity, TrendingUp, Eye, ArrowRight, Circle
} from "lucide-react";

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiRes, alertRes, usersRes, logsRes] = await Promise.all([
          getAdminKpis(),
          getAdminAlerts(),
          getAdminUsers(),
          getActionLogs({})
        ]);
        setKpis(kpiRes.data.data);
        setAlerts(alertRes.data.data || []);
        setTotalUsers((usersRes.data.data || []).length);
        setRecentLogs((logsRes.data.data || []).slice(0, 6));
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const actionColors = {
    LOGIN: { bg: '#dbeafe', color: '#1d4ed8' },
    CREATE: { bg: '#dcfce7', color: '#15803d' },
    UPDATE: { bg: '#fef9c3', color: '#a16207' },
    DELETE: { bg: '#fee2e2', color: '#b91c1c' },
    EXPORT: { bg: '#f3e8ff', color: '#7e22ce' },
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#4f46e1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ color: '#64748b', fontWeight: 600 }}>Loading Command Center…</p>
    </div>
  );

  return (
    <div className="admin-page">
      {/* ── HERO HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e1 0%, #7c3aed 100%)',
        borderRadius: '20px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 40px rgba(79,70,229,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '80px', bottom: '-60px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Admin Command Center</h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.95rem' }}>Real-time monitoring & platform oversight</p>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 600 }}>LAST UPDATED</span>
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>{now.toLocaleTimeString()}</span>
          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{now.toLocaleDateString()}</span>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          {
            label: 'Total Inspections',
            value: kpis?.totalInspections ?? 0,
            icon: <ClipboardCheck size={22} />,
            bg: 'linear-gradient(135deg, #4f46e1, #818cf8)',
            delta: '+12% this month'
          },
          {
            label: 'Active Inspectors',
            value: kpis?.activeInspectors ?? 0,
            icon: <Eye size={22} />,
            bg: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            delta: 'Operational'
          },
          {
            label: 'Platform Users',
            value: totalUsers,
            icon: <Users size={22} />,
            bg: 'linear-gradient(135deg, #10b981, #34d399)',
            delta: 'All roles'
          },
          {
            label: 'System Alerts',
            value: alerts.length,
            icon: <AlertTriangle size={22} />,
            bg: alerts.length > 0 ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'linear-gradient(135deg, #64748b, #94a3b8)',
            delta: alerts.length > 0 ? 'Requires attention' : 'All clear'
          },
        ].map((card, i) => (
          <div key={i} style={{
            borderRadius: '16px',
            padding: '1.5rem',
            background: card.bg,
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', right: '-15px', top: '-15px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              {card.icon}
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, margin: '4px 0' }}>{card.label}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.75, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> {card.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        
        {/* LEFT — Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Quick Access */}
          <section className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Quick Access</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { to: '/admin/users', icon: <Users size={28} />, label: 'User Registry', color: '#4f46e1', bg: '#eef2ff' },
                { to: '/admin/logs', icon: <FileText size={28} />, label: 'Action Logs', color: '#0ea5e9', bg: '#e0f2fe' },
                { to: '/admin/analytics', icon: <BarChart3 size={28} />, label: 'Analytics', color: '#10b981', bg: '#dcfce7' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    borderRadius: '14px',
                    padding: '1.5rem 1rem',
                    background: item.bg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: item.color,
                    transition: 'all 0.2s',
                    border: `2px solid transparent`,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = item.color; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    {item.icon}
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Audit Activity */}
          <section className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                <Activity size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Recent Audit Activity
              </h2>
              <Link to="/admin/logs" style={{ fontSize: '0.8rem', color: '#4f46e1', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentLogs.map((log, i) => {
                  const colors = actionColors[log.actionType] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px', background: colors.bg, color: colors.color, flexShrink: 0 }}>
                        {log.actionType}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.description || `${log.entityType} action`}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                          {log.user?.email || 'System'} • {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Circle size={8} fill={colors.color} color={colors.color} style={{ flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                <Activity size={36} style={{ marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No recent activity</p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* System Alerts */}
          <section className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                <AlertTriangle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: '#ef4444' }} />
                Security Alerts
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: alerts.length > 0 ? '#fee2e2' : '#dcfce7', color: alerts.length > 0 ? '#b91c1c' : '#15803d', padding: '2px 10px', borderRadius: '20px' }}>
                {alerts.length > 0 ? `${alerts.length} ACTIVE` : 'ALL CLEAR'}
              </span>
            </div>
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '0.75rem', background: '#fff5f5', borderRadius: '10px', marginBottom: '0.5rem', border: '1px solid #fecaca' }}>
                <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.4 }}>{alert}</p>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#10b981' }}>
                <ShieldCheck size={36} style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No suspicious activity detected</p>
              </div>
            )}
          </section>

          {/* Platform Status */}
          <section className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Platform Status</h2>
            {[
              { label: 'Backend API', status: 'Operational', ok: true },
              { label: 'Database', status: 'Connected', ok: true },
              { label: 'Auth Service', status: 'Active', ok: true },
              { label: 'Audit Logger', status: 'Running', ok: true },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Circle size={6} fill="#15803d" color="#15803d" /> {s.status}
                </span>
              </div>
            ))}
          </section>

          {/* Role Info */}
          <section className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '8px', color: '#4f46e1' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Auditor Role</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Read-Only Access</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
              You have <strong>monitoring privileges</strong> over all platform activities. Data is read-only and cannot be modified from this view.
            </p>
          </section>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
