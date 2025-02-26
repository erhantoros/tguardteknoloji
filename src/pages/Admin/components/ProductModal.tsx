import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Modal from '../../../components/Modal';
import FileUpload from '../../../components/FileUpload';
import { useCategories } from '../../../hooks/useCategories';
import toast from 'react-hot-toast';
import type { Product } from '../../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const { categories, loading: loadingCategories } = useCategories('product');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    features: [''],
    is_featured: false,
    featured_order: 0,
    price: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        image_url: product.image_url,
        category: product.category,
        features: product.features,
        is_featured: product.is_featured || false,
        featured_order: product.featured_order || 0,
        price: product.price?.toString() || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: categories[0] || '',
        features: [''],
        is_featured: false,
        featured_order: 0,
        price: ''
      });
    }
  }, [product, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', product.id);

        if (error) throw error;
        toast.success('Ürün başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([data]);

        if (error) throw error;
        toast.success('Ürün başarıyla eklendi');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Ürün Düzenle' : 'Yeni Ürün'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Başlık
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Açıklama
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Görsel
          </label>
          <div className="space-y-2">
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <FileUpload onUpload={handleImageUpload} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Fiyat (TL)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Özellikler
          </label>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Özellik ekleyin"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            + Özellik Ekle
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-200">
              Öne Çıkan Ürün
            </label>
          </div>

          {formData.is_featured && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Sıralama (Düşük sayı = Daha önce gösterilir)
              </label>
              <input
                type="number"
                min="0"
                value={formData.featured_order}
                onChange={(e) => setFormData({ ...formData, featured_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductModal;