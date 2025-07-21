import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useQuery from "../api/useQuery";
import "../stylesheets/AccountPage.css";

const suggestions = [
  {
    id: 2, 
    title: "Batman Begins",
    genre: "Action",
    poster: "https://th.bing.com/th/id/OIP.N3ovIsICeEFj3oXwNlxcXAHaEK?w=329&h=185&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3",
  },
  {
    id: 40, 
    title: "Superbad",
    genre: "Comedy",
    poster: "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
  },
  {
    id: 26,
    title: "Mad Max: Fury Road",
    genre: "Action",
    poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  },
  {
    id: 1,
    title: "The Notebook",
    genre: "Romance",
    poster: "https://th.bing.com/th/id/OIP.SdcmSGzsBZN5yogbxWqqLgHaHa?w=185&h=185&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3",
  },
  {
    id: 31,
    title: "Die Hard",
    genre: "Action",
    poster: "https://filmartgallery.com/cdn/shop/files/Die-Hard-Vintage-Movie-Poster-Original_b2d11d4a_600x.jpg?v=1741144345",
  },
  {
    id: 70,
    title: "The Big Lebowski",
    genre: "Comedy",
    poster: "https://i.ebayimg.com/images/g/S58AAOSwOyJX31n6/s-l1600.webp",
  },
  {
    id: 30,
    title: "La La Land",
    genre: "Romance",
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  },
  {
    id: 39,
    title: "Groundhog Day",
    genre: "Comedy",
    poster: "https://i.ebayimg.com/images/g/SNgAAOSwWYtkVDVT/s-l1600.webp",
  },
];

export default function AccountPage() {
  const { data: user, loading, error } = useQuery("/users/me", "me");
  const [activeTab, setActiveTab] = useState("suggestions");

  const { data: watchlist = [], loading: loadingWatchlist, refetch: refetchWatchlist } = useQuery("/watchlist", "watchlist");
  const { data: ratedMovies = [], loading: loadingRated } = useQuery("/ratings/me", "rated-movies");
  const [ratedFilter, setRatedFilter] = useState("all");

  let filteredRated = ratedMovies;
  if (ratedFilter === "liked") filteredRated = ratedMovies.filter(m => m.rating === true);
  if (ratedFilter === "disliked") filteredRated = ratedMovies.filter(m => m.rating === false);

  
  async function handleDeleteWatchlist(movieId) {
    await fetch(`https://capstone-backend-w0dr.onrender.com/api/watchlist/${movieId}`, {
      method: "DELETE",
      credentials: "include",
    });
    refetchWatchlist();
  }  

  if (loading) return <p>Loading account info...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="account-page">
      <h1 className="welcome-user">Welcome, {user.first_name}!</h1>
      <nav className="account-tabs">
        <button className={activeTab === "rated" ? "tab-btn active" : "tab-btn"} 
        onClick={() => setActiveTab("rated")}>Rated Movies</button>
        <button className={activeTab === "watchlist" ? "tab-btn active" : "tab-btn"} 
        onClick={() => setActiveTab("watchlist")}>Watchlist</button>
        <button className={activeTab === "suggestions" ? "tab-btn active" : "tab-btn"} 
        onClick={() => setActiveTab("suggestions")}>Movie Suggestions</button>
      </nav>

      {activeTab === "rated" && (
        <section className="each-section">
          <h2 className="each-section-title">Your Rated Movies</h2>
          <label className="filter-name">
            Show:&nbsp;
            <select value={ratedFilter} 
            onChange={event => setRatedFilter(event.target.value)}
            className="filter-dropdown">
              <option value="all">All</option>
              <option value="liked">👍 Liked</option>
              <option value="disliked">👎 Disliked</option>
            </select>
          </label>
          {loadingRated ? <p>Loading...</p> : (
            filteredRated.length === 0 ? (
              <p className="no-movies-in-rated">
                Hey there {user.first_name}! You have not rated any movies yet!{" "}
                <a className="see-movie-list-link" href="/movies">See movie list.</a>
              </p>
            ) : (
              <ul className="account-movies-list">
                {filteredRated.map(movie => (
                  <li key={movie.rating_id || `${movie.id}-${movie.rating}`} className="movie-item-box">
                    <div className="movie-poster-col">
                      <img className="account-movie-poster" src={movie.movie_poster} />
                    </div>
                    <div className="movie-info-col">
                      <strong className="account-movie-title">{movie.title}</strong> 
                      <span className="account-movie-genre">({movie.genres})</span>
                      <span className="account-movie-rating">{movie.rating === true ? "👍" : "👎"}</span>
                      <em className="account-movie-plot">{movie.plot_summary}</em>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      )}

      {activeTab === "watchlist" && (
        <section className="each-section">
          <h2 className="each-section-title">Your Watchlist</h2>
          {loadingWatchlist ? <p>Loading...</p> : (
            watchlist.length === 0 ? (
              <p className="no-movies-in-rated">Your watchlist is empty!{" "}
              <a className="see-movie-list-link" href="/movies">See movie list.</a>
              </p>
            ) : (
              <ul className="account-movies-list">
                {watchlist.map(movie => (
                  <li key={movie.id} className="movie-item-box">
                    <div className="movie-poster-col">
                      <img className="account-movie-poster" src={movie.movie_poster} />
                    </div>
                    <div className="movie-info-col">
                      <strong className="account-movie-title">{movie.title}</strong> 
                      <span className="account-movie-genre">({movie.genres})</span>
                      <em className="account-movie-plot">{movie.plot_summary}</em>
                      <button className="delete-btn" onClick={() => handleDeleteWatchlist(movie.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      )}

      {activeTab === "suggestions" && (
        <section className="each-section">
          <h2 className="each-section-title">Your Personalized Movie Suggestions</h2>
          <div className="suggestion-grid">
            {suggestions.map((movie, i) => (
              <div className="suggestion-movie-box" key={i}>
                <img className="suggestion-movie-poster" src={movie.poster} alt={movie.title} />
                <div className="suggestion-movie-title">{movie.title}</div>
                <div className="suggestion-movie-genre">{movie.genre}</div>
                <Link className="movie-details-button-suggestions" to={`/movies/${movie.id}`}>View Movie Details</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
