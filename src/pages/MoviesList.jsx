import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


export default function MoviesList() {
  const { token } = useAuth(); // Access the auth token from context
  const isAuthenticated = !!token; // Convert token toboolean (true if exists)
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((movieListData) => {
        setMoviesList(movieListData); // Store movie list in state
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="movieLine">
      <h2>Movie Catalog</h2>
      <ul>
        {moviesList.map((movie) => (
          <li key={movie.id}>
            {movie.title} - {movie.genres}
            {/* Only show a request to log in if user is not logged in */}
            {!isAuthenticated && <p style={{ color: 'gray' }}>Log in to view movie details</p>}
            {/* Only show link if user is authenticated */}
            {isAuthenticated && (
              <Link to={`/movies/${movie.id}`} style={{ marginLeft: '10px' }}>
                View Movie Details
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
