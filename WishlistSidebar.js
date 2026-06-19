import React from "react";

const WishlistSidebar = ({ open, onClose, wishlist, onRemove, onAddToCart }) => {
  return (
    <div className={`sidebar sidebar-right ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">❤️ Wishlist <span className="sidebar-count">{wishlist.length} items</span></h2>
        <button className="sidebar-close" onClick={onClose}>✕</button>
      </div>

      {wishlist.length === 0 ? (
        <div className="sidebar-empty">
          <div className="empty-icon">❤️</div>
          <p>Your wishlist is empty!</p>
          <small>Tap the heart on any product to save it here.</small>
        </div>
      ) : (
        <div className="sidebar-items">
          {wishlist.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" onError={(e) => e.target.src = `https://via.placeholder.com/60x60/1a1a2e/fff?text=${encodeURIComponent(item.name[0])}`} />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-cat">{item.category}</div>
                <div className="cart-item-price">
                  ₹{item.salePrice.toLocaleString()}
                  <span className="wishlist-orig">₹{item.originalPrice.toLocaleString()}</span>
                  <span className="wishlist-save">-{item.discount}%</span>
                </div>
                <div className="wishlist-actions">
                  <button className="wishlist-add-cart" onClick={() => onAddToCart(item)}>🛒 Add to Cart</button>
                  <button className="wishlist-remove" onClick={() => onRemove(item.id)}>🗑 Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSidebar;
