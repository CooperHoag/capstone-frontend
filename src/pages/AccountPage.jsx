import { useState } from "react";
import useQuery from "../api/useQuery";
import RemoveFromWatchlistButton from "../pages/RemoveFromWatchlistButton";

export default function AccountPage() {
  const { data: user, loading, error } = useQuery("/users/me", "me");
  const [activeTab, setActiveTab] = useState("suggestions");

  const { data: watchlist = [], loading: loadingWatchlist, refetch: refetchWatchlist } = useQuery("/watchlist", "watchlist");
  const { data: ratedMovies = [], loading: loadingRated } = useQuery("/ratings/me", "rated-movies");
  const [ratedFilter, setRatedFilter] = useState("all");

  let filteredRated = ratedMovies;
  if (ratedFilter === "liked") filteredRated = ratedMovies.filter(m => m.rating === true);
  if (ratedFilter === "disliked") filteredRated = ratedMovies.filter(m => m.rating === false);

  
  function handleRemovedFromWatchlist(movieId) {
    // Remove the movie locally from the watchlist
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
    watchlist.splice(0, watchlist.length, ...updatedWatchlist);
    refetchWatchlist(); // Refetch the watchlist for data consistency
  }

  if (loading) return <p>Loading account info...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("rated")}>Rated Movies</button>
        <button onClick={() => setActiveTab("watchlist")}>Watchlist</button>
        <button onClick={() => setActiveTab("suggestions")}>Movie Suggestions</button>
      </nav>

      {/* Rated Movies Tab */}
      {activeTab === "rated" && (
        <section>
          <h2>Your Rated Movies</h2>
          <label>
            Show:&nbsp;
            <select value={ratedFilter} onChange={e => setRatedFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="liked">👍 Liked</option>
              <option value="disliked">👎 Disliked</option>
            </select>
          </label>
          {loadingRated ? <p>Loading...</p> : (
            filteredRated.length === 0 ? (
              <p>
                Welcome {user.first_name}! You have not rated any movies yet!{" "}
                <a href="/movies">Click HERE to see movie list.</a>
              </p>
            ) : (
              <ul>
                {filteredRated.map(movie => (
                  <li key={movie.rating_id || `${movie.id}-${movie.rating}`}>
                    <strong>{movie.title}</strong> ({movie.genres})<br />
                    {movie.rating === true ? "👍" : "👎"}<br />
                    <em>{movie.plot_summary}</em>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      )}

      {/* Watchlist Tab */}
      {activeTab === "watchlist" && (
        <section>
          <h2>Your Watchlist</h2>
          {loadingWatchlist ? <p>Loading...</p> : (
            watchlist.length === 0 ? (
              <p>Your watchlist is empty!</p>
            ) : (
              <ul>
                {watchlist.map(movie => (
                  <li key={movie.id} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <div>
                      <strong>{movie.title}</strong> ({movie.genres})<br />
                      <em>{movie.plot_summary}</em>
                    </div>
                    <RemoveFromWatchlistButton movie={movie} onRemoved={handleRemovedFromWatchlist} refetchWatchlist={refetchWatchlist} />
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      )}

      {/* Suggestions Tab */}
      {activeTab === "suggestions" && (
        <section>
          <h2>Movie Suggestions (Coming Soon)</h2>
          <p>This will show movie suggestions based on your preferences.</p>
        </section>
      )}
    </div>
  );
}

