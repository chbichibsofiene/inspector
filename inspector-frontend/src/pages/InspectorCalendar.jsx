import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Users,
  CheckCircle2,
  Trash2,
  Plus,
  LayoutGrid,
  FileText,
  Building2,
  X,
  Check,
  Video,
  Link as LinkIcon
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityTeachers,
  updateActivity,
} from "../api/activities";
import { downloadReportPdf, getReports } from "../api/reports";

const emptyForm = {
  title: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
  type: "INSPECTION",
  location: "",
  isOnline: false,
  guestTeacherIds: [],
};

function formatDateTime(value) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toDateTimeLocalValue(value) {
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function addHours(value, hours) {
  const date = new Date(value);
  date.setHours(date.getHours() + hours);
  return toDateTimeLocalValue(date);
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

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

export default function InspectorCalendar() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const calendarEvents = useMemo(
    () =>
      activities.map((activity) => ({
        id: String(activity.id),
        title: activity.title,
        start: activity.startDateTime,
        end: activity.endDateTime,
        className:
          activity.type === "TRAINING"
            ? "calendar-event-training"
            : "calendar-event-inspection",
        extendedProps: {
          activity,
        },
      })),
    [activities]
  );

  const latestReportByActivity = useMemo(() => {
    const grouped = new Map();

    reports.forEach((report) => {
      const current = grouped.get(report.activityId);
      const currentDate = current ? new Date(current.updatedAt || current.createdAt) : null;
      const reportDate = new Date(report.updatedAt || report.createdAt);

      if (!current || reportDate > currentDate) {
        grouped.set(report.activityId, report);
      }
    });

    return grouped;
  }, [reports]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [activitiesRes, teachersRes, reportsRes] = await Promise.all([
        getActivities(),
        getActivityTeachers(),
        getReports(),
      ]);

      setActivities(activitiesRes.data?.data || []);
      setTeachers(teachersRes.data?.data || []);
      setReports(reportsRes.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to load activity calendar.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleTeacher(teacherId) {
    setForm((current) => {
      const exists = current.guestTeacherIds.includes(teacherId);
      return {
        ...current,
        guestTeacherIds: exists
          ? current.guestTeacherIds.filter((id) => id !== teacherId)
          : [...current.guestTeacherIds, teacherId],
      };
    });
  }

  function handleSelectAll() {
    const allSelected = form.guestTeacherIds.length === teachers.length;
    if (allSelected) {
      updateForm("guestTeacherIds", []);
    } else {
      updateForm("guestTeacherIds", teachers.map(t => t.id));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        guestTeacherIds: form.guestTeacherIds.map(Number),
      };

      if (editingId) {
        await updateActivity(editingId, payload);
        setSuccess("Activity updated successfully.");
      } else {
        await createActivity(payload);
        setSuccess("Activity created successfully.");
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to save activity.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(activityId) {
    setError("");
    setSuccess("");
    try {
      await deleteActivity(activityId);
      setSuccess("Activity deleted successfully.");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to delete activity.");
    }
  }

  async function handleDownloadReportPdf(report) {
    setError("");
    setSuccess("");
    try {
      const response = await downloadReportPdf(report.id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `activity-report-${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess("Report PDF downloaded successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to download report PDF.");
    }
  }

  function handleCalendarSelect(selection) {
    setEditingId(null);
    setForm((current) => ({
      ...current,
      startDateTime: toDateTimeLocalValue(selection.start),
      endDateTime: toDateTimeLocalValue(
        selection.end || new Date(selection.start.getTime() + 60 * 60 * 1000)
      ),
    }));
    setShowModal(true);
  }

  function handleDateClick(selection) {
    setEditingId(null);
    setForm((current) => ({
      ...current,
      startDateTime: toDateTimeLocalValue(selection.date),
      endDateTime: addHours(selection.date, 1),
    }));
    setShowModal(true);
  }

  function handleEventClick(selection) {
    const activity = selection.event.extendedProps.activity;
    setEditingId(activity.id);
    setForm({
      title: activity.title || "",
      description: activity.description || "",
      startDateTime: toDateTimeLocalValue(activity.startDateTime),
      endDateTime: toDateTimeLocalValue(activity.endDateTime),
      type: activity.type || "INSPECTION",
      location: activity.location || "",
      isOnline: activity.isOnline === true || activity.online === true,
      meetingUrl: activity.meetingUrl || "",
      guestTeacherIds: (activity.guests || []).map((guest) => guest.id),
    });

    setShowModal(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(false);
  }

  async function handleDropOrResize(info) {
    const activity = info.event.extendedProps.activity;

    try {
      await updateActivity(activity.id, {
        title: activity.title,
        description: activity.description,
        startDateTime: toDateTimeLocalValue(info.event.start),
        endDateTime: toDateTimeLocalValue(
          info.event.end || new Date(info.event.start.getTime() + 60 * 60 * 1000)
        ),
        type: activity.type,
        location: activity.location,
        guestTeacherIds: (activity.guests || []).map((guest) => guest.id),
      });
      setSuccess("Activity moved successfully.");
      await load();
    } catch (err) {
      info.revert();
      setError(err?.response?.data?.message || err.message || "Unable to move activity.");
    }
  }

  function renderEventContent(eventInfo) {
    const activity = eventInfo.event.extendedProps?.activity;
    
    if (!activity) {
      return (
        <div className="premium-event premium-event-inspection">
          <div className="event-time">
            <Clock size={10} /> {eventInfo.timeText}
          </div>
          <div className="event-title">{eventInfo.event.title}</div>
        </div>
      );
    }

    const typeClass = activity.type ? activity.type.toLowerCase() : 'inspection';

    return (
      <div className={`premium-event premium-event-${typeClass}`}>
        <div className="event-time">
          <Clock size={10} /> {eventInfo.timeText}
        </div>
        <div className="event-title">{activity.title}</div>
        {activity.location && (
          <div className="event-location">
            <MapPin size={10} /> {activity.location}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">{t("activityCalendar")}</div>
          <div className="page-subtitle">
            {t("calendarDesc")}
          </div>
        </div>
        <Link className="secondary-link-button" to="/inspector">
          {t("backToDashboard")}
        </Link>
      </header>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="calendar-layout">
        <div className="calendar-main">
          <section className="calendar-shell" style={{ marginTop: 0 }}>
            <div className="calendar-panel">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                buttonText={{
                  today: t("today"),
                  month: t("month"),
                  week: t("week"),
                  day: t("day"),
                }}
                events={calendarEvents}
                editable
                selectable
                selectMirror
                nowIndicator
                height="auto"
                aspectRatio={1.8}
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                select={handleCalendarSelect}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleDropOrResize}
                eventResize={handleDropOrResize}
                eventContent={renderEventContent}
              />
            </div>
          </section>

          <section className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <div>
                <div className="card-title">{t("upcomingActivities")}</div>
                <div className="card-subtitle">
                  {t("upcomingActivitiesDesc")}
                </div>
              </div>
              <Link className="primary-link-button compact-link-button" to="/inspector">
                {t("workspaceIndicators")}
              </Link>
            </div>

            {activities.length === 0 ? (
              <p className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No activities planned yet.</p>
            ) : (
              <div className="activity-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '1.25rem',
                marginTop: '1rem' 
              }}>
                {activities.slice(0, 6).map((activity) => (
                  <article className="card" key={activity.id} style={{ 
                    padding: '1.25rem', 
                    border: '1px solid var(--border-subtle)',
                    background: '#fcfdfe'
                  }}>
                    <div className="activity-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                      {activity.title}
                      <span className={`badge ${activity.type ? activity.type.toLowerCase() : ''}`}>{TYPE_LABELS[activity.type] || activity.type}</span>
                    </div>
                    <div className="activity-meta" style={{ display: 'grid', gap: '0.4rem', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} className="text-muted" /> {formatDateTime(activity.startDateTime)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} className="text-muted" /> {activity.location}
                      </span>
                    </div>
                    <div className="item-actions" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <Link
                        className="secondary-link-button compact-link-button"
                        to={`/inspector/reports?activityId=${activity.id}`}
                      >
                        {t("reportBtn")}
                      </Link>
                      <button className="danger-btn" onClick={() => handleDelete(activity.id)} style={{ padding: '6px 10px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay premium-overlay" onClick={() => !saving && setShowModal(false)}>
          <div 
            className={`premium-modal ${form.type ? form.type.toLowerCase() : ''}`} 
            style={{ width: '90%', maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`modal-branding-bar branding-${form.type ? form.type.toLowerCase() : ''}`} />
            
            <header className="premium-modal-header">
              <div>
                <h2>{editingId ? "Update Activity" : "Secure New Schedule"}</h2>
                <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                  {editingId ? "Modify your existing pedagogical plan" : "Establish a new professional session"}
                </p>
              </div>
              <button 
                type="button"
                className="close-btn" 
                onClick={() => !saving && setShowModal(false)}
                style={{ background: '#f1f5f9', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </header>

            <div className="premium-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                
                <div className="form-group">
                  <div className="group-header">
                    <FileText size={14} /> Basic Information
                  </div>
                  <div className="input-with-icon">
                    <Search className="input-icon" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Visite de classe - 3ème Math"
                      value={form.title}
                      onChange={(event) => updateForm("title", event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <div className="group-header">
                      <LayoutGrid size={14} /> Category
                    </div>
                    <div className="input-with-icon">
                      <LayoutGrid className="input-icon" size={18} />
                      <select
                        value={form.type}
                        onChange={(event) => updateForm("type", event.target.value)}
                        required
                        style={{ appearance: 'none' }}
                      >
                        <option value="">Select Type</option>
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="group-header">
                      <Clock size={14} /> Starts
                    </div>
                    <div className="input-with-icon">
                      <Clock className="input-icon" size={18} />
                      <input
                        type="datetime-local"
                        value={form.startDateTime}
                        onChange={(event) => updateForm("startDateTime", event.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="group-header">
                    <Clock size={14} /> Ends
                  </div>
                  <div className="input-with-icon">
                    <Clock className="input-icon" size={18} />
                    <input
                      type="datetime-local"
                      value={form.endDateTime}
                      onChange={(event) => updateForm("endDateTime", event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="group-header">
                    <FileText size={14} /> {t("description")}
                  </div>
                  <div className="input-with-icon">
                    <FileText className="input-icon" style={{ top: '15px' }} size={18} />
                    <textarea
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                      rows="3"
                      placeholder="Set the objectives for this session..."
                      style={{ paddingTop: '12px' }}
                    />
                  </div>
                </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                      <div className="group-header">
                        <Video size={14} /> {t("meetingType")}
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '12px',
                        marginTop: '0.5rem'
                      }}>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setForm(curr => ({ ...curr, isOnline: false, location: curr.location === "Online" ? "" : curr.location }));
                          }}
                          style={{
                            padding: '1.25rem 1rem',
                            borderRadius: '16px',
                            border: '2px solid',
                            borderColor: !form.isOnline ? 'var(--primary)' : 'var(--border-subtle)',
                            background: !form.isOnline ? '#f0f9ff' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            boxShadow: !form.isOnline ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
                            outline: 'none'
                          }}
                        >
                          <MapPin size={24} color={!form.isOnline ? 'var(--primary)' : '#94a3b8'} />
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: !form.isOnline ? '#0369a1' : '#64748b' }}>{t("inPerson")}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>{t("atLocation")}</div>
                        </button>

                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setForm(curr => ({ ...curr, isOnline: true, location: "Online" }));
                          }}
                          style={{
                            padding: '1.25rem 1rem',
                            borderRadius: '16px',
                            border: '2px solid',
                            borderColor: form.isOnline ? 'var(--primary)' : 'var(--border-subtle)',
                            background: form.isOnline ? '#f0f9ff' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            boxShadow: form.isOnline ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
                            outline: 'none'
                          }}
                        >
                          <Video size={24} color={form.isOnline ? 'var(--primary)' : '#94a3b8'} />
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: form.isOnline ? '#0369a1' : '#64748b' }}>{t("online")}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>{t("jitsiVideo")}</div>
                        </button>
                      </div>
                    </div>

                    {form.isOnline && form.meetingUrl && (
                      <div className="form-group" style={{ 
                        marginTop: '1rem',
                        padding: '1.25rem',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <div className="group-header">
                          <LinkIcon size={14} /> Jitsi Meeting Link
                        </div>
                        <div className="input-with-icon" style={{ marginTop: '0.5rem' }}>
                          <LinkIcon className="input-icon" size={18} />
                          <input
                            type="text"
                            value={form.meetingUrl}
                            readOnly
                            style={{ background: '#fff', cursor: 'default' }}
                          />
                        </div>
                        <a 
                          href={form.meetingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="primary-link-button" 
                          style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                        >
                          Join Online Meeting Now
                        </a>
                      </div>
                    )}

                    <div className="form-group">
                      <div className="group-header">
                        <MapPin size={14} /> {form.isOnline ? t("virtualLocation") : t("meetingLocation")}
                      </div>
                      <div className="input-with-icon">
                        <MapPin className="input-icon" size={18} />
                        <input
                          type="text"
                          placeholder={form.isOnline ? t("online") : t("specifyLocation")}
                          value={form.location}
                          onChange={(e) => updateForm("location", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                <div className="form-group">
                  <div className="group-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} /> Assign Teachers
                      <span className={`selection-stats ${form.guestTeacherIds.length > 0 ? 'active' : ''}`}>
                        {form.guestTeacherIds.length} of {teachers.length} Assigned
                      </span>
                    </div>
                    {teachers.length > 0 && (
                      <button 
                        type="button" 
                        className="text-link-button" 
                        onClick={handleSelectAll}
                        style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}
                      >
                        {form.guestTeacherIds.length === teachers.length ? "Clear All" : "Quick Select All"}
                      </button>
                    )}
                  </div>

                  {teachers.length === 0 ? (
                    <p className="muted" style={{ padding: '1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                      No teachers found in your delegation.
                    </p>
                  ) : (
                    <div className="teacher-selection-grid">
                      {teachers.map((teacher) => {
                        const isSelected = form.guestTeacherIds.includes(teacher.id);
                        return (
                          <div 
                            key={teacher.id} 
                            className={`teacher-card-premium ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleTeacher(teacher.id)}
                          >
                            <div className="teacher-avatar">
                              {isSelected ? <Check size={18} /> : (teacher.firstName?.[0] || teacher.lastName?.[0] || "?")}
                            </div>
                            <div className="teacher-info">
                              <span className="teacher-name">{teacher.firstName} {teacher.lastName}</span>
                              <span className="teacher-school">
                                <Building2 size={10} /> {teacher.etablissement?.name || "Independent"}
                              </span>
                            </div>
                            <div className="selection-check">
                              {isSelected && <Check size={12} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="form-actions" style={{ 
                  marginTop: '1rem', 
                  display: 'flex', 
                  gap: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '2rem'
                }}>
                  {editingId && (
                    <button 
                      type="button" 
                      className="danger-btn" 
                      onClick={() => handleDelete(editingId).then(() => setShowModal(false))}
                      style={{ 
                        height: '52px', 
                        width: '52px', 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '16px'
                      }}
                      title="Withdraw Activity"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="primary-btn"
                    style={{ flex: 1, height: '52px', fontSize: '1rem', fontWeight: 700, borderRadius: '16px' }}
                  >
                    {saving ? "Processing..." : editingId ? "Update Schedule" : "Finalize Planning"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
