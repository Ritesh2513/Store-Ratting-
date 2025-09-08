const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Admin routes
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/dashboard-stats', authenticate, isAdmin, userController.getDashboardStats);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.post('/', authenticate, isAdmin, userController.createUser);
router.put('/:id', authenticate, isAdmin, userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;