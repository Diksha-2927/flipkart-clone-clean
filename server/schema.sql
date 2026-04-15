-- E-commerce Database Schema

CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  offer VARCHAR(100),
  image_urls JSON,
  stock INT DEFAULT 0
);

-- Cart table (assuming single user, no user_id)
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  quantity INT DEFAULT 1,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10,2),
  address TEXT,
  payment VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sample data
INSERT INTO products (name, description, brand, category, price, rating, offer, image_urls, stock) VALUES
('iPhone 15', 'Latest iPhone with advanced features and sleek design.', 'Apple', 'Electronics', 999.99, 4.8, '10% off', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]', 10),
('Samsung Galaxy S24', 'High-end Android smartphone with premium camera.', 'Samsung', 'Electronics', 899.99, 4.7, '15% off', '["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]', 15),
('Nike Air Max', 'Comfortable running shoes with stylish design.', 'Nike', 'Fashion', 129.99, 4.6, 'Buy 1 Get 1', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400","https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400"]', 20),
('MacBook Pro', 'Powerful laptop for professionals and creatives.', 'Apple', 'Electronics', 1999.99, 4.9, 'Free delivery', '["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]', 5),
('Sony Headphones', 'Noise-cancelling wireless headphones with premium sound.', 'Sony', 'Electronics', 299.99, 4.5, '20% off', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400","https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400"]', 8);