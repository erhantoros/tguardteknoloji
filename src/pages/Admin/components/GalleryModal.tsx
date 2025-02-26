import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Modal from '../../../components/Modal';
import MultiFileUpload from '../../../components/MultiFileUpload';
import toast from 'react-hot-toast';
import type { GalleryItem } from '../../../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: GalleryItem;
}

function GalleryModal({ isOpen, onClose, onSuccess, item }: GalleryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[],
    category: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        images: item.images || [item.image_url],
        category: item.category || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        images: [],
        category: ''
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        image_url: formData.images[0], // Ana resim olarak ilk resmi kullan
        images: formData.images // Tüm resimleri images dizisinde sakla
      };

      if (item) {
        const { error } = await supabase
          .from('gallery')
          .update(data)
          .eq('id', item.id);

        if (error) throw error;
        toast.success('Galeri öğesi başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([data]);

        if (error) throw error;
        toast.success('Galeri öğesi başarıyla eklendi');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Galeri Öğesini Düzenle' : 'Yeni Galeri Öğesi'}
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Görseller
          </label>
          <div className="space-y-4">
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <MultiFileUpload
              onUpload={handleImageUpload}
              accept="image/*"
              maxSize={2}
              maxFiles={10}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Kategori
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
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
            disabled={loading || formData.images.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default GalleryModal;