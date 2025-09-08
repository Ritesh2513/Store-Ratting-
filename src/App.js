import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Common Components
import Navbar from './components/common/Navbar';

// Store Components
import StoreList from './components/store/StoreList';
import StoreDetail from './components/store/StoreDetail';
import StoreOwnerDashboard from './components/store/StoreOwnerDashboard';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

// Profile Components
import Profile from './components/profile/Profile';
import ChangePassword from './components/profile/ChangePassword';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on user role
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (currentUser.role === 'store_owner') {
      return <Navigate to="/store/dashboard" />;
    } else {
      return <Navigate to="/stores" />;
    }
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/stores" />} />
            
            {/* Store Routes */}
            <Route path="/stores" element={<StoreList />} />
            <Route path="/stores/:storeId" element={<StoreDetail />} />
            
            {/* Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/store/dashboard" element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Profile Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
