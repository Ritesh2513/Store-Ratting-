# Manual Testing Documentation

## Overview

This document provides a comprehensive guide for manually testing the Store Rating Application. It covers testing procedures for all major features across both frontend and backend components.

## Prerequisites

- Backend server running locally on port 5000
- Frontend application running locally on port 3000
- Test user accounts created (admin, store owner, regular user)

## Test Environment Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
5. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```

## Test User Accounts

Create the following test accounts using the registration page:

1. **Admin User**
   - Email: admin@example.com
   - Password: Admin123!
   - (Note: The first user registered will automatically be an admin)

2. **Store Owner**
   - Email: owner@example.com
   - Password: Owner123!
   - (Note: This user will become a store owner after creating a store)

3. **Regular User**
   - Email: user@example.com
   - Password: User123!

## Test Cases

### 1. Authentication

#### 1.1 User Registration

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| AUTH-01 | Register new user | 1. Navigate to /register<br>2. Fill in name, email, password<br>3. Submit form | User is registered and redirected to login page |
| AUTH-02 | Register with existing email | 1. Navigate to /register<br>2. Fill in details with an email that already exists<br>3. Submit form | Error message displayed indicating email already in use |
| AUTH-03 | Register with invalid data | 1. Navigate to /register<br>2. Submit form with invalid email format or short password<br>3. Submit form | Validation errors displayed |

#### 1.2 User Login

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| AUTH-04 | Login with valid credentials | 1. Navigate to /login<br>2. Enter valid email and password<br>3. Submit form | User is logged in and redirected based on role |
| AUTH-05 | Login with invalid credentials | 1. Navigate to /login<br>2. Enter invalid email or password<br>3. Submit form | Error message displayed |
| AUTH-06 | Logout functionality | 1. Login<br>2. Click logout button in navbar | User is logged out and redirected to login page |

### 2. Store Management

#### 2.1 Store Listing

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| STORE-01 | View all stores | 1. Navigate to /stores | List of stores displayed with ratings |
| STORE-02 | Filter stores | 1. Navigate to /stores<br>2. Use filter options (name, address, rating) | Filtered list of stores displayed |
| STORE-03 | View store details | 1. Navigate to /stores<br>2. Click on a store | Store details page displayed with ratings |

#### 2.2 Store Creation (Admin/Store Owner)

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| STORE-04 | Create new store | 1. Login as admin or regular user<br>2. Navigate to create store page<br>3. Fill in store details<br>4. Submit form | Store is created and user role updated to store_owner if not admin |
| STORE-05 | Create store with invalid data | 1. Login as admin or regular user<br>2. Navigate to create store page<br>3. Submit form with invalid data | Validation errors displayed |

#### 2.3 Store Management (Admin/Store Owner)

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| STORE-06 | Update store details | 1. Login as admin or store owner<br>2. Navigate to store management<br>3. Edit store details<br>4. Submit form | Store details updated |
| STORE-07 | Delete store (admin only) | 1. Login as admin<br>2. Navigate to store management<br>3. Delete a store | Store is deleted and associated users' roles updated |

### 3. Rating System

#### 3.1 Submit Ratings

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| RATE-01 | Submit new rating | 1. Login as regular user<br>2. Navigate to a store detail page<br>3. Submit rating and comment<br>4. Submit form | Rating is submitted and store average rating updated |
| RATE-02 | Update existing rating | 1. Login as regular user<br>2. Navigate to a store you've already rated<br>3. Change rating or comment<br>4. Submit form | Rating is updated and store average rating recalculated |
| RATE-03 | Submit invalid rating | 1. Login as regular user<br>2. Navigate to a store detail page<br>3. Submit invalid rating (e.g., outside 1-5 range)<br>4. Submit form | Validation error displayed |

#### 3.2 View Ratings

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| RATE-04 | View all ratings for a store | 1. Navigate to a store detail page | All ratings for the store displayed |
| RATE-05 | View user's rating for a store | 1. Login as a user<br>2. Navigate to a store you've rated | Your rating is highlighted or separately displayed |

### 4. Admin Features

#### 4.1 User Management

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| ADMIN-01 | View all users | 1. Login as admin<br>2. Navigate to user management | List of all users displayed |
| ADMIN-02 | Create new user | 1. Login as admin<br>2. Navigate to user management<br>3. Create new user with role | User is created with specified role |
| ADMIN-03 | Update user | 1. Login as admin<br>2. Navigate to user management<br>3. Edit user details | User details updated |
| ADMIN-04 | Delete user | 1. Login as admin<br>2. Navigate to user management<br>3. Delete a user | User is deleted |

#### 4.2 Dashboard

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| ADMIN-05 | View admin dashboard | 1. Login as admin<br>2. Navigate to dashboard | Dashboard with statistics displayed |

### 5. Store Owner Features

#### 5.1 Store Owner Dashboard

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| OWNER-01 | View store owner dashboard | 1. Login as store owner<br>2. Navigate to dashboard | Dashboard with store statistics displayed |
| OWNER-02 | View store ratings | 1. Login as store owner<br>2. Navigate to dashboard<br>3. View ratings section | All ratings for owned store(s) displayed |

## Cross-Browser Testing

Test the application on the following browsers:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest, if available)

## Responsive Design Testing

Test the application on the following device sizes:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## Error Handling Testing

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| ERR-01 | Server error handling | 1. Simulate server error (e.g., disconnect database)<br>2. Perform operations | Appropriate error messages displayed |
| ERR-02 | Form validation | 1. Submit forms with invalid data | Validation errors displayed |
| ERR-03 | Authentication errors | 1. Access protected routes without authentication | Redirected to login page |
| ERR-04 | Authorization errors | 1. Access routes without proper role | Redirected to appropriate page based on role |

## Reporting Issues

When reporting issues, include the following information:
1. Test ID (if applicable)
2. Steps to reproduce
3. Expected result
4. Actual result
5. Screenshots (if applicable)
6. Browser/device information