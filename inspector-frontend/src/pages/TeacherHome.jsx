import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherDashboard } from "../api/dashboard";
import { getUser } from "../auth/session";
import TimetableSection from "../components/TimetableSection";
import InspectorActivitiesTimetable from "../components/InspectorActivitiesTimetable";
import { 
  MessageSquare, Brain, BookOpen, ChevronRight, 
  User, School, GraduationCap, Calendar, Clock, Star, FileText
} from "lucide-react";

export default function TeacherHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const res = await getTeacherDashboard();
        setData(res.data?.data ?? res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading && !data) {
    return <div className="loading-state"><div className="spinner"></div></div>;
  }

  const profileImg = data?.profileImageUrl || getUser()?.profileImageUrl;

  return (
    <div className="teacher-dashboard-premium">
      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="welcome-back">
              Welcome back, {data?.firstName ? `Mr. ${data.lastName}` : "Teacher"}!
            </h1>
            <p className="hero-subtitle">
              Ready to continue your pedagogical development today?
            </p>
            <div className="hero-tags">
              {data?.subject && (
                <span className="hero-tag">
                  <GraduationCap size={14} /> {data.subject} Teacher
                </span>
              )}
              {data?.schoolName && (
                <span className="hero-tag">
                  <School size={14} /> {data.schoolName}
                </span>
              )}
            </div>
          </div>
          
          <div className="hero-avatar-prominent">
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="prominent-profile-img" />
            ) : (
              <div className="prominent-placeholder">
                <User size={48} color="#94a3b8" />
              </div>
            )}
          </div>
        </div>
      </section>

      {error && <div className="auth-error" style={{ margin: "1rem 0" }}>{error}</div>}

      <div className="main-dashboard-content">
        <div className="dashboard-left-col">
          {/* Timetable and Activities */}
          <div className="timetable-wrapper" style={{ marginBottom: "2rem" }}>
            <div className="section-header">
              <Calendar size={18} />
              <h3>Weekly Timetable</h3>
            </div>
            <TimetableSection />
          </div>

          <div className="activities-wrapper">
            <div className="section-header">
              <Clock size={18} />
              <h3>Inspector Consultations</h3>
            </div>
            <InspectorActivitiesTimetable />
          </div>
        </div>

        <div className="dashboard-right-col">
          <div className="section-header">
            <Star size={18} />
            <h3>Quick Access</h3>
          </div>

          <div className="quick-access-grid">
            <Link to="/teacher/courses" className="access-card premium">
              <div className="access-icon"><BookOpen size={24} /></div>
              <div className="access-info">
                <h4>My Courses</h4>
                <p>Structured learning modules</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/teacher/quizzes" className="access-card quiz">
              <div className="access-icon"><Brain size={24} /></div>
              <div className="access-info">
                <h4>Quizzes</h4>
                <p>Knowledge assessments</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/teacher/calendar" className="access-card schedule">
              <div className="access-icon"><Calendar size={24} /></div>
              <div className="access-info">
                <h4>Schedule</h4>
                <p>Weekly timetable</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/reports" className="access-card reports">
              <div className="access-icon"><FileText size={24} /></div>
              <div className="access-info">
                <h4>Reports</h4>
                <p>Performance & feedback</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/messages" className="access-card messenger">
              <div className="access-icon"><MessageSquare size={24} /></div>
              <div className="access-info">
                <h4>Live Chat</h4>
                <p>Chat with your inspector</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .teacher-dashboard-premium { animation: fadeIn 0.5s ease; }
        
        .dashboard-hero {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 24px;
          padding: 2.5rem;
          color: white;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.4);
        }
        
        .dashboard-hero::after {
          content: ""; position: absolute; top: -50px; right: -50px;
          width: 200px; height: 200px; background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }

        .welcome-back { font-size: 2.25rem; font-weight: 900; margin: 0 0 0.5rem; }
        .hero-subtitle { font-size: 1.1rem; opacity: 0.9; margin-bottom: 1.5rem; }
        .hero-tags { display: flex; gap: 12px; }
        .hero-tag { 
          background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
          padding: 6px 14px; border-radius: 20px; font-size: 0.85rem;
          display: flex; align-items: center; gap: 8px; font-weight: 600;
        }

        .hero-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }

        .main-dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem; color: #475569; }
        .section-header h3 { font-size: 1.1rem; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px; }

        .quick-access-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .access-card { 
          background: white; border: 1.5px solid #f1f5f9; padding: 1.25rem; border-radius: 18px;
          display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .access-card:hover { transform: translateX(8px); border-color: #c7d2fe; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05); }
        .access-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        
        .access-card.premium .access-icon { background: #eef2ff; color: #4f46e5; }
        .access-card.quiz .access-icon { background: #fdf2f8; color: #db2777; }
        .access-card.schedule .access-icon { background: #fff7ed; color: #f97316; }
        .access-card.reports .access-icon { background: #eff6ff; color: #3b82f6; }
        .access-card.messenger .access-icon { background: #f0fdf4; color: #16a34a; }

        .access-info h4 { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
        .access-info p { margin: 2px 0 0; font-size: 0.8rem; color: #64748b; }
        .arrow { margin-left: auto; color: #cbd5e1; }

        .info-card-modern { background: #1e293b; color: white; padding: 1.5rem; border-radius: 20px; }
        .info-card-modern h4 { margin: 0 0 0.75rem; font-size: 1rem; }
        .info-card-modern p { font-size: 0.85rem; opacity: 0.8; line-height: 1.5; margin-bottom: 1.25rem; }
        .progress-mini { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 8px; }
        .progress-bar-inner { height: 100%; background: #4f46e5; border-radius: 3px; }
        .progress-label { font-size: 0.75rem; color: #94a3b8; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 1024px) {
          .main-dashboard-content { grid-template-columns: 1fr; }
          .hero-content { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }
      `}} />
    </div>
  );
}
