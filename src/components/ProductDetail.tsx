import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import PaymentModal from './PaymentModal';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addItem } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-64 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                
                {product.price && (
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    {product.price.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    })}
                  </p>
                )}

                <div className="prose prose-sm text-gray-600 mb-6">
                  <p>{product.description}</p>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="font-semibold text-gray-900">Özellikler</h3>
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Sepete Ekle
                  </button>

                  {product.price && (
                    <button
                      onClick={() => setShowPayment(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="h-5 w-5" />
                      Hemen Satın Al
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        product={product}
      />
    </div>
  );
}

export default ProductDetail;