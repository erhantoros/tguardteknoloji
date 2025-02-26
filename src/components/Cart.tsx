import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import PaymentModal from './PaymentModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

function Cart({ isOpen, onClose }: CartProps) {
  const { items, loading, updateQuantity, removeItem, total } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-[60]" // Z-index artırıldı
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-gray-900 mr-2" />
              <h2 className="text-xl font-semibold">Sepetim</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 max-h-96"> {/* max-h-96 ile içerik genişletildi */}
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p>Sepetiniz boş</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white rounded-lg border p-4"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-blue-600 font-semibold">
                        {item.product.price?.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Toplam</span>
                <span className="text-2xl font-bold text-blue-600">
                  {total.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  })}
                </span>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ödemeye Geç
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        items={items}
        total={total}
      />
    </div>
  );
}

export default Cart;
