# SpendWise — Student Expense Tracker

## 1. Project Overview

SpendWise is a beginner-friendly full-stack web application that helps students track and manage their daily expenses.

The application allows a student to add, view, edit, delete, and categorize expenses. It also provides a dashboard showing total spending and category-wise spending.

The application will be developed using the MERN stack:

* MongoDB — Database
* Express.js — Backend framework
* React.js — Frontend
* Node.js — Backend runtime

The project will use Git and GitHub for source-code management and will be deployed online so that a live rendered URL can be submitted.

---

## 2. Main Features

### Expense Management

A student can:

* Add a new expense
* View all expenses
* View individual expense details
* Edit an existing expense
* Delete an expense

### Expense Information

Each expense should contain:

* Title
* Amount
* Category
* Date
* Description

### Categories

The initial categories are:

* Food
* Travel
* Education
* Shopping
* Entertainment
* Health
* Other

### Dashboard

The dashboard should display:

* Total expenses
* Total spending for the current month
* Number of transactions
* Category-wise spending
* Recent expenses

### Search and Filtering

The user should be able to:

* Search expenses by title
* Filter expenses by category
* Filter expenses by date/month

---

## 3. User Flow

1. User opens SpendWise.
2. User sees the dashboard.
3. User clicks "Add Expense".
4. User enters expense details.
5. Frontend validates the input.
6. Frontend sends the expense data to the backend API.
7. Backend validates the request.
8. Backend stores the expense in MongoDB.
9. Dashboard refreshes and displays the new expense.
10. User can later edit or delete the expense.
11. Dashboard statistics update based on the stored expenses.

---

## 4. Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Development Tools

* VS Code
* Git
* GitHub
* AI coding assistant

### Deployment

The application should be deployed using a suitable hosting platform such as Render.

---

## 5. System Architecture

The application follows a three-layer architecture:

```text
React Frontend
      |
      | HTTP / REST API
      v
Express + Node.js Backend
      |
      | Mongoose
      v
MongoDB Atlas
```

### Frontend Responsibilities

* Display dashboard
* Display expense list
* Provide expense form
* Validate user input
* Send API requests
* Display success/error messages
* Update the UI after CRUD operations

### Backend Responsibilities

* Provide REST API endpoints
* Validate incoming data
* Perform CRUD operations
* Communicate with MongoDB
* Return appropriate HTTP responses
* Handle errors

### Database Responsibilities

MongoDB stores all expense records.

---

## 6. Project Folder Structure

The project should use a clear separation between frontend and backend.

```text
SpendWise/
│
├── architecture.md
├── README.md
├── .gitignore
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
└── server/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── config/
    ├── server.js
    ├── package.json
    └── .env
```

The exact folder structure may be adjusted by the coding agent if there is a strong technical reason.

---

## 7. MongoDB Data Model

Create an `Expense` collection.

Example expense document:

```javascript
{
  title: "Lunch",
  amount: 180,
  category: "Food",
  date: "2026-09-30",
  description: "College canteen lunch",
  createdAt: "...",
  updatedAt: "..."
}
```

### Fields

| Field       | Type   | Required  | Description                     |
| ----------- | ------ | --------- | ------------------------------- |
| title       | String | Yes       | Name of the expense             |
| amount      | Number | Yes       | Expense amount                  |
| category    | String | Yes       | Expense category                |
| date        | Date   | Yes       | Date of expense                 |
| description | String | No        | Optional additional information |
| createdAt   | Date   | Automatic | Creation timestamp              |
| updatedAt   | Date   | Automatic | Last update timestamp           |

---

## 8. API Endpoints

### Create Expense

```text
POST /api/expenses
```

Creates a new expense.

### Get All Expenses

```text
GET /api/expenses
```

Returns all expenses.

### Get Single Expense

```text
GET /api/expenses/:id
```

Returns one expense by ID.

### Update Expense

```text
PUT /api/expenses/:id
```

Updates an existing expense.

### Delete Expense

```text
DELETE /api/expenses/:id
```

Deletes an expense.

---

## 9. Frontend Components

Suggested components:

### Navbar

Displays the application name and basic navigation.

### Dashboard

Displays:

* Total spending
* Monthly spending
* Number of expenses
* Category summary
* Recent expenses

### ExpenseForm

Used to:

* Add expenses
* Edit expenses

### ExpenseList

Displays all expenses.

### ExpenseCard

Displays an individual expense with:

* Title
* Amount
* Category
* Date
* Description
* Edit button
* Delete button

### Filters

Allows filtering by:

* Category
* Date/month

---

## 10. Validation Rules

The application should validate:

* Title must not be empty.
* Amount must be greater than zero.
* Category must be selected.
* Date must be provided.
* Description is optional.
* Invalid MongoDB IDs should return an appropriate error.
* The backend must also validate data instead of relying only on frontend validation.

---

## 11. Error Handling

The application should handle:

* Empty required fields
* Invalid amount
* Negative amount
* Invalid date
* Database connection failure
* Server errors
* Invalid expense ID
* Expense not found
* Network/API errors

User-friendly error messages should be displayed on the frontend.

---

## 12. Security and Environment Variables

Sensitive information must not be committed to GitHub.

The backend should use a `.env` file for configuration such as:

```text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

The `.env` file must be included in `.gitignore`.

Never expose the MongoDB connection string publicly.

---

## 13. Edge Cases

The application should consider:

1. User enters zero as the amount.
2. User enters a negative amount.
3. User submits the form without a title.
4. User does not select a category.
5. User enters a very large amount.
6. User tries to edit an expense that no longer exists.
7. User tries to delete an expense that no longer exists.
8. MongoDB is temporarily unavailable.
9. Backend server is unavailable.
10. No expenses exist yet.
11. Search returns no results.
12. A category has no expenses.
13. User enters an invalid date.

---

## 14. Dashboard Calculations

The frontend should calculate or receive from the backend:

* Total number of expenses
* Total amount spent
* Current month's total
* Category-wise totals
* Recent expenses

For the first version, calculations can be performed from the fetched expense data on the frontend.

The implementation can be improved later if needed.

---

## 15. Development Phases

### Phase 1 — Project Setup

* Create React frontend using Vite.
* Create Node.js/Express backend.
* Configure project structure.
* Install required dependencies.

### Phase 2 — Database

* Create MongoDB Atlas database.
* Create Mongoose Expense model.
* Configure environment variables.
* Connect backend to MongoDB.

### Phase 3 — Backend API

Implement:

* Create expense
* Read expenses
* Read single expense
* Update expense
* Delete expense

### Phase 4 — Frontend

Build:

* Dashboard
* Expense form
* Expense list
* Expense cards
* Filters
* Edit/delete functionality

### Phase 5 — Integration

Connect React frontend to Express backend.

Verify that all CRUD operations work with MongoDB.

### Phase 6 — Testing and Debugging

Test:

* Adding expenses
* Editing expenses
* Deleting expenses
* Filtering
* Dashboard calculations
* Validation
* Error handling

Use AI assistance to identify and fix bugs, but verify every AI-generated change.

### Phase 7 — GitHub

* Initialize Git.
* Create `.gitignore`.
* Commit the project.
* Create a GitHub repository.
* Push the project to GitHub.
* Verify that `.env` is not committed.

### Phase 8 — Deployment

Deploy the backend and frontend.

Configure required environment variables on the hosting platform.

Verify the live application.

---

## 16. AI-Assisted Development Rules

The developer should use AI assistance responsibly.

Before accepting AI-generated code:

1. Understand what the code does.
2. Check whether it follows the architecture.
3. Verify dependencies.
4. Check for security issues.
5. Run the application.
6. Test the feature.
7. Fix errors using AI assistance when appropriate.

Do not blindly accept generated code.

---

## 17. Minimum Viable Product

The first working version must support:

* Add expense
* View expenses
* Edit expense
* Delete expense
* Category selection
* Expense amount
* Expense date
* Dashboard total
* MongoDB persistence
* Responsive basic UI

Additional features should only be added after the core application works.

---

## 18. Future Enhancements

Possible future features:

* User authentication
* Multiple student accounts
* Monthly budget
* Budget alerts
* Charts and graphs
* Export expenses to CSV
* Dark mode
* Recurring expenses
* AI-based spending insights

These features are not required for the initial version.

---

## 19. Success Criteria

The project is considered complete when:

* The React frontend runs successfully.
* The Express backend runs successfully.
* MongoDB Atlas connection works.
* Expenses can be created.
* Expenses can be viewed.
* Expenses can be edited.
* Expenses can be deleted.
* Dashboard statistics work.
* Validation works.
* The code is pushed to GitHub.
* The application is deployed.
* The deployed URL works in a browser.
