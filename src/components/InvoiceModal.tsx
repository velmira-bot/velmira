import React from 'react';
import { X, Printer, Download, Sparkles } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const gstRate = 0.18; // GST for luxury horology & leathergoods
  const taxableAmount = Math.round(order.totalAmount / (1 + gstRate));
  const totalTax = order.totalAmount - taxableAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 my-8 overflow-hidden print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Top Action Bar (hidden on print) */}
        <div className="bg-[#0F0F0F] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-cinzel font-bold tracking-wider">
              Official Tax Invoice — {order.id}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#c5a059] text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 text-stone-800 print:p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-stone-200">
            <div>
              <h1 className="font-serif text-2xl font-black tracking-widest text-[#0F0F0F]">
                VELMIRA
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#111111] font-semibold">
                Haute Horlogerie Ateliers
              </p>
              <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
                GSTIN: 27AABCV8942K1Z9 | CIN: U18209MH2026PLC098234<br />
                Email: velmirafashion00@gmail.com<br />
                UAE: +971 556787854 | IND: +91 8893777727
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-widest rounded-md">
                TAX INVOICE
              </span>
              <p className="text-xs font-semibold text-stone-900 mt-2">
                Invoice No: <span className="font-mono">{order.id}</span>
              </p>
              <p className="text-xs text-stone-500">
                Date: {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-stone-500">
                Payment: <span className="uppercase font-semibold text-stone-800">{order.paymentMethod}</span> ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-6 text-xs pb-6 border-b border-stone-200">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Billed To (Customer):
              </p>
              <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 mt-0.5">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p className="text-stone-600">{order.shippingAddress.addressLine2}</p>}
              <p className="text-stone-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-stone-600 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Dispatched via Luxury Cargo:
              </p>
              <p className="font-semibold text-stone-900">{order.courierPartner}</p>
              <p className="text-stone-600 mt-0.5 font-mono">AWB: {order.trackingNumber}</p>
              <p className="text-stone-600">Expected Delivery: {order.estimatedDelivery}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-stone-900 border-b border-stone-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Product Description</th>
                  <th className="p-3">Size & Shade</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 text-stone-400">{idx + 1}</td>
                    <td className="p-3 font-sans">
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-[10px] text-[#D4AF37] font-semibold uppercase">{item.brand}</p>
                    </td>
                    <td className="p-3 font-sans text-stone-600">
                      {item.size} / {item.color}
                    </td>
                    <td className="p-3 text-center font-bold text-stone-900">{item.quantity}</td>
                    <td className="p-3 text-right text-stone-600">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex justify-end pt-4 border-t border-stone-200">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Items)</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span className="font-mono">-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping & Insurance</span>
                <span className="font-mono">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>Estimated CGST (6%)</span>
                <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>Estimated SGST (6%)</span>
                <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t-2 border-stone-900">
                <span>Total Paid</span>
                <span className="font-mono text-stone-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="pt-8 border-t border-stone-200 flex justify-between items-end text-xs text-stone-500">
            <div>
              <p className="font-semibold text-stone-800">Velmira Authenticity & Returns Guarantee</p>
              <p className="text-[10px] text-stone-400 mt-0.5 max-w-sm">
                This is an authenticated computer-generated invoice with registered GST credentials. 7-day doorstep return privilege applies.
              </p>
            </div>
            <div className="text-right">
              <div className="font-serif-luxury italic text-stone-700 text-sm mb-1">
                Aurelius Laurent
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest border-t border-stone-300 pt-1">
                Authorized Signatory, Velmira Ltd
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
