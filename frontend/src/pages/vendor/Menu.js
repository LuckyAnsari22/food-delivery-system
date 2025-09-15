import React from 'react';
import { Helmet } from 'react-helmet-async';

const VendorMenu = () => {
  return (
    <>
      <Helmet>
        <title>Menu Management - FoodDelivery</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Menu Management</h1>
          <p className="text-gray-500">This page is under development</p>
        </div>
      </div>
    </>
  );
};

export default VendorMenu;
