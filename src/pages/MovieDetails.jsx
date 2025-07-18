import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useApi } from "../api/ApiContext";

function useCurrentUser() {
  const { data: me } = useQuery("/users/me", "me");
  return me;
}

export default function MovieDetails() {
  // Get the movie ID from the URL
  const { id } = useParams();
  const { request } = useApi();
  const me = useCurrentUser();

  // State for all the info and UI controls on the page
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

  // When the component loads, fetch everything needed for this movie
  useEffect(() => {
    // Fetch movie details, user's watchlist status, user's rating, and reviews
    async function fetchAll() {
      try {
        // Movie info
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const results = await res.json();
        console.log(results);
        setMovie(results);

        // Watchlist status
        const userWatchlist = await request("/watchlist");
        setInWatchlist(
          userWatchlist.some((entry) => entry.id === parseInt(id))
        );

        // User's rating for this movie
        const ratings = await request("/ratings/me");
        const rated = ratings.find((r) => r.id === parseInt(id));
        if (rated) {
          setUserRating(rated.rating);
          setUserRatingId(rated.rating_id);
        } else {
          setUserRating(null);
          setUserRatingId(null);
        }

        // Movie reviews
        setReviewsLoading(true);
        setReviews((await request(`/reviews/${id}`)) || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Handle adding/removing movie from user's watchlist
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

  // Handle rating: thumbs up, thumbs down, or remove rating
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
      // Remove the rating if toggled off
      if (userRatingId) {
        await request(`/ratings/${userRatingId}`, { method: "DELETE" });
        setUserRatingId(null);
      }
    } else {
      // Add or update the rating
      const success = await rateMovie({ movieId: id, rating: liked });
      if (success) {
        setUserRatingId(success.rating_id);
      }
    }
  };

  // Handle review pop-up, submit, and delete
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

  // Render everything!
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      <h2>{movie.title}</h2>
      {movie.movie_poster && (
        <img src={movie.movie_poster} alt={`${movie.title} poster`} />
      )}
      <p>
        <strong>Director:</strong> {movie.director}
      </p>
      <p>
        <strong>Release Date:</strong> {formattedDate || "Unknown"}
      </p>
      <p>
        <strong>Plot Summary:</strong> {movie.plot_summary}
      </p>

      <button onClick={toggleWatchlist}>
        {inWatchlist ? "✓ In Watchlist" : "Add to Watchlist"}
      </button>

      <div className="rating-buttons">
        <p>Rate this movie:</p>
        <button
          onClick={() => handleRating(true)}
          style={{
            fontWeight: userRating === true ? "bold" : "normal",
            border: userRating === true ? "2px solid black" : "1px solid gray",
          }}
        >
          👍
        </button>
        <button
          onClick={() => handleRating(false)}
          style={{
            fontWeight: userRating === false ? "bold" : "normal",
            border: userRating === false ? "2px solid black" : "1px solid gray",
          }}
        >
          👎
        </button>
      </div>

      <div className="leave-review">
        <button onClick={() => setShowModal(true)}>Leave a Review</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Leave a Review</h3>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
            <button onClick={submitReview}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="reviews">
        <h3>Reviews:</h3>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : (
          reviews.map((review) => {
            const isOwnReview =
              me &&
              (review.user_id === me.id || review.username === me.username);
            return (
              <div key={review.id} className="review-box">
                <p>
                  <strong>{review.username}:</strong> {review.content}
                </p>

                {/* ✅ Follow/Unfollow button */}
                {me && review.user_id !== me.id && (
                  <button onClick={() => toggleFollow(review.user_id)}>
                    {following.includes(review.user_id) ? "Unfollow" : "Follow"}
                  </button>
                )}

                {isOwnReview && (
                  <button onClick={() => handleDeleteReview(review.id)}>
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
