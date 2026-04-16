import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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

export default function InspectorCalendar() {
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
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
    setSuccess("Date selected. Complete the activity details and save.");
    setEditingId(null);
    setForm((current) => ({
      ...current,
      startDateTime: toDateTimeLocalValue(selection.start),
      endDateTime: toDateTimeLocalValue(
        selection.end || new Date(selection.start.getTime() + 60 * 60 * 1000)
      ),
    }));
  }

  function handleDateClick(selection) {
    setSuccess("Date selected. Complete the activity details and save.");
    setEditingId(null);
    setForm((current) => ({
      ...current,
      startDateTime: toDateTimeLocalValue(selection.date),
      endDateTime: addHours(selection.date, 1),
    }));
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
      guestTeacherIds: (activity.guests || []).map((guest) => guest.id),
    });
    setSuccess("Activity loaded. Edit the details and click Update activity.");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
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

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Activity calendar</div>
          <div className="page-subtitle">
            Plan inspections and training sessions by date.
          </div>
        </div>
        <Link className="secondary-link-button" to="/inspector">
          Back to dashboard
        </Link>
      </header>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="calendar-shell">
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
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            events={calendarEvents}
            editable
            selectable
            selectMirror
            nowIndicator
            height="auto"
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="19:00:00"
            select={handleCalendarSelect}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleDropOrResize}
            eventResize={handleDropOrResize}
          />
        </div>
      </section>

      <div className="dashboard-grid activity-workspace">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                {editingId ? "Edit activity" : "New activity"}
              </div>
              <div className="card-subtitle">
                Select a date in the calendar, then complete the details.
              </div>
            </div>
            <span className="tag">{loading ? "Loading" : editingId ? "Editing" : "Planner"}</span>
          </div>

          <form className="activity-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                required
              />
            </label>

            <div className="form-row">
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(event) => updateForm("type", event.target.value)}
                  required
                >
                  <option value="INSPECTION">Inspection</option>
                  <option value="TRAINING">Training</option>
                </select>
              </label>

              <label>
                Location
                <input
                  value={form.location}
                  onChange={(event) => updateForm("location", event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Starts
                <input
                  type="datetime-local"
                  value={form.startDateTime}
                  onChange={(event) => updateForm("startDateTime", event.target.value)}
                  required
                />
              </label>

              <label>
                Ends
                <input
                  type="datetime-local"
                  value={form.endDateTime}
                  onChange={(event) => updateForm("endDateTime", event.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                rows="3"
              />
            </label>

            <div className="teacher-picker">
              <div className="card-subtitle">Guests</div>
              {teachers.length === 0 ? (
                <p className="muted">No teacher profiles are available yet.</p>
              ) : (
                <div className="teacher-options">
                  {teachers.map((teacher) => (
                    <label key={teacher.id} className="teacher-option">
                      <input
                        type="checkbox"
                        checked={form.guestTeacherIds.includes(teacher.id)}
                        onChange={() => toggleTeacher(teacher.id)}
                      />
                      <span>
                        {teacher.firstName} {teacher.lastName}
                        <small>{teacher.etablissement?.name || teacher.email}</small>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving || form.guestTeacherIds.length === 0}>
                {saving ? "Saving..." : editingId ? "Update activity" : "Create activity"}
              </button>
              {editingId && (
                <button type="button" className="secondary-action-btn" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Planned activities</div>
              <div className="card-subtitle">
                Click an event in the calendar to load its details.
              </div>
            </div>
            <span className="badge">{activities.length} activities</span>
          </div>

          {activities.length === 0 ? (
            <p className="muted">No activities planned yet.</p>
          ) : (
            <div className="activity-list">
              {activities.map((activity) => {
                const latestReport = latestReportByActivity.get(activity.id);

                return (
                  <article className="activity-item" key={activity.id}>
                    <div>
                      <div className="activity-title">
                        {activity.title}
                        <span className="badge">{activity.type}</span>
                      </div>
                      <p>{activity.description || "No description added."}</p>
                      <div className="activity-meta">
                        <span>{formatDateTime(activity.startDateTime)}</span>
                        <span>{activity.location}</span>
                        <span>
                          {(activity.guests || [])
                            .map((guest) => `${guest.firstName} ${guest.lastName}`)
                            .join(", ") || "No guests"}
                        </span>
                        <span>{latestReport ? "Report ready" : "No report yet"}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      {latestReport && (
                        <button
                          type="button"
                          className="secondary-action-btn"
                          onClick={() => handleDownloadReportPdf(latestReport)}
                        >
                          PDF
                        </button>
                      )}
                      <Link
                        className="secondary-link-button compact-link-button"
                        to={`/inspector/reports?activityId=${activity.id}`}
                      >
                        Report
                      </Link>
                      <button className="danger-btn" onClick={() => handleDelete(activity.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="card activity-list-card">
        <div className="card-header">
          <div>
            <div className="card-title">Reports</div>
            <div className="card-subtitle">
              Write activity reports after inspections or training sessions.
            </div>
          </div>
          <Link className="primary-link-button compact-link-button" to="/inspector/reports">
            Open reports
          </Link>
        </div>
      </section>
    </div>
  );
}
