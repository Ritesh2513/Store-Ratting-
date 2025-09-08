import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const initialValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    address: currentUser?.address || ''
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name must be at most 60 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    address: Yup.string()
      .max(400, 'Address must be at most 400 characters')
      .required('Address is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      setSuccessMessage('');
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`${API_URL}/profile`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      
      // Update local user data
      if (response.data && response.data.user) {
        // Refresh the page to update the user data
        window.location.reload();
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = () => {
    navigate('/change-password');
  };

  if (!currentUser) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">User Profile</h3>
              {!isEditing && (
                <button 
                  className="btn btn-light btn-sm" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {isEditing ? (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                        />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          disabled
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <Field
                          as="textarea"
                          id="address"
                          name="address"
                          className="form-control"
                          rows="3"
                        />
                        <ErrorMessage name="address" component="div" className="text-danger" />
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div>
                  <div className="mb-3">
                    <h5>Name</h5>
                    <p>{currentUser.name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Email</h5>
                    <p>{currentUser.email}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Address</h5>
                    <p>{currentUser.address}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Role</h5>
                    <p>
                      {currentUser.role === 'admin' && 'Administrator'}
                      {currentUser.role === 'store_owner' && 'Store Owner'}
                      {currentUser.role === 'user' && 'Regular User'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Account Created</h5>
                    <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-warning" 
                  onClick={handlePasswordChange}
                >
                  Change Password
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;