import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { openWhatsAppOrder, getWhatsAppContact } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
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
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    setCouponStatus({ message: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleWhatsAppCheckout = () => {
    const defaultAddress = user?.addresses[0] || {
      id: 'temp',
      fullName: user?.name || 'Valued Patron',
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
      customerName: user?.name || 'Valued Patron',
      customerPhone: user?.phone || 'Provided upon inquiry',
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

  const handleStandardCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  const shippingPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-6 sm:right-7.5 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white text-[#111111] border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              <h2 className="font-serif text-base font-bold tracking-wider uppercase">Shopping Bag</h2>
              <span className="text-xs bg-[#111111] text-white px-2 py-0.5 font-mono">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-[#777777] hover:text-[#111111] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Region Indicator & WhatsApp Notice */}
          <div className="bg-[#F8F8F8] text-[#111111] border-b border-neutral-200 p-2.5 px-4 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <MessageCircle className="w-3.5 h-3.5 text-[#111111] shrink-0" />
              <span className="truncate">Concierge: <strong>{getWhatsAppContact(country).display}</strong></span>
            </div>
            <span className="font-mono text-[10px] border border-neutral-300 px-1.5 py-0.5 shrink-0">
              {country === 'UAE' ? '🇦🇪 UAE' : '🇮🇳 INDIA'}
            </span>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FFFFFF] p-3 px-5 border-b border-neutral-200 text-xs">
            {freeDeliveryRemaining > 0 ? (
              <p className="text-[#777777] font-medium">
                Add <span className="font-bold text-[#111111]">{formatPrice(freeDeliveryRemaining)}</span> more for <span className="text-[#111111] font-semibold">Complimentary Express Shipping</span>
              </p>
            ) : (
              <p className="text-[#111111] font-semibold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#111111]" /> Complimentary Express Delivery Unlocked
              </p>
            )}
            <div className="w-full bg-[#E5E5E5] h-1 mt-2 overflow-hidden">
              <div
                className="bg-[#111111] h-full transition-all duration-500"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F8F8F8] border border-neutral-200 flex items-center justify-center text-[#777777]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#111111] uppercase tracking-wider">Your bag is empty</h3>
                <p className="text-xs text-[#777777] mt-1 max-w-xs mx-auto">
                  Explore our luxury Swiss and automatic timepieces to begin your curation.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/watches');
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex space-x-3.5 p-3 border border-neutral-200 bg-[#FFFFFF] hover:border-black transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover shrink-0 border border-neutral-200 bg-[#F8F8F8]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-[#777777] tracking-widest uppercase truncate">
                        {item.brand}
                      </p>
                      <h4 className="text-xs font-medium text-[#111111] line-clamp-1 mt-0.5">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#777777]">
                        <span className="border border-neutral-200 px-1.5 py-0.2 text-[#111111]">
                          {item.size}
                        </span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                      <div className="flex items-center space-x-1.5 border border-neutral-300 bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-[#777777] hover:text-[#111111] p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-[#111111]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#777777] hover:text-[#111111] p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#111111] font-mono">
                          {formatPrice(item.price * item.quantity, (item.priceAED || 0) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#777777] hover:text-black p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-200 p-4 sm:p-5 bg-white space-y-3.5">
              {/* Summary */}
              <div className="space-y-1.5 text-xs text-[#777777]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#111111] font-medium font-mono">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#111111]">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#111111] font-bold uppercase text-[10px]">Complimentary</span>
                  ) : (
                    <span className="font-mono">{formatPrice(deliveryFee)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="text-base text-[#111111] font-mono">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 bg-[#111111] text-white hover:bg-neutral-800 font-medium text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge ({getWhatsAppContact(country).display})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleViewCart}
                    className="w-full py-2.5 border border-neutral-300 text-[#111111] font-medium text-xs uppercase tracking-wider hover:bg-neutral-100 transition"
                  >
                    View Bag
                  </button>
                  <button
                    onClick={handleStandardCheckout}
                    className="w-full py-2.5 bg-[#111111] text-white font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center space-x-1"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
