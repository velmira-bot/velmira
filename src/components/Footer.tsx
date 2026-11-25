import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, WHATSAPP_RAW_NUMBER } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#FAFAFA] text-[#71717A] border-t border-neutral-200 pt-16 pb-12 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Strip (Clean White Box) */}
        <div className="bg-white p-8 sm:p-10 border border-neutral-200 mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717A] block mb-1">
              VELMIRA ATELIER PRIVÉ
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Receive Private Watch Release Previews
            </h3>
            <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
              Subscribe for private catalogue access to limited edition automatic timepieces, flying tourbillons, and collector allocations.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-black bg-neutral-100 border border-neutral-300 px-5 py-3 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You are registered for Velmira Privé watch allocations.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your VIP email address..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="bg-[#F8F9FA] text-[#111111] placeholder-[#A1A1AA] text-xs px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black flex-1 font-sans"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#111111] text-white hover:bg-black font-serif text-xs font-bold uppercase tracking-widest transition flex items-center justify-center space-x-2 shrink-0 shadow-xs"
                >
                  <span>Join Privé</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-neutral-200">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-extrabold tracking-[0.2em] text-[#111111] block">
                VELMIRA
              </span>
              <span className="text-[9px] font-medium tracking-[0.3em] text-[#71717A] uppercase -mt-0.5 block font-sans">
                Haute Horlogerie Ateliers
              </span>
            </Link>
            <p className="text-xs text-[#71717A] leading-relaxed max-w-sm">
              Velmira is an independent luxury watch atelier dedicated strictly to mechanical precision, high-beat automatic movements, and timeless craftsmanship. Direct white-glove delivery across India and the United Arab Emirates.
            </p>
            <div className="space-y-2 text-xs text-[#52525B] pt-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Concierge: <strong className="text-[#111111] font-mono">{OFFICIAL_WHATSAPP_NUMBER}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#111111] shrink-0" />
                <span>Regional Ateliers: Dubai, UAE & Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#111111] shrink-0" />
                <span>concierge@velmira.com</span>
              </div>
            </div>
          </div>

          {/* Watch Collections */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#111111] uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#71717A]">
              <li>
                <Link to="/watches?category=Men's%20Watches" className="hover:text-black transition">
                  Men's Watches
                </Link>
              </li>
              <li>
                <Link to="/watches?category=Women's%20Watches" className="hover:text-black transition">
                  Women's Watches
                </Link>
              </li>
              <li>
                <Link to="/watches?category=Luxury%20Watches" className="hover:text-black transition">
                  Luxury Watches
                </Link>
              </li>
              <li>
                <Link to="/watches?category=Classic%20Watches" className="hover:text-black transition">
                  Classic Watches
                </Link>
              </li>
              <li>
                <Link to="/watches?category=Sports%20Watches" className="hover:text-black transition">
                  Sports Watches
                </Link>
              </li>
              <li>
                <Link to="/watches?category=Minimal%20Watches" className="hover:text-black transition">
                  Minimal Watches
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#111111] uppercase tracking-widest mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#71717A]">
              <li>Direct WhatsApp Assistance</li>
              <li>Insured Doorstep Cargo (India & UAE)</li>
              <li>Serial Authenticity Verification</li>
              <li>Complimentary Bracelet Sizing</li>
              <li>White-Glove Courier Dispatch</li>
              <li>Patron Consultation</li>
            </ul>
          </div>

          {/* Assurance */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#111111] uppercase tracking-widest mb-4">
              Assurance
            </h4>
            <div className="space-y-3 text-xs text-[#71717A]">
              <div className="p-3.5 bg-white border border-neutral-200">
                <p className="font-semibold text-[#111111] text-[11px]">100% Certified Authentic</p>
                <p className="text-[10px] text-[#71717A] mt-0.5">Tested for water resistance, chronometer accuracy, and magnetic shielding.</p>
              </div>
              <div className="p-3.5 bg-white border border-neutral-200">
                <p className="font-semibold text-[#111111] text-[11px]">White-Glove Insured Cargo</p>
                <p className="text-[10px] text-[#71717A] mt-0.5">Insured doorstep dispatch across India & UAE Emirates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} VELMIRA HAUTE HORLOGERIE. All rights reserved.</p>

          <div className="flex items-center space-x-3 text-[10px] uppercase font-mono tracking-wider">
            <span className="px-2.5 py-1 bg-white border border-neutral-200 text-[#111111]">India 🇮🇳 (INR ₹)</span>
            <span className="px-2.5 py-1 bg-white border border-neutral-200 text-[#111111]">UAE 🇦🇪 (AED د.إ)</span>
            <span className="px-2.5 py-1 bg-[#111111] text-white font-bold">WhatsApp Direct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
