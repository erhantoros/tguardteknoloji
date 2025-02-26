import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageTitle from '../components/PageTitle';
import type { Service } from '../types';

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Eğer hiç hizmet yoksa varsayılan hizmetleri ekle
      if (!data || data.length === 0) {
        const defaultServices = [
          {
            title: 'Bilgisayar Tamiri',
            description: 'Format atma, hızlandırma, donanım yükseltme ve sorun giderme hizmetleri.',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
            image_url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1000',
            features: [
              'Virüs ve malware temizleme',
              'Donanım arıza tespiti',
              'Parça değişimi ve yükseltme',
              'İşletim sistemi kurulumu'
            ]
          },
          {
            title: 'Güvenlik Kamera Sistemleri',
            description: 'Profesyonel kamera sistemleri kurulumu ve bakım hizmetleri.',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
            image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1000',
            features: [
              'HD/4K kamera sistemleri',
              'Gece görüş özelliği',
              'Uzaktan erişim desteği',
              '7/24 kayıt sistemi'
            ]
          },
          {
            title: 'Bilişim & Sunucu Çözümleri',
            description: 'Kurumsal ağ ve sunucu sistemleri kurulum ve yönetimi.',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',
            image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
            features: [
              'Sunucu kurulumu ve yönetimi',
              'Ağ altyapısı kurulumu',
              'Yedekleme çözümleri',
              'Güvenlik duvarı yapılandırması'
            ]
          }
        ];

        const { error: insertError } = await supabase
          .from('services')
          .insert(defaultServices);

        if (insertError) throw insertError;

        setServices(defaultServices);
      } else {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle 
          title="Hizmetlerimiz"
          subtitle="Modern teknoloji çözümleriyle işinizi güvence altına alıyoruz."
        />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz hizmet bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg z-20">
                    <div className="text-blue-600" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  {service.price && (
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                      {service.price} ₺
                    </p>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    Teklif Al
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;