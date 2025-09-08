const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

// Get all stores with optional filtering
exports.getAllStores = async (req, res) => {
  try {
    const { name, address, minRating } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (name) {
      whereConditions.name = { [Op.like]: `%${name}%` };
    }
    
    if (address) {
      whereConditions.address = { [Op.like]: `%${address}%` };
    }
    
    if (minRating) {
      whereConditions.averageRating = { [Op.gte]: parseFloat(minRating) };
    }
    
    // Get stores with filters
    const stores = await Store.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['averageRating', 'DESC']]
    });
    
    res.status(200).json({
      message: 'Stores retrieved successfully',
      stores
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Error retrieving stores', error: error.message });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const storeId = req.params.id;
    
    const store = await Store.findByPk(storeId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          include: [
            {
              model: User,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(200).json({
      message: 'Store retrieved successfully',
      store
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ message: 'Error retrieving store', error: error.message });
  }
};

// Create store (admin or store owner)
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, userId } = req.body;
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // If not admin, can only create store for self
    if (!isAdmin && userId && userId !== currentUserId) {
      return res.status(403).json({ message: 'You can only create a store for yourself' });
    }
    
    // Check if store with email already exists
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }
    
    // Create new store
    const store = await Store.create({
      name,
      email,
      address,
      userId: userId || currentUserId
    });
    
    // If not admin, update user role to store_owner
    if (!isAdmin) {
      const user = await User.findByPk(currentUserId);
      user.role = 'store_owner';
      user.storeId = store.id;
      await user.save();
    }
    
    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
};

// Update store (admin or store owner)
exports.updateStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const { name, email, address } = req.body;
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Find store by ID
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user has permission to update this store
    if (!isAdmin && store.userId !== currentUserId) {
      return res.status(403).json({ message: 'You do not have permission to update this store' });
    }
    
    // Update store data
    if (name) store.name = name;
    if (email) store.email = email;
    if (address) store.address = address;
    
    await store.save();
    
    res.status(200).json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Error updating store', error: error.message });
  }
};

// Delete store (admin only)
exports.deleteStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    
    // Find store by ID
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Delete store
    await store.destroy();
    
    // Update any store owners to regular users
    await User.update(
      { role: 'user', storeId: null },
      { where: { storeId } }
    );
    
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Error deleting store', error: error.message });
  }
};

// Get stores owned by current user (store owner only)
exports.getOwnerStores = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stores = await Store.findAll({
      where: { userId },
      include: [
        {
          model: Rating,
          attributes: ['id', 'rating', 'comment', 'createdAt']
        }
      ]
    });
    
    res.status(200).json({
      message: 'Owner stores retrieved successfully',
      stores
    });
  } catch (error) {
    console.error('Get owner stores error:', error);
    res.status(500).json({ message: 'Error retrieving owner stores', error: error.message });
  }
};