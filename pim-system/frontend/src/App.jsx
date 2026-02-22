import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, LoginPage, RegisterPage } from './pages/Auth';
import ProductsPage from './pages/Products';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app">
      <nav className="navbar">
        <h1>📦 PIM System</h1>
        {isAuthenticated && (
          <div className="nav-right">
            <span>Welcome, {user?.username}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/products" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
