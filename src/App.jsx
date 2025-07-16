import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import MovieDetails from "./pages/MovieDetails";
import MoviesList from "./pages/MoviesList";
import AccountPage from "./pages/AccountPage";
import WatchlistPage from "./pages/WatchListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MoviesList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<WatchlistPage />} />;
      </Route>
    </Routes>
  );
}
