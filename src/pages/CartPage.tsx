import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { openWhatsAppOrder, getWhatsAppContact } from '../utils/whatsapp';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItemsCount,
    subtotal,
    deliveryFee,
    appliedCoupon,
    couponDiscount,
    finalTotal,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { formatPrice, currency, country } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode.trim());
    setCouponResult({ message: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  const handleWhatsAppOrder = () => {
    const defaultAddress = user?.addresses[0] || {
      id: 'temp',
      fullName: user?.name || 'Valued Client',
      phone: user?.phone || '',
      country: country,
      addressLine1: country === 'UAE' ? 'Dubai / Abu Dhabi, UAE' : 'Mumbai / Delhi, India',
      city: country === 'UAE' ? 'Dubai' : 'Mumbai',
      state: country === 'UAE' ? 'Dubai' : 'Maharashtra',
      pincode: country === 'UAE' ? '00000' : '400001',
      addressType: 'Home',
      isDefault: true
    };

    openWhatsAppOrder({
      customerName: user?.name || 'Valued Client',
      customerPhone: user?.phone || 'Provided via chat',
      customerEmail: user?.email,
      shippingAddress: defaultAddress,
      items: cart.map(it => ({
        name: it.name,
        brand: it.brand,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: it.price,
        priceAED: it.priceAED
      })),
      subtotal,
      deliveryFee,
      couponDiscount,
      totalAmount: finalTotal,
      currency,
      paymentMethod: 'WhatsApp Direct Confirmation'
    });
  };

  const shippingPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white p-12 border border-neutral-200">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#F8F8F8] border border-neutral-200 flex items-center justify-center text-[#777777]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#111111]">Your Timepiece Bag Is Empty</h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-2 max-w-md mx-auto leading-relaxed">
              Explore our precision Swiss automatic watches and horology collections.
            </p>
            <Link
              to="/watches"
              className="mt-8 inline-flex items-center space-x-2 px-8 py-3.5 bg-[#111111] text-white font-medium text-xs uppercase tracking-widest hover:bg-neutral-800 transition"
            >
              <span>Explore Watches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-16 font-sans">
      {/* Breadcrumb */}
      <div className="bg-[#FFFFFF] border-b border-neutral-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-[#777777]">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#777777]" />
          <span className="text-[#111111] font-medium">Watch Bag ({totalItemsCount} items)</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Your Watch Bag
          </h1>
          <div className="flex items-center space-x-2 text-xs text-[#111111] bg-[#F8F8F8] border border-neutral-200 px-3 py-1.5 font-medium">
            <MessageCircle className="w-4 h-4 text-[#111111]" />
            <span>Concierge: <strong>{getWhatsAppContact(country).display}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress bar */}
            <div className="bg-[#FFFFFF] p-4 border border-neutral-200">
              <div className="flex items-center justify-between text-xs">
                {freeDeliveryRemaining > 0 ? (
                  <span className="text-[#777777] font-medium">
                    Add <strong className="text-[#111111] font-mono">{formatPrice(freeDeliveryRemaining)}</strong> more for <strong className="text-[#111111]">Complimentary Express Delivery</strong>
                  </span>
                ) : (
                  <span className="text-[#111111] font-semibold flex items-center">
                    Complimentary Express Delivery unlocked for {country === 'UAE' ? 'the UAE' : 'India'}
                  </span>
                )}
                <span className="font-mono text-[#777777] text-[11px]">{shippingPercent}%</span>
              </div>
              <div className="w-full bg-[#EEEEEE] h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-[#111111] h-full transition-all duration-500"
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-[#FFFFFF] border border-neutral-200 divide-y divide-neutral-200">
              {cart.map(item => (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                  <Link to={`/products/${item.productId}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 sm:w-28 sm:h-32 object-cover object-center border border-neutral-200 bg-[#F8F8F8]"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-[#777777] uppercase tracking-wider">
                            {item.brand}
                          </span>
                          <Link to={`/products/${item.productId}`}>
                            <h3 className="text-sm sm:text-base font-medium text-[#111111] hover:underline transition">
                              {item.name}
                            </h3>
                          </Link>
                        </div>
                        <span className="text-base font-bold text-[#111111] font-mono">
                          {formatPrice(item.price * item.quantity, (item.priceAED || 0) * item.quantity)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#777777]">
                        <span className="border border-neutral-200 px-2.5 py-1 text-[#111111]">
                          Case Size: <strong>{item.size}</strong>
                        </span>
                        <span className="border border-neutral-200 px-2.5 py-1 text-[#111111]">
                          Finish: <strong>{item.color}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#777777] font-medium">Quantity:</span>
                        <div className="flex items-center border border-neutral-300 px-2 py-0.5 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#777777] hover:text-[#111111]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#111111] font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#777777] hover:text-[#111111]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-medium text-[#777777] hover:text-black transition flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Summary & WhatsApp CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            {/* Promo Code Box */}
            <div className="bg-[#FFFFFF] p-5 border border-neutral-200">
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider block mb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-[#111111]" /> Voucher Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 border border-neutral-200 bg-[#F8F8F8] text-xs">
                  <div>
                    <p className="font-bold text-[#111111]">{appliedCoupon.code} Applied</p>
                    <p className="text-[11px] text-[#777777]">Saved {formatPrice(couponDiscount)}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#777777] hover:text-black text-xs font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. VELMIRA500"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#111111] text-white font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 transition"
                    >
                      Apply
                    </button>
                  </div>

                  {couponResult && (
                    <p className={`text-[11px] ${couponResult.isError ? 'text-red-600' : 'text-[#111111]'}`}>
                      {couponResult.message}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price Details Card */}
            <div className="bg-[#FFFFFF] p-6 border border-neutral-200 space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#111111] uppercase tracking-widest pb-3 border-b border-neutral-100">
                Summary
              </h3>

              <div className="space-y-2.5 text-xs text-[#777777]">
                <div className="flex justify-between">
                  <span>Bag Subtotal ({totalItemsCount} items)</span>
                  <span className="font-mono text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#111111]">
                    <span>Voucher ({appliedCoupon?.code})</span>
                    <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Cargo</span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#111111] font-bold uppercase text-[10px]">Complimentary</span>
                  ) : (
                    <span className="font-mono text-[#111111]">{formatPrice(deliveryFee)}</span>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-[#111111]">
                  <span className="text-sm font-bold">Total Payable</span>
                  <span className="text-xl font-bold font-mono text-[#111111]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* DUAL CHECKOUT BUTTONS */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-6 bg-[#111111] hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp ({getWhatsAppContact(country).display})</span>
                </button>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 px-6 border border-neutral-300 hover:border-black text-[#111111] font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
                >
                  <span>Online Checkout Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-center space-x-1 text-[11px] text-[#777777]">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span>Express Insured Dispatch to India & UAE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};