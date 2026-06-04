import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartSidebar from "./components/CartSidebar";
import WishlistSidebar from "./components/WishlistSidebar";
import CheckoutModal from "./components/CheckoutModal";
import OrdersPage from "./pages/OrdersPage";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      return exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => i.id === id);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.salePrice * i.qty, 0);

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `FD-${Date.now()}`,
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString(),
      status: "Confirmed",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onCartOpen={() => setCartOpen(true)}
            onWishlistOpen={() => setWishlistOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <Home
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isWishlisted}
                  searchQuery={searchQuery}
                />
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<OrdersPage orders={orders} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <CartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQty={updateQty}
            cartTotal={cartTotal}
            onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
          />
          <WishlistSidebar
            open={wishlistOpen}
            onClose={() => setWishlistOpen(false)}
            wishlist={wishlist}
            onRemove={(id) => setWishlist((prev) => prev.filter((i) => i.id !== id))}
            onAddToCart={(p) => { addToCart(p); setWishlistOpen(false); setCartOpen(true); }}
          />
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            cart={cart}
            cartTotal={cartTotal}
            onPlaceOrder={placeOrder}
          />

          {(cartOpen || wishlistOpen || checkoutOpen) && (
            <div className="sidebar-overlay" onClick={() => { setCartOpen(false); setWishlistOpen(false); }} />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
