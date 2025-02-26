import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

function SocialLinks({ className = '', iconClassName = 'h-6 w-6' }: SocialLinksProps) {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const handleWhatsAppClick = () => {
    if (!settings.social_whatsapp) return;
    
    const message = encodeURIComponent(settings.whatsapp_message || 'Merhaba, bilgi almak istiyorum.');
    const url = `https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`flex space-x-4 ${className}`}>
      {settings.social_facebook && (
        <a
          href={settings.social_facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Facebook className={iconClassName} />
        </a>
      )}
      {settings.social_instagram && (
        <a
          href={settings.social_instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-600 transition-colors"
        >
          <Instagram className={iconClassName} />
        </a>
      )}
      {settings.social_whatsapp && (
        <button
          onClick={handleWhatsAppClick}
          className="text-gray-600 hover:text-green-600 transition-colors"
        >
          <MessageCircle className={iconClassName} />
        </button>
      )}
    </div>
  );
}

export default SocialLinks;