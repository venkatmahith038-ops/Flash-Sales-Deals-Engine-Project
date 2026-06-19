import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ cartCount, wishlistCount, onCartOpen, onWishlistOpen, searchQuery, onSearchChange }) => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-bolt">⚡</span>
          <span className="logo-text">FlashDeals</span>
        </Link>

        <div className="nav-center">
          <div className="nav-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search flash deals..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => onSearchChange("")}>✕</button>
            )}
          </div>
        </div>

        <div className="nav-right">
          <Link to="/" className="nav-link">Deals</Link>

          {isLoggedIn && (
            <Link to="/orders" className="nav-link">My Orders</Link>
          )}

          {isLoggedIn ? (
            <div className="nav-user">
              <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {menuOpen && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/orders" className="menu-item" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                  <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </div>
          )}

          <button className="wishlist-btn" onClick={onWishlistOpen}>
            ❤️
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </button>

          <button className="cart-btn" onClick={onCartOpen}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
