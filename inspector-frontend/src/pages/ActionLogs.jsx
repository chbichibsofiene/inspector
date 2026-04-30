import { useState, useEffect } from "react";
import { getActionLogs, getAdminUsers } from "../api/admin";
import { Search, Download, Filter, RefreshCw, FileText, Circle, ChevronDown, X } from "lucide-react";

const ACTION_META = {
  LOGIN:  { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  CREATE: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  UPDATE: { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
  DELETE: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
  EXPORT: { bg: '#f3e8ff', color: '#7e22ce', dot: '#a855f7' },
};

export default function ActionLogs() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ userId: "", actionType: "", startDate: "", endDate: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadData = async (f = filters) => {
    setLoading(true);
    try {
      const [logsRes, usersRes] = await Promise.all([getActionLogs(f), getAdminUsers()]);
      setLogs(logsRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const applyFilters = () => { loadData(filters); setFiltersOpen(false); };
  const clearFilters = () => { const f = { userId: "", actionType: "", startDate: "", endDate: "" }; setFilters(f); loadData(f); };

  const exportToCSV = () => {
    const headers = ["User", "Action", "Entity", "Date", "IP", "Description"];
    const rows = filtered.map(log => [
      log.user?.email || "System", log.actionType, log.entityType,
      new Date(log.createdAt).toLocaleString(), log.ipAddress, log.description
    ]);
    const csv = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `audit_logs_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = logs.filter(log => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (log.user?.email || "").toLowerCase().includes(q) ||
      (log.description || "").toLowerCase().includes(q) ||
      (log.entityType || "").toLowerCase().includes(q) ||
      (log.actionType || "").toLowerCase().includes(q);
  });

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="admin-page">
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '20px', padding: '2rem 2.5rem', marginBottom: '2rem',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 10px 40px rgba(30,41,59,0.4)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}>
            <FileText size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Audit Log Center</h1>
            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Immutable record of all platform actions and system events</p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px' }}>
          <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => loadData()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Badges */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>
          {filtered.length} / {logs.length} Entries
        </div>
        {Object.entries(ACTION_META).map(([type, meta]) => {
          const count = logs.filter(l => l.actionType === type).length;
          if (count === 0) return null;
          return (
            <div key={type} style={{ background: meta.bg, borderRadius: '12px', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: meta.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Circle size={6} fill={meta.dot} color={meta.dot} />
              {type}: {count}
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by user, action, entity, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', background: '#f8fafc' }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.25rem', border: `2px solid ${activeFilterCount > 0 ? '#4f46e1' : '#e2e8f0'}`, borderRadius: '10px', background: activeFilterCount > 0 ? '#eef2ff' : 'white', color: activeFilterCount > 0 ? '#4f46e1' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
          <Filter size={15} />
          Filters
          {activeFilterCount > 0 && <span style={{ background: '#4f46e1', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>{activeFilterCount}</span>}
          <ChevronDown size={14} style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderTop: '3px solid #4f46e1', animation: 'slideDown 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>User</label>
              <select name="userId" value={filters.userId} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}>
                <option value="">All Users</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Action Type</label>
              <select name="actionType" value={filters.actionType} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}>
                <option value="">All Actions</option>
                {Object.keys(ACTION_META).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>From Date</label>
              <input type="datetime-local" name="startDate" value={filters.startDate} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>To Date</label>
              <input type="datetime-local" name="endDate" value={filters.endDate} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={clearFilters} style={{ padding: '0.6rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Clear All</button>
            <button onClick={applyFilters} style={{ padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', background: '#4f46e1', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <section className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600 }}>Loading audit logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ fontWeight: 700, color: '#64748b', fontSize: '1rem' }}>No logs found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['User', 'Action', 'Entity', 'Description', 'Date & Time', 'IP Address'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const meta = ACTION_META[log.actionType] || { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
                  return (
                    <tr key={log.id || i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                            {(log.user?.email || 'S').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.8rem' }}>{log.user?.email || 'System'}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px', background: meta.bg, color: meta.color, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
                          <Circle size={5} fill={meta.dot} color={meta.dot} />
                          {log.actionType}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#475569', fontWeight: 500 }}>{log.entityType || '—'}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#64748b', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.description || '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#64748b', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ipAddress || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
