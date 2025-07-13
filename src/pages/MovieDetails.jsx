import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchMovie();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      <h2>{movie.title}</h2>
      {movie.movie_poster && (
        <img src={movie.movie_poster} alt={`${movie.title} poster`} />
      )}
      <p><strong>Director:</strong> {movie.director}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Plot Summary:</strong> {movie.plot_summary}</p>
    </div>
  );
}
