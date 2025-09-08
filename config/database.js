const { Sequelize } = require('sequelize');

// Use environment variables for database configuration
const dbName = process.env.DB_NAME || 'store_rating';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'Ritesh@2003';
const dbHost = process.env.DB_HOST || 'localhost';

// For development, use SQLite
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // For production, use PostgreSQL
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // For development and testing, use SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;