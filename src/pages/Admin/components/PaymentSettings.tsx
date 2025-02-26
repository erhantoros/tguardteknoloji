import React, { useState, useEffect } from 'react';
import { Save, CreditCard } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface PaymentSettings {
  paytr_merchant_id: string;
  paytr_merchant_key: string;
  paytr_merchant_salt: string;
  payment_enabled: boolean;
  test_mode: boolean;
  max_installment: number;
}

function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    paytr_merchant_id: '',
    paytr_merchant_key: '',
    paytr_merchant_salt: '',
    payment_enabled: false,
    test_mode: true,
    max_installment: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('paytr_merchant_id, paytr_merchant_key, paytr_merchant_salt, payment_enabled, test_mode, max_installment')
        .single();

      if (error) throw error;
      
      if (data) {
        setSettings({
          paytr_merchant_id: data.paytr_merchant_id || '',
          paytr_merchant_key: data.paytr_merchant_key || '',
          paytr_merchant_salt: data.paytr_merchant_salt || '',
          payment_enabled: data.payment_enabled || false,
          test_mode: data.test_mode || true,
          max_installment: data.max_installment || 12
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast.error('Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', 1); // Ana ayarlar kaydı

      if (error) throw error;
      
      toast.success('Ödeme ayarları başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating payment settings:', error);
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold text-white mb-8">Ödeme Ayarları</h1>

      <div className="bg-gray-800 rounded-xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PayTR API Bilgileri */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-blue-400" />
              PayTR Entegrasyonu
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={settings.paytr_merchant_id}
                  onChange={(e) => setSettings({ ...settings, paytr_merchant_id: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Merchant Key
                </label>
                <input
                  type="password"
                  value={settings.paytr_merchant_key}
                  onChange={(e) => setSettings({ ...settings, paytr_merchant_key: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Merchant Salt
                </label>
                <input
                  type="password"
                  value={settings.paytr_merchant_salt}
                  onChange={(e) => setSettings({ ...settings, paytr_merchant_salt: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ödeme Ayarları */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Genel Ayarlar</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payment_enabled"
                  checked={settings.payment_enabled}
                  onChange={(e) => setSettings({ ...settings, payment_enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                />
                <label htmlFor="payment_enabled" className="ml-2 text-sm font-medium text-gray-200">
                  Ödeme Sistemini Aktifleştir
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="test_mode"
                  checked={settings.test_mode}
                  onChange={(e) => setSettings({ ...settings, test_mode: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                />
                <label htmlFor="test_mode" className="ml-2 text-sm font-medium text-gray-200">
                  Test Modu (Gerçek ödeme alınmaz)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Maksimum Taksit Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.max_installment}
                  onChange={(e) => setSettings({ ...settings, max_installment: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentSettings;