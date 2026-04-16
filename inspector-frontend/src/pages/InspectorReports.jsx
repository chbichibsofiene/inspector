import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getActivities } from "../api/activities";
import {
  createReport,
  deleteReport,
  downloadReportPdf,
  getReports,
  importReportPdf,
  updateReport,
} from "../api/reports";

const emptyForm = {
  activityId: "",
  teacherId: "",
  title: "",
  observations: "",
  recommendations: "",
  score: "",
  status: "DRAFT",
};

function formatDate(value) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function InspectorReports() {
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedActivity = useMemo(
    () => activities.find((activity) => String(activity.id) === String(form.activityId)),
    [activities, form.activityId]
  );

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        const [activitiesRes, reportsRes] = await Promise.all([
          getActivities(),
          getReports(),
        ]);

        const loadedActivities = activitiesRes.data?.data || [];
        const requestedActivityId = searchParams.get("activityId");

        setActivities(loadedActivities);
        setReports(reportsRes.data?.data || []);
        setForm((current) => ({
          ...current,
          activityId:
            requestedActivityId && loadedActivities.some((activity) => String(activity.id) === requestedActivityId)
              ? requestedActivityId
              : current.activityId || (loadedActivities[0] ? String(loadedActivities[0].id) : ""),
        }));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [searchParams]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "activityId" ? { teacherId: "" } : {}),
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm((current) => ({
      ...emptyForm,
      activityId: current.activityId,
    }));
  }

  function editReport(report) {
    setEditingId(report.id);
    setForm({
      activityId: String(report.activityId),
      teacherId: report.teacher?.id ? String(report.teacher.id) : "",
      title: report.title || "",
      observations: report.observations || "",
      recommendations: report.recommendations || "",
      score: report.score ?? "",
      status: report.status || "DRAFT",
    });
    setSuccess("Report loaded. Edit the form and save.");
  }

  async function reloadReports() {
    const reportsRes = await getReports();
    setReports(reportsRes.data?.data || []);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      activityId: Number(form.activityId),
      teacherId: form.teacherId ? Number(form.teacherId) : null,
      title: form.title,
      observations: form.observations,
      recommendations: form.recommendations,
      score: form.score === "" ? null : Number(form.score),
      status: form.status,
    };

    try {
      if (editingId) {
        await updateReport(editingId, payload);
        setSuccess("Report updated successfully.");
      } else {
        await createReport(payload);
        setSuccess("Report created successfully.");
      }

      resetForm();
      await reloadReports();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to save report.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reportId) {
    setError("");
    setSuccess("");
    try {
      await deleteReport(reportId);
      setSuccess("Report deleted successfully.");
      await reloadReports();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to delete report.");
    }
  }

  async function handleDownloadPdf(report) {
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
      setSuccess("PDF downloaded successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to download PDF.");
    }
  }

  async function handleImportPdf(report, file) {
    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await importReportPdf(report.id, file);
      setSuccess("PDF imported successfully.");
      await reloadReports();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to import PDF.");
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-title">Activity reports</div>
          <div className="page-subtitle">
            Write observations, recommendations and evaluation notes after an activity.
          </div>
        </div>
        <Link className="secondary-link-button" to="/inspector/calendar">
          Back to calendar
        </Link>
      </header>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="dashboard-grid activity-workspace">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{editingId ? "Edit report" : "New report"}</div>
              <div className="card-subtitle">
                {loading ? "Loading activities..." : "Link the report to a planned activity."}
              </div>
            </div>
            <span className="tag">{editingId ? "Editing" : "Report"}</span>
          </div>

          <form className="activity-form" onSubmit={handleSubmit}>
            <label>
              Activity
              <select
                value={form.activityId}
                onChange={(event) => updateForm("activityId", event.target.value)}
                required
              >
                <option value="">Select an activity</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title} - {formatDate(activity.startDateTime)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Teacher
              <select
                value={form.teacherId}
                onChange={(event) => updateForm("teacherId", event.target.value)}
              >
                <option value="">General activity report</option>
                {(selectedActivity?.guests || []).map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                required
              />
            </label>

            <label>
              Observations
              <textarea
                value={form.observations}
                onChange={(event) => updateForm("observations", event.target.value)}
                rows="5"
                required
              />
            </label>

            <label>
              Recommendations
              <textarea
                value={form.recommendations}
                onChange={(event) => updateForm("recommendations", event.target.value)}
                rows="4"
              />
            </label>

            <div className="form-row">
              <label>
                Score /20
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={form.score}
                  onChange={(event) => updateForm("score", event.target.value)}
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                  required
                >
                  <option value="DRAFT">Draft</option>
                  <option value="FINAL">Final</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving || !form.activityId}>
                {saving ? "Saving..." : editingId ? "Update report" : "Create report"}
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
              <div className="card-title">Report history</div>
              <div className="card-subtitle">
                Saved reports for your inspector activities.
              </div>
            </div>
            <span className="badge">{reports.length} reports</span>
          </div>

          {reports.length === 0 ? (
            <p className="muted">No reports saved yet.</p>
          ) : (
            <div className="activity-list">
              {reports.map((report) => (
                <article className="activity-item" key={report.id}>
                  <div>
                    <div className="activity-title">
                      {report.title}
                      <span className="badge">{report.status}</span>
                    </div>
                    <p>{report.observations}</p>
                    <div className="activity-meta">
                      <span>{report.activityTitle}</span>
                      <span>{report.teacher ? `${report.teacher.firstName} ${report.teacher.lastName}` : "General"}</span>
                      <span>{report.score == null ? "No score" : `${report.score}/20`}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="secondary-action-btn" onClick={() => handleDownloadPdf(report)}>
                      {report.hasImportedPdf ? "Download imported PDF" : "Download PDF"}
                    </button>
                    <label className="secondary-link-button compact-link-button file-import-button">
                      Import PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(event) => handleImportPdf(report, event.target.files?.[0])}
                      />
                    </label>
                    <button type="button" className="secondary-action-btn" onClick={() => editReport(report)}>
                      Edit
                    </button>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(report.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
