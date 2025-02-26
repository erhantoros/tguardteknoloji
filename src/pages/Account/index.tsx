import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import OrderHistory from './components/OrderHistory';
import Profile from './components/Profile';

function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Siparişlerim
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profilim
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'orders' && <OrderHistory />}
              {activeTab === 'profile' && <Profile />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;