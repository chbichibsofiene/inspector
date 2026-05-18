import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { saveSession } from "../auth/session";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 2) {
      setShowEasterEgg(true);
      setLogoClicks(0);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      const data = res.data;

      // Backend returns: { success, message, data: { token, tokenType, email, role, userId } }
      const payload = data?.data || data;

      const token = payload?.token;
      const user =
        payload && payload.email && payload.role
          ? {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            profileCompleted: payload.profileCompleted,
          }
          : null;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      saveSession({ token, user });

      switch (user.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "INSPECTOR":
          navigate("/inspector", { replace: true });
          break;
        case "TEACHER":
          navigate("/teacher", { replace: true });
          break;
        case "PEDAGOGICAL_RESPONSIBLE":
          navigate("/responsible", { replace: true });
          break;
        default:
          navigate("/forbidden", { replace: true });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {showEasterEgg && (
        <div className="easter-egg-modal" onClick={() => setShowEasterEgg(false)}>
          <div className="easter-egg-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-easter-egg" onClick={() => setShowEasterEgg(false)}>×</button>
            <div className="easter-egg-header">
              <h3>👨‍💻 Meet the Dev Team</h3>
              <p>Made with ❤️ by these awesome people</p>
            </div>
            <div className="dev-team-list">
              <div className="dev-member">
                <img src="/images/sofien.jpg" alt="Sofien Chbichib" className="dev-avatar" style={{ objectFit: 'cover' }} />
                <div className="dev-info">
                  <h4>Sofien Chbichib</h4>
                  <a href="https://www.linkedin.com/in/sofien-chbichib-b10189253/" target="_blank" rel="noreferrer" className="linkedin-link">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="linkedin-icon"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
              <div className="dev-member">
                <img src="/images/slimen1.jpg" alt="Slimen Bouthour" className="dev-avatar" style={{ objectFit: 'cover' }} />
                <div className="dev-info">
                  <h4>Slimen Bouthour</h4>
                  <a href="https://www.linkedin.com/in/bouthour-slimen-097051230/" target="_blank" rel="noreferrer" className="linkedin-link">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="linkedin-icon"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Decorative Dots */}
      <div className="dot dot-blue"></div>
      <div className="dot dot-green"></div>
      <div className="dot dot-yellow"></div>

      <div className="login-split-container">
        {/* Left Side: Interactive 3D Avatar Illustration */}
        <div className="login-illustration-side">
          <div className="login-illustration-glow"></div>
          <img
            src={showPassword ? "/images/new_hiding_eyes.png" : "/images/new_crossed_hands.png"}
            alt="Interactive Login Illustration"
            className="interactive-login-image"
          />
        </div>

        {/* Right Side: Sign-in Card */}
        <div className="auth-card">
          <div className="login-logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }} title="Double click me for a surprise!">
            <img src="/logo.png" alt="Logo" className="login-logo" />
            <h1>Pedagogical Center</h1>
          </div>
          <h2>Sign in</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-2.956-2.956l-2.64-2.64m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <div className="forgot-password-link">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account yet?{" "}
            <a href="/register">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
}
