import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const location = useLocation();

  const API = process.env.REACT_APP_API_URL; // ✅ Render backend URL

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);

    if (query) {
      searchProducts(query);
    } else {
      fetchProducts();
    }

    fetchCategories();
  }, [location.search]);

  // ✅ GET PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEARCH PRODUCTS
  const searchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/products/search/${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // ✅ ADD TO WISHLIST
  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${API}/wishlist`, { product_id: productId });
      alert('Added to wishlist!');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (productId) => {
    try {
      await axios.post(`${API}/cart`, { product_id: productId, quantity: 1 });
      alert('Added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSortOption('');
    setSearchQuery('');
    fetchProducts();
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const filteredProducts = selectedCategory
    ? sortedProducts.filter(product => product.category === selectedCategory)
    : sortedProducts;

  return (
    <div className="product-list">

      <section className="hero-banner">
        <div className="hero-copy">
          <p className="hero-tag">Flipkart Style E-commerce</p>
          <h1>Latest deals on top brands</h1>
          <p>Discover electronics, fashion, home essentials and more with fast delivery.</p>
        </div>
      </section>

      <div className="main-content">

        <aside className="category-sidebar">
          <h2>Categories</h2>
          <button
            className={selectedCategory === '' ? 'active' : ''}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>

          {categories.map((category, i) => (
            <button
              key={i}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </aside>

        <div className="product-main">

          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (searchQuery.trim() ? searchProducts(searchQuery) : fetchProducts())
              }
            />

            <button
              onClick={() =>
                searchQuery.trim() ? searchProducts(searchQuery) : fetchProducts()
              }
            >
              Search
            </button>

            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
            </select>

            <button className="clear-btn" onClick={clearFilters}>
              Clear
            </button>
          </div>

          <div className="results-count">
            Showing {filteredProducts.length} products
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">

              {filteredProducts.map(product => {
                let images = [];

                try {
                  images =
                    typeof product.image_urls === 'string'
                      ? JSON.parse(product.image_urls)
                      : product.image_urls || [];
                } catch (e) {
                  images = [];
                }

                return (
                  <div key={product.id} className="product-card">

                    <img
                      src={images[0] || 'https://via.placeholder.com/200'}
                      alt={product.name}
                    />

                    <div className="product-meta">
                      <p className="brand">{product.brand}</p>
                      <h3>{product.name}</h3>
                      <p className="price">${product.price}</p>
                    </div>

                    <div className="product-actions">
                      <Link to={`/product/${product.id}`}>View Details</Link>

                      <button onClick={() => addToCart(product.id)}>
                        Add to Cart
                      </button>

                      <button onClick={() => addToWishlist(product.id)}>
                        Wishlist
                      </button>
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;