import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { isAuthenticated } from './utils/auth.js'
import SavedSchemesPage from './pages/SavedSchemesPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { AppSettingsProvider } from './context/AppSettingsContext.jsx'
import ApplyPage from './pages/ApplyPage.jsx'
import LearnMorePage from './pages/LearnMorePage.jsx'
import SetupProfilePage from './pages/SetupProfilePage.jsx'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''
axios.defaults.withCredentials = true

function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppSettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedSchemesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <ApplyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route
            path="/setup-profile"
            element={
              <ProtectedRoute>
                <SetupProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppSettingsProvider>
  </StrictMode>,
)
