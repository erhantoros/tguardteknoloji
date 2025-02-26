import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Settings, 
  Users, 
  LogOut,
  Image,
  Box,
  Wrench,
  Home,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    } else {
      navigate('/admin');
    }
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/home-settings', icon: <Home className="h-5 w-5" />, label: 'Ana Sayfa' },
    { path: '/admin/services', icon: <Wrench className="h-5 w-5" />, label: 'Hizmetler' },
    { path: '/admin/products', icon: <Box className="h-5 w-5" />, label: 'Ürünler' },
    { path: '/admin/gallery', icon: <Image className="h-5 w-5" />, label: 'Galeri' },
    { path: '/admin/contacts', icon: <Users className="h-5 w-5" />, label: 'İletişim Talepleri' },
    { path: '/admin/payment', icon: <CreditCard className="h-5 w-5" />, label: 'Ödeme Ayarları' },
    { path: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Site Ayarları' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center p-4 border-b border-gray-700">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold text-blue-400">Admin Panel</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;