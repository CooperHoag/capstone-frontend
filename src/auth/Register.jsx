import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register, setToken } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (formData) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const bio = formData.get("bio");
    const profileImageUrl = formData.get("profileImageUrl");
    try {
      const response = await register({ firstName, lastName, email, username, password, bio, profileImageUrl });

      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Register for an account</h1>
      <form action={onRegister}>
        <label>
          First Name
          <input type="text" name="firstName" required />
        </label>
        <label>
          Last Name
          <input type="text" name="lastName" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <label>
          Bio
          <textarea name="bio" />
        </label>
        <label>
          Profile Image
          <input type="url" name="profileImageUrl" />
        </label>
        <button type="submit">Register</button>
        {error && <output>{error}</output>}
      </form>
      <Link to="/login">Already have an account? Log in here.</Link>
    </>
  );
}
