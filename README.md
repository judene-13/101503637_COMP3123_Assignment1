
# COMP3123 Assignment 1 - Employee Management REST API

Student ID: 101503637

## Project Description

For this assignment, I created an Employee Management REST API using Node.js, Express, MongoDB, and Mongoose.

The API allows users to create an account, log in, and manage employee information. Each employee belongs to the user who created them, so users cannot access or change another user's employee records.

The project also includes security features such as password hashing, JWT authentication, input validation, Helmet, and rate limiting.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JavaScript
- bcryptjs
- JSON Web Token (JWT)
- express-validator
- Helmet
- express-rate-limit
- Morgan
- Postman
- Git and GitHub

## Project Structure

- config - MongoDB connection
- controllers - User and employee operations
- middleware - Authentication and error handling
- models - MongoDB User and Employee schemas
- routes - API endpoints
- utils - Application logging
- logs - Locally generated request logs
- server.js - Main application file

## How to Run the Project

### 1. Clone the Repository

git clone https://github.com/judene-13/101503637_COMP3123_Assignment1.git

### 2. Open the Project

cd 101503637_COMP3123_Assignment1

### 3. Install Dependencies

npm install

### 4. Configure Environment Variables

Create a .env file in the main project folder.

The application requires:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Use the .env.example file as a reference.

Do not upload the actual .env file to GitHub.

### 5. Connect MongoDB

The application uses MongoDB Atlas.

Create a MongoDB Atlas cluster, configure a database user, and allow your computer's IP address to connect.

The required database name is:

comp3123_assignment1

Add the MongoDB connection string to your .env file.

### 6. Start the Server

npm start

The API runs at:

http://localhost:3000

## API Endpoints

### User Endpoints

POST /api/v1/user/signup

Registers a new user and returns 201 Created.

POST /api/v1/user/login

Allows users to log in using a username or email and password.

A successful login returns 200 OK and a JWT.

### Employee Endpoints

All employee endpoints require a valid JWT.

GET /api/v1/emp/employees

Returns employees belonging to the logged-in user.

POST /api/v1/emp/employees

Creates an employee for the logged-in user.

GET /api/v1/emp/employees/:eid

Returns one employee belonging to the logged-in user.

PUT /api/v1/emp/employees/:eid

Updates an employee belonging to the logged-in user.

DELETE /api/v1/emp/employees?eid=xxx

Deletes an employee belonging to the logged-in user.

A successful deletion returns 204 No Content.

## Authentication

Users must register before logging in.

Passwords are hashed using bcryptjs before they are stored in MongoDB.

After logging in, the server generates a JWT that expires after one hour.

To access employee endpoints, the client must send the token in the Authorization header:

Authorization: Bearer YOUR_TOKEN

The server verifies the token before allowing access.

## Employee Ownership

Each employee has a user field containing the MongoDB ObjectId of the user who created them.

When an employee is created, the API gets the user's ID from the verified JWT.

When retrieving, updating, or deleting employees, the database query checks both the employee ID and the authenticated user's ID.

This prevents users from accessing employee records that do not belong to them.

I tested this using two different accounts. Both users were prevented from accessing the other user's employees.

## Input Validation

The API validates information submitted by users.

For signup, it checks the username, email, and password.

For employees, it checks names, email, position, salary, joining date, department, and employee IDs.

Invalid information returns 400 Bad Request with a JSON error message.

Duplicate usernames or emails return 409 Conflict.

## Security

### Password Hashing

User passwords are hashed using bcryptjs and are not returned in API responses.

### JWT

Employee routes are protected using JWT authentication.

Missing, invalid, and expired tokens are rejected.

### Helmet

Helmet adds security-related HTTP headers to the application.

### Rate Limiting

Rate limiting controls how many requests a client can send within a certain amount of time.

The general API limit is 100 requests per 15 minutes.

The signup and login endpoints share a stricter limit of 5 requests per 15 minutes.

If the limit is exceeded, the API returns:

429 Too Many Requests

### Environment Variables

Database credentials and JWT secrets are stored in the .env file.

The .gitignore file prevents .env and node_modules from being uploaded to GitHub.

## Logging

The application uses Morgan and the Node.js file system module to record HTTP requests locally.

Logs are stored in:

logs/app.log

The logs include timestamps, request methods, request paths, and response status codes.

Passwords, JWT values, and database credentials are not intentionally written to the request logs.

Generated logs are excluded from GitHub.

## Health Check

GET /health

The health-check endpoint confirms that the API server is running.

Expected response:

{
  "status": "OK",
  "message": "Employee Management API is running"
}

## Error Handling

The API uses HTTP status codes to indicate the result of a request.

- 200 - Successful request
- 201 - Resource created
- 204 - Resource deleted successfully
- 400 - Invalid request
- 401 - Missing or invalid authentication
- 403 - Forbidden access when applicable
- 404 - Resource or route not found
- 409 - Duplicate username or email
- 429 - Rate limit exceeded
- 500 - Internal server error

Error responses use JSON messages.

## Testing

I used Postman to test the API.

The tests include:

- User signup and login
- Duplicate registration
- Invalid user information
- Creating employees
- Getting all employees
- Getting one employee
- Updating employees
- Deleting employees
- Missing and invalid JWT
- Invalid employee ID
- Invalid JSON
- Unknown routes
- Employee ownership using two different users

The Postman collection is included with the assignment submission.

## GitHub

I used Git throughout development to keep track of the changes made to the project.

The repository includes the source code, project configuration, and documentation.

GitHub Repository:
https://github.com/judene-13/101503637_COMP3123_Assignment1
