import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";


/** A form that allows users to register for a new account */
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
      await register({ firstName, lastName, email, username, password, bio, favoriteGenres: selectedGenres, });
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
    <>
      <h1>Register for an account</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Register</button>
        {error && <output>{error}</output>}
      </form>

      <fieldset>
  <legend>Select exactly 3 favorite genres</legend>
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
  {selectedGenres.length !== 3 && (
    <p style={{ color: "#F85525", fontWeight: "bold" }}>
      Please select exactly 3 genres.
    </p>
  )}
</fieldset>

      <Link to="/login">Already have an account? Log in here.</Link>

      
    </>
  );
}
