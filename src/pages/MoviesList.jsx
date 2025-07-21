import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../stylesheets/MoviesList.css";

export default function MoviesList() {
  const { token } = useAuth();
  const isAuthenticated = !!token;
  const [moviesList, setMoviesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/movies" && !token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch("https://capstone-backend-w0dr.onrender.com/api/movies");
      const movieListData = await res.json();
      setMoviesList(movieListData);
    };
    fetchMovies();
  }, []);

  // Filter movies by title or genres
  const filteredMovies = moviesList.filter((movie) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      movie.title.toLowerCase().includes(lowerSearch) ||
      movie.genres.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="movie-list-component component-bg-color">
      <h2 className="h2-movie-catalog component-bg-color">Movie Catalog</h2>
      <input
        type="text"
        placeholder="Search by title or genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="movies-search-bar"
      />
      {/* Render login message ONCE, outside the map */}
      {!isAuthenticated && (
                    <p className="log-in-text component-bg-color">Log-in or Sign up for your Leisure Buddy movie recommendation and social experience!</p>
                  )}
      <ul className="movies-grid">
        {filteredMovies.map((movie) => (
          <li className="movie-card" key={movie.id}>
            <img className="movie-card-poster" src={movie.movie_poster} alt={`${movie.title} poster`} />
            <div className="movie-card-title">{movie.title}</div>
            <div className="movie-card-genre">{movie.genres}</div>
            {isAuthenticated && (
                <Link className="movie-card-details-link" to={`/movies/${movie.id}`}>
                View Movie Details
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
