import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Printer, ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { TrackOrderModal } from '../components/TrackOrderModal';
import { getWhatsAppContact } from '../utils/whatsapp';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useShop();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  const order = orders.find(o => o.id === id) || orders[0];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] py-12 sm:py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 shadow-sm text-center">
          {/* Minimal Black/White Icon */}
          <div className="w-16 h-16 bg-[#111111] text-white flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#777777]">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] tracking-wide mt-1">
            Thank You For Your Patronage
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-2 max-w-md mx-auto">
            Your watch order has been scheduled for white-glove inspection and insured air express delivery.
          </p>

          {/* Order Details Strip */}
          <div className="mt-8 p-6 bg-[#F8F8F8] border border-neutral-200 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#777777] block font-semibold uppercase text-[10px]">Reference</span>
              <span className="font-mono font-bold text-[#111111] text-sm mt-0.5 block">{order?.id || id}</span>
            </div>
            <div>
              <span className="text-[#777777] block font-semibold uppercase text-[10px]">Estimated Delivery</span>
              <span className="font-medium text-[#111111] text-sm mt-0.5 block">{order?.estimatedDelivery || 'Within 2-3 Days'}</span>
            </div>
            <div>
              <span className="text-[#777777] block font-semibold uppercase text-[10px]">Total Amount</span>
              <span className="font-mono font-bold text-[#111111] text-sm mt-0.5 block">
                ₹{order?.totalAmount?.toLocaleString('en-IN') || '—'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${getWhatsAppContact(order?.shippingAddress?.country || order?.currency).raw}?text=${encodeURIComponent(`Hello Velmira Concierge, I am inquiring about my Watch Order ID: ${order?.id || id}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge ({getWhatsAppContact(order?.shippingAddress?.country || order?.currency).display})</span>
            </a>

            <button
              onClick={() => setIsTrackOpen(true)}
              className="w-full sm:w-auto px-6 py-3 border border-neutral-300 hover:border-black text-[#111111] font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Delivery</span>
            </button>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="w-full sm:w-auto px-6 py-3 border border-neutral-300 hover:border-black text-[#111111] font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Invoice</span>
            </button>

            <Link
              to="/watches"
              className="w-full sm:w-auto px-6 py-3 border border-neutral-300 hover:border-black text-[#111111] font-medium text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2"
            >
              <span>Explore Watches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Delivery Address summary */}
          {order?.shippingAddress && (
            <div className="mt-10 pt-6 border-t border-neutral-100 text-left text-xs text-[#777777] max-w-md mx-auto">
              <div className="flex items-center space-x-1.5 font-bold text-[#111111] mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                <span>Delivery Address:</span>
              </div>
              <p className="text-[#111111] font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        order={order}
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />
    </div>
  );
};