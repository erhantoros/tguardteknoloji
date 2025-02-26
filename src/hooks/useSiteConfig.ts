import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteConfig } from '../types';

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      // Önce tüm kayıtları kontrol et
      const { data: allConfigs, error: fetchError } = await supabase
        .from('site_config')
        .select('*');

      if (fetchError) throw fetchError;

      // Hiç kayıt yoksa yeni bir kayıt oluştur
      if (!allConfigs || allConfigs.length === 0) {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert([{
            logo_url: '',
            company_name: 'TGuard Teknoloji',
            primary_color: '#2563eb',
            facebook_url: '',
            instagram_url: '',
            whatsapp_number: '',
            contact_phone: '',
            contact_email: '',
            contact_address: '',
            whatsapp_message: 'Merhaba, bilgi almak istiyorum.'
          }]);

        if (insertError) throw insertError;
      }

      // En son kaydı al
      const { data: latestConfig, error: latestError } = await supabase
        .from('site_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestError && latestError.code !== 'PGRST204') throw latestError;
      setConfig(latestConfig);
    } catch (error) {
      console.error('Error fetching site config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      // Mevcut config'i al
      const { data: currentConfig } = await supabase
        .from('site_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (currentConfig) {
        // Mevcut config'i güncelle
        const { error: updateError } = await supabase
          .from('site_config')
          .update({
            ...newConfig,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConfig.id);

        if (updateError) throw updateError;
      } else {
        // Yeni config oluştur
        const { error: insertError } = await supabase
          .from('site_config')
          .insert([{
            ...newConfig,
            logo_url: newConfig.logo_url || '',
            company_name: newConfig.company_name || 'TGuard Teknoloji',
            primary_color: newConfig.primary_color || '#2563eb'
          }]);

        if (insertError) throw insertError;
      }

      // Config'i yeniden yükle
      await fetchConfig();
      return { error: null };
    } catch (error) {
      console.error('Error updating site config:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading, updateConfig };
}