import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useApi } from "../api/ApiContext";
import "../stylesheets/MovieDetails.css"

function useCurrentUser() {
  const { data: me } = useQuery("/users/me", "me");
  return me;
}

export default function MovieDetails() {
  const { id } = useParams();
  const { request } = useApi();
  const me = useCurrentUser();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [userRatingId, setUserRatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  // When the page loads, this fetches everything needed for this movie
  useEffect(() => {
    async function fetchAll() {
      setReviewsLoading(true);
  
      try {
        // Movie info
        const res = await fetch(`https://capstone-backend-w0dr.onrender.com/api/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const results = await res.json();
        setMovie(results);
  
        // Watchlist status
        const userWatchlist = await request("/watchlist");
        let foundInWatchlist = false;
        for (let i = 0; i < userWatchlist.length; i++) {
          if (userWatchlist[i].id === Number(id)) {
            foundInWatchlist = true;
          }
        }
        setInWatchlist(foundInWatchlist);
  
        // User's rating for this movie
        const ratings = await request("/ratings/me");
        let foundRating = null;
        for (let i = 0; i < ratings.length; i++) {
          if (ratings[i].id === Number(id)) {
            foundRating = ratings[i];
          }
        }
        if (foundRating) {
          setUserRating(foundRating.rating);
          setUserRatingId(foundRating.rating_id);
        } else {
          setUserRating(null);
          setUserRatingId(null);
        }
  
        // Movie reviews
        const fetchedReviews = await request(`/reviews/${id}`);
        setReviews(fetchedReviews || []);
      } catch (err) {
        setError(err.message);
      }
      setReviewsLoading(false);
    }
  
    fetchAll();
  }, []);
  

  // adding/removing the movie from user's watchlist
  const { mutate: addToWatchlist } = useMutation("POST", "/watchlist", [
    "watchlist",
  ]);
  const { mutate: removeFromWatchlist } = useMutation(
    "DELETE",
    `/watchlist/${id}`,
    ["watchlist"]
  );
  const toggleWatchlist = async () => {
    if (inWatchlist) {
      await removeFromWatchlist();
      setInWatchlist(false);
    } else {
      await addToWatchlist({ movieId: id });
      setInWatchlist(true);
    }
  };

  // thumbs up/down, or removes the rating
  const { mutate: rateMovie } = useMutation("POST", "/ratings", ["ratings"]);
  const handleRating = async (liked) => {
    const newRating = userRating === liked ? null : liked;
    setUserRating(newRating);

    console.log(
      newRating === null
        ? "rating removed"
        : liked
        ? "movie liked"
        : "movie disliked"
    );

    if (newRating === null) {
      // removes the rating if toggled off
      if (userRatingId) {
        await request(`/ratings/${userRatingId}`, { method: "DELETE" });
        setUserRatingId(null);
      }
    } else {
      // adds or updates the rating
      const success = await rateMovie({ movieId: id, rating: liked });
      if (success) {
        setUserRatingId(success.rating_id);
      }
    }
  };

  const { mutate: leaveReview } = useMutation("POST", "/reviews", [
    `reviews-${id}`,
  ]);
  const submitReview = async () => {
    const result = await leaveReview({ movieId: id, content: reviewContent });
    if (result) {
      setShowModal(false);
      setReviewContent("");
      setReviews((await request(`/reviews/${id}`)) || []);
    }
  };
  const handleDeleteReview = async (reviewId) => {
    await request(`/reviews/${reviewId}`, { method: "DELETE" });
    setReviews((await request(`/reviews/${id}`)) || []);
  };

  let formattedDate = "";
  if (movie?.release_date) {
    const dateObj = new Date(movie.release_date);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const { mutate: followUser } = useMutation("POST", "/followers", [
    "followers",
  ]);
  const { mutate: unfollowUser } = useMutation("DELETE", "/followers", [
    "followers",
  ]);

  const toggleFollow = async (userId) => {
    if (following.includes(userId)) {
      await unfollowUser({ userId });
      setFollowing(following.filter((id) => id !== userId));
    } else {
      await followUser({ userId });
      setFollowing([...following, userId]);
    }
  };

  if (error) return <p>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      <h2 className="movie-title">{movie.title}</h2>
      {movie.movie_poster && (
        <img className="movie-poster" src={movie.movie_poster} />
      )}
      <p className="movie-director"><strong className="director">Director:</strong> {movie.director}</p>
      <p className="movie-genre"><strong className="genre">Genre:</strong> {movie.genres}</p>
      <p className="movie-release-date"><strong className="release-date">Release Date:</strong> {formattedDate || "Unknown"}</p>
      <p className="movie-plot-summary"><strong className="plot">Plot Summary:</strong> {movie.plot_summary}</p>

      <button className="watchlist-btn" onClick={toggleWatchlist}>
        {inWatchlist ? "✓ In Watchlist" : "Add to Watchlist"}
      </button>

      <div className="rating-buttons">
        <p className="rate-this-movie">Rate this movie:</p>
        <button
          className={userRating === true ? "rating-btn selected" : "rating-btn"}
          onClick={() => handleRating(true)}
        >👍</button>

        <button
          className={userRating === false ? "rating-btn selected" : "rating-btn"}
          onClick={() => handleRating(false)}
        >👎</button>
      </div>

      <div className="leave-review">
        <button className="leave-review-btn" onClick={() => setShowModal(true)}>Leave a Review</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="leave-a-review-title">Leave a Review</h3>
            <textarea
              className="review-textarea"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
            <button className="modal-submit-review-btn" onClick={submitReview}>Submit</button>
            <button className="modal-cancel-review-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="reviews-section">
        <h3 className="reviews-title">Reviews:</h3>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : (
          reviews.map((review) => {
            const isOwnReview =
              me &&
              (review.user_id === me.id || review.username === me.username);
            return (
              <div key={review.id} className="review-box">
                <p className="review-username-area"><strong className="review-username">{review.username}:</strong> {review.content}</p>
                {me && review.user_id !== me.id && (
                  <button className="follow-btn" onClick={() => toggleFollow(review.user_id)}>
                    {following.includes(review.user_id) ? "Unfollow" : "Follow"}
                  </button>
                )}

                {isOwnReview && (
                  <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}