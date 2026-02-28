
import React, { useState } from 'react';
import { SiteConfig, Language } from '../types';

interface FloatingContactProps {
  config: SiteConfig;
  language: Language;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ config, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isVi = language === 'vi';

  const socialLinks = [
    {
      id: 'zalo',
      name: 'Zalo Chat',
      // Sử dụng icon Zalo chính thức với độ phân giải cao
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg',
      // Đảm bảo link luôn có giá trị, nếu config trống thì dùng số hotline
      url: config.contactZalo || `https://zalo.me/${config.contactPhone?.replace(/\s+/g, '')}`,
      show: config.showZalo,
      color: 'bg-white' // Nền trắng để nổi bật icon xanh Zalo
    },
    {
      id: 'facebook',
      name: 'Messenger',
      // Sử dụng icon Messenger chính thức
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg',
      url: config.contactFacebook || 'https://m.me/tkapfashion',
      show: config.showFacebook,
      color: 'bg-white' // Nền trắng để nổi bật icon màu gradient của Messenger
    }
  ].filter(link => link.show);

  if (socialLinks.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end gap-4 font-heading">
      {/* Menu Options */}
      <div className={`flex flex-col gap-3 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-75 pointer-events-none'}`}>
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 group"
          >
            <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl border border-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {social.name}
            </span>
            <div className={`w-14 h-14 ${social.color} rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 p-2 border border-zinc-100`}>
              <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
            </div>
          </a>
        ))}
      </div>

      {/* Main Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 relative ${isOpen ? 'bg-zinc-800 rotate-45' : 'bg-black'}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-400"></span>
            </span>
          </div>
        )}
      </button>

      {/* Tooltip Label */}
      {!isOpen && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm whitespace-nowrap shadow-xl animate-reveal md:block hidden">
          {isVi ? 'TƯ VẤN NGAY' : 'EXECUTIVE SUPPORT'}
        </div>
      )}
    </div>
  );
};

export default FloatingContact;
