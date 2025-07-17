import { useState } from "react";
import useMutation from "../api/useMutation";
import { useApi } from "../api/ApiContext";

export default function RemoveFromWatchlistButton({ movie, refetchWatchlist }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null); // true, false, or null
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mutations for removing and rating
  const { mutate: removeFromWatchlist } = useMutation(
    "DELETE",
    `/watchlist/${movie.id}`,
    ["watchlist"]
  );
  const { mutate: rateMovie } = useMutation(
    "POST",
    "/ratings",
    ["ratings", "rated-movies"]
  );
  const { request } = useApi();

  // Un-rate if needed
  async function unrateIfExists() {
    if (movie.rating_id) {
      await request(`/ratings/${movie.rating_id}`, { method: "DELETE" });
    }
  }

  async function handleRemoveWithRating() {
    setLoading(true);
    setError(null);
    try {
      if (selectedRating !== null) {
        if (movie.rating === selectedRating) {
          await unrateIfExists();
        } else {
          await rateMovie({ movieId: movie.id, rating: selectedRating });
        }
      }
      await removeFromWatchlist();
      setShowModal(false);
      if (refetchWatchlist) refetchWatchlist(); // Refetch watchlist immediately
    } catch (e) {
      setError(e.message || "Error removing movie.");
    } finally {
      setLoading(false);
      setSelectedRating(null);
    }
  }
  
  async function handleRemoveOnly() {
    setLoading(true);
    setError(null);
    try {
      await removeFromWatchlist();
      setShowModal(false);
      if (refetchWatchlist) refetchWatchlist(); // Refetch watchlist immediately
    } catch (e) {
      setError(e.message || "Error removing movie.");
    } finally {
      setLoading(false);
      setSelectedRating(null);
    }
  }

  // For modal: update selection, allow toggling
  function handleThumb(selected) {
    setSelectedRating((prev) =>
      prev === selected ? null : selected
    );
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Remove
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 2px 12px #0002",
              minWidth: "320px",
              maxWidth: "95vw"
            }}
          >
            <h3 style={{ marginTop: 0 }}>How do you want to rate this movie?</h3>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.25rem" }}>
              <button
                style={{
                  fontSize: "2rem",
                  background: selectedRating === true ? "#d1e7dd" : "#eee",
                  border: selectedRating === true ? "2px solid #198754" : "1px solid #aaa",
                  borderRadius: "0.75rem",
                  width: 64,
                  height: 64,
                  cursor: "pointer",
                  fontWeight: movie.rating === true ? "bold" : undefined,
                }}
                aria-label="Thumbs Up"
                onClick={() => handleThumb(true)}
                disabled={loading}
              >
                👍
              </button>
              <button
                style={{
                  fontSize: "2rem",
                  background: selectedRating === false ? "#f8d7da" : "#eee",
                  border: selectedRating === false ? "2px solid #dc3545" : "1px solid #aaa",
                  borderRadius: "0.75rem",
                  width: 64,
                  height: 64,
                  cursor: "pointer",
                  fontWeight: movie.rating === false ? "bold" : undefined,
                }}
                aria-label="Thumbs Down"
                onClick={() => handleThumb(false)}
                disabled={loading}
              >
                👎
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={handleRemoveWithRating}
                disabled={selectedRating === null || loading}
                style={{
                  background: selectedRating !== null ? "#212529" : "#aaa",
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: selectedRating !== null ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  marginBottom: "0.4rem"
                }}
              >
                Remove from watchlist with rating
              </button>
              <button
                onClick={handleRemoveOnly}
                disabled={loading}
                style={{
                  background: "#eee",
                  color: "#111",
                  borderRadius: "8px",
                  border: "1px solid #bbb",
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                }}
              >
                I did not watch, I just want to remove
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: "1rem",
                  color: "#666",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
                disabled={loading}
              >Cancel</button>
            </div>
            {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
          </div>
        </div>
      )}
    </>
  );
}
