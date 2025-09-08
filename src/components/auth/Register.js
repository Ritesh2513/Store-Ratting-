import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const { register } = useAuth();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(20, 'Name must be at least 20 characters')
      .max(60, 'Name must be at most 60 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must be at most 16 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter and one special character'
      )
      .required('Password is required'),
    address: Yup.string()
      .max(400, 'Address must be at most 400 characters')
      .required('Address is required'),
    role: Yup.string()
      .oneOf(['user', 'store_owner', 'admin'], 'Invalid role')
      .required('Role is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      await register(values);
      navigate('/stores'); // Redirect to stores page after successful registration
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
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
              <h3 className="mb-0">Register</h3>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
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
                      <label htmlFor="name" className="form-label">Name</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Enter your full name (20-60 characters)"
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
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="8-16 characters with uppercase and special character"
                      />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <Field
                        as="textarea"
                        id="address"
                        name="address"
                        className="form-control"
                        placeholder="Enter your address (max 400 characters)"
                        rows="3"
                      />
                      <ErrorMessage name="address" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Account Type</label>
                      <Field
                        as="select"
                        id="role"
                        name="role"
                        className="form-select"
                      >
                        <option value="user">Regular User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Administrator</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="text-danger" />
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              
              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;