import React, { useState, useEffect } from 'react';
import { Users, Box, Image, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { ContactForm } from '../../../types';

function Dashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    products: 0,
    gallery: 0,
    pendingContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: contactsCount },
        { count: productsCount },
        { count: galleryCount },
        { count: pendingCount },
        { data: recentContactsData }
      ] = await Promise.all([
        supabase.from('contact_forms').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('gallery').select('*', { count: 'exact' }),
        supabase.from('contact_forms').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('contact_forms').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        contacts: contactsCount || 0,
        products: productsCount || 0,
        gallery: galleryCount || 0,
        pendingContacts: pendingCount || 0
      });

      setRecentContacts(recentContactsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-8 w-8" />}
          title="İletişim Talepleri"
          value={stats.contacts}
          color="blue"
        />
        <StatCard
          icon={<Box className="h-8 w-8" />}
          title="Ürünler"
          value={stats.products}
          color="green"
        />
        <StatCard
          icon={<Image className="h-8 w-8" />}
          title="Galeri"
          value={stats.gallery}
          color="purple"
        />
        <StatCard
          icon={<Clock className="h-8 w-8" />}
          title="Bekleyen Talepler"
          value={stats.pendingContacts}
          color="yellow"
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Son İletişim Talepleri</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hizmet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentContacts.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-gray-400" colSpan={5}>
                    Henüz iletişim talebi bulunmuyor.
                  </td>
                </tr>
              ) : (
                recentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {contact.service_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(contact.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    green: 'bg-green-500/10 text-green-400 border-green-400/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20'
  };

  return (
    <div className={`rounded-xl border ${colors[color]} p-6`}>
      <div className="flex items-center">
        <div className={`${colors[color]} rounded-lg p-3`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
    contacted: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    completed: 'bg-green-500/10 text-green-400 border-green-400/20'
  };

  const labels = {
    pending: 'Beklemede',
    contacted: 'İletişime Geçildi',
    completed: 'Tamamlandı'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

export default Dashboard;