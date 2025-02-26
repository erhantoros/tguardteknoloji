import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import type { Product } from '../../../types';
import ProductModal from './ProductModal';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Ürün başarıyla silindi');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ürün silinirken bir hata oluştu');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ürünler</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Ürün
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <p className="text-gray-400">Henüz ürün bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                <div className="space-y-1 mb-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchProducts}
        product={selectedProduct || undefined}
      />
    </div>
  );
}

export default Products;