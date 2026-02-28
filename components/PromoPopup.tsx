
import React, { useState, useEffect, useMemo } from 'react';
import { PromoPopupConfig, Language } from '../types';

interface PromoPopupProps {
  config: PromoPopupConfig;
  language: Language;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ config, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Logic kiểm tra tần suất hiển thị
  useEffect(() => {
    if (!config.isActive) return;

    const lastDismissed = localStorage.getItem('tkap-promo-dismissed-at');
    const now = Date.now();
    const frequencyMs = (config.frequencyDays || 0) * 24 * 60 * 60 * 1000;

    if (!lastDismissed || (now - parseInt(lastDismissed) > frequencyMs)) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, config.displayDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [config.isActive, config.displayDelay, config.frequencyDays]);

  // Logic đếm ngược
  useEffect(() => {
    if (!config.countdownEnd || !isVisible) return;

    const targetDate = new Date(config.countdownEnd).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.countdownEnd, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('tkap-promo-dismissed-at', Date.now().toString());
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Giả lập lưu email
    console.log('Newsletter signup:', email);
    setIsSubscribed(true);
    setTimeout(handleClose, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full max-w-5xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        {/* Close Icon */}
        <button 
          onClick={handleClose}
          className="absolute right-6 top-6 z-20 p-2 text-zinc-400 hover:text-black transition-all bg-white/10 hover:bg-white rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image - Left Side */}
        <div className="w-full md:w-[45%] h-64 md:h-auto relative overflow-hidden">
          <img 
            src={config.imageUrl} 
            alt="Promotion" 
            className="w-full h-full object-cover transition-transform duration-[3s] scale-105 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="space-y-8 max-w-md mx-auto w-full">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black tracking-[0.5em] text-zinc-300 uppercase block mb-4">Special Invitation</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none vietnamese-fix">
                {config.title[language] || config.title['vi']}
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-light uppercase tracking-widest vietnamese-fix">
                {config.content[language] || config.content['vi']}
              </p>
            </div>

            {/* Countdown Timer */}
            {config.countdownEnd && (
              <div className="flex justify-center md:justify-start gap-4 py-6 border-y border-zinc-100">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hrs', val: timeLeft.hours },
                  { label: 'Min', val: timeLeft.minutes },
                  { label: 'Sec', val: timeLeft.seconds }
                ].map((unit, idx) => (
                  <div key={idx} className="text-center min-w-[50px]">
                    <div className="text-2xl font-black text-black leading-none">{String(unit.val).padStart(2, '0')}</div>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{unit.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Newsletter or CTA */}
            {isSubscribed ? (
              <div className="py-8 text-center bg-zinc-50 border border-zinc-100 animate-fade-in">
                <p className="text-[11px] font-black uppercase tracking-widest text-green-600">
                  {language === 'vi' ? 'CẢM ƠN BẠN ĐÃ ĐĂNG KÝ!' : 'THANK YOU FOR SUBSCRIBING!'}
                </p>
              </div>
            ) : config.showNewsletter ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input 
                  type="email"
                  required
                  placeholder={config.newsletterPlaceholder?.[language] || (language === 'vi' ? 'NHẬP EMAIL CỦA BẠN' : 'ENTER YOUR EMAIL')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-all"
                />
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-2xl"
                >
                  {config.buttonText?.[language] || (language === 'vi' ? 'ĐĂNG KÝ NGAY' : 'SUBSCRIBE NOW')}
                </button>
              </form>
            ) : (
              <a 
                href={config.link}
                onClick={handleClose}
                className="block w-full bg-black text-white py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-2xl"
              >
                {config.buttonText?.[language] || (language === 'vi' ? 'KHÁM PHÁ NGAY' : 'SHOP THE COLLECTION')}
              </a>
            )}

            <div className="text-center md:text-left">
              <button 
                onClick={handleClose}
                className="text-[9px] font-bold text-zinc-300 hover:text-black uppercase tracking-widest transition-colors border-b border-transparent hover:border-black pb-1"
              >
                {language === 'vi' ? 'BỎ QUA ƯU ĐÃI NÀY' : 'I PREFER TO SKIP THIS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
