import React from "react";

const CartSidebar = ({ open, onClose, cart, onRemove, onUpdateQty, cartTotal, onCheckout }) => {
  const savings = cart.reduce((sum, i) => sum + (i.originalPrice - i.salePrice) * i.qty, 0);

  return (
    <div className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">🛒 Your Cart <span className="sidebar-count">{cart.length} items</span></h2>
        <button className="sidebar-close" onClick={onClose}>✕</button>
      </div>

      {cart.length === 0 ? (
        <div className="sidebar-empty">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty!</p>
          <small>Add some flash deals to get started.</small>
        </div>
      ) : (
        <>
          <div className="sidebar-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" onError={(e) => e.target.src = `https://via.placeholder.com/60x60/1a1a2e/fff?text=${encodeURIComponent(item.name[0])}`} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-cat">{item.category}</div>
                  <div className="cart-item-price">₹{item.salePrice.toLocaleString()}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                    <button className="cart-remove" onClick={() => onRemove(item.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()} on this order!</div>
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="cart-total-row">
              <span>Delivery</span>
              <span className="free-delivery">{cartTotal >= 499 ? "FREE" : "₹49"}</span>
            </div>
            <div className="cart-total-row total-row">
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal >= 499 ? 0 : 49)).toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
