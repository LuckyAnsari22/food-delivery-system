import React from 'react';
import { Helmet } from 'react-helmet-async';

const Orders = () => {
  return (
    <>
      <Helmet>
        <title>My Orders - FoodDelivery</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-gray-500">This page is under development</p>
        </div>
      </div>
    </>
  );
};

export default Orders;
