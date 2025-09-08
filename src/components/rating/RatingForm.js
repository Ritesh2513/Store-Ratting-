import React, { useState, useEffect } from 'react';

const RatingForm = ({ initialRating, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: initialRating?.rating || 5,
    comment: initialRating?.comment || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Update form when initialRating changes
  useEffect(() => {
    if (initialRating) {
      setFormData({
        rating: initialRating.rating,
        comment: initialRating.comment || ''
      });
    }
  }, [initialRating]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const success = await onSubmit(formData);
      if (success) {
        setMessage({ type: 'success', text: 'Rating submitted successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to submit rating. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="rating" className="form-label">Your Rating</label>
        <div className="rating-select">
          {[5, 4, 3, 2, 1].map(value => (
            <div className="form-check form-check-inline" key={value}>
              <input
                className="form-check-input"
                type="radio"
                name="rating"
                id={`rating${value}`}
                value={value}
                checked={formData.rating === value}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={`rating${value}`}>
                {value} {value === 1 ? 'Star' : 'Stars'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="comment" className="form-label">Your Review (Optional)</label>
        <textarea
          className="form-control"
          id="comment"
          name="comment"
          rows="3"
          value={formData.comment}
          onChange={handleChange}
          maxLength="500"
        ></textarea>
        <small className="text-muted">{formData.comment.length}/500 characters</small>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : initialRating ? 'Update Rating' : 'Submit Rating'}
      </button>
    </form>
  );
};

export default RatingForm;