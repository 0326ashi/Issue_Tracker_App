# 🐞 Issue Tracker Application

A full-stack Issue Tracker application that allows users to create, manage, track, and resolve issues efficiently.
The system supports CRUD operations, user authentication, and a clean, user-friendly interface.

## 📌 Features
### 🔐 Authentication
- User registration and login
- Secure password hashing
- Authentication using JWT 

### 📝 Issue Management 
- Create new issues with title, description, and other details
- View detailed information for individual issues
- Update existing issue details
- Change issue status to In Progress or Resolved
- View issue count by status
- Search and filter issues based on multiple criteria
- Delete issues when they are no longer required

### 🎨 User Interface
- Easy navigation between issue lists and details
- Visual indicators for issue status

## ⚙️ Setup Instructions
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/0326ashi/Issue_Tracker_App.git
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
### Create a .env file in the backend folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### Run the backend:
```bash
npm run dev
```
## 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```
### Run the frontend:
```bash
npm start
```

## 🧰 Tech Stack
**Frontend**: React, Vite, TypeScript

**Backend**: Node.js, Express.js, MongoDB, JWT for authentication






