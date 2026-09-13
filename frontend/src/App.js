import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages import
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InputData from './pages/InputData';
import ChatBot from './pages/ChatBot';
import FarmHistory from './pages/FarmHistory';

// ProtectedRoute component for authenticated routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('Farmer-ID');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const [user, setUser] = useState({ name: 'Farmer', isAuthenticated: false });
  const [historyRecords, setHistoryRecords] = useState([]);

  useEffect(() => {
    // Check if token exists on initial app load
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName') || 'Farmer';
    if (token) {
      setUser({ name: userName, isAuthenticated: true });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} 
        />
        <Route 
          path="/input-data" 
          element={<ProtectedRoute><InputData setHistoryRecords={setHistoryRecords} /></ProtectedRoute>} 
        />
        <Route 
          path="/chatbot" 
          element={<ProtectedRoute><ChatBot /></ProtectedRoute>} 
        />
        <Route 
          path="/farm-history" 
          element={<ProtectedRoute><FarmHistory historyRecords={historyRecords} /></ProtectedRoute>} 
        />
        {/* Route alias for history */}
        <Route 
          path="/history" 
          element={<Navigate to="/farm-history" replace />} 
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}