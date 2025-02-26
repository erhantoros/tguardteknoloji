import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SocialLinks from '../components/SocialLinks';
import PageTitle from '../components/PageTitle';
import toast from 'react-hot-toast';

const serviceTypes = [
  'Bilgisayar Tamiri',
  'Güvenlik Kamera Sistemleri',
  'Bilişim & Sunucu Çözümleri',
  'Elektrik & Altyapı',
  'Siber Güvenlik',
  'Network Çözümleri',
  'Veri Kurtarma'
];

function Contact() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_forms')
        .insert([{
          ...formData,
          status: 'pending',
          notes: []
        }]);

      if (error) throw error;

      toast.success('Mesajınız başarıyla gönderildi!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle 
          title="İletişim"
          subtitle="Size en iyi hizmeti sunmak için buradayız. Bizimle iletişime geçin."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6">
                {settings?.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <a href={`tel:${settings.contact_phone}`} className="text-gray-600 hover:text-blue-600">
                        {settings.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium">E-posta</p>
                      <a href={`mailto:${settings.contact_email}`} className="text-gray-600 hover:text-blue-600">
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.contact_address && (
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium">Adres</p>
                      <p className="text-gray-600">{settings.contact_address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
                <SocialLinks iconClassName="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Bize Ulaşın</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Hizmet Türü
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    required
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    'Gönderiliyor...'
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;