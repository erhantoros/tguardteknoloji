import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Modal from '../../../components/Modal';
import FileUpload from '../../../components/FileUpload';
import toast from 'react-hot-toast';
import { Monitor, Camera, Server, Wrench, Shield, Wifi, HardDrive } from 'lucide-react';
import type { Service } from '../../../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Service;
}

// Available icons with their SVG paths
const availableIcons = [
  { name: 'Monitor', icon: Monitor, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' },
  { name: 'Camera', icon: Camera, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>' },
  { name: 'Server', icon: Server, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>' },
  { name: 'Wrench', icon: Wrench, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' },
  { name: 'Shield', icon: Shield, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' },
  { name: 'Wifi', icon: Wifi, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>' },
  { name: 'HardDrive', icon: HardDrive, path: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>' }
];

function ServiceModal({ isOpen, onClose, onSuccess, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    image_url: '',
    price: '',
    features: ['']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        image_url: service.image_url || '',
        price: service.price?.toString() || '',
        features: service.features
      });
    } else {
      setFormData({
        title: '',
        description: '',
        icon: availableIcons[0].path,
        image_url: '',
        price: '',
        features: ['']
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (service) {
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', service.id);

        if (error) throw error;
        toast.success('Hizmet başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([data]);

        if (error) throw error;
        toast.success('Hizmet başarıyla eklendi');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
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
      title={service ? 'Hizmet Düzenle' : 'Yeni Hizmet'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            İkon
          </label>
          <div className="grid grid-cols-4 gap-4">
            {availableIcons.map(({ name, icon: Icon, path }) => (
              <button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, icon: path })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.icon === path
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto" />
                <span className="text-xs mt-2 block text-center">{name}</span>
              </button>
            ))}
          </div>
        </div>

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
            Arkaplan Resmi
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
            <p className="text-sm text-gray-400">
              Önerilen boyut: 800x600px, Maksimum boyut: 2MB
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Fiyat (Opsiyonel)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="0.00"
            step="0.01"
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

export default ServiceModal;