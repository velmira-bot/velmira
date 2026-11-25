import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getWhatsAppContact } from '../utils/whatsapp';

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Telangana',
  'Kerala',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'Andhra Pradesh',
  'Goa',
  'Odisha',
  'Assam',
  'Jammu & Kashmir',
  'Chandigarh'
];

const UAE_EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain'
];

export const CheckoutPage: React.FC = () => {
  const { cart, finalTotal, clearCart } = useCart();
  const { formatPrice, currency, country, setRegion } = useCurrency();

  // Mobile order summary accordion state
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Clean empty shipping state (NO mock/demo addresses)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateOrEmirate, setStateOrEmirate] = useState(country === 'UAE' ? 'Dubai' : 'Maharashtra');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Form submission ref for mobile sticky bar trigger
  const formRef = useRef<HTMLFormElement>(null);

  // Submission / confirmation state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle region switch directly on checkout
  const handleCountryToggle = (newCountry: 'India' | 'UAE') => {
    setRegion(newCountry);
    setStateOrEmirate(newCountry === 'UAE' ? 'Dubai' : 'Maharashtra');
  };

  // If bag is empty and not yet submitted
  if (cart.length === 0 && !isSubmitted) {
    return (
      <div className="min-h-[70vh] bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#F8F8F8] border border-neutral-200 flex items-center justify-center text-[#777777] mb-4">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111111]">
          Your Timepiece Bag is Empty
        </h2>
        <p className="text-xs text-[#777777] mt-2 max-w-sm">
          Please select an authentic luxury timepiece to begin your order inquiry.
        </p>
        <Link
          to="/watches"
          className="mt-6 px-8 py-3 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-semibold tracking-widest uppercase transition"
        >
          Explore Watches
        </Link>
      </div>
    );
  }

  // Handle inquiry submission
  const handleSubmitInquiry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('Please enter a valid WhatsApp mobile number.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!addressLine.trim()) {
      setErrorMessage('Please enter your delivery address.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    if (country === 'India') {
      if (!city.trim()) {
        setErrorMessage('Please enter your city.');
        return;
      }
      if (!pincode.trim() || pincode.trim().length !== 6) {
        setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
        return;
      }
    }

    // Generate clean inquiry reference ID
    const refId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(refId);

    // Format luxury WhatsApp message
    const lines: string[] = [
      '✦ *VELMIRA TIMEPIECES — ORDER ENQUIRY*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `*Reference:* ${refId}`,
      `*Date:* ${new Date().toLocaleDateString('en-GB')}`,
      `*Destination:* ${country === 'UAE' ? '🇦🇪 United Arab Emirates' : '🇮🇳 India'}`,
      '',
      '👤 *CLIENT DETAILS:*',
      `• *Name:* ${fullName.trim()}`,
      `• *WhatsApp:* ${phone.trim()}`,
      '',
      '📍 *DELIVERY ADDRESS:*',
      `• *Address:* ${addressLine.trim()}`
    ];

    if (landmark.trim()) {
      lines.push(`• *Landmark:* ${landmark.trim()}`);
    }

    if (country === 'India') {
      lines.push(`• *City:* ${city.trim()}`);
      lines.push(`• *State:* ${stateOrEmirate}`);
      lines.push(`• *PIN Code:* ${pincode.trim()}`);
    } else {
      lines.push(`• *Emirate:* ${stateOrEmirate}`);
      if (city.trim()) lines.push(`• *Area / Makani:* ${city.trim()}`);
    }

    lines.push('');
    lines.push('⌚ *SELECTED WATCHES:*');
    cart.forEach((item, idx) => {
      lines.push(`${idx + 1}. *${item.name}*`);
      lines.push(`   • Atelier: ${item.brand}`);
      lines.push(`   • Spec: ${item.size} | Color: ${item.color}`);
      lines.push(`   • Qty: ${item.quantity} × ${formatPrice(item.price, item.priceAED)}`);
    });

    lines.push('');
    lines.push(`💰 *TOTAL AMOUNT:* *${formatPrice(finalTotal)}*`);
    lines.push('🚚 *Delivery:* Complimentary Insured White-Glove Dispatch');

    if (notes.trim()) {
      lines.push('');
      lines.push(`📝 *Special Instructions:* ${notes.trim()}`);
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('Please confirm availability and dispatch schedule. Thank you.');

    const targetContact = getWhatsAppContact(country, phone);
    const encodedMsg = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/${targetContact.raw}?text=${encodedMsg}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Clear cart and show classy confirmation view
    clearCart();
    setIsSubmitted(true);
  };

  const targetContact = getWhatsAppContact(country, phone);

  // Classy Confirmation Screen
  if (isSubmitted) {
    return (
      <div className="min-h-[75vh] bg-[#FFFFFF] flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-6 sm:p-10 text-center shadow-lg">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#111111] text-white flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            ENQUIRY RECEIVED
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] tracking-wide mt-1">
            Thank You, {fullName.split(' ')[0]}
          </h2>
          <p className="text-xs text-[#777777] mt-1.5 font-mono">
            Reference ID: <strong className="text-[#111111] font-bold">{orderRef}</strong>
          </p>

          <div className="my-5 p-4 bg-[#F8F8F8] border border-neutral-200 text-left text-xs space-y-2 text-[#777777]">
            <p className="text-[#111111] font-medium">
              Your inquiry has been routed to our client concierge desk.
            </p>
            <p className="text-[11px] text-[#777777]">
              Our concierge at <strong>{targetContact.display}</strong> is reviewing your order details and will confirm dispatch tracking on WhatsApp shortly.
            </p>
          </div>

          <div className="space-y-2.5">
            <a
              href={`https://wa.me/${targetContact.raw}?text=${encodeURIComponent(`Hello Velmira Concierge, I am following up on my Order Enquiry Reference ${orderRef}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 bg-[#111111] hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue on WhatsApp ({targetContact.display})</span>
            </a>

            <Link
              to="/"
              className="block w-full py-2.5 px-6 border border-neutral-300 hover:border-black text-[#111111] text-xs font-medium uppercase tracking-wider transition text-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryItem = cart[0];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-28 sm:pb-16 pt-4 sm:pt-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Minimal Header Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
          <Link
            to="/watches"
            className="inline-flex items-center space-x-1.5 text-xs text-[#777777] hover:text-[#111111] font-medium transition py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Watches</span>
          </Link>

          <div className="text-center">
            <span className="font-serif text-base sm:text-lg font-bold tracking-[0.25em] text-[#111111]">
              VELMIRA
            </span>
            <span className="text-[9px] text-[#777777] block tracking-widest uppercase">
              Shipping & Order Enquiry
            </span>
          </div>

          {/* Compact Country Selector Pill */}
          <div className="inline-flex border border-neutral-200 bg-[#F8F8F8] p-0.5">
            <button
              type="button"
              onClick={() => handleCountryToggle('India')}
              className={`px-3 py-1 text-[11px] font-bold transition flex items-center space-x-1 ${
                country === 'India'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              <span>🇮🇳</span>
              <span>₹</span>
            </button>
            <button
              type="button"
              onClick={() => handleCountryToggle('UAE')}
              className={`px-3 py-1 text-[11px] font-bold transition flex items-center space-x-1 ${
                country === 'UAE'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              <span>🇦🇪</span>
              <span>AED</span>
            </button>
          </div>
        </div>

        {/* Compact Item Glance Preview Card (Visible on mobile & tablet) */}
        <div className="lg:hidden mb-6 bg-[#FFFFFF] border border-neutral-200 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {primaryItem && (
                <img
                  src={primaryItem.image}
                  alt={primaryItem.name}
                  className="w-12 h-14 object-cover border border-neutral-200 shrink-0 bg-[#F8F8F8]"
                />
              )}
              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-[#777777] uppercase tracking-wider truncate">
                  {primaryItem?.brand}
                </p>
                <h4 className="text-xs font-medium text-[#111111] truncate">
                  {primaryItem?.name} {cart.length > 1 && `+ ${cart.length - 1} more`}
                </h4>
                <p className="text-[10px] text-[#777777]">
                  {primaryItem?.size} • {primaryItem?.color} • Complimentary Shipping
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="ml-2 px-2.5 py-1.5 border border-neutral-200 bg-[#F8F8F8] text-[#111111] text-[11px] font-mono font-medium flex items-center space-x-1 shrink-0"
            >
              <span>{formatPrice(finalTotal)}</span>
              {isSummaryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Item Breakdown */}
          {isSummaryExpanded && (
            <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2 text-xs">
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="py-2 first:pt-0 flex items-center justify-between text-xs">
                    <span className="text-[#111111] truncate max-w-[200px]">{item.name} × {item.quantity}</span>
                    <span className="font-mono font-medium text-[#111111]">{formatPrice(item.price * item.quantity, (item.priceAED || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between text-[11px] text-[#111111] font-medium">
                <span>Insured White-Glove Dispatch</span>
                <span className="font-bold uppercase">Complimentary</span>
              </div>
            </div>
          )}
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Streamlined Mobile-Friendly Shipping Form */}
          <div className="lg:col-span-7 space-y-6">
            <form ref={formRef} onSubmit={handleSubmitInquiry} className="space-y-6">
              {errorMessage && (
                <div className="p-3 border border-red-300 bg-red-50 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* CARD 1: Patron Contact */}
              <div className="bg-[#FFFFFF] border border-neutral-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#111111]">
                    1. Contact Details
                  </h4>
                  <span className="text-[10px] text-[#777777]">Direct WhatsApp Confirmation</span>
                </div>

                <div className="border border-neutral-200 divide-y divide-neutral-200 bg-white">
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Julian Vance"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none"
                    />
                  </div>

                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                      WhatsApp Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#777777] shrink-0">
                        {country === 'UAE' ? '🇦🇪 +971' : '🇮🇳 +91'}
                      </span>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder={country === 'UAE' ? '50 123 4567' : '98765 43210'}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-[#111111] font-mono placeholder-[#AAAAAA] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Shipping Destination */}
              <div className="bg-[#FFFFFF] border border-neutral-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#111111]">
                    2. Delivery Location
                  </h4>
                  <span className="text-[10px] text-[#111111] font-semibold">
                    {country === 'UAE' ? 'United Arab Emirates' : 'India'}
                  </span>
                </div>

                <div className="border border-neutral-200 divide-y divide-neutral-200 bg-white">
                  {/* Street Address */}
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                      Address Details <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="street-address"
                      placeholder={
                        country === 'UAE'
                          ? 'Villa / Apartment, Building, Street / District'
                          : 'Flat / House No., Apartment, Street / Area'
                      }
                      value={addressLine}
                      onChange={e => setAddressLine(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none"
                    />
                  </div>

                  {/* Region Specific Rows */}
                  {country === 'India' ? (
                    <>
                      {/* State Dropdown */}
                      <div className="p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={stateOrEmirate}
                          onChange={e => setStateOrEmirate(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm text-[#111111] focus:outline-none cursor-pointer"
                        >
                          {INDIAN_STATES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* City & PIN Code */}
                      <div className="grid grid-cols-2 divide-x divide-neutral-200 bg-white">
                        <div className="p-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mumbai"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full bg-transparent text-xs sm:text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none"
                          />
                        </div>

                        <div className="p-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="6 Digits"
                            value={pincode}
                            onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-transparent text-xs sm:text-sm text-[#111111] font-mono placeholder-[#AAAAAA] focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* UAE Fields: Emirate & Area */
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 bg-white">
                      <div className="p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                          Emirate <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={stateOrEmirate}
                          onChange={e => setStateOrEmirate(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm text-[#111111] focus:outline-none cursor-pointer"
                        >
                          {UAE_EMIRATES.map(em => (
                            <option key={em} value={em}>{em}</option>
                          ))}
                        </select>
                      </div>

                      <div className="p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                          Area / Makani
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Downtown"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Landmark & Notes Toggle */}
                {!showOptionalFields ? (
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(true)}
                    className="text-[11px] font-medium text-[#111111] hover:underline flex items-center space-x-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Landmark or Instructions (Optional)</span>
                  </button>
                ) : (
                  <div className="pt-2 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near City Center"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                        Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Call prior to handover"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop-Only Submit Button */}
              <div className="hidden sm:block pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center space-x-2.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Enquiry on WhatsApp • {formatPrice(finalTotal)}</span>
                </button>
                <p className="text-[11px] text-center text-[#777777] mt-2">
                  Orders are confirmed directly with our boutique concierge at <strong className="text-[#111111]">{targetContact.display}</strong>.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT: Desktop Sticky Order Summary Column */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-[#FFFFFF] border border-neutral-200 p-6 sticky top-24">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#111111] mb-4 pb-3 border-b border-neutral-100 flex items-center justify-between">
                <span>Selected Timepieces</span>
                <span className="text-xs font-mono font-normal text-[#777777]">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1 space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover border border-neutral-200 shrink-0 bg-[#F8F8F8]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#777777] uppercase font-semibold tracking-wider">
                        {item.brand}
                      </p>
                      <h4 className="text-xs font-medium text-[#111111] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#777777]">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-medium font-mono text-[#111111] shrink-0">
                      {formatPrice(item.price * item.quantity, (item.priceAED || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#111111]">{formatPrice(finalTotal)}</span>
                </div>
                <div className="flex justify-between text-[#111111]">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>White-Glove Insured Delivery</span>
                  </span>
                  <span className="font-bold uppercase tracking-wider text-[10px]">Complimentary</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-serif text-sm font-bold text-[#111111] uppercase tracking-wide">
                    Total
                  </span>
                  <span className="font-mono text-lg font-bold text-[#111111]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Trust Pillars */}
              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-[#777777]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>100% Certified Authentic Swiss Horology</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Direct Concierge Verification on WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY: Sleek Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-6 sm:right-7.5 bg-white border-t border-neutral-200 p-3 sm:hidden z-30 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0 pl-1">
            <span className="text-[9px] uppercase tracking-wider text-[#777777] font-semibold block leading-tight">
              Total Payable
            </span>
            <span className="font-mono text-sm font-bold text-[#111111] leading-none">
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSubmitInquiry()}
            className="flex-1 py-3 px-4 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-2 hover:bg-neutral-800 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};