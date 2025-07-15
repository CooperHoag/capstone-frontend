import { NavLink, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>Leisure Buddy</p>
      </NavLink>
      <nav>
        {token ? (
          <>
            <NavLink to="/movies">See All Movies</NavLink>
            <NavLink to="/account">Account</NavLink>
            <button onClick={() => { logout(); navigate("/"); }}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Sign Up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
