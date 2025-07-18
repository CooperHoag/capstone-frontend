import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "/src/movies-list.css";

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
    <div className="movie-list-component">
      
      <input 
        className="movies-list-search"
        type="text"
        placeholder="Search by title or genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "6px", width: "25%" }}
      />
      
      <h2>Movie Catalog</h2>

      {!isAuthenticated && (
              <p style={{ color: 'gray' }}>Log in to view movie details</p>
            )}

      <ul className="list-of-movies">

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
