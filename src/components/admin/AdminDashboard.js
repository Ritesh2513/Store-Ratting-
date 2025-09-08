import React, { useState, useEffect } from 'react';
import { userAPI, storeAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsResponse = await userAPI.getDashboardStats();
        setStats(statsResponse.data);
        
        // Fetch users
        const usersResponse = await userAPI.getAllUsers();
        setUsers(usersResponse.data);
        
        // Fetch stores
        const storesResponse = await storeAPI.getAllStores();
        setStores(storesResponse.data);
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user. ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle store deletion
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    
    try {
      await storeAPI.deleteStore(storeId);
      setStores(stores.filter(store => store.id !== storeId));
    } catch (err) {
      setError('Failed to delete store. ' + (err.response?.data?.message || err.message));
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mt-5 alert alert-danger">
        You don't have permission to access this page.
      </div>
    );
  }

  if (loading) {
    return <div className="container mt-5 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {currentUser.name}!</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Stores
          </button>
        </li>
      </ul>
      
      {activeTab === 'stats' && stats && (
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h5 className="card-title">Total Users</h5>
                <h2>{stats.totalUsers}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h5 className="card-title">Store Owners</h5>
                <h2>{stats.storeOwners}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h5 className="card-title">Total Stores</h5>
                <h2>{stats.totalStores}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-warning text-dark">
              <div className="card-body text-center">
                <h5 className="card-title">Total Ratings</h5>
                <h2>{stats.totalRatings}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3>Average Store Rating</h3>
              </div>
              <div className="card-body text-center">
                <h1 style={{ fontSize: '4rem' }}>
                  {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                </h1>
                <p>out of 5</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h3>User Management</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'store_owner' ? 'bg-success' : 'bg-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.id !== currentUser.id && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'stores' && (
        <div className="card">
          <div className="card-header bg-success text-white">
            <h3>Store Management</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Owner</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(store => (
                    <tr key={store.id}>
                      <td>{store.id}</td>
                      <td>{store.name}</td>
                      <td>{store.email}</td>
                      <td>{store.User?.name || 'N/A'}</td>
                      <td>
                        {store.averageRating ? (
                          <span>
                            {store.averageRating.toFixed(1)} ({store.totalRatings})
                          </span>
                        ) : 'No ratings'}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;