# 🐞 Issue Tracker Application

A full-stack Issue Tracker application that allows users to create, manage, track, and resolve issues efficiently.
The system supports CRUD operations, user authentication, and a clean, user-friendly interface.

## 📌 Features
### 🔐 Authentication
- User registration and login
- Secure password hashing
- Authentication using JWT 

### 📝 Issue Management 
- Create, view, update, and delete issues
- Track issue status (Open, In Progress, Resolved)
- Filter issues by status, priority & severity

### 🎨 User Interface
- Search and filter issues
- Clear status indicators

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
npm run dev
```




