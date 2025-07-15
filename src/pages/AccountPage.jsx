import useQuery from "../api/useQuery";

export default function AccountPage() {
  const { data, loading, error } = useQuery("/users/me", "me");

  if (loading) return <p>Loading account info...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No user data found.</p>;

  return (
    <div>
      <h1>Welcome, {data.first_name}!</h1>
      <nav>
        <button>Rated Movies</button>
        <button>Watchlist</button>
        <button>Movie Suggestions</button>
      </nav>
    </div>
  );
}
