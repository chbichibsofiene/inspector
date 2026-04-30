import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileApi from "../api/profile";
import { Search, User, School, MapPin, ChevronRight, Filter, BookOpen } from "lucide-react";
import TeacherInsightsModal from "../components/TeacherInsightsModal";

export default function InspectorTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      setLoading(true);
      const res = await profileApi.getMyTeachers();
      setTeachers(res.data?.data || []);
    } catch (err) {
      setError("Failed to load your assigned teachers.");
    } finally {
      setLoading(false);
    }
  }

  const filteredTeachers = teachers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serialCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.etablissement?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inspector-teachers-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Assigned Teachers</h1>
          <p className="page-subtitle">View and manage pedagogical information for teachers in your jurisdiction.</p>
        </div>
      </header>

      {error && <div className="auth-error">{error}</div>}

      <div className="teachers-toolbar card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, serial code, or school..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-stats">
          <Filter size={16} />
          <span>Showing {filteredTeachers.length} teachers</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your teaching staff...</p>
        </div>
      ) : (
        <div className="teachers-grid">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="teacher-insight-card card" onClick={() => setSelectedTeacher(teacher)}>
              <div className="card-top">
                <div className="profile-avatar">
                  {teacher.profileImageUrl ? (
                    <img src={teacher.profileImageUrl} alt={`${teacher.firstName} ${teacher.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                      {(teacher.firstName?.[0] || '?').toUpperCase()}{(teacher.lastName?.[0] || '').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="teacher-main-info">
                  <h3>{teacher.firstName} {teacher.lastName}</h3>
                  <span className="serial-tag">{teacher.serialCode || "No Serial"}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-item">
                  <School size={16} />
                  <span>{teacher.etablissement?.name || "No School assigned"}</span>
                </div>
                <div className="info-item">
                  <MapPin size={16} />
                  <span>{teacher.etablissement?.schoolLevel || "General"}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="insight-button">
                  <BookOpen size={14} /> View Insights
                </div>
                <ChevronRight size={18} className="arrow-icon" />
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && !loading && (
            <div className="empty-teachers">
              <User size={48} />
              <h3>No teachers found</h3>
              <p>
                {searchTerm 
                  ? "Try adjusting your search criteria." 
                  : "We couldn't find any teachers matching your profile settings. Please make sure your 'My Profile' setup includes your assigned Delegations and Dependencies."}
              </p>
              {!searchTerm && (
                <Link to="/profile/setup" className="primary-link-button" style={{ marginTop: '1.5rem' }}>
                  Update My Profile
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {selectedTeacher && (
        <TeacherInsightsModal 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .teachers-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          margin-bottom: 2rem;
          background: white;
          border-radius: 12px;
          gap: 1rem;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .filter-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .teacher-insight-card {
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .teacher-insight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .card-top {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: linear-gradient(to right, #f8fafc, white);
          border-bottom: 1px solid #f1f5f9;
        }

        .profile-avatar {
          width: 54px;
          height: 54px;
          background: linear-gradient(135deg, var(--primary), #818cf8);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .teacher-main-info h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1e293b;
        }

        .serial-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #3b82f6;
          text-transform: uppercase;
        }

        .card-body {
          padding: 1.25rem 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.75rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .insight-button {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #316eda;
          text-transform: uppercase;
        }

        .arrow-icon {
          color: #cbd5e1;
        }

        .empty-teachers {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          color: #94a3b8;
          text-align: center;
        }

        .empty-teachers h3 {
          margin: 1.5rem 0 0.5rem;
          color: #64748b;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
