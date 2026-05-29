import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageCategories from './admin/ManageCategories';
import ManageSubCategories from './admin/ManageSubCategories';
import ManageBrands from './admin/ManageBrands';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageCustomers from './admin/ManageCustomers';

import OrderTracking from './pages/OrderTracking';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 16, color: '#888' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public customer routes */}
            <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
            <Route path="/products" element={<WithNavbar><ProductList /></WithNavbar>} />
            <Route path="/products/:id" element={<WithNavbar><ProductDetail /></WithNavbar>} />
            <Route path="/cart" element={<WithNavbar><Cart /></WithNavbar>} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected customer routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <WithNavbar><Checkout /></WithNavbar>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <WithNavbar><Orders /></WithNavbar>
              </ProtectedRoute>
            } />

            <Route path="/orders/track/:id" element={
              <ProtectedRoute>
                <WithNavbar><OrderTracking /></WithNavbar>
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="subcategories" element={<ManageSubCategories />} />
              <Route path="brands" element={<ManageBrands />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="customers" element={<ManageCustomers />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;