import React, { useState, useEffect } from "react";
import { getTeacherActivities } from "../api/activities";
import { Calendar, MapPin, Clock, User, Video, AlertCircle, Wifi } from "lucide-react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABELS = { MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun" };

export default function InspectorActivitiesTimetable() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await getTeacherActivities();
      setActivities(response.data?.data || []);
    } catch (err) {
      setError("Unable to load activities.");
    } finally {
      setLoading(false);
    }
  };

  const isPast = (date) => new Date(date) < new Date();

  // Map activities to their day-of-week bucket
  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = activities.filter(a => {
      const d = new Date(a.startDateTime);
      const jsDay = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
      const dayMap = { MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0 };
      return dayMap[day] === jsDay;
    }).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    return acc;
  }, {});

  const formatTime = (dt) =>
    new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString([], { day: "numeric", month: "short" });

  const typeColor = {
    INSPECTION: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    TRAINING:   { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
    MEETING:    { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    OTHER:      { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  };

  return (
    <section className="card timetable-card" style={{ marginTop: "2rem" }}>
      <div className="card-header">
        <div>
          <div className="card-title">Inspector Activities Timetable</div>
          <div className="card-subtitle">Events you have been invited to by your inspector</div>
        </div>
        <span className="badge" style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "4px 12px", fontSize: "0.8rem", fontWeight: 700 }}>
          {activities.length} Events
        </span>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: "1rem" }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div></div>
      ) : (
        <div className="timetable-container">
          {DAYS.map(day => (
            <div key={day} className="timetable-day-column">
              <h4 className="day-name">{DAY_LABELS[day]}</h4>
              <div className="day-slots">
                {grouped[day].length === 0 ? (
                  <div className="empty-day">Free</div>
                ) : (
                  grouped[day].map(activity => {
                    const palette = typeColor[activity.type] || typeColor.OTHER;
                    const past = isPast(activity.endDateTime);
                    return (
                      <div key={activity.id} className="slot-item inspector-slot" style={{
                        background: past ? "#f8fafc" : palette.bg,
                        borderLeft: `3px solid ${past ? "#cbd5e1" : palette.color}`,
                        opacity: past ? 0.7 : 1,
                        position: "relative"
                      }}>
                        {/* Date badge */}
                        <div style={{ fontSize: "0.65rem", fontWeight: 800, color: past ? "#94a3b8" : palette.color, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {formatDate(activity.startDateTime)}
                        </div>

                        {/* Time */}
                        <div className="slot-time" style={{ color: past ? "#94a3b8" : "#475569" }}>
                          <Clock size={11} /> {formatTime(activity.startDateTime)} – {formatTime(activity.endDateTime)}
                        </div>

                        {/* Title */}
                        <div className="slot-main" style={{ marginTop: "4px" }}>
                          <strong style={{ color: past ? "#64748b" : "#0f172a", fontSize: "0.82rem", lineHeight: 1.3 }}>
                            {activity.title}
                          </strong>
                        </div>

                        {/* Type tag */}
                        <span style={{
                          display: "inline-block", marginTop: "5px", fontSize: "0.65rem",
                          fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                          padding: "2px 7px", borderRadius: "5px",
                          background: palette.bg, color: palette.color, border: `1px solid ${palette.border}`
                        }}>
                          {activity.type}
                        </span>

                        {/* Location */}
                        <div className="slot-footer" style={{ marginTop: "6px", color: "#94a3b8" }}>
                          <MapPin size={11} /> {activity.location || "Online / TBD"}
                        </div>

                        {/* Inspector name */}
                        {activity.inspectorName && (
                          <div className="slot-footer" style={{ color: "#3b82f6", marginTop: "3px" }}>
                            <User size={11} /> {activity.inspectorName}
                          </div>
                        )}

                        {/* Join link for online upcoming events */}
                        {(activity.isOnline || activity.online) && activity.meetingUrl && !past && (
                          <a
                            href={activity.meetingUrl}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                              display: "flex", alignItems: "center", gap: "5px",
                              marginTop: "8px", fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed",
                              background: "#f5f3ff", padding: "4px 8px", borderRadius: "6px",
                              border: "1px solid #ddd6fe", textDecoration: "none"
                            }}
                          >
                            <Wifi size={12} /> Join
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
          <Calendar size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <h3 style={{ margin: "0 0 0.5rem" }}>No assigned activities</h3>
          <p>You haven't been added as a guest to any inspector activities yet.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .inspector-slot { border-radius: 10px; padding: 0.65rem 0.75rem; margin-bottom: 8px; transition: box-shadow 0.2s; }
        .inspector-slot:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      `}} />
    </section>
  );
}
