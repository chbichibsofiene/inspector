import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveSession } from "../auth/session";
import profileApi from "../api/profile";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const user = getUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    language: "French",
    rank: "",
    subject: "",
    schoolLevel: "",
    delegationId: "",
    dependencyId: "",
    departmentId: "",
    etablissementId: "", // For teachers
    etablissementIds: [], // For inspectors
  });

  // Reference Data State
  const [ranks, setRanks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [etablissements, setEtablissements] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load initial reference data
    async function loadInitialData() {
      try {
        const [ranksRes, subjectsRes, levelsRes, delegationsRes] = await Promise.all([
          profileApi.getRanks(),
          profileApi.getSubjects(),
          profileApi.getSchoolLevels(),
          profileApi.getDelegations(),
        ]);
        setRanks(ranksRes.data.data);
        setSubjects(subjectsRes.data.data);
        setLevels(levelsRes.data.data);
        setDelegations(delegationsRes.data.data);
      } catch (err) {
        setError("Failed to load reference data.");
      }
    }

    async function loadExistingProfile() {
      if (user.profileCompleted) {
        try {
          const res = user.role === "INSPECTOR" 
            ? await profileApi.getInspectorProfile() 
            : await profileApi.getTeacherProfile();
          
          const p = res.data.data;
          setFormData({
            firstName: p.firstName,
            lastName: p.lastName,
            phone: p.phone || "",
            language: p.language || "French",
            rank: p.rank || "",
            subject: p.subject || "",
            schoolLevel: p.schoolLevel || "",
            delegationId: p.delegation.id,
            dependencyId: p.dependency.id,
            departmentId: p.department?.id || "",
            etablissementId: p.etablissement?.id || "",
            etablissementIds: p.etablissements?.map(e => e.id) || [],
          });
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }
    }

    loadInitialData();
    loadExistingProfile();
  }, [user, navigate]);

  // Load Dependencies/Departments when Delegation changes
  useEffect(() => {
    if (formData.delegationId) {
      async function loadRegionalData() {
        try {
          const [depRes, deptRes] = await Promise.all([
            profileApi.getDependencies(formData.delegationId),
            profileApi.getDepartments(formData.delegationId),
          ]);
          setDependencies(depRes.data.data);
          setDepartments(deptRes.data.data);
        } catch (err) {
          setError("Failed to load regional data.");
        }
      }
      loadRegionalData();
    }
  }, [formData.delegationId]);

  // Load Etablissements when Dependency or Level changes
  useEffect(() => {
    if (formData.dependencyId) {
      async function loadEtablissements() {
        try {
          const res = await profileApi.getEtablissements(
            formData.dependencyId, 
            user.role === "INSPECTOR" ? formData.schoolLevel : ""
          );
          setEtablissements(res.data.data);
        } catch (err) {
          setError("Failed to load institutions.");
        }
      }
      loadEtablissements();
    }
  }, [formData.dependencyId, formData.schoolLevel, user.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (id) => {
    setFormData((prev) => {
      const exists = prev.etablissementIds.includes(id);
      if (exists) {
        return { ...prev, etablissementIds: prev.etablissementIds.filter((item) => item !== id) };
      } else {
        return { ...prev, etablissementIds: [...prev.etablissementIds, id] };
      }
    });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (user.role === "INSPECTOR") {
        res = user.profileCompleted 
          ? await profileApi.updateInspectorProfile(formData)
          : await profileApi.completeInspectorProfile(formData);
      } else {
        res = user.profileCompleted
          ? await profileApi.updateTeacherProfile(formData)
          : await profileApi.completeTeacherProfile(formData);
      }

      setSuccess("Profile saved successfully! Redirecting...");
      
      // Update local storage user state
      const updatedUser = { ...user, profileCompleted: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate(user.role === "INSPECTOR" ? "/inspector" : "/teacher");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.phone;
  const isStep2Valid = user.role === "INSPECTOR" 
    ? (formData.rank && formData.subject && formData.schoolLevel && formData.delegationId && formData.dependencyId && formData.departmentId)
    : (formData.subject && formData.delegationId && formData.dependencyId && formData.etablissementId);
  const isStep3Valid = user.role === "INSPECTOR" ? formData.etablissementIds.length > 0 : true;

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Complete Your Profile</h1>
          <p className="muted">Initial setup to personalize your workspace</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            {[1, 2, user.role === "INSPECTOR" ? 3 : null].filter(Boolean).map((s) => (
              <div 
                key={s} 
                className={`step-dot ${step >= s ? "active" : ""}`}
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  background: step >= s ? "var(--primary)" : "#e5e7eb",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        </header>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={(e) => e.preventDefault()} className="auth-form">
          {step === 1 && (
            <div className="wizard-step">
              <h3 style={{ marginBottom: "1rem" }}>Step 1: Personal Information</h3>
              <div className="form-row">
                <label>
                  First Name
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <label>
                  Last Name
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </label>
              </div>
              <label style={{ marginTop: "1rem" }}>
                Phone Number
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+216 ..." required />
              </label>
              <label style={{ marginTop: "1rem" }}>
                Internal Communication Language
                <select name="language" value={formData.language} onChange={handleChange}>
                  <option value="French">French</option>
                  <option value="Arabic">Arabic</option>
                  <option value="English">English</option>
                </select>
              </label>
              <div className="form-actions" style={{ marginTop: "2rem" }}>
                <button type="button" onClick={nextStep} disabled={!isStep1Valid} style={{ width: "100%" }}>
                  Next Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h3 style={{ marginBottom: "1rem" }}>Step 2: Professional Context</h3>
              
              {user.role === "INSPECTOR" && (
                <div className="form-row">
                  <label>
                    Professional Rank
                    <select name="rank" value={formData.rank} onChange={handleChange} required>
                      <option value="">Select Rank</option>
                      {ranks.map(r => <option key={r.name} value={r.name}>{r.label}</option>)}
                    </select>
                  </label>
                  <label>
                    Primary School Level
                    <select name="schoolLevel" value={formData.schoolLevel} onChange={handleChange} required>
                      <option value="">Select Level</option>
                      {levels.map(l => <option key={l.name} value={l.name}>{l.label}</option>)}
                    </select>
                  </label>
                </div>
              )}

              <label style={{ marginTop: "1rem" }}>
                Teaching Subject
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.name} value={s.name}>{s.label}</option>)}
                </select>
              </label>

              <div className="form-row" style={{ marginTop: "1rem" }}>
                <label>
                  Delegation
                  <select name="delegationId" value={formData.delegationId} onChange={handleChange} required>
                    <option value="">Select</option>
                    {delegations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>
                <label>
                  Regional Dependency
                  <select name="dependencyId" value={formData.dependencyId} onChange={handleChange} disabled={!formData.delegationId} required>
                    <option value="">Select</option>
                    {dependencies.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>
              </div>

              {user.role === "INSPECTOR" ? (
                <label style={{ marginTop: "1rem" }}>
                  Assigned Department
                  <select name="departmentId" value={formData.departmentId} onChange={handleChange} disabled={!formData.delegationId} required>
                    <option value="">Select</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>
              ) : (
                <label style={{ marginTop: "1rem" }}>
                  Primary School (Teacher Assignment)
                  <select name="etablissementId" value={formData.etablissementId} onChange={handleChange} disabled={!formData.dependencyId} required>
                    <option value="">Select School</option>
                    {etablissements.map(e => <option key={e.id} value={e.id}>{e.name} ({e.schoolLevel})</option>)}
                  </select>
                </label>
              )}

              <div className="form-actions" style={{ marginTop: "2rem" }}>
                <button type="button" className="secondary-action-btn" onClick={prevStep}>Back</button>
                {user.role === "INSPECTOR" ? (
                  <button type="button" onClick={nextStep} disabled={!isStep2Valid} style={{ flex: 1 }}>Manage Assignments</button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={!isStep2Valid || loading} style={{ flex: 1 }}>
                    {loading ? "Finalizing..." : "Complete Setup"}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && user.role === "INSPECTOR" && (
            <div className="wizard-step">
              <h3 style={{ marginBottom: "0.5rem" }}>Step 3: School Jurisdictions</h3>
              <p className="muted" style={{ marginBottom: "1.5rem" }}>Select the schools you are responsible for monitoring.</p>
              
              <div style={{ maxHeight: "300px", overflowY: "auto", display: "grid", gap: "0.5rem", padding: "0.5rem", border: "1px solid var(--border-subtle)", borderRadius: "12px" }}>
                {etablissements.length === 0 ? (
                  <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Select a dependency in step 2 to see schools.</p>
                ) : (
                  etablissements.map(e => (
                    <div 
                      key={e.id} 
                      onClick={() => handleMultiSelect(e.id)}
                      style={{ 
                        padding: "0.75rem 1rem", 
                        borderRadius: "10px", 
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: formData.etablissementIds.includes(e.id) ? "var(--primary)" : "transparent",
                        background: formData.etablissementIds.includes(e.id) ? "var(--primary-soft)" : "#f8fafc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{e.name}</div>
                        <small style={{ color: "var(--text-muted)" }}>{e.schoolLevel}</small>
                      </div>
                      {formData.etablissementIds.includes(e.id) && <span style={{ color: "var(--primary)", fontWeight: 800 }}>✓</span>}
                    </div>
                  ))
                )}
              </div>

              <div className="form-actions" style={{ marginTop: "2rem" }}>
                <button type="button" className="secondary-action-btn" onClick={prevStep}>Back</button>
                <button type="button" onClick={handleSubmit} disabled={!isStep3Valid || loading} style={{ flex: 1 }}>
                  {loading ? "Finalizing..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
