import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, WHATSAPP_RAW_NUMBER } from '../utils/whatsapp';

export interface WatchSlide {
  id: string;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  movement: string;
  price: string;
  priceAED: string;
  link: string;
}

export const WATCH_SLIDES: WatchSlide[] = [
  {
    id: 'slide-1',
    image: '/watches/seiko-collection-vault.jpg',
    category: "COLLECTOR'S VAULT",
    title: 'THE MECHANICAL CALIBRE SUITE',
    subtitle: 'Triple sunburst emerald, cyan & ivory dials encased in solid brushed 316L steel.',
    movement: '21-Jewel Automatic • Day-Date Complication',
    price: '₹14,999',
    priceAED: 'AED 660',
    link: '/watches/prod-w1'
  },
  {
    id: 'slide-2',
    image: '/watches/cartier-boutique-display.jpg',
    category: 'HAUTE HORLOGERIE',
    title: 'SANTOS GEOMETRIC BOUTIQUE',
    subtitle: 'Classic Roman indices with sapphire cabochon crown and deployant bracelet.',
    movement: 'Bespoke Mechanical Calibre • Dual-Tone Steel',
    price: '₹24,999',
    priceAED: 'AED 1,090',
    link: '/watches/prod-w3'
  },
  {
    id: 'slide-3',
    image: '/watches/hublot-chrono-lounge.jpg',
    category: 'GRAND COMPLICATION',
    title: 'TITANIUM CHRONO & FLUTED BEZEL',
    subtitle: 'Skeleton exhibition dials with hand saddle-stitched calfskin leather.',
    movement: 'High-Beat Chrono-Monopusher • Coin-Edge Bezel',
    price: '₹28,500',
    priceAED: 'AED 1,250',
    link: '/watches/prod-w4'
  },
  {
    id: 'slide-4',
    image: '/watches/tissot-silver-chronograph.jpg',
    category: 'SWISS CHRONOMETER',
    title: 'SILVER SUNBURST TACHYMÈTRE',
    subtitle: 'Triple chronometer subdials with hand-finished cognac alligator leather.',
    movement: 'Certified Tachymètre Chronometer • Sapphire Glass',
    price: '₹18,999',
    priceAED: 'AED 830',
    link: '/watches/prod-w5'
  },
  {
    id: 'slide-5',
    image: '/watches/emerald-purple-automatic.jpg',
    category: 'ROYAL CALIBRE',
    title: 'SUNBURST EMERALD & AMETHYST',
    subtitle: '21-jewel self-winding rotor with bilingual day-date complications.',
    movement: 'Radial Sunburst Calibre • Gold Baton Indices',
    price: '₹13,499',
    priceAED: 'AED 590',
    link: '/watches/prod-w2'
  },
  {
    id: 'slide-6',
    image: '/watches/vintage-silver-digital.jpg',
    category: 'ARCHIVE CLASSIC',
    title: 'HERITAGE STEEL DIGITAL & ANA-DIGI',
    subtitle: 'Architectural geometry in full surgical grade 316L stainless steel.',
    movement: 'Retrograde Dual-Time Quartz • Luminescent Panel',
    price: '₹7,999',
    priceAED: 'AED 350',
    link: '/watches/prod-w6'
  },
  {
    id: 'slide-7',
    image: '/watches/horology-atelier-vintage.jpg',
    category: 'VINTAGE ATELIER',
    title: 'HAND-RESTORED TIMEPIECE VAULT',
    subtitle: 'Hand-calibrated antique escapements and timeless chronometric precision.',
    movement: 'Master Restorations • Laser-Engraved Serial',
    price: '₹16,500',
    priceAED: 'AED 720',
    link: '/watches/prod-w7'
  }
];

export const WatchHeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalSlides = WATCH_SLIDES.length;

  const SLIDE_DURATION = 5000; // 5 seconds per slide
  const INTERVAL_STEP = 50;

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  // Smooth automatic progress timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (INTERVAL_STEP / SLIDE_DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const current = WATCH_SLIDES[currentIndex];

  return (
    <section 
      className="relative w-full h-[80vh] sm:h-[86vh] lg:h-[90vh] bg-white overflow-hidden border-b border-neutral-200 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Haute Horlogerie Hero Showcase"
    >
      {/* 
        Ultra-High-Resolution Almost Full-Screen Watch Photography 
        with Silky Cross-Fade and Ambient Lighting Depth
      */}
      <div className="absolute inset-0 w-full h-full bg-[#FFFFFF]">
        {WATCH_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link 
                to={slide.link} 
                className="block w-full h-full cursor-pointer relative overflow-hidden flex items-center justify-center bg-white"
                title={`Explore ${slide.title}`}
              >
                {/* 1. Ambient Background Fill to Match Tone & Depth */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <img
                    src={slide.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover filter blur-3xl opacity-25 scale-115 transform"
                  />
                  <div className="absolute inset-0 bg-white/40" />
                </div>

                {/* 2. Crystal-Clear 2K+ High-Definition Watch Photography */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-0 sm:p-6 lg:p-8">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover sm:object-contain object-center max-h-none sm:max-h-[82vh] max-w-full sm:max-w-5xl filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.14)] transition-transform duration-[6500ms] ease-out ${
                      isActive ? 'scale-105 sm:scale-102' : 'scale-100'
                    }`}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      backfaceVisibility: 'hidden'
                    }}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Subtle luxury edge lighting */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 pointer-events-none" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Floating Haute Horlogerie Badges (Minimal, Discreet & Editorial) */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-12 flex flex-col justify-between py-6 sm:py-8 pointer-events-none">
        
        {/* Top Minimal Track Pill */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest pointer-events-auto">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 border border-neutral-200/90 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-pulse" />
            <span className="uppercase text-[9px] font-bold tracking-[0.25em] text-[#111111]">
              VELMIRA ATELIER • {current.category}
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 border border-neutral-200/90 text-[10px] font-mono font-semibold text-neutral-800 shadow-xs">
            0{currentIndex + 1} / 0{totalSlides}
          </div>
        </div>

        {/* Bottom Floating Minimal Bar (Sleek, Translucent & Never Obstructing the Watch) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pointer-events-auto">
          {/* Subtle model indicator banner */}
          <div className="inline-flex items-center space-x-3 bg-white/95 sm:bg-white/90 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 border border-neutral-200/90 shadow-sm max-w-full sm:max-w-md">
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-mono block truncate">
                {current.movement}
              </span>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-[#111111] tracking-tight truncate">
                {current.title}
              </h3>
            </div>
            <div className="border-l border-neutral-200 pl-3 shrink-0 flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#111111]">
                {current.price}
              </span>
              <Link
                to={current.link}
                className="p-1 rounded-full bg-[#111111] text-white hover:bg-black transition ml-1"
                title="View Timepiece"
              >
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Smooth Dynamic Progress Bars */}
          <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-md p-2 border border-neutral-200/80 shadow-xs">
            {WATCH_SLIDES.map((_, idx) => {
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                  }}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className="relative h-1.5 w-6 sm:w-8 bg-neutral-200 overflow-hidden rounded-full transition-all duration-300"
                >
                  <div
                    className={`absolute inset-y-0 left-0 bg-[#111111] transition-all ${
                      isCurrent ? 'w-full' : idx < currentIndex ? 'w-full' : 'w-0'
                    }`}
                    style={isCurrent ? { width: `${progress}%`, transitionDuration: `${INTERVAL_STEP}ms` } : undefined}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discreet Tactile Previous / Next Arrows on Screen Edges */}
      <button
        onClick={prevSlide}
        aria-label="Previous Timepiece"
        className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/85 hover:bg-white text-neutral-800 hover:text-black border border-neutral-200 shadow-md backdrop-blur-xs transition rounded-full opacity-60 hover:opacity-100 hover:scale-105"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Timepiece"
        className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/85 hover:bg-white text-neutral-800 hover:text-black border border-neutral-200 shadow-md backdrop-blur-xs transition rounded-full opacity-60 hover:opacity-100 hover:scale-105"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </section>
  );
};
