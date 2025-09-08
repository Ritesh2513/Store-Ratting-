const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin role middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Store owner role middleware
const isStoreOwner = (req, res, next) => {
  if (req.user && req.user.role === 'store_owner') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Store owner privileges required.' });
  }
};

// Check if user is admin or store owner of the specific store
const isAdminOrStoreOwner = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    
    if (req.user && req.user.role === 'store_owner') {
      // Get the store to check ownership
      const { Store } = require('../models');
      const store = await Store.findByPk(req.params.id);
      
      if (store && store.userId === req.user.id) {
        return next();
      }
    }
    
    res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while checking permissions.' });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isStoreOwner,
  isAdminOrStoreOwner
};