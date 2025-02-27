import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hesabım</h2>
        <div className="mb-6">
          <p className="text-lg font-medium">{user?.email}</p>
          <p className="text-gray-500">{user?.id}</p>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" /> Çıkış Yap
        </button>
      </div>

      <div className="w-full max-w-3xl mt-6 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" /> Siparişlerim
        </h3>
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">Henüz siparişiniz bulunmamaktadır.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="border p-4 rounded-lg">
                <p className="font-medium">Sipariş ID: {order.id}</p>
                <p className="text-gray-500">Tarih: {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-gray-900 font-bold">Toplam: {order.total_amount} TL</p>
                <p className="text-gray-500">Durum: {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Account;
