import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const PINCodeChecker: React.FC = () => {
  const { country } = useCurrency();
  const [inputVal, setInputVal] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'India' | 'UAE'>(country);
  const [result, setResult] = useState<{
    valid: boolean;
    city?: string;
    deliveryDate?: string;
    codAvailable?: boolean;
    message?: string;
  } | null>(null);

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim();

    if (selectedCountry === 'India') {
      if (!/^\d{6}$/.test(clean)) {
        setResult({
          valid: false,
          message: 'Please enter a valid 6-digit Indian PIN code'
        });
        return;
      }

      let city = 'Metro Region';
      if (clean.startsWith('400')) city = 'Mumbai';
      else if (clean.startsWith('110')) city = 'New Delhi';
      else if (clean.startsWith('560')) city = 'Bengaluru';
      else if (clean.startsWith('600')) city = 'Chennai';
      else if (clean.startsWith('700')) city = 'Kolkata';
      else if (clean.startsWith('500')) city = 'Hyderabad';

      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      setResult({
        valid: true,
        city: `${city}, India`,
        deliveryDate,
        codAvailable: true
      });
    } else {
      // UAE Check
      if (clean.length < 3) {
        setResult({
          valid: false,
          message: 'Please enter your UAE Emirate or Area (e.g. Dubai Marina, Downtown, Abu Dhabi)'
        });
        return;
      }

      const deliveryDate = 'Next-Day Express (Within 24 Hours)';

      setResult({
        valid: true,
        city: `${clean.toUpperCase()}, UAE`,
        deliveryDate,
        codAvailable: true
      });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-stone-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-800 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>India & UAE Delivery Availability</span>
        </div>

        {/* Country toggle */}
        <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-white text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => { setSelectedCountry('India'); setResult(null); setInputVal(''); }}
            className={`px-2 py-0.5 rounded transition ${selectedCountry === 'India' ? 'bg-[#0F0F0F] text-white' : 'text-stone-500'}`}
          >
            🇮🇳 India
          </button>
          <button
            type="button"
            onClick={() => { setSelectedCountry('UAE'); setResult(null); setInputVal(''); }}
            className={`px-2 py-0.5 rounded transition ${selectedCountry === 'UAE' ? 'bg-[#0F0F0F] text-white' : 'text-stone-500'}`}
          >
            🇦🇪 UAE
          </button>
        </div>
      </div>

      <form onSubmit={checkDelivery} className="flex gap-2">
        <input
          type="text"
          placeholder={
            selectedCountry === 'India'
              ? 'Enter 6-digit Indian PIN (e.g. 400053)'
              : 'Enter Emirate / Area (e.g. Dubai, Abu Dhabi)'
          }
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#D4AF37] bg-white font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#0F0F0F] text-[#D4AF37] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition"
        >
          Check
        </button>
      </form>

      {result && (
        <div className="mt-3 text-xs">
          {result.valid ? (
            <div className="space-y-1.5 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900">
              <div className="flex items-center space-x-1.5 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Express White-Glove Handover to {result.city}</span>
              </div>
              <p className="text-[11px] text-stone-600 pl-5">
                • Timeline: <strong className="text-stone-900">{result.deliveryDate}</strong>
              </p>
              <p className="text-[11px] text-stone-600 pl-5">
                • <strong className="text-emerald-700">Cash on Delivery & WhatsApp Dispatch Available</strong>
              </p>
              <p className="text-[11px] text-stone-600 pl-5">
                • Inquiries & Customization via WhatsApp ({selectedCountry === 'UAE' ? '+971 556787854' : '+91 8893777727'})
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-red-600 text-[11px]">
              <AlertCircle className="w-4 h-4" />
              <span>{result.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
