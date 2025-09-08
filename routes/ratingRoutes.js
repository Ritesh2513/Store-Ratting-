const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protected routes (normal users)
router.post('/', authenticate, ratingController.submitRating);
router.get('/store/:storeId/user', authenticate, ratingController.getUserRatingForStore);

// Public routes
router.get('/store/:storeId', ratingController.getStoreRatings);

// Admin routes
router.delete('/:id', authenticate, isAdmin, ratingController.deleteRating);

module.exports = router;