import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [recentProducts, setRecentProducts] = useState([]);
  const RECENTLY_VIEWED_KEY = 'recentlyViewed';

  const fetchRecentlyViewed = async (ids) => {
    try {
      const responses = await Promise.all(
        ids.map((productId) => axios.get(`http://localhost:5000/products/${productId}`))
      );
      setRecentProducts(responses.map((response) => response.data));
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.image_urls) {
      const images = JSON.parse(product.image_urls);
      setActiveImage(images[0] || '');
      const storedIds = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      const updatedIds = [product.id, ...storedIds.filter((pid) => pid !== product.id)].slice(0, 5);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedIds));
      const recentIds = updatedIds.filter((pid) => pid !== product.id);
      if (recentIds.length) {
        fetchRecentlyViewed(recentIds);
      } else {
        setRecentProducts([]);
      }
    }
  }, [product]);

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:5000/cart', { product_id: parseInt(id, 10), quantity: 1 });
      alert('Added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async () => {
    try {
      await axios.post('http://localhost:5000/wishlist', { product_id: parseInt(id, 10) });
      alert('Added to wishlist!');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const buyNow = async () => {
    try {
      await axios.post('http://localhost:5000/cart', { product_id: id, quantity: 1 });
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) return <div className="product-loading">Loading product...</div>;

  const images = product.image_urls ? JSON.parse(product.image_urls) : [];

  const starCount = product.rating ? Math.round(product.rating) : 0;

  return (
    <div className="product-detail">
      <div className="product-images">
        <img src={activeImage || 'https://via.placeholder.com/400'} alt={product.name} />
        <div className="thumbnails">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index + 1}`}
              className={activeImage === image ? 'active-thumb' : ''}
              onClick={() => setActiveImage(image)}
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <div className="detail-header-row">
          {product.offer && <span className="detail-offer">{product.offer}</span>}
          {starCount > 0 && <span className="detail-rating">{Array.from({ length: starCount }, (_, i) => '★').join('')}</span>}
        </div>
        <h1>{product.name}</h1>
        <p className="brand">by {product.brand}</p>
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>
        <p className="stock">Only {product.stock} left in stock</p>
        <div className="button-row">
          <button onClick={addToCart} className="add-to-cart">Add to Cart</button>
          <button onClick={buyNow} className="buy-now">Buy Now</button>
          <button onClick={addToWishlist} className="wishlist-btn">Add to Wishlist</button>
        </div>
        {recentProducts.length > 0 && (
          <div className="recently-viewed">
            <h3>Recently Viewed</h3>
            <div className="recent-grid">
              {recentProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="recent-card">
                  <img src={item.image_urls ? JSON.parse(item.image_urls)[0] : 'https://via.placeholder.com/150'} alt={item.name} />
                  <p>{item.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;