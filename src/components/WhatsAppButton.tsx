import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

function WhatsAppButton() {
  const { settings } = useSiteSettings();

  if (!settings?.social_whatsapp) return null;

  const handleClick = () => {
    const message = encodeURIComponent(settings.whatsapp_message || 'Merhaba, bilgi almak istiyorum.');
    const url = `https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 z-50 flex items-center group"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out">
        Bize Ulaşın
      </span>
    </button>
  );
}

export default WhatsAppButton;