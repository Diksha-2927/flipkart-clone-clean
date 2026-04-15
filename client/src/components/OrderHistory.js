import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const navigate = useNavigate();

  const orders = [
    { id: 'ORD123', date: '2026-04-10', status: 'Delivered', total: 1200 },
    { id: 'ORD456', date: '2026-04-12', status: 'Processing', total: 800 }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Order History</h2>

      {orders.map((order) => (
        <div key={order.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
          <p>Order ID: {order.id}</p>
          <p>Date: {order.date}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>
        </div>
      ))}

      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default OrderHistory;