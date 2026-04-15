import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleCartUpdate = () => fetchCartCount();
    const handleWishlistUpdate = () => fetchWishlistCount();
    const handleAuth = () => {
      const updatedUser = localStorage.getItem('loggedInUser');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('authChanged', handleAuth);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('authChanged', handleAuth);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearch(query);
  }, [location.search]);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart');
      setCartCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/wishlist');
      setWishlistCount(response.data.length);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Flipkart Clone</Link>
      </div>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products, brands and more"
        />
        <button type="submit">Search</button>
      </form>
      <div className="header-right">
        <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user && <Link to="/orders">Orders</Link>}
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login / Signup</Link>
        )}
      </div>
    </header>
  );
};

export default Header;