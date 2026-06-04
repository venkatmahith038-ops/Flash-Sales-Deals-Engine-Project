import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CountdownTimer from "../components/CountdownTimer";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Electronics", "Footwear", "Fashion", "Wearables", "Kitchen", "Computers", "Photography", "Furniture", "Mobile", "Home"];

const Home = ({ onAddToCart, onToggleWishlist, isWishlisted, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("discount");
  const { isLoggedIn, user } = useAuth();

  const flashSaleEnd = useState(() => Date.now() + 11 * 3600000 + 23 * 60000 + 45000)[0];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?category=${category}&sort=${sort}`);
        setProducts(data);
      } catch {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, sort]);

  // Filter by search query
  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.badge.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="home">
      {/* ── HERO BANNER ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">⚡ FLASH SALE LIVE NOW</div>
          <h1 className="hero-title">
            Deals So Hot,<br />They <span className="hero-accent">Expire Fast</span>
          </h1>
          <p className="hero-sub">Up to 70% off on 100+ top brands. Limited time only!</p>
          <div className="hero-timer-wrap">
            <span className="hero-timer-label">🔥 Today's Big Sale ends in:</span>
            <CountdownTimer endsIn={flashSaleEnd} />
          </div>
          {!isLoggedIn && (
            <a href="/register" className="hero-cta">Get Early Access →</a>
          )}
          {isLoggedIn && (
            <div className="hero-welcome">👋 Welcome back, {user.name}! Grab your deals!</div>
          )}
        </div>
        <div className="hero-stats">
          <div className="stat"><span>16+</span><small>Live Deals</small></div>
          <div className="stat"><span>70%</span><small>Max Discount</small></div>
          <div className="stat"><span>50K+</span><small>Happy Buyers</small></div>
          <div className="stat"><span>Free</span><small>Delivery ₹499+</small></div>
        </div>
      </section>

      {/* ── PROMO STRIP ── */}
      <div className="promo-strip">
        <span>🚚 Free Delivery on orders above ₹499</span>
        <span>•</span>
        <span>🔄 Easy 30-day Returns</span>
        <span>•</span>
        <span>🔒 100% Secure Payments</span>
        <span>•</span>
        <span>⚡ New deals every hour</span>
      </div>

      {/* ── SEARCH RESULTS BANNER ── */}
      {searchQuery && (
        <div className="search-results-banner">
          <span>🔍 Showing results for "<strong>{searchQuery}</strong>" — {filteredProducts.length} deal{filteredProducts.length !== 1 ? "s" : ""} found</span>
        </div>
      )}

      {/* ── CATEGORIES ── */}
      {!searchQuery && (
        <section className="categories-section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── FILTERS ── */}
      <div className="filter-bar">
        <span className="results-count">{filteredProducts.length} deals found</span>
        <div className="sort-group">
          <span>Sort by:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="discount">Biggest Discount</option>
            <option value="price">Lowest Price</option>
            <option value="expiry">Ending Soon</option>
          </select>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <section className="products-section">
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No deals found for "{searchQuery}"</h3>
            <p>Try searching for Electronics, Fashion, Mobile, or a product name.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">⚡ FlashDeals</div>
        <p>© 2024 FlashDeals. All rights reserved. Best flash deals in India.</p>
        <div className="footer-links">
          <span>About</span><span>Privacy</span><span>Terms</span><span>Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
