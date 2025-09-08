import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storeAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StoreOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch owner's stores
  useEffect(() => {
    const fetchOwnerStores = async () => {
      try {
        setLoading(true);
        const response = await storeAPI.getOwnerStores();
        setStores(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load your stores. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerStores();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Store name is required';
    if (formData.name && (formData.name.length < 20 || formData.name.length > 60)) {
      errors.name = 'Store name must be between 20 and 60 characters';
    }
    if (!formData.email) errors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.address && formData.address.length > 400) {
      errors.address = 'Address must be less than 400 characters';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const response = await storeAPI.createStore(formData);
      setStores(prev => [...prev, response.data]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        address: ''
      });
      setFormErrors({});
    } catch (err) {
      setError('Failed to create store. ' + (err.response?.data?.message || err.message));
    }
  };

  if (!currentUser || currentUser.role !== 'store_owner') {
    return (
      <div className="container mt-5 alert alert-danger">
        You don't have permission to access this page.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Store Owner Dashboard</h1>
      <p>Welcome, {currentUser.name}!</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Your Stores</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading your stores...</p>
              ) : stores.length > 0 ? (
                <div className="list-group">
                  {stores.map(store => (
                    <Link 
                      key={store.id} 
                      to={`/stores/${store.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{store.name}</h5>
                        <small>
                          Rating: {store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}
                          ({store.totalRatings})
                        </small>
                      </div>
                      <p className="mb-1">{store.address}</p>
                      <small>{store.email}</small>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>You don't have any stores yet. Create one using the form.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3>Create New Store</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Store Name</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  <small className="text-muted">Between 20 and 60 characters</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Store Email</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Store Address</label>
                  <textarea
                    className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                  {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                  <small className="text-muted">Maximum 400 characters</small>
                </div>
                
                <button type="submit" className="btn btn-success">Create Store</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;