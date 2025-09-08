const sequelize = require('../config/database');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// Define model associations
User.hasOne(Store, { foreignKey: 'userId', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Rating associations
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

// Function to sync all models with the database
const syncModels = async () => {
  try {
    // Create tables if they don't exist
    await sequelize.sync();
    console.log('Database models synchronized successfully');
    
    // Create admin user if it doesn't exist (for initial setup)
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@storerating.com',
        password: 'Admin@123',
        address: 'System Address',
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error synchronizing database models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncModels
};