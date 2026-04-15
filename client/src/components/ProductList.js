import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const location = useLocation();

  const API = process.env.REACT_APP_API_URL;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ GET PRODUCTS
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API]);

  // ✅ SEARCH PRODUCTS
  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products/search/${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API]);

  // ✅ GET CATEGORIES
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [API]);

  // ✅ INITIAL LOAD
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
  }, [location.search, fetchProducts, searchProducts, fetchCategories]);

  // ✅ ADD TO CART
  const addToCart = async (productId) => {
    try {
      await axios.post(`${API}/cart`, { product_id: productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD TO WISHLIST
  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${API}/wishlist`, { product_id: productId });
      alert('Added to wishlist!');
    } catch (err) {
      console.error(err);
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
    ? sortedProducts.filter(p => p.category === selectedCategory)
    : sortedProducts;

  return (
    <div className="product-list">

      <aside className="category-sidebar">
        <h2>Categories</h2>

        <button onClick={() => setSelectedCategory('')}>All</button>

        {categories.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </aside>

      <div className="product-main">

        <div className="filters">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              (searchQuery ? searchProducts(searchQuery) : fetchProducts())
            }
          />

          <button
            onClick={() =>
              searchQuery ? searchProducts(searchQuery) : fetchProducts()
            }
          >
            Search
          </button>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="price-asc">Low to High</option>
            <option value="price-desc">High to Low</option>
            <option value="rating-desc">Top Rated</option>
          </select>

          <button onClick={clearFilters}>Clear</button>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} products
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map(product => {
              let images = [];

              try {
                images =
                  typeof product.image_urls === 'string'
                    ? JSON.parse(product.image_urls)
                    : product.image_urls || [];
              } catch {
                images = [];
              }

              return (
                <div key={product.id} className="product-card">

                  <img
                    src={images[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                  />

                  <h3>{product.name}</h3>
                  <p>{product.brand}</p>
                  <p>${product.price}</p>

                  <div>
                    <Link to={`/product/${product.id}`}>View</Link>
                    <button onClick={() => addToCart(product.id)}>Cart</button>
                    <button onClick={() => addToWishlist(product.id)}>Wishlist</button>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default ProductList;