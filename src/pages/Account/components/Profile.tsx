import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  full_name: string;
  phone: string;
  address: string;
  company_name?: string;
  tax_office?: string;
  tax_number?: string;
}

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCompanyFields, setShowCompanyFields] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    address: '',
    company_name: '',
    tax_office: '',
    tax_number: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST204') throw error;
      
      if (data) {
        setProfile(data);
        setShowCompanyFields(!!data.company_name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Profil başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Profil Bilgileri</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres
          </label>
          <textarea
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="company"
            checked={showCompanyFields}
            onChange={(e) => setShowCompanyFields(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="company" className="ml-2 text-sm text-gray-700">
            Kurumsal bilgilerimi kaydet
          </label>
        </div>

        {showCompanyFields && (
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma Adı
              </label>
              <input
                type="text"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vergi Dairesi
              </label>
              <input
                type="text"
                value={profile.tax_office}
                onChange={(e) => setProfile({ ...profile, tax_office: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vergi Numarası
              </label>
              <input
                type="text"
                value={profile.tax_number}
                onChange={(e) => setProfile({ ...profile, tax_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;