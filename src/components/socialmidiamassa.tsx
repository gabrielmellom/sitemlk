import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

interface SocialMediaProps {
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({
  facebookUrl = "https://www.facebook.com/mulekafm88/?locale=pt_BR",
  instagramUrl = "https://www.instagram.com/mulekafm88/?hl=pt",
  whatsappNumber = "https://wa.me/554484180021", 
}) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Vim através do site da rádio.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
      <div className="bg-white shadow-lg rounded-r-lg flex flex-col">
        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center p-3 transition-all duration-300 hover:bg-orange-500 hover:text-white
                     text-orange-500 border-b border-gray-200 first:rounded-tr-lg hover:pr-20 overflow-hidden
                     w-12 hover:w-auto"
        >
          <Facebook size={20} className="flex-shrink-0" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
            Facebook
          </span>
        </a>

        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center p-3 transition-all duration-300 hover:bg-purple-500 hover:text-white
                     text-purple-500 border-b border-gray-200 hover:pr-20 overflow-hidden
                     w-12 hover:w-auto"
        >
          <Instagram size={20} className="flex-shrink-0" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
            Instagram
          </span>
        </a>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="group flex items-center p-3 transition-all duration-300 hover:bg-green-500 hover:text-white
                     text-green-500 last:rounded-br-lg hover:pr-20 overflow-hidden
                     w-12 hover:w-auto"
        >
          <MessageCircle size={20} className="flex-shrink-0" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
            WhatsApp
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialMedia;