import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Pages
import LandingPage from './pages/Landing'
import PricingPage from './pages/Pricing'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import { useAuthStore } from './store'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" />
}

function App() {
  const { i18n } = useTranslation()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard/*"
          element={
            
              <DashboardPage />
            
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
