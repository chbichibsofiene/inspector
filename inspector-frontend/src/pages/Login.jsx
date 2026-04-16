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
      <div className="auth-card">
        <h1>Inspector Platform</h1>
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

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
  );
}

