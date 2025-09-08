const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate, isAdmin, isAdminOrStoreOwner } = require('../middleware/auth');

// Public routes
router.get('/', storeController.getAllStores);

// Store owner routes
router.get('/owner/stores', authenticate, storeController.getOwnerStores);

// Public store detail route
router.get('/:id', storeController.getStoreById);

// Protected routes
router.post('/', authenticate, storeController.createStore);
router.put('/:id', authenticate, isAdminOrStoreOwner, storeController.updateStore);
router.delete('/:id', authenticate, isAdmin, storeController.deleteStore);

module.exports = router;