# Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (for production)

## Backend Deployment

### Environment Setup

1. Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
DATABASE_URL=postgres://username:password@host:port/database
```

2. Install dependencies:

```bash
cd backend
npm install
```

### Production Database Setup

1. Create a PostgreSQL database for the application
2. Update the `DATABASE_URL` in the `.env` file with your PostgreSQL connection string

### Starting the Backend Server

```bash
cd backend
npm start
```

For production deployment with process management:

```bash
npm install -g pm2
pm2 start index.js --name "store-rating-backend"
```

## Frontend Deployment

### Environment Setup

1. Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=https://your-backend-api-url.com/api
```

2. Install dependencies:

```bash
cd frontend
npm install
```

### Building for Production

```bash
cd frontend
npm run build
```

This will create a `build` directory with optimized production files.

### Serving the Frontend

You can serve the frontend using a static file server like Nginx or using a Node.js server:

```bash
npm install -g serve
serve -s build
```

## Deployment Options

### Option 1: Traditional Hosting

1. Deploy the backend to a VPS or dedicated server
2. Set up Nginx as a reverse proxy to the Node.js backend
3. Deploy the frontend build files to a static file hosting service or the same server

### Option 2: Container Deployment

1. Create Docker containers for both frontend and backend
2. Deploy using Docker Compose or Kubernetes

### Option 3: Cloud Platform Services

1. Backend: Deploy to services like Heroku, AWS Elastic Beanstalk, or Google App Engine
2. Frontend: Deploy to services like Netlify, Vercel, or AWS S3 + CloudFront
3. Database: Use managed database services like AWS RDS or Heroku Postgres

## Continuous Integration/Continuous Deployment

Set up CI/CD pipelines using services like GitHub Actions, GitLab CI, or Jenkins to automate the testing and deployment process.

## Monitoring and Logging

1. Implement application monitoring using tools like New Relic, Datadog, or Prometheus
2. Set up centralized logging using the ELK stack (Elasticsearch, Logstash, Kibana) or services like Loggly

## Backup Strategy

1. Set up regular database backups
2. Implement a disaster recovery plan

## Security Considerations

1. Enable HTTPS for all traffic
2. Implement rate limiting for API endpoints
3. Regularly update dependencies to patch security vulnerabilities
4. Use environment variables for sensitive information
5. Implement proper authentication and authorization checks