import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "../stylesheets/Navbar.css"

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar" id="navbar">
      <NavLink className="navbar-logo" id="brand" to="/">
        <p className="leisure-buddy-nb">Leisure Buddy</p>
      </NavLink>
      <nav className="navbar-links">
        {token ? (
          <>
            <NavLink className="see-all-movies-nb" to="/movies">See All Movies</NavLink>
            <NavLink className="account-nb" to="/account">Account</NavLink>
            <button className="logout-nb" onClick={() => { logout(); navigate("/"); }}>Log out</button>
          </>
        ) : (
          <>
            <NavLink className="login-nb" to="/login">Log in</NavLink>
            <NavLink className="register-nb" to="/register">Sign Up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
