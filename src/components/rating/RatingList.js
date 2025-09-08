import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RatingList = ({ ratings, onEdit, onDelete }) => {
  const { currentUser } = useAuth();

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate average rating
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 'No ratings yet';

  // Check if the current user can edit a rating
  const canEditRating = (rating) => {
    return currentUser && rating.userId === currentUser.id;
  };

  // Check if the current user can delete a rating (admin or the rating owner)
  const canDeleteRating = (rating) => {
    return currentUser && (currentUser.role === 'admin' || rating.userId === currentUser.id);
  };

  // Generate star display
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="rating-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customer Reviews</h3>
        <div className="average-rating">
          <span className="badge bg-primary p-2">
            Average Rating: {averageRating}
          </span>
        </div>
      </div>

      {ratings.length === 0 ? (
        <div className="alert alert-info">No reviews yet. Be the first to leave a review!</div>
      ) : (
        <div className="list-group">
          {ratings.map(rating => (
            <div key={rating.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stars mb-1" style={{ color: '#ffc107' }}>
                    {renderStars(rating.rating)}
                  </div>
                  <h6 className="mb-1">{rating.User?.name || 'Anonymous'}</h6>
                  <small className="text-muted">{formatDate(rating.createdAt)}</small>
                </div>
                <div>
                  {canEditRating(rating) && (
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onEdit(rating)}
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteRating(rating) && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(rating.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {rating.comment && (
                <p className="mt-2 mb-0">{rating.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .star {
          font-size: 1.2rem;
          color: #e0e0e0;
        }
        .star.filled {
          color: #ffc107;
        }
      `}</style>
    </div>
  );
};

export default RatingList;