import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/wishlist');
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      await Promise.all(wishlistItems.map((item) => axios.delete(`http://localhost:5000/wishlist/${item.id}`)));
      fetchWishlist();
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/wishlist/${id}`);
      fetchWishlist();
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const moveToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/cart', { product_id: productId, quantity: 1 });
      await axios.delete(`http://localhost:5000/wishlist/${productId}`);
      fetchWishlist();
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  return (
    <div className="wishlist">
      <h1>My Wishlist</h1>
      <div className="wishlist-toolbar">
        <Link to="/" className="continue-link">Continue Shopping</Link>
        {wishlistItems.length > 0 && (
          <button className="clear-btn" onClick={clearWishlist}>Clear Wishlist</button>
        )}
      </div>
      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(product => (
            <div key={product.id} className="wishlist-item">
              <img src={product.image_urls ? JSON.parse(product.image_urls)[0] : 'https://via.placeholder.com/200'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <div className="wishlist-actions">
                <Link to={`/product/${product.id}`}>View Details</Link>
                <button onClick={() => moveToCart(product.id)}>Move to Cart</button>
                <button onClick={() => removeFromWishlist(product.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;