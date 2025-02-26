import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import FileUpload from '../../../components/FileUpload';

function SiteConfig() {
  const { settings, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    logo_url: '',
    company_name: '',
    primary_color: '#2563eb',
    facebook_url: '',
    instagram_url: '',
    whatsapp_number: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    whatsapp_message: 'Merhaba, bilgi almak istiyorum.',
    google_maps_url: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        logo_url: settings.logo_url || '',
        company_name: settings.company_name || '',
        primary_color: settings.primary_color || '#2563eb',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        whatsapp_number: settings.whatsapp_number || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        contact_address: settings.contact_address || '',
        whatsapp_message: settings.whatsapp_message || 'Merhaba, bilgi almak istiyorum.',
        google_maps_url: settings.google_maps_url || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Site Ayarları</h1>

      <div className="bg-gray-800 rounded-xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genel Ayarlar */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Genel Ayarlar</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Logo
                  </label>
                  <div className="space-y-2">
                    {formData.logo_url && (
                      <img
                        src={formData.logo_url}
                        alt="Logo"
                        className="w-32 h-32 object-contain rounded-lg bg-white p-2"
                      />
                    )}
                    <FileUpload onUpload={handleLogoUpload} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Ana Renk
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="h-10 w-20 bg-gray-700 border border-gray-600 rounded-lg"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">İletişim Bilgileri</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="+902425555555"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="info@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Adres
                  </label>
                  <textarea
                    name="contact_address"
                    value={formData.contact_address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Serik, Antalya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    name="google_maps_url"
                    value={formData.google_maps_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Sosyal Medya</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    WhatsApp Numarası
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="+905555555555"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    WhatsApp Varsayılan Mesaj
                  </label>
                  <textarea
                    name="whatsapp_message"
                    value={formData.whatsapp_message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Merhaba, bilgi almak istiyorum."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-700">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SiteConfig;