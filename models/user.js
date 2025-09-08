const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 60]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100] // Storing hashed passwords, so length will be longer
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 400]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'store_owner', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Stores',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;