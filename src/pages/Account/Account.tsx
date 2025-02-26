import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { LogOut, ShoppingCart, Heart, Lock, User } from 'lucide-react';

function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.error('Lütfen giriş yapın');
      navigate('/login'); // Kullanıcı giriş yapmadıysa yönlendir
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Siparişler çekilemedi:', error);
    } else {
      setOrders(data);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hesabım</h2>

      {/* Kullanıcı Bilgileri */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4">
        <User className="h-12 w-12 text-gray-600" />
        <div>
          <p className="text-gray-700"><strong>Ad Soyad:</strong> {user.user_metadata?.full_name || 'Bilinmiyor'}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-700"><strong>Giriş Tarihi:</strong> {new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
        </div>
      </div>

      {/* Sipariş Geçmişi */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-blue-600" /> Sipariş Geçmişi
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">Henüz siparişiniz bulunmamaktadır.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                <p><strong>Sipariş ID:</strong> {order.id}</p>
                <p><strong>Tarih:</strong> {new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                <p><strong>Toplam Tutar:</strong> {order.total_price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                <p><strong>Durum:</strong> <span className="text-blue-600 font-semibold">{order.status}</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Diğer Hesap Ayarları */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/favorites')}
          className="p-4 flex items-center justify-center gap-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          <Heart className="h-6 w-6" /> Favorilerim
        </button>

        <button
          onClick={() => navigate('/change-password')}
          className="p-4 flex items-center justify-center gap-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          <Lock className="h-6 w-6" /> Şifre Değiştir
        </button>
      </div>

      {/* Çıkış Yap Butonu */}
      <button
        onClick={() => {
          signOut();
          toast.success('Çıkış yapıldı');
          navigate('/'); // Çıkış yapınca anasayfaya yönlendir
        }}
        className="mt-6 w-full py-3 flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        <LogOut className="h-6 w-6" /> Çıkış Yap
      </button>
    </div>
  );
}

export default Account;
