import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import type { Service } from '../../../types';
import ServiceModal from './ServiceModal';

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Hizmetler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Hizmet başarıyla silindi');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Hizmet silinirken bir hata oluştu');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Hizmetler</h1>
        <button
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Hizmet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <p className="text-gray-400">Henüz hizmet bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="p-6">
                <div className="text-blue-400 mb-4">
                  <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                {service.price && (
                  <p className="text-lg font-semibold text-white mb-4">
                    {service.price} ₺
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchServices}
        service={selectedService || undefined}
      />
    </div>
  );
}

export default Services;