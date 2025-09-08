const { Rating, Store, User, sequelize } = require('../models');

// Submit or update a rating for a store
exports.submitRating = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Validate rating value
    if (rating < 1 || rating > 5) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user has already rated this store
    let userRating = await Rating.findOne({
      where: { userId, storeId },
      transaction
    });
    
    let message;
    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      userRating.comment = comment;
      await userRating.save({ transaction });
      message = 'Rating updated successfully';
    } else {
      // Create new rating
      userRating = await Rating.create({
        userId,
        storeId,
        rating,
        comment
      }, { transaction });
      message = 'Rating submitted successfully';
    }
    
    // Update store average rating
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating'],
      transaction
    });
    
    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings;
    
    await Store.update({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings
    }, {
      where: { id: storeId },
      transaction
    });
    
    await transaction.commit();
    
    res.status(200).json({
      message,
      rating: userRating
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
};

// Get all ratings for a store
exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{
        model: User,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: 'Store ratings retrieved successfully',
      ratings
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Error retrieving store ratings', error: error.message });
  }
};

// Get user's rating for a specific store
exports.getUserRatingForStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const userId = req.user.id;
    
    const rating = await Rating.findOne({
      where: { userId, storeId }
    });
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    res.status(200).json({
      message: 'User rating retrieved successfully',
      rating
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ message: 'Error retrieving user rating', error: error.message });
  }
};

// Delete a rating (admin only)
exports.deleteRating = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const ratingId = req.params.id;
    
    // Find rating
    const rating = await Rating.findByPk(ratingId, { transaction });
    if (!rating) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    const storeId = rating.storeId;
    
    // Delete rating
    await rating.destroy({ transaction });
    
    // Update store average rating
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating'],
      transaction
    });
    
    const totalRatings = ratings.length;
    let averageRating = 0;
    
    if (totalRatings > 0) {
      averageRating = ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings;
    }
    
    await Store.update({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings
    }, {
      where: { id: storeId },
      transaction
    });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Error deleting rating', error: error.message });
  }
};