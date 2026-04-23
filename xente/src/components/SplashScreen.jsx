import React, { useEffect, useState } from 'react';

const IMAGES = ['/xenteimage1.jpeg', '/xenteimage2.jpeg', '/xenteimage3.jpeg'];

export const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('enter');
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % IMAGES.length);
    }, 1200);
    const exitTimer = setTimeout(() => setPhase('exit'), 3200);
    const finishTimer = setTimeout(() => onFinish(), 3800);
    return () => { clearInterval(imgInterval); clearTimeout(exitTimer); clearTimeout(finishTimer); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background images with crossfade */}
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: currentImg === i ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

      {/* Orange accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Floating stat cards */}
        <div className="absolute top-16 right-[8%] bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 animate-float hidden lg:block">
          <p className="text-[11px] text-white/50 mb-1">Total Onboarded</p>
          <p className="text-2xl font-extrabold text-white">2,847</p>
          <p className="text-[11px] text-orange-400 font-semibold">+12.5% this month</p>
        </div>

        <div className="absolute bottom-20 left-[6%] bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white/10 animate-float [animation-delay:1.5s] hidden lg:block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div>
              <p className="text-xs font-semibold text-white">Ambassador Active</p>
              <p className="text-[11px] text-white/40">153 onboarded</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center animate-scale-in">
          <img src="/xenteLogo2.png" alt="Xente Logo" className="h-14 sm:h-16 w-auto mx-auto mb-8 object-contain" />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Ambassador <span className="text-orange-400">Onboarding</span>
            <br />Platform
          </h1>
          <p className="text-base sm:text-lg text-white/60 mb-14 max-w-md mx-auto">
            Track, manage and grow your ambassador network
          </p>

          {/* Progress bar */}
          <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-progress-fill" />
          </div>
          <p className="text-xs text-white/30 mt-3 font-medium tracking-widest uppercase">
            Initializing system...
          </p>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-6 text-center">
          <p className="text-[11px] text-white/20 tracking-wider">Powered by Xente Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
