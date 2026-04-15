import React from 'react';
import { useParams } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="order-confirmation">
      <h1>Order Placed Successfully!</h1>
      <p>Your order ID is: <strong>{orderId}</strong></p>
      <p>Thank you for shopping with us. You will receive an email confirmation shortly.</p>
    </div>
  );
};

export default OrderConfirmation;