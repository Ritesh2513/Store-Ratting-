import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { updatePassword } = useAuth();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must be at most 16 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter and one special character'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setServerError('');
      setSuccessMessage('');
      
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      setSuccessMessage('Password updated successfully');
      resetForm();
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Change Password</h3>
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
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <Field
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="form-control"
                      />
                      <ErrorMessage name="currentPassword" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="form-control"
                      />
                      <ErrorMessage name="newPassword" component="div" className="text-danger" />
                      <small className="text-muted">
                        Password must be 8-16 characters with at least one uppercase letter and one special character
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/profile')}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;