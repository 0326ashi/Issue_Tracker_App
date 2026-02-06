import { Navigate, Route, Routes } from 'react-router-dom'
import './styles/auth.css'
import './styles/dashboard.css'
import CreateIssue from './pages/CreateIssue'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/issues/new" element={<CreateIssue />} />
    </Routes>
  )
}

export default App
