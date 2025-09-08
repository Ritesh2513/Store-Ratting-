import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeAPI, ratingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StoreList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', address: '', minRating: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getAllStores(filters);
      setStores(response.data.stores || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Failed to load stores. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRatingChange = async (storeId, rating) => {
    if (!currentUser) {
      alert('Please log in to rate stores');
      return;
    }

    try {
      await ratingAPI.submitRating({ storeId, rating, comment: '' });
      // Update the store in the list
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { ...store, userRating: rating } 
            : store
        )
      );
      // Refresh the stores list to get updated average ratings
      fetchStores();
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const renderRatingStars = (store) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={`star ${store.userRating >= star ? 'selected' : ''}`}
            onClick={() => handleRatingChange(store.id, star)}
            style={{ cursor: 'pointer', color: store.userRating >= star ? '#FFD700' : '#e4e5e9', fontSize: '1.5rem', marginRight: '5px' }}
          >
            <i className={`fas ${store.userRating >= star ? 'fa-star' : 'fa-star'}`}></i>
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading stores...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title mb-4">Store Listings</h2>
      
      {/* Filter Form */}
      <div className="card filter-card mb-4">
        <div className="card-body">
          <h5 className="card-title"><i className="fas fa-filter me-2"></i>Filter Stores</h5>
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="name" className="form-label">Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                  placeholder="Search by address"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="minRating" className="form-label">Min Rating</label>
                <select
                  className="form-select"
                  id="minRating"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-search me-2"></i>Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Store List */}
      {stores.length === 0 ? (
        <div className="alert alert-info"><i className="fas fa-info-circle me-2"></i>No stores found matching your criteria.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {stores.map(store => (
            <div key={store.id} className="col">
              <div className="card store-card h-100" onClick={() => navigate(`/stores/${store.id}`)}>
                <div className="card-header bg-transparent">
                  <h5 className="card-title mb-0"><i className="fas fa-store me-2"></i>{store.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <i className="fas fa-map-marker-alt me-2"></i> {store.address}
                  </p>
                  <p className="card-text">
                    <i className="fas fa-envelope me-2"></i> {store.email}
                  </p>
                  <div className="store-rating mb-3">
                    <span className="rating-badge">
                      <i className="fas fa-star me-1"></i>
                      {store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-muted ms-2">({store.totalRatings || 0} reviews)</span>
                  </div>
                  
                  {currentUser && (
                    <div className="user-rating mt-3 pt-3 border-top">
                      <p className="mb-1 text-muted"><i className="fas fa-user-edit me-1"></i> Your Rating:</p>
                      {renderRatingStars(store)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;