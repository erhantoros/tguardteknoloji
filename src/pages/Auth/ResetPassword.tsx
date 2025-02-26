import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      
      setSent(true);
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Şifre sıfırlama işlemi başlatılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">E-postanızı Kontrol Edin</h1>
            <p className="text-gray-600 mt-4">
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </p>
            <Link
              to="/auth/login"
              className="mt-8 inline-block text-blue-600 hover:text-blue-500"
            >
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Şifre Sıfırlama</h1>
          <p className="text-gray-600 mt-2">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-500">
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;