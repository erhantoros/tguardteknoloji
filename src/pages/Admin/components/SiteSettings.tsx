import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import FileUpload from '../../../components/FileUpload';
import toast from 'react-hot-toast';

function SiteSettings() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    company_name: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    social_facebook: '',
    social_instagram: '',
    social_whatsapp: '',
    whatsapp_message: 'Merhaba, bilgi almak istiyorum.',
    logo_url: '',
    primary_color: '#2563eb'
  });

  // Settings değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        contact_address: settings.contact_address || '',
        social_facebook: settings.social_facebook || '',
        social_instagram: settings.social_instagram || '',
        social_whatsapp: settings.social_whatsapp || '',
        whatsapp_message: settings.whatsapp_message || 'Merhaba, bilgi almak istiyorum.',
        logo_url: settings.logo_url || '',
        primary_color: settings.primary_color || '#2563eb'
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await updateSettings(formData);
      if (error) throw error;
      toast.success('Ayarlar başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
    // Logo yüklendiğinde otomatik kaydet
    updateSettings({ ...formData, logo_url: url })
      .then(({ error }) => {
        if (error) throw error;
        toast.success('Logo başarıyla güncellendi');
      })
      .catch((error) => {
        console.error('Error updating logo:', error);
        toast.error('Logo güncellenirken bir hata oluştu');
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

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
                    Logo
                  </label>
                  <div className="space-y-2">
                    {formData.logo_url && (
                      <div className="relative w-32 h-32 bg-white rounded-lg p-2">
                        <img
                          src={formData.logo_url}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <FileUpload 
                      onUpload={handleLogoUpload} 
                      accept="image/*" 
                      maxSize={2} 
                    />
                    <p className="text-sm text-gray-400">
                      Önerilen boyut: 200x200px, Maksimum boyut: 2MB
                    </p>
                  </div>
                </div>

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
                    required
                  />
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
                    name="social_facebook"
                    value={formData.social_facebook}
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
                    name="social_instagram"
                    value={formData.social_instagram}
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
                    name="social_whatsapp"
                    value={formData.social_whatsapp}
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

export default SiteSettings;