import React from 'react';
import { ShieldCheck, RotateCcw, Truck, MessageSquare } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const perks = [
    {
      icon: ShieldCheck,
      title: '100% Certified Authentic',
      subtitle: 'Swiss movements & Italian leather'
    },
    {
      icon: Truck,
      title: 'Pan-India & UAE Express',
      subtitle: 'Insured doorstep dispatch'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Concierge',
      subtitle: 'Direct: IND & UAE Dedicated Support'
    },
    {
      icon: RotateCcw,
      title: 'Atelier Packaging',
      subtitle: 'Complimentary presentation case'
    }
  ];

  return (
    <section className="border-b border-stone-200/70 bg-white py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 ${idx > 0 ? 'sm:pl-6' : ''} ${idx > 1 ? 'pt-3 sm:pt-0' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-cinzel text-stone-900 tracking-wide">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">{perk.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
