import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Package, Truck, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  items: Array<{
    product: {
      title: string;
      price: number;
    };
    quantity: number;
  }>;
}

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            quantity,
            product:products (
              title,
              price
            )
          )
        `)
        .eq('user_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'processing':
        return 'Hazırlanıyor';
      case 'shipped':
        return 'Kargoda';
      case 'delivered':
        return 'Teslim Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Siparişlerim</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <p>Henüz siparişiniz bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 space-y-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    Sipariş Tarihi: {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sipariş No: #{order.id.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} adet x{' '}
                        {item.product.price.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        })}
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.quantity * item.product.price).toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Toplam</span>
                  <span className="text-xl font-bold text-blue-600">
                    {order.total_amount.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;