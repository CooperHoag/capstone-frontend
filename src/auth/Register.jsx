import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../stylesheets/Register.css";

export default function Register() {
  const { register, setToken } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Sci-Fi"];

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length < 3
        ? [...prev, genre]
        : prev
    );
  };

  const onRegister = async (formData) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const bio = formData.get("bio");

    try {
      await register({
        firstName,
        lastName,
        email,
        username,
        password,
        bio,
        favoriteGenres: selectedGenres,
      });
      navigate("/");
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (selectedGenres.length !== 3) {
      setError("Please select exactly 3 genres.");
      return;
    }

    onRegister(formData);
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register for an account</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">
          First Name
          <input className="register-input" type="text" name="firstName" required />
        </label>
        <label className="register-label">
          Last Name
          <input className="register-input" type="text" name="lastName" required />
        </label>
        <label className="register-label">
          Email
          <input className="register-input" type="email" name="email" required />
        </label>
        <label className="register-label">
          Username
          <input className="register-input" type="text" name="username" required />
        </label>
        <label className="register-label">
          Password
          <input className="register-input" type="password" name="password" required />
        </label>
        <label className="register-label">
          Bio
          <textarea className="register-input register-bio" name="bio" />
        </label>
        
      

      <fieldset className="genre-fieldset">
        <legend className="genre-legend">Select your top 3 favorite genres</legend>
        <div className="genre-options">
          {genres.map((genre) => (
            <label
              key={genre}
              className={
                selectedGenres.includes(genre)
                  ? "genre-label selected"
                  : "genre-label"
              }
            >
              <input
                type="checkbox"
                value={genre}
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
              />
              {genre}
            </label>
          ))}
        </div>
        {/* {selectedGenres.length !== 3 && (
          <div className="register-error genre-error">
            Please select exactly 3 genres.
          </div>
        )} */}
      </fieldset>
      <button className="register-button" type="submit">Register</button>
        {error && <div className="register-error">{error}</div>}
      </form>
      <div className="register-login-link">
        <Link className="register-login-link-text" to="/login">Already have an account? Log in here.</Link>
      </div>
    </div>
  );
}
