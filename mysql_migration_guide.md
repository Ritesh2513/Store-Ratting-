# MySQL Migration Guide

## Prerequisites

1. MySQL server installed and running
2. MySQL user with appropriate permissions
3. MySQL database created for the application

## Steps to Migrate from SQLite to MySQL

### 1. Install MySQL Driver

```bash
npm install mysql2 --save
```

### 2. Update Database Configuration

Modify `backend/config/database.js` to use MySQL:

```javascript
const { Sequelize } = require('sequelize');

// Use environment variables for database configuration
const dbName = process.env.DB_NAME || 'store_rating';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '3306';

// Use MySQL for all environments
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // For production, use MySQL with production settings
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // For development and testing, use MySQL with development settings
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
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
```

### 3. Update Environment Variables

Update your `.env` file with MySQL connection details:

```
# Database Configuration
DB_NAME=store_rating
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

### 4. Create MySQL Database

Create the database if it doesn't exist:

```sql
CREATE DATABASE IF NOT EXISTS store_rating;
```

### 5. Data Migration (Optional)

If you need to migrate existing data from SQLite to MySQL:

1. Export data from SQLite:
   ```bash
   sqlite3 database.sqlite .dump > sqlite_dump.sql
   ```

2. Convert the SQLite dump to MySQL compatible format (may require manual adjustments)

3. Import into MySQL:
   ```bash
   mysql -u your_mysql_username -p store_rating < mysql_dump.sql
   ```

### 6. Restart the Application

Stop the current server and restart it:

```bash
npm run dev
```

## Troubleshooting

### Common Issues

1. **Access Denied Error**:
   - Verify MySQL username and password in `.env` file
   - Ensure the MySQL user has appropriate permissions

2. **Connection Refused**:
   - Check if MySQL server is running
   - Verify host and port settings

3. **Database Not Found**:
   - Ensure the database exists
   - Check if the MySQL user has access to the database

### MySQL User Setup

If you need to create a new MySQL user with appropriate permissions:

```sql
CREATE USER 'store_rating_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON store_rating.* TO 'store_rating_user'@'localhost';
FLUSH PRIVILEGES;
```

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js MySQL2 Package](https://github.com/sidorares/node-mysql2)