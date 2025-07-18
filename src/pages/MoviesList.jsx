import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "/src/movies-list.css";


export default function MoviesList() {
  const { token } = useAuth(); // Access the auth token from context
  const isAuthenticated = !!token; // Convert token toboolean (true if exists)

  const [moviesList, setMoviesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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