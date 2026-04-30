import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserHistory, getAdminUsers } from "../api/admin";
import { Search } from "lucide-react";

export default function UserHistory() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSuggestedUsers();
    
    // Check if there is an email or id in search params
    const emailParam = searchParams.get("email");
    const idParam = searchParams.get("id");
    if (emailParam || idParam) {
      const identifier = emailParam || idParam;
      setUserId(identifier);
      performSearch(identifier);
    }
  }, [searchParams]);

  const loadSuggestedUsers = async () => {
    try {
      const res = await getAdminUsers();
      if (res.data && res.data.data) {
        setSuggestedUsers(res.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading suggested users", err);
    }
  };

  const performSearch = async (idToSearch) => {
    const id = idToSearch || userId;
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await getUserHistory(id);
      setHistory(response.data.data || []);
    } catch (err) {
      setError("User not found or error loading history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">User Activity History</h1>
          <p className="page-subtitle">Track full timeline of actions for a specific user.</p>
        </div>
      </header>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); performSearch(); }} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Enter User ID, Email, or Name..." 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} />
            {loading ? "Searching..." : "Track History"}
          </button>
        </form>

        {suggestedUsers.length > 0 && history.length === 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem' }}>Recently Registered Users:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {suggestedUsers.map(u => (
                <button 
                  key={u.id}
                  onClick={() => { setUserId(u.email); performSearch(u.email); }}
                  style={{ 
                    padding: '8px 16px', 
                    background: '#f1f5f9', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {u.name || u.email}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="timeline-container">
        {history.length > 0 ? (
          <div className="vertical-timeline">
            {history.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content card">
                  <div className="timeline-header">
                    <span className={`badge badge-${item.actionType.toLowerCase()}`}>
                      {item.actionType}
                    </span>
                    <span className="timeline-date">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="timeline-body">
                    <strong>{item.entityType}</strong>: {item.description}
                  </div>
                  <div className="timeline-footer monospace muted">
                    IP: {item.ipAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="empty-state card">No history found. Enter a valid user ID to start tracking.</div>
        )}
      </section>
    </div>
  );
}
