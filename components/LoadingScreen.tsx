
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Kiểm tra xem trong phiên làm việc này (Session) đã hiển thị Loading chưa
    const hasShownIntro = sessionStorage.getItem('tkap-intro-shown');
    
    if (hasShownIntro) {
      // Nếu đã hiển thị rồi thì không làm gì cả
      setShouldRender(false);
      return;
    }

    // Nếu chưa hiển thị, bắt đầu quá trình render
    setShouldRender(true);

    // Splash screen hiển thị ít nhất 2s để đảm bảo trải nghiệm cao cấp cho lần đầu
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Đánh dấu đã hiển thị trong Session này
      sessionStorage.setItem('tkap-intro-shown', 'true');
      
      setTimeout(() => setShouldRender(false), 800);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isFadingOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <div className="flex flex-col items-center space-y-8 animate-reveal">
        <div className="overflow-hidden">
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2 animate-reveal">
            T-KAP
          </h1>
        </div>
        <div className="h-px w-24 bg-white/30" />
        <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] animate-reveal delay-300">
          XIN CHÀO QUÝ KHÁCH
        </p>
      </div>
      
      {/* Một dải lụa mỏng chạy ngang phía dưới tạo cảm giác may đo */}
      <div className="absolute bottom-20 left-0 w-full overflow-hidden opacity-20">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent shimmer" />
      </div>
    </div>
  );
};

export default LoadingScreen;
