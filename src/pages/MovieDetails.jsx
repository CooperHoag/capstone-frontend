import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";
import useMutation from "../api/useMutation";

export default function MovieDetails() {
  const { id } = useParams();
  const { request } = useApi();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  // State to track if this movie is in the user's watchlist
  const [inWatchlist, setInWatchlist] = useState(false);

  // Define API mutations for adding and removing from watchlist
  const { mutate: addToWatchlist } = useMutation("POST", "/watchlist", [
    "watchlist",
  ]);
  const { mutate: removeFromWatchlist } = useMutation(
    "DELETE",
    `/watchlist/${id}`,
    ["watchlist"]
  );

  useEffect(() => {
    // Fetch the movie details using the ID from the URL
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data); // Save movie info to state
      } catch (err) {
        setError(err.message);
      }
    }

    // Fetch the user's watchlist and check if this movie is in it
    async function fetchWatchlistStatus() {
      try {
        const userWatchlist = await request("/watchlist");
        // Check if the current movie ID is in the user's watchlist
        setInWatchlist(
          userWatchlist.some((entry) => entry.id === parseInt(id))
        );
      } catch (err) {
        console.error("Failed to load watchlist status");
      }
    }

    // Run both functions when the component loads
    fetchMovie();
    fetchWatchlistStatus();
  }, [id]);

  // Handle the button click to toggle watchlist status
  const toggleWatchlist = async () => {
    if (inWatchlist) {
      // If movie is already in the watchlist → remove it
      await removeFromWatchlist();
      setInWatchlist(false);
    } else {
      // If movie is not in the watchlist → add it
      await addToWatchlist({ movieId: id });
      setInWatchlist(true);
    }
  };

  // Show error if there was a problem loading the movie
  if (error) return <p>{error}</p>;
  // Show loading message until the movie data is ready
  if (!movie) return <p>Loading...</p>;

  // Main UI
  return (
    <div>
      <h2>{movie.title}</h2>

      {movie.movie_poster && (
        <img src={movie.movie_poster} alt={`${movie.title} poster`} />
      )}

      <p>Director: {movie.director}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Plot Summary: {movie.plot_summary}</p>

      {/* Watchlist toggle button */}
      <button onClick={toggleWatchlist}>
        {inWatchlist ? "✓ In Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
}
