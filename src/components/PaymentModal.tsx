import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    title: string;
    price: number;
  };
  items?: CartItem[];
  total?: number;
}

function PaymentModal({ isOpen, onClose, product, items, total }: PaymentModalProps) {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
  });
  const [showCompanyFields, setShowCompanyFields] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        sessionStorage.setItem('paymentFormData', JSON.stringify({
          ...formData,
          product: product,
          items: items,
          total: total
        }));
        navigate('/auth/login');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_email: formData.email,
          user_name: formData.name,
          user_phone: formData.phone,
          user_address: formData.address,
          company_name: showCompanyFields ? formData.companyName : null,
          tax_office: showCompanyFields ? formData.taxOffice : null,
          tax_number: showCompanyFields ? formData.taxNumber : null,
          total_amount: total || (product?.price || 0),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (items) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        clearCart();
      } else if (product) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: product.id,
            quantity: 1,
            price: product.price
          });

        if (itemError) throw itemError;
      }

      toast.success('Siparişiniz başarıyla oluşturuldu');
      onClose();
      navigate('/account');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = total || (product?.price || 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-screen z-[80]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[70vh]">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {items ? 'Sepet Toplamı' : product?.title}
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {totalAmount.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  İşleniyor...
                </>
              ) : (
                'Ödemeye Geç'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentModal;
