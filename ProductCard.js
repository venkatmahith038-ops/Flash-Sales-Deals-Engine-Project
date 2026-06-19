import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer";

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stockPct = Math.min(100, Math.round(((30 - product.stock) / 30) * 100));

  return (
    <div className="product-card">
      <div className="card-badge">{product.badge}</div>
      <button
        className={`wishlist-heart ${isWishlisted ? "wishlisted" : ""}`}
        onClick={() => onToggleWishlist(product)}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>
      <div className="card-img-wrap">
        <img
          src={imgError ? `https://via.placeholder.com/300x220/1a1a2e/ffffff?text=${encodeURIComponent(product.name)}` : product.image}
          alt={product.name}
          className="card-img"
          onError={() => setImgError(true)}
        />
        <div className="card-discount">-{product.discount}%</div>
      </div>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>

        <div className="card-rating">
          {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
          <span className="rating-val">{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="card-prices">
          <span className="price-sale">₹{product.salePrice.toLocaleString()}</span>
          <span className="price-orig">₹{product.originalPrice.toLocaleString()}</span>
          <span className="price-save">Save ₹{(product.originalPrice - product.salePrice).toLocaleString()}</span>
        </div>

        <div className="card-timer-row">
          <span className="timer-label-text">⏱ Ends in:</span>
          <CountdownTimer endsIn={product.endsIn} compact />
        </div>

        <div className="stock-bar-wrap">
          <div className="stock-bar">
            <div className="stock-fill" style={{ width: `${stockPct}%` }} />
          </div>
          <span className="stock-text">
            {product.stock <= 5 ? `🔴 Only ${product.stock} left!` : `✅ ${product.stock} in stock`}
          </span>
        </div>

        <button className={`add-cart-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added!" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
