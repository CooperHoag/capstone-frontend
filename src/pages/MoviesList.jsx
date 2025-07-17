import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function MoviesList() {
  const { token } = useAuth();
  const isAuthenticated = !!token;
  const [moviesList, setMoviesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Optional: Only restrict /movies (not homepage)
  useEffect(() => {
    if (window.location.pathname === "/movies" && !token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch("http://localhost:3000/api/movies");
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
    <div className="movieLine">
      <h2>Movie Catalog</h2>

      <input
        type="text"
        placeholder="Search by title or genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "6px", width: "25%" }}
      />

      <ul>
        {filteredMovies.map((movie) => (
          <li key={movie.id}>
            {movie.title} - {movie.genres}
            {!isAuthenticated && (
              <p style={{ color: 'gray' }}>Log in to view movie details</p>
            )}
            {isAuthenticated && (
              <Link to={`/movies/${movie.id}`} style={{ marginLeft: '10px' }}>
                <button>View Movie Details</button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
