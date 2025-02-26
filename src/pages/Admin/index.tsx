import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Products from './components/Products';
import Gallery from './components/Gallery';
import ContactRequests from './components/ContactRequests';
import SiteSettings from './components/SiteSettings';
import HomeSettings from './components/HomeSettings';
import PaymentSettings from './components/PaymentSettings';
import Login from './components/Login';

function Admin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="products" element={<Products />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contacts" element={<ContactRequests />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="home-settings" element={<HomeSettings />} />
        <Route path="payment" element={<PaymentSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default Admin;