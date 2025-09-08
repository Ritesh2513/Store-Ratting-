const { User, Store, Rating } = require('../models');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || 'user'
    });
    
    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt
    };
    
    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, address, role, storeId } = req.body;
    
    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (role) user.role = role;
    if (storeId !== undefined) user.storeId = storeId;
    
    await user.save();
    
    // Return updated user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      storeId: user.storeId,
      updatedAt: user.updatedAt
    };
    
    res.status(200).json({
      message: 'User updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get dashboard statistics (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user counts by role
    const userCount = await User.count({ where: { role: 'user' } });
    const storeOwnerCount = await User.count({ where: { role: 'store_owner' } });
    const adminCount = await User.count({ where: { role: 'admin' } });
    
    // Get store count
    const storeCount = await Store.count();
    
    // Get rating count
    const ratingCount = await Rating.count();
    
    // Get average rating
    const ratings = await Rating.findAll({ attributes: ['rating'] });
    const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 0;
    
    res.status(200).json({
      message: 'Dashboard statistics retrieved successfully',
      stats: {
        users: {
          total: userCount + storeOwnerCount + adminCount,
          regular: userCount,
          storeOwners: storeOwnerCount,
          admins: adminCount
        },
        stores: {
          total: storeCount
        },
        ratings: {
          total: ratingCount,
          average: averageRating
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard statistics', error: error.message });
  }
};