import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import "../stylesheets/Login.css"

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login, setToken } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const userInfo = await login({ username, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log in to your account</h1>
      <form classname="login-form" action={onLogin}>
        <label className="login-label">
          Username
          <input className="login-input" type="username" name="username" required />
        </label>
        <label className="login-label">
          Password
          <input className="login-input" type="password" name="password" required />
        </label>
        <button className="login-button">Login</button>
        {error && <output>{error}</output>}
      </form>
      <div className="login-register-link">
        <Link className="login-register-link-text" to="/register">Need an account? Register here.</Link>
      </div>
    </div>
  );
}
