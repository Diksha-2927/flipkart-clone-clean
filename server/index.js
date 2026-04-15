require('dotenv').config({ path: __dirname + '/.env', override: true });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const dbPassword = process.env.DB_PASSWORD ? process.env.DB_PASSWORD.trim() : undefined;
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME
};

console.log('Using DB config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? 'SET' : 'EMPTY'
});

let db = null;
if (dbConfig.host && dbConfig.user && dbConfig.database && dbConfig.password) {
  db = mysql.createConnection(dbConfig);
  db.connect(err => {
    if (err) {
      console.error("MySQL Connection Error:", err.message);
      console.log("Running with in-memory data as fallback");
      db = null;
    } else {
      console.log("MySQL Connected...");
    }
  });
} else {
  console.log("Database credentials missing or incomplete, or DB password not provided. Using in-memory fallback.");
  db = null;
}

// In-memory data store (fallback)
let products = [
  { id: 1, name: 'iPhone 15', description: 'Latest iPhone with advanced features', price: 999.99, category: 'Electronics', brand: 'Apple', image_urls: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"]', stock: 10 },
  { id: 2, name: 'Samsung Galaxy S24', description: 'High-end Android smartphone', price: 899.99, category: 'Electronics', brand: 'Samsung', image_urls: '["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"]', stock: 15 },
  { id: 3, name: 'Nike Air Max', description: 'Comfortable running shoes', price: 129.99, category: 'Fashion', brand: 'Nike', image_urls: '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"]', stock: 20 },
  { id: 4, name: 'MacBook Pro', description: 'Powerful laptop for professionals', price: 1999.99, category: 'Electronics', brand: 'Apple', image_urls: '["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400"]', stock: 5 },
  { id: 5, name: 'Sony Headphones', description: 'Noise-cancelling wireless headphones', price: 299.99, category: 'Electronics', brand: 'Sony', image_urls: '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]', stock: 8 }
];

let cart = [
  { id: 1, product_id: 1, quantity: 1 },
  { id: 2, product_id: 3, quantity: 2 }
];
let orders = [];
let wishlist = [1, 4];
let nextOrderId = 1;
let useDB = false;

// Root route for browser users
app.get('/', (req, res) => {
  res.send('Flipkart Clone API is running. Open the frontend at http://localhost:3001');
});

// Get products
app.get("/products", (req, res) => {
  res.json(products);
});

// Get product by id
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (product) res.json(product);
  else res.status(404).send("Product not found");
});

// Get categories
app.get("/categories", (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Search products
app.get("/products/search/:query", (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = products.filter(p => p.name.toLowerCase().includes(query));
  res.json(results);
});

// Filter by category
app.get("/products/category/:category", (req, res) => {
  const results = products.filter(p => p.category === req.params.category);
  res.json(results);
});

// Add to cart
app.post("/cart", (req, res) => {
  const { product_id, quantity } = req.body;
  const product = products.find(p => p.id == product_id);
  if (product) {
    const existing = cart.find(c => c.product_id == product_id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: cart.length + 1, product_id, quantity });
    }
    res.send("Added to cart");
  } else {
    res.status(404).send("Product not found");
  }
});

// Get cart
app.get("/cart", (req, res) => {
  const cartWithDetails = cart.map(item => {
    const product = products.find(p => p.id == item.product_id);
    return {
      id: item.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    };
  });
  res.json(cartWithDetails);
});

// Update cart quantity
app.put("/cart/:id", (req, res) => {
  const { quantity } = req.body;
  const item = cart.find(c => c.id == req.params.id);
  if (item) {
    item.quantity = quantity;
    res.send("Cart updated");
  } else {
    res.status(404).send("Item not found");
  }
});

// Remove from cart
app.delete("/cart/:id", (req, res) => {
  cart = cart.filter(c => c.id != req.params.id);
  res.send("Item removed from cart");
});

// Place order
app.post("/orders", (req, res) => {
  const { address, payment } = req.body;
  const cartWithDetails = cart.map(item => {
    const product = products.find(p => p.id == item.product_id);
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price
    };
  });
  const total = cartWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: nextOrderId++,
    total,
    address,
    payment,
    items: cartWithDetails,
    created_at: new Date()
  };
  orders.push(order);
  cart = [];
  res.json({ orderId: order.id, total });
});

// Get orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Add to wishlist
app.post("/wishlist", (req, res) => {
  const { product_id } = req.body;
  if (!wishlist.includes(product_id)) {
    wishlist.push(product_id);
  }
  res.send("Added to wishlist");
});

// Get wishlist
app.get("/wishlist", (req, res) => {
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  res.json(wishlistProducts);
});

// Remove from wishlist
app.delete("/wishlist/:id", (req, res) => {
  wishlist = wishlist.filter(id => id != req.params.id);
  res.send("Removed from wishlist");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});