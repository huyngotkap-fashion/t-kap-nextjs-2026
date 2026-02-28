
import React from 'react';
import { Language, SiteConfig } from '../types';
import { translations } from '../translations';

interface FooterProps {
  language: Language;
  config: SiteConfig;
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ language, config, onNavigate }) => {
  const t = translations[language].footer;
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15680.601587296322!2d106.742899!3d10.722881!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752593786aba71%3A0x44d972d363ebe83a!2sCty%20TNHH%20May%20th%E1%BB%9Di%20trang%20T-Kap!5e0!3m2!1svi!2s!4v1768189559675!5m2!1svi!2s";

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(path);
  };

  const headingClass = "text-[9px] font-black uppercase tracking-[0.3em] mb-8 text-white whitespace-nowrap overflow-hidden text-ellipsis block";

  return (
    <footer className="bg-black text-white pt-24 pb-12 mt-16 border-t border-white/5 font-sans overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <div className="space-y-8">
            <a href="/" onClick={(e) => handleLinkClick(e, '/')}><img src={config.logoImageUrl} alt="Logo" className="h-12 w-auto object-contain" /></a>
            <div className="space-y-6 text-[12px] leading-relaxed opacity-70">
              <p><span className="font-bold text-white uppercase tracking-widest block mb-1">{t.contact.phone}:</span> {config.contactPhone}</p>
              <p><span className="font-bold text-white uppercase tracking-widest block mb-1">{t.contact.email}:</span> {config.contactEmail}</p>
              
              <div>
                <span className="font-bold text-white uppercase tracking-widest block mb-1">{t.contact.hq}:</span>
                <p className="font-light">{config.contactHQ}</p>
              </div>

              {config.contactBranch && (
                <div>
                  <span className="font-bold text-white uppercase tracking-widest block mb-1">{t.contact.branch}:</span>
                  <p className="font-light">{config.contactBranch}</p>
                </div>
              )}

              {config.contactFactory && (
                <div>
                  <span className="font-bold text-white uppercase tracking-widest block mb-1">{t.contact.factory}:</span>
                  <p className="font-light">{config.contactFactory}</p>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h4 className={headingClass}>{t.aboutTitle}</h4>
            <ul className="space-y-4 text-[13px] opacity-50">
              <li><a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-white transition-colors">Introduction</a></li>
              <li><a href="/stores" onClick={(e) => handleLinkClick(e, '/stores')} className="hover:text-white transition-colors">Stores</a></li>
              <li><a href="/men" onClick={(e) => handleLinkClick(e, '/men')} className="hover:text-white transition-colors">Men&apos;s Collection</a></li>
              <li><a href="/women" onClick={(e) => handleLinkClick(e, '/women')} className="hover:text-white transition-colors">Women&apos;s Collection</a></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className={headingClass}>{t.interact}</h4>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Facebook */}
              {config.showFacebook && config.contactFacebook && (
                <a href={config.contactFacebook} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              
              {/* Zalo */}
              {config.showZalo && config.contactZalo && (
                <a href={config.contactZalo} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full hover:bg-blue-500 hover:text-white transition-all group overflow-hidden">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" className="w-6 h-6 grayscale group-hover:grayscale-0" alt="Zalo" />
                </a>
              )}

              {/* Youtube */}
              {config.showYoutube && config.contactYoutube && (
                <a href={config.contactYoutube} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full hover:bg-red-600 hover:text-white transition-all">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.015 3.015 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-8 min-w-0">
            <h4 className={headingClass}>{t.subscribe}</h4>
            <div className="flex bg-white/5 border border-white/10 rounded-sm overflow-hidden">
              <input type="email" placeholder={t.emailPlaceholder} className="flex-1 bg-transparent px-4 py-3 text-[12px] text-white focus:outline-none w-full" />
              <button className="bg-white text-black px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t.send}</button>
            </div>
            <div className="rounded-sm overflow-hidden border border-white/5 grayscale opacity-30 hover:opacity-100 h-28">
              <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] opacity-30 font-bold uppercase tracking-[0.2em]">
          <p>{t.rights}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
