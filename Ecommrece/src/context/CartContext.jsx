import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      // Backend returns { cart: { items: [...] } }
      // We map the populated productId details into a flatter structure for the UI
      const rawItems = response.data?.cart?.items || [];
      const mappedItems = rawItems.map(item => ({
        id: item.productId?._id,
        productId: item.productId?._id,
        name: item.productId?.name || 'Luxury Item',
        price: item.productId?.price || 0,
        image: item.productId?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        quantity: item.quantity
      }));
      setCart(mappedItems);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      // If 400 (Token missing), we just keep cart empty
      if (err.response?.status === 400) setCart([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes("Token")) {
        alert("Please login to add items to your bag.");
      } else {
        alert(err.response?.data?.message || "Failed to add item");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
