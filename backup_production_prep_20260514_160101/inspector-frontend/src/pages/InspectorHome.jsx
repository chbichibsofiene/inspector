import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock, MapPin, Calendar, ChevronRight,
  User, BarChart2, Users, MessageSquare, Brain, BookOpen, Star, FileText, Info, X
} from "lucide-react";
import { getInspectorDashboard } from "../api/dashboard";
import { getActivities, getActivityTeachers } from "../api/activities";
import { getUser } from "../auth/session";
import { useTranslation } from "react-i18next";

export default function InspectorHome() {
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityCount, setActivityCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { t, i18n } = useTranslation();

  const currentWeekDays = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const groupedActivities = useMemo(() => {
    const groups = {};
    currentWeekDays.forEach(dayDate => {
      const dayStr = dayDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
      groups[dayStr] = activities.filter(a => a.startDateTime.startsWith(dayStr));
    });
    return groups;
  }, [activities, currentWeekDays]);

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const [dashboardRes, activitiesRes, teachersRes] = await Promise.all([
          getInspectorDashboard(),
          getActivities(),
          getActivityTeachers(),
        ]);

        setData(dashboardRes.data?.data ?? dashboardRes.data);
        const activitiesData = activitiesRes.data?.data || [];
        setActivities(activitiesData);
        setActivityCount(activitiesData.length);
        setTeacherCount((teachersRes.data?.data || []).length);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load inspector workspace.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const TYPE_LABELS = {
    INVITATION_REUNION: "Invitation réunion",
    VISITE_PEDAGOGIQUE: "Visite pédagogique",
    INSPECTION: "Inspection",
    FORMATION: "Formation",
    LECON_TEMOIN: "Leçon témoin",
    REUNION_TRAVAIL: "Réunion de travail",
    SEMINAIRE: "Séminaire",
    COMMISSION: "Commission"
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (date) => {
    return date.toLocaleDateString(i18n.language, { weekday: 'long' });
  };

  const getDayShort = (date) => {
    return date.toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric' });
  };

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
              {t("welcome")}, {data?.firstName ? `${data.lastName}` : t("inspector")}!
            </h1>
            <p className="hero-subtitle">
              {t("overseeing")}
            </p>
            <div className="hero-tags">
              <span className="hero-tag">
                <Users size={14} /> {teacherCount} {t("assignedTeachers")}
              </span>
              <span className="hero-tag">
                <Calendar size={14} /> {activityCount} {t("activeActivities")}
              </span>
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
          {/* Activity Calendar */}
          <div className="timetable-wrapper">
            <div className="section-header">
              <Calendar size={18} />
              <h3>{t("activityCalendar")}</h3>
            </div>

            <div className="timetable-container" style={{
              background: 'white',
              borderRadius: '24px',
              padding: '1.5rem',
              border: '1.5px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div className="timetable-header-row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/inspector/calendar" className="manage-btn-inline" style={{
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <ChevronRight size={14} />
                  {t("manageCalendar")}
                </Link>
              </div>

              <div className="timetable-days-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
                width: '100%'
              }}>
                {currentWeekDays.map(day => {
                  const dayStr = day.toLocaleDateString('en-CA');
                  const dayActivities = groupedActivities[dayStr] || [];
                  const isToday = new Date().toLocaleDateString('en-CA') === dayStr;

                  return (
                    <div key={dayStr} className={`timetable-day-column ${isToday ? 'today-column' : ''}`}>
                      <h4 className="day-name">
                        <span className="day-long">{getDayName(day)}</span>
                        <span className="day-short">{getDayShort(day)}</span>
                      </h4>
                      <div className="day-slots">
                        {dayActivities.length === 0 ? (
                          <div className="empty-day" style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>{t("noEvents")}</div>
                        ) : (
                          dayActivities.map(activity => (
                            <div
                              key={activity.id}
                              className={`slot-item inspector-slot ${activity.type ? activity.type.toLowerCase() : 'inspection'}`}
                              onClick={() => setSelectedActivity(activity)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="slot-time">
                                <Clock size={12} />
                                {formatTime(activity.startDateTime)}
                              </div>
                              <div className="slot-main">
                                <strong>{activity.title}</strong>
                                <span className="slot-type-badge">{TYPE_LABELS[activity.type] || activity.type}</span>
                              </div>
                              {activity.location && (
                                <div className="slot-footer">
                                  <MapPin size={12} /> {activity.location}
                                </div>
                              )}
                              {activity.guests && activity.guests.length > 0 && (
                                <div className="slot-guests-mini" style={{ display: 'flex', gap: '4px', marginTop: '6px', alignItems: 'center' }}>
                                  <div style={{ display: 'flex' }}>
                                    {activity.guests.slice(0, 3).map((guest, idx) => (
                                      <div
                                        key={guest.id}
                                        title={`${guest.firstName} ${guest.lastName}`}
                                        style={{
                                          width: '24px',
                                          height: '24px',
                                          borderRadius: '8px',
                                          overflow: 'hidden',
                                          background: '#f1f5f9',
                                          flexShrink: 0,
                                          border: '2px solid white',
                                          marginLeft: idx > 0 ? '-8px' : '0',
                                          zIndex: 3 - idx,
                                          position: 'relative'
                                        }}
                                      >
                                        {guest.profileImageUrl ? (
                                          <img src={guest.profileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', fontSize: '9px', fontWeight: 'bold' }}>
                                            {(guest.firstName?.[0] || '?')}{(guest.lastName?.[0] || '')}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {activity.guests.length > 3 && (
                                      <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '8px',
                                        background: '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        color: '#475569',
                                        border: '2px solid white',
                                        marginLeft: '-8px',
                                        zIndex: 0
                                      }}>
                                        +{activity.guests.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-right-col">
          <div className="section-header">
            <Star size={18} />
            <h3>{t("managementSuite")}</h3>
          </div>

          <div className="quick-access-grid">
            <Link to="/inspector/teachers" className="access-card premium">
              <div className="access-icon"><Users size={24} /></div>
              <div className="access-info">
                <h4>{t("teacherRegistry")}</h4>
                <p>{t("teacherRegistryDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/inspector/courses" className="access-card schedule">
              <div className="access-icon"><BookOpen size={24} /></div>
              <div className="access-info">
                <h4>{t("courseBuilder")}</h4>
                <p>{t("courseBuilderDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/inspector/quizzes" className="access-card quiz">
              <div className="access-icon"><Brain size={24} /></div>
              <div className="access-info">
                <h4>{t("aiQuizCenter")}</h4>
                <p>{t("aiQuizCenterDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/inspector/powerbi" className="access-card reports">
              <div className="access-icon"><BarChart2 size={24} /></div>
              <div className="access-info">
                <h4>{t("biAnalytics")}</h4>
                <p>{t("biAnalyticsDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/inspector/reports" className="access-card reports">
              <div className="access-icon"><FileText size={24} /></div>
              <div className="access-info">
                <h4>{t("pedagogicalReports")}</h4>
                <p>{t("pedagogicalReportsDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>

            <Link to="/messages" className="access-card messenger">
              <div className="access-icon"><MessageSquare size={24} /></div>
              <div className="access-info">
                <h4>{t("liveChat")}</h4>
                <p>{t("liveChatDesc")}</p>
              </div>
              <ChevronRight className="arrow" size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── ACTIVITY DETAIL MODAL ────────────────────────────────────────────── */}
      {selectedActivity && (
        <div className="activity-modal-overlay" onClick={() => setSelectedActivity(null)}>
          <div className="activity-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-type-badge ${selectedActivity.type?.toLowerCase()}`}>
                {TYPE_LABELS[selectedActivity.type] || selectedActivity.type}
              </div>
              <button className="close-btn" onClick={() => setSelectedActivity(null)}></button>
            </div>

            <div className="modal-body">
              <h2 className="modal-title">{selectedActivity.title}</h2>

              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <Clock size={18} />
                  <div>
                    <label>{t("time")}</label>
                    <span>{new Date(selectedActivity.startDateTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="modal-info-item">
                  <MapPin size={18} />
                  <div>
                    <label>{t("location")}</label>
                    <span>{selectedActivity.location || "Online / Not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="modal-description">
                <label><FileText size={16} /> {t("description")}</label>
                <p>{selectedActivity.description || "No additional description provided for this activity."}</p>
              </div>

              {selectedActivity.guests && selectedActivity.guests.length > 0 && (
                <div className="modal-guests">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                    <Users size={16} /> {t("invitedTeachers")}
                  </label>
                  <div className="guests-list">
                    {selectedActivity.guests.map(guest => (
                      <div key={guest.id} className="guest-card">
                        <div className="guest-avatar-lg">
                          {guest.profileImageUrl
                            ? <img src={guest.profileImageUrl} alt={guest.firstName} />
                            : <span className="guest-initials">{(guest.firstName?.[0] || '?')}{(guest.lastName?.[0] || '')}</span>
                          }
                        </div>
                        <div className="guest-info">
                          <strong>{guest.firstName} {guest.lastName}</strong>
                          {guest.subject && <span>{guest.subject}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <Link to="/inspector/calendar" className="modal-action-btn">
                <Calendar size={18} />
                {t("openFullCalendar")}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .teacher-dashboard-premium { animation: fadeIn 0.5s ease; }
        
        .dashboard-hero {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 24px;
          padding: 2.5rem;
          color: white;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
        }
        
        .dashboard-hero::after {
          content: ""; position: absolute; top: -50px; right: -50px;
          width: 200px; height: 200px; background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }

        .welcome-back { font-size: 2.25rem; font-weight: 900; margin: 0 0 0.5rem; }
        .hero-subtitle { font-size: 1.1rem; opacity: 0.9; margin-bottom: 1.5rem; }
        .hero-tags { display: flex; gap: 12px; }
        .hero-tag { 
          background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
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
        .access-card:hover { transform: translateX(8px); border-color: #cbd5e1; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05); }
        .access-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        
        .access-card.premium .access-icon { background: #f1f5f9; color: #1e293b; }
        .access-card.quiz .access-icon { background: #fffbeb; color: #d97706; }
        .access-card.schedule .access-icon { background: #eff6ff; color: #2563eb; }
        .access-card.reports .access-icon { background: #f0fdf4; color: #16a34a; }
        .access-card.messenger .access-icon { background: #f8fafc; color: #64748b; }

        .access-info h4 { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
        .access-info p { margin: 2px 0 0; font-size: 0.8rem; color: #64748b; }
        .arrow { margin-left: auto; color: #cbd5e1; }

        .manage-btn-inline {
          background: white;
          color: #475569;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1.5px solid #f1f5f9;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .manage-btn-inline:hover {
          background: white;
          color: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 8px 16px rgba(79, 70, 229, 0.12);
          transform: translateY(-2px);
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Modal Styles */
        .activity-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: modalFadeIn 0.3s ease;
        }
        .activity-modal-content {
          background: white;
          width: 90%;
          max-width: 500px;
          border-radius: 28px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .modal-type-badge {
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .modal-type-badge.inspection { background: #eff6ff; color: #2563eb; }
        .modal-type-badge.formation { background: #f0fdf4; color: #16a34a; }
        .modal-type-badge.seminaire { background: #fff1f2; color: #e11d48; }
        
        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 9999;
        }

        .close-btn::before,
        .close-btn::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 2px;
          background: #333;
          transform-origin: center;
          transition: background 0.2s;
        }

        .close-btn::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .close-btn::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .close-btn:hover::before,
        .close-btn:hover::after {
          background: red;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }
        .modal-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .modal-info-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: #64748b;
        }
        .modal-info-item label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        .modal-info-item span {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 600;
        }
        .modal-description {
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 16px;
        }
        .modal-description label, .modal-guests label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.75rem;
        }
        .modal-description p {
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }
        .guests-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .guest-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          transition: all 0.2s;
        }
        .guest-card:hover {
          border-color: var(--primary);
          background: #f5f3ff;
        }
        .guest-avatar-lg {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary), #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }
        .guest-avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
        .guest-initials {
          color: white;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .guest-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .guest-info strong {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
        }
        .guest-info span {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .modal-footer {
          margin-top: 2.5rem;
        }
        .modal-action-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
        }
        .modal-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(79, 70, 229, 0.4);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 1024px) {
          .main-dashboard-content { grid-template-columns: 1fr; }
          .hero-content { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }
      `}} />
    </div>
  );
}
