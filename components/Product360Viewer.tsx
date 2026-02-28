
import React, { useState, useEffect, useRef } from 'react';

interface Product360ViewerProps {
  images: string[];
  className?: string;
}

const Product360Viewer: React.FC<Product360ViewerProps> = ({ images, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal, 1.5 - 2 = zoomed
  const containerRef = useRef<HTMLDivElement>(null);
  // Fix: Use number for timer ID in browser environment instead of NodeJS.Timeout
  const autoRotateRef = useRef<number | null>(null);

  // Preload images logic
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    images.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(idx));
      };
    });
  }, [images]);

  // Auto-rotate logic
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      // Fix: use window.setInterval explicitly to return a number
      // Updated: Changed interval from 100ms to 200ms for a smoother, premium feel
      autoRotateRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 200); 
    } else {
      if (autoRotateRef.current) window.clearInterval(autoRotateRef.current);
    }
    return () => {
      if (autoRotateRef.current) window.clearInterval(autoRotateRef.current);
    };
  }, [isAutoRotating, isDragging, images.length]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    // Pause auto-rotation when user interacts
    if (isAutoRotating) setIsAutoRotating(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !images || images.length <= 1) return;
    
    const sensitivity = 8; 
    const deltaX = clientX - startX;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1;
      setCurrentIndex(prev => (prev + direction + images.length) % images.length);
      setStartX(clientX);
    }
  };

  const handleEnd = () => setIsDragging(false);

  const toggleZoom = () => {
    setZoomLevel(prev => (prev === 1 ? 2 : 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 ${className}`}>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No 360° Data Available</p>
      </div>
    );
  }

  const isFullyLoaded = loadedImages.size === images.length;

  return (
    <div 
      ref={containerRef}
      className={`relative select-none overflow-hidden bg-zinc-100 flex items-center justify-center group ${className}`}
    >
      {/* 360 Image Surface */}
      <div 
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out`}
        style={{ transform: `scale(${zoomLevel})` }}
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX); }}
        onMouseMove={(e) => { e.preventDefault(); handleMove(e.clientX); }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`360-view-frame-${currentIndex}`}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
          onLoad={() => setLoadedImages(prev => new Set(prev).add(currentIndex))}
        />
      </div>

      {/* Hidden Preload Cache */}
      <div className="hidden">
        {images.map((src, idx) => (
          idx !== currentIndex && <img key={idx} src={src} alt="preload" />
        ))}
      </div>

      {/* CONTROL HUD - DARK THEME for better contrast */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-xs px-6 pointer-events-none">
        <div className="flex flex-col items-center gap-4 bg-black/85 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-reveal pointer-events-auto">
          
          {/* Main Controls */}
          <div className="flex items-center gap-8">
            {/* Auto Rotate Toggle */}
            <button 
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2.5 rounded-full transition-all duration-300 ${isAutoRotating ? 'bg-white text-black scale-110 shadow-lg' : 'text-white hover:bg-white/20'}`}
              title={isAutoRotating ? "Dừng xoay" : "Tự động xoay"}
            >
              {isAutoRotating ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V2.21c0-.45-.54-.67-.85-.35l-3.8 3.79c-.2.2-.2.51 0 .71l3.79 3.79c.32.31.86.09.86-.36V7c3.73 0 6.84 2.55 7.73 6h2.08c-.96-4.59-5.03-8-9.81-8zM4.19 11c.96-4.59 5.03-8 9.81-8V5.79c0 .45.54.67.85.35l3.8-3.79c.2-.2.2-.51 0-.71l-3.79-3.79c-.32-.31-.86-.09-.86.36V3c-3.73 0-6.84 2.55-7.73 6H2.11c.96-4.59 5.03-8 9.81-8z" transform="rotate(180 12 12)"/></svg>
              )}
            </button>

            {/* Drag Hint or Status */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase mb-2">
                {isDragging ? 'DRAGGING' : isAutoRotating ? 'AUTOPLAY' : '360° VIEW'}
              </span>
              <div className="h-1 bg-white/20 w-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  style={{ width: `${(loadedImages.size / images.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Zoom Toggle */}
            <button 
              onClick={toggleZoom}
              className={`p-2.5 rounded-full transition-all duration-300 ${zoomLevel > 1 ? 'bg-white text-black scale-110 shadow-lg' : 'text-white hover:bg-white/20'}`}
              title={zoomLevel > 1 ? "Thu nhỏ" : "Phóng to"}
            >
              {zoomLevel > 1 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
              )}
            </button>
          </div>
          
          {/* Loading status (only visible when not fully loaded) */}
          {!isFullyLoaded && (
            <div className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em] animate-pulse">
              Buffering Experience... {Math.round((loadedImages.size / images.length) * 100)}%
            </div>
          )}
        </div>
      </div>

      {/* Hint overlay on first load */}
      {loadedImages.size > 0 && !isDragging && !isAutoRotating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <svg className="w-4 h-4 text-white animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Drag to rotate</span>
              <svg className="w-4 h-4 text-white animate-bounce-horizontal-reverse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
           </div>
        </div>
      )}
    </div>
  );
};

export default Product360Viewer;
