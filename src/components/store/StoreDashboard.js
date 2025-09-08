import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreDashboard = () => {
  const [storeData, setStoreData] = useState({
    sales: [],
    inventory: [],
    orders: []
  });

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [salesRes, inventoryRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/sales'),
          axios.get('http://localhost:5000/api/dashboard/inventory'),
          axios.get('http://localhost:5000/api/dashboard/orders')
        ]);

        setStoreData({
          sales: salesRes.data,
          inventory: inventoryRes.data,
          orders: ordersRes.data
        });
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <div className="space-y-4">
            {storeData.sales.map((sale) => (
              <div key={sale.id} className="border-b pb-2">
                <p className="font-medium">{sale.product}</p>
                <p className="text-gray-600">${sale.amount}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <div className="space-y-4">
            {storeData.inventory.map((item) => (
              <div key={item.id} className="border-b pb-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">Stock: {item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {storeData.orders.map((order) => (
              <div key={order.id} className="border-b pb-2">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-gray-600">{order.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;