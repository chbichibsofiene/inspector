import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUsers } from "../api/admin";
import {
  Search, Users, Mail, Shield, Clock, ChevronRight,
  Activity, Filter, X, UserCheck, UserX, RefreshCw, Circle, IdCard
} from "lucide-react";

const ROLE_META = {
  ADMIN:      { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', grad: 'linear-gradient(135deg,#ef4444,#f87171)' },
  INSPECTOR:  { bg: '#eef2ff', color: '#4338ca', dot: '#4f46e1', grad: 'linear-gradient(135deg,#4f46e1,#818cf8)' },
  TEACHER:    { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e', grad: 'linear-gradient(135deg,#10b981,#34d399)' },
  RESPONSIBLE:{ bg: '#fff7ed', color: '#c2410c', dot: '#f97316', grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
};

const getRoleMeta = (role) => ROLE_META[role] || { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', grad: 'linear-gradient(135deg,#64748b,#94a3b8)' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter(u => {
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || u.email.toLowerCase().includes(q) ||
      (u.serialCode || '').toLowerCase().includes(q) || (u.cin || '').toLowerCase().includes(q);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleGroups = ['ALL', ...new Set(users.map(u => u.role))];
  const counts = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    inspectors: users.filter(u => u.role === 'INSPECTOR').length,
  };

  return (
    <div className="admin-page">
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e1 0%, #7c3aed 100%)',
        borderRadius: '20px', padding: '2rem 2.5rem', marginBottom: '2rem',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 10px 40px rgba(79,70,229,0.35)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '100px', bottom: '-60px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}>
            <Users size={30} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>User Registry</h1>
            <p style={{ margin: 0, opacity: 0.75, fontSize: '0.9rem' }}>Browse, search and audit all platform users</p>
          </div>
        </div>

        {/* Mini KPIs in header */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px' }}>
          {[
            { label: 'Total', value: counts.total },
            { label: 'Inspectors', value: counts.inspectors },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '70px' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, email, serial code or CIN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 2rem 0.65rem 2.25rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', background: '#f8fafc', transition: 'border-color 0.2s', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#4f46e1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Role Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {roleGroups.map(role => {
              const meta = role === 'ALL' ? null : getRoleMeta(role);
              const isActive = roleFilter === role;
              return (
                <button key={role} onClick={() => setRoleFilter(role)} style={{
                  padding: '6px 14px', borderRadius: '20px', border: `2px solid ${isActive ? (meta?.dot || '#4f46e1') : '#e2e8f0'}`,
                  background: isActive ? (meta?.bg || '#eef2ff') : 'white',
                  color: isActive ? (meta?.color || '#4f46e1') : '#64748b',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  {role === 'ALL' ? `All (${users.length})` : `${role} (${users.filter(u => u.role === role).length})`}
                </button>
              );
            })}
          </div>

          <button onClick={loadUsers} style={{ padding: '0.65rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e1'; e.currentTarget.style.color = '#4f46e1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
        </div>
      </div>

      {/* User Cards Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#4f46e1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading user registry...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#94a3b8' }}>
          <Users size={56} style={{ margin: '0 auto 1.5rem', display: 'block', opacity: 0.4 }} />
          <h3 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '1.1rem' }}>No users found</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(user => {
            const meta = getRoleMeta(user.role);
            const initials = user.firstName && user.lastName
              ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
              : user.email.substring(0, 2).toUpperCase();
            const fullName = user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : null;

            return (
              <div key={user.id} style={{
                background: 'white',
                borderRadius: '18px',
                border: '1.5px solid #f1f5f9',
                overflow: 'hidden',
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(79,70,229,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                {/* Card Header */}
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(135deg, #fafbff 0%, #f8fafc 100%)', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>

                  {/* Avatar */}
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '18px', flexShrink: 0,
                    background: user.profileImageUrl ? 'transparent' : meta.grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '1.3rem', overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                  }}>
                    {user.profileImageUrl
                      ? <img src={user.profileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : initials}
                  </div>

                  {/* Name & Role */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fullName || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unnamed User</span>}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 800, color: meta.color, background: meta.bg, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                        <Shield size={10} /> {user.role}
                      </span>
                      {user.serialCode && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e1', background: '#eef2ff', padding: '3px 10px', borderRadius: '20px', fontFamily: 'monospace' }}>
                          {user.serialCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.85rem' }}>
                    <Mail size={14} style={{ flexShrink: 0, color: '#94a3b8' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                  </div>
                  {user.cin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.85rem' }}>
                      <IdCard size={14} style={{ flexShrink: 0, color: '#94a3b8' }} />
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>CIN: {user.cin}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <Clock size={13} style={{ flexShrink: 0 }} />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div style={{ padding: '0.875rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(`/admin/history?email=${user.email}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', color: '#4f46e1', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Activity size={14} /> Audit History
                  </button>
                  <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
