import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI, ratingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RatingForm from '../rating/RatingForm';
import RatingList from '../rating/RatingList';

const StoreDetail = () => {
  const { storeId } = useParams();
  const { currentUser } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(null);

  // Fetch store details
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        const response = await storeAPI.getStoreById(storeId);
        setStore(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load store details. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  // Fetch user's rating for this store if logged in
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!currentUser) return;
      
      try {
        const response = await ratingAPI.getUserRatingForStore(storeId);
        setUserRating(response.data);
      } catch (err) {
        // User hasn't rated this store yet, that's okay
        if (err.response && err.response.status !== 404) {
          console.error('Error fetching user rating:', err);
        }
      }
    };

    fetchUserRating();
  }, [currentUser, storeId]);

  // Handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    try {
      await ratingAPI.submitRating({
        ...ratingData,
        storeId: parseInt(storeId)
      });
      
      // Refresh store details to get updated rating
      const storeResponse = await storeAPI.getStoreById(storeId);
      setStore(storeResponse.data);
      
      // Refresh user rating
      const ratingResponse = await ratingAPI.getUserRatingForStore(storeId);
      setUserRating(ratingResponse.data);
      
      return true;
    } catch (err) {
      setError('Failed to submit rating. ' + (err.response?.data?.message || err.message));
      return false;
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading store details...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!store) {
    return <div className="container mt-5 alert alert-warning">Store not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h2>{store.name}</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <p><strong>Email:</strong> {store.email}</p>
              <p><strong>Address:</strong> {store.address}</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="rating-badge">
                <h3>Rating</h3>
                <h2>{store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}</h2>
                <p>{store.totalRatings} {store.totalRatings === 1 ? 'review' : 'reviews'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h3>Your Rating</h3>
          </div>
          <div className="card-body">
            <RatingForm 
              initialRating={userRating} 
              onSubmit={handleRatingSubmit} 
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-light">
          <h3>Customer Reviews</h3>
        </div>
        <div className="card-body">
          <RatingList storeId={storeId} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;