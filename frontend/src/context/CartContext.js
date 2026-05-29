import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (product, qty = 1) => {
    setCart(prev => ({
      ...prev,
      [product._id]: {
        product,
        quantity: (prev[product._id]?.quantity || 0) + qty,
      },
    }));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart(prev => ({ ...prev, [productId]: { ...prev[productId], quantity: qty } }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => { const next = { ...prev }; delete next[productId]; return next; });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <CartContext.Provider value={{ cart, cartItems, cartCount, subtotal, gst, total, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
