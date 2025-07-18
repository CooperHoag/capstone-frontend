import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

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
      console.log('user token', userInfo);
      setToken(userInfo);

      
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Log in to your account</h1>
      <form action={onLogin}>
        <label>
          Username
          <input type="username" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Login</button>
        {error && <output>{error}</output>}
      </form>
      <Link to="/register">Need an account? Register here.</Link>
    </>
  );
}
