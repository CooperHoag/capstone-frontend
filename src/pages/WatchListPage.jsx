import { useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";
import { Link } from "react-router-dom";

export default function WatchlistPage() {
  const { request } = useApi();
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const data = await request("/watchlist");
        console.log("Watchlist data:", data);
        setWatchlist(data);
      } catch (err) {
        setError("Failed to load watchlist");
      }
    }

    fetchWatchlist();
  }, []);

  if (error) return <p>{error}</p>;
  if (!watchlist.length) return <p>Your watchlist is empty.</p>;

  return (
    <div>
      <h2>Your Watchlist</h2>
      <ul>
        {watchlist.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.movie_poster && (
                <img
                  src={movie.movie_poster}
                  alt={`${movie.title} poster`}
                  style={{ width: "100px", marginRight: "10px" }}
                />
              )}
              {movie.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
