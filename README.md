# 💰 Finance Data Processing & Access Control Backend

A backend system designed to manage financial records with secure role-based access control. This project demonstrates clean backend architecture, API design, authentication, and data handling.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- SQLite (Sequelize ORM)
- JWT Authentication
- bcrypt (Password Hashing)

---

## 📌 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-Based Access Control (RBAC)

### 👥 User Roles
- **Admin** → Full access (CRUD + user management)
- **Analyst** → Read data + dashboard insights
- **Viewer** → Read-only access

### 💳 Financial Records
- Create, Read, Update, Delete (CRUD)
- Fields:
  - Amount
  - Type (Income / Expense)
  - Category
  - Date
  - Notes

### 🔍 Filtering
- Filter records by:
  - Type
  - Category

### 📊 Dashboard APIs
- Total Income
- Total Expense
- Net Balance

### ⚙️ Other Features
- Input Validation
- Error Handling
- Clean MVC Structure

---

## 📂 Project Structure
