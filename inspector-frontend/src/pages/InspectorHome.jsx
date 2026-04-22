import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Calendar, ChevronRight } from "lucide-react";
import { getInspectorDashboard } from "../api/dashboard";
import { getActivities, getActivityTeachers } from "../api/activities";

export default function InspectorHome() {
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityCount, setActivityCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDayShort = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

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

      {error && <div className="auth-error">{error}</div>}

      <div className="dashboard-grid">
        <section className="card dashboard-calendar-card">
          <div className="card-header">
            <div>
              <div className="card-title">Activity Calendar</div>
              <div className="card-subtitle">
                This week's pedagogical schedule.
              </div>
            </div>
            <Link className="compact-btn" to="/inspector/calendar">
              Manage <ChevronRight size={14} />
            </Link>
          </div>

          <div className="timetable-container">
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
                      <div className="empty-day">No events</div>
                    ) : (
                      dayActivities.map(activity => (
                        <div key={activity.id} className={`slot-item inspector-slot ${activity.type ? activity.type.toLowerCase() : 'inspection'}`}>
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Workspace status</div>
              <div className="card-subtitle">
                {loading ? "Loading your inspector data..." : data?.message || "Ready to plan activities."}
              </div>
            </div>
            <span className="tag">{data?.status || "ACTIVE"}</span>
          </div>

          <div className="metric-list">
            <div>
              <span>Activities</span>
              <strong>{activityCount}</strong>
            </div>
            <div>
              <span>Available teachers</span>
              <Link to="/inspector/teachers" style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {teacherCount} <ChevronRight size={14} />
              </Link>
            </div>
            <div>
              <span>Serial code</span>
              <strong>{data?.serialCode || "N/A"}</strong>
            </div>
            {data?.phone && (
              <div>
                <span>Phone</span>
                <strong>{data.phone}</strong>
              </div>
            )}
            {data?.language && (
              <div>
                <span>Language</span>
                <strong>{data.language}</strong>
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Power BI analytics</div>
              <div className="card-subtitle">
                Open activity and report indicators for Power BI.
              </div>
            </div>
            <span className="tag">Analytics</span>
          </div>

          <p className="muted">
            Use this page to embed a Power BI report or connect Power BI to the analytics API.
          </p>

          <Link className="primary-link-button" to="/inspector/powerbi">
            Open Power BI
          </Link>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Teachers Management</div>
              <div className="card-subtitle">
                Access recurring timetables and pedagogical histories.
              </div>
            </div>
            <span className="tag">Insights</span>
          </div>

          <p className="muted">
            Search through your assigned staff and view their activity records and schedules.
          </p>

          <Link className="primary-link-button" to="/inspector/teachers">
            Manage Teachers
          </Link>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Messenger</div>
              <div className="card-subtitle">
                Secure professional chat with teachers in your area.
              </div>
            </div>
            <span className="tag">New</span>
          </div>

          <p className="muted">
            Communicate directly and share files securely with teachers.
          </p>

          <Link className="primary-link-button" to="/messages">
            Go to Messenger
          </Link>
        </section>

        <section className="card highlight-card">
          <div className="card-header">
            <div>
              <div className="card-title">AI Quiz Center</div>
              <div className="card-subtitle">
                Evaluate teacher training needs with AI.
              </div>
            </div>
            <span className="tag premium">New</span>
          </div>

          <p className="muted">
            Generate pedagogical quizzes using Gemini Pro and review automated evaluations.
          </p>

          <Link className="primary-link-button" to="/inspector/quizzes">
            Launch AI Quiz Center
          </Link>
        </section>
      </div>
    </div>
  );
}
