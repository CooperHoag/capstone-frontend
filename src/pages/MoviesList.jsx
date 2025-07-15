import { useState, useEffect } from "react";

export default function MoviesList() {
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((movieListData) => setMoviesList(movieListData))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="movieLine">
      <h2>Movie Catalog</h2>
      <ul>
        {moviesList.map((movie) => (
          <li key={movie.id}>
            {movie.title} - {movie.genres}
          </li>
        ))}
      </ul>
    </div>
  );
}
