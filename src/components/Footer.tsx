import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { 
  WHATSAPP_UAE_DISPLAY, 
  WHATSAPP_UAE_RAW, 
  WHATSAPP_IND_DISPLAY, 
  WHATSAPP_IND_RAW, 
  VELMIRA_EMAIL 
} from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFAFA] text-[#71717A] border-t border-neutral-200 pt-16 pb-12 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="space-y-2.5 text-xs text-[#52525B] pt-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  UAE Concierge: <a href={`https://wa.me/${WHATSAPP_UAE_RAW}`} target="_blank" rel="noreferrer" className="text-[#111111] font-mono font-bold hover:underline">{WHATSAPP_UAE_DISPLAY}</a>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  IND Concierge: <a href={`https://wa.me/${WHATSAPP_IND_RAW}`} target="_blank" rel="noreferrer" className="text-[#111111] font-mono font-bold hover:underline">{WHATSAPP_IND_DISPLAY}</a>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#111111] shrink-0" />
                <a href={`mailto:${VELMIRA_EMAIL}`} className="text-[#111111] hover:underline font-medium">
                  {VELMIRA_EMAIL}
                </a>
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
