# Flipkart Clone E-Commerce Platform

A full-stack e-commerce web application that replicates Flipkart's design and functionality.

## Features

- Product listing with grid layout
- Product search and category filtering
- Product detail pages with image carousel
- Shopping cart management
- Order placement and confirmation
- Responsive design

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MySQL

## Setup Instructions

### Prerequisites
- Node.js
- MySQL
- npm

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
   - Create a MySQL database named `ecommerce`
   - Run the `schema.sql` file to create tables and insert sample data
4. Update the database password in `index.js` if necessary
5. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Running the Application
- Backend will run on `http://localhost:5000`
- Frontend will run on `http://localhost:3000`

## Database Schema

- `products`: Stores product information
- `cart`: Stores cart items (single user assumed)
- `orders`: Stores order information
- `order_items`: Stores items in each order

## API Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all categories
- `GET /products/search/:query` - Search products
- `GET /products/category/:category` - Filter by category
- `POST /cart` - Add to cart
- `GET /cart` - Get cart items
- `PUT /cart/:id` - Update cart quantity
- `DELETE /cart/:id` - Remove from cart
- `POST /orders` - Place order
- `GET /orders` - Get order history

## Assumptions

- Single user system (no authentication)
- Sample data is seeded in the database
- Images use placeholder URLs
- Payment methods are simulated

## Future Enhancements

- User authentication
- Order history per user
- Wishlist functionality
- Email notifications
- Admin panel for product management