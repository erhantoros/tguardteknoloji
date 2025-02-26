import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SocialLinks from './SocialLinks';

function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.company_name}
                  className="h-8 w-auto"
                />
              ) : (
                <Shield className="h-8 w-8 text-blue-400" />
              )}
              <span className="ml-2 text-xl font-bold">{settings?.company_name || 'TGuard'}</span>
            </div>
            <p className="text-gray-400">
              Profesyonel bilişim ve güvenlik çözümleri ile hizmetinizdeyiz.
            </p>
            <div className="mt-6">
              <SocialLinks className="justify-start" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition">
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition">
                  Galeri
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Bilgisayar Tamiri</li>
              <li className="text-gray-400">Güvenlik Kamera Sistemleri</li>
              <li className="text-gray-400">Bilişim & Sunucu Çözümleri</li>
              <li className="text-gray-400">Elektrik & Altyapı Hizmetleri</li>
              <li className="text-gray-400">Veri Kurtarma</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              {settings?.contact_phone && (
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings?.contact_email && (
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.contact_address && (
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.company_name || 'TGuard Teknoloji'}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;