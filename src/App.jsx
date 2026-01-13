// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ToolLoanForm from './components/ToolLoanForm';
import ApprovalPanel from './components/ApprovalPanel';
import SuppliesPage from './components/SuppliesPage';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';

// Protected Route untuk user yang sudah login
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Public Route untuk user yang belum login
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/loan" element={
        <ProtectedRoute allowedRoles={['karyawan', 'admin']}>
          <Layout>
            <ToolLoanForm />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/supplies" element={
        <ProtectedRoute allowedRoles={['karyawan', 'admin']}>
          <Layout>
            <SuppliesPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/approvals" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <ApprovalPanel />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;