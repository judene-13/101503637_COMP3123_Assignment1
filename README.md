# COMP3123 Assignment 1 - Employee Management REST API

**Student ID:** 101503637  
**Course:** COMP3123 - Full Stack Development  
**Project:** Employee Management REST API

## About My Project

For Assignment 1, I built an Employee Management REST API using Node.js, Express, and MongoDB.

The main purpose of my application is to allow users to register, log in, and manage employee information. Each user can add, view, update, and delete their own employees.

One of the important parts of this assignment was making sure users could not access employees belonging to another account. I used JWT authentication and MongoDB relationships to manage this.

I also added security features such as password hashing, input validation, Helmet, and rate limiting.

## Technologies I Used

- **Node.js:** Runs my backend application.
- **Express.js:** Handles the API routes and HTTP requests.
- **MongoDB Atlas:** Stores my users and employees.
- **Mongoose:** Helps me create schemas and work with MongoDB.
- **bcryptjs:** Hashes user passwords before saving them.
- **jsonwebtoken:** Generates and verifies JWT tokens.
- **express-validator:** Checks incoming user and employee information.
- **Helmet:** Adds security headers to HTTP responses.
- **express-rate-limit:** Limits how many requests can be made within a certain time.
- **Morgan:** Records HTTP request information.
- **dotenv:** Loads configuration values from my `.env` file.
- **Postman:** Used to test my API endpoints.
- **Git and GitHub:** Used to track my changes and store my project.

## Project Structure

I separated my code into different folders to make the application easier to understand and manage.

```text
101503637_COMP3123_Assignment1/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── userController.js
│   └── employeeController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   └── Employee.js
│
├── routes/
│   ├── userRoutes.js
│   └── employeeRoutes.js
│
├── utils/
│   └── logger.js
│
├── logs/
│   └── app.log (generated locally)
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

The `server.js` file starts the application, while the other files handle specific parts of the backend.

The `.env` file and `node_modules` folder are not included in GitHub.

## How to Set Up and Run My Project

### 1. Clone the Repository

Open Git Bash or the VS Code terminal and run:

```bash
git clone https://github.com/judene-13/101503637_COMP3123_Assignment1.git
```

Go inside the project folder:

```bash
cd 101503637_COMP3123_Assignment1
```

### 2. Install Dependencies

Run:

```bash
npm install
```

This installs the packages listed in `package.json`.

### 3. Configure MongoDB

I used MongoDB Atlas instead of installing MongoDB Server locally.

To use the application, create a MongoDB Atlas cluster, set up a database user, and allow your computer's IP address to connect.

The database name must be:

`comp3123_assignment1`

### 4. Create the Environment File

Create a `.env` file in the main project folder.

Use `.env.example` as a guide:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_jwt_secret
```

Replace the example values with your own configuration.

I kept my actual MongoDB password and JWT secret out of GitHub because they are private information.

### 5. Start the Application

Run:

```bash
npm start
```

The server should connect to MongoDB and start on port 3000.

The API can then be accessed at:

`http://localhost:3000`

## API Endpoints

I created two main groups of endpoints: User and Employee.

### User Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/api/v1/user/signup` | Creates a new user account | 201 |
| POST | `/api/v1/user/login` | Logs in using a username or email | 200 |

For signup, the user provides a username, email, and password.

For login, the application checks the user's credentials and returns a JWT if they are correct.

### Employee Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/v1/emp/employees` | Gets the logged-in user's employees | 200 |
| POST | `/api/v1/emp/employees` | Creates an employee | 201 |
| GET | `/api/v1/emp/employees/:eid` | Gets an employee using their ID | 200 |
| PUT | `/api/v1/emp/employees/:eid` | Updates an employee | 200 |
| DELETE | `/api/v1/emp/employees?eid=xxx` | Deletes an employee | 204 |

All employee endpoints require a valid JWT token.

For a successful DELETE request, the application returns `204 No Content`, so there is no JSON response body.

## How Authentication Works

When a user signs up, the password is hashed using bcryptjs before being saved in MongoDB.

This means the database does not store the original password.

When logging in, the application compares the password entered by the user with the stored password hash.

If they match, the server generates a JWT that expires after one hour.

The token must be sent with protected employee requests using the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

I used Postman to test what happens when a token is missing, invalid, or expired.

The API rejects requests that do not have valid authentication.

## MongoDB Relationship and Employee Ownership

This was one of the more important parts of my assignment.

I created two Mongoose models, `User` and `Employee`.

Each employee has a `user` field that stores the ObjectId of the user who created the employee.

When an employee is created, the application gets the user ID from the verified JWT instead of accepting an owner ID from the request body.

For retrieving, updating, and deleting an employee, the application checks both the employee ID and the logged-in user's ID.

This is important because knowing another employee's ID should not give someone permission to access that record.

### How I Tested Ownership

I created two test accounts:

- **User A:** `testuser1`
- **User B:** `employeeuserB`

User A created Maya Williams, while User B created Daniel Brown.

I tested whether User B could retrieve, update, or delete Maya's information. These requests returned `404 Employee not found`.

I also tested User A trying to retrieve Daniel's information, which returned the same response.

These tests helped me confirm that the employee ownership checks were working in both directions.

## Input Validation

I used `express-validator` to check the information being sent to the API.

For user registration, the application checks the username, email, and password.

For employees, it checks information such as:

- First and last name
- Email address
- Position
- Salary
- Date of joining
- Department
- Employee ID

For example, an employee ID must be a valid MongoDB ObjectId.

Invalid information returns `400 Bad Request` with an error message.

I also tested registering an account with an existing username or email, which returned `409 Conflict`.

## Security Features

### Password Hashing

I used bcryptjs to hash passwords before saving them.

The password hash is not returned in normal API responses.

### JWT Authentication

I used JWT authentication to protect employee routes.

A user must log in and provide a valid Bearer Token to access these endpoints.

### Helmet

I added Helmet to help secure the application by setting HTTP security headers.

These headers provide additional browser-related protections.

### Rate Limiting

I added rate limiting to help prevent someone from sending too many requests in a short period.

The general API allows up to **100 requests every 15 minutes per IP address**.

The signup and login endpoints have a stricter shared limit of **5 requests every 15 minutes per IP address**.

If the limit is exceeded, the application returns `429 Too Many Requests`.

### Environment Variables

I used dotenv to keep configuration values outside my main JavaScript files.

My `.gitignore` excludes `.env`, `node_modules`, and generated logs.

## Application Logging

I used Morgan and Node.js file handling to save HTTP request information locally.

The log file is created at:

`logs/app.log`

The request logs include the date and time, HTTP method, request path, and response status.

For example, the log can show when someone makes a GET request to `/health` or receives an error status.

The request logger does not intentionally record passwords, request bodies, JWT values, or database credentials.

Generated log files are excluded from GitHub, but logging can be demonstrated by running requests through Postman and opening `logs/app.log`.

## Health Check

I created a health-check endpoint to confirm the server is running.

**Method:** GET

**Endpoint:** `/health`

Expected response:

```json
{
  "status": "OK",
  "message": "Employee Management API is running"
}
```

This endpoint returns `200 OK` when the Express application is running.

## Error Handling and HTTP Status Codes

I added error handling so the application returns JSON messages when something goes wrong.

Some of the HTTP status codes used in my project are:

| Status | Meaning |
|---|---|
| 200 | Request completed successfully |
| 201 | User or employee created |
| 204 | Employee deleted successfully |
| 400 | Invalid request information |
| 401 | Missing, invalid, or expired authentication |
| 403 | Forbidden request, where applicable |
| 404 | Employee or route not found |
| 409 | Username or email already exists |
| 429 | Too many requests |
| 500 | Server error |

For employee ownership checks, I return `404` when a record does not belong to the logged-in user. This avoids revealing another user's employee information.

## Testing With Postman

I used Postman throughout the assignment instead of waiting until the end to test everything.

I tested the endpoints as I built them, which made it easier to see whether something was working before moving on.

Some of the tests included:

- Registering new users
- Logging in using a username and password
- Getting a JWT token
- Rejecting duplicate registrations
- Creating employees
- Viewing all employees
- Getting an employee using their ID
- Updating an employee's information
- Deleting an employee and receiving `204 No Content`
- Sending requests without a JWT
- Testing invalid employee IDs
- Testing malformed JSON
- Testing unknown routes
- Checking employee ownership using two different accounts

One issue I ran into during testing was forgetting to add the Bearer Token to employee requests. Postman returned `401 Unauthorized`, which helped me understand why authentication is required before accessing the employee APIs.

I also learned that I needed to use the actual MongoDB employee ID instead of leaving a placeholder in the URL.

The exported Postman collection contains the saved API requests for testing.

## What I Learned

This assignment helped me understand how the different parts of a backend application work together.

Before this project, I had mostly worked with smaller Express exercises. This time I had to connect a database, create models, handle different API requests, and make sure user information was protected.

The part that took the most attention was JWT authentication and employee ownership because I had to test the application using different accounts.

I also got more practice using Git, MongoDB Atlas, VS Code, and Postman.

Overall, the assignment helped me understand why backend development involves more than just creating endpoints. It also involves checking the information users send, controlling access, and handling errors properly.

## GitHub Repository

[COMP3123 Assignment 1 - Employee Management REST API](https://github.com/judene-13/101503637_COMP3123_Assignment1)

The repository includes my source code, configuration examples, Git commit history, and project documentation.