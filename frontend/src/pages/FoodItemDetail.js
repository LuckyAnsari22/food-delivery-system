import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const FoodItemDetail = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Food Item Details - FoodDelivery</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Food Item Details</h1>
          <p className="text-gray-600">Item ID: {id}</p>
          <p className="text-gray-500 mt-2">This page is under development</p>
        </div>
      </div>
    </>
  );
};

export default FoodItemDetail;
