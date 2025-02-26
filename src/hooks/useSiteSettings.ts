import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface SiteSettings {
  id: string;
  logo_url: string;
  company_name: string;
  primary_color: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_whatsapp: string;
  whatsapp_message: string;
  created_at: string;
  updated_at: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (fetchError) {
        // Eğer veri yoksa, varsayılan ayarları oluştur
        if (fetchError.code === 'PGRST204') {
          const { data: newData, error: insertError } = await supabase
            .from('site_settings')
            .insert([{
              company_name: 'TGuard Teknoloji',
              primary_color: '#2563eb',
              whatsapp_message: 'Merhaba, bilgi almak istiyorum.'
            }])
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newData);

          // Logo değiştiğinde favicon'u güncelle
          if (newData?.logo_url) {
            updateFavicon(newData.logo_url);
          }
          return;
        }
        throw fetchError;
      }

      setSettings(data);
      
      // Logo değiştiğinde favicon'u güncelle
      if (data?.logo_url) {
        updateFavicon(data.logo_url);
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast.error('Site ayarları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      let { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (existingSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update(newSettings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([newSettings]);

        if (error) throw error;
      }

      await fetchSettings();
      toast.success('Ayarlar başarıyla güncellendi');

      // Logo değiştiğinde favicon'u güncelle
      if (newSettings.logo_url) {
        updateFavicon(newSettings.logo_url);
      }

      return { error: null };
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('Ayarlar güncellenirken bir hata oluştu');
      return { error };
    }
  };

  // Favicon'u güncelle
  const updateFavicon = (logoUrl: string) => {
    // Mevcut favicon elementlerini bul
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(favicon => favicon.remove());

    // Yeni favicon elementleri oluştur
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = logoUrl;
    document.head.appendChild(favicon);

    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = logoUrl;
    document.head.appendChild(appleTouchIcon);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, updateSettings, fetchSettings };
}