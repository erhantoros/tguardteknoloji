import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import type { GalleryItem } from '../../../types';
import GalleryModal from './GalleryModal';

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setItems(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map(item => item.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Galeri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Görsel başarıyla silindi');
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Görsel silinirken bir hata oluştu');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Galeri</h1>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Görsel
        </button>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Tümü
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <p className="text-gray-400">Henüz görsel bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-400 mb-4">{item.description}</p>
                )}
                {item.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-400/10 text-blue-400 mb-4">
                    {item.category}
                  </span>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      <GalleryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchGallery}
        item={selectedItem || undefined}
      />
    </div>
  );
}

export default Gallery;