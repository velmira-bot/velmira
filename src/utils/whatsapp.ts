import { CartItem, Product, Address, CurrencyType } from '../types';

export const VELMIRA_EMAIL = 'velmirafashion00@gmail.com';

// UAE Concierge
export const WHATSAPP_UAE_DISPLAY = '+971 556787854';
export const WHATSAPP_UAE_RAW = '971556787854';

// India Concierge
export const WHATSAPP_IND_DISPLAY = '+91 8893777727';
export const WHATSAPP_IND_RAW = '918893777727';

// Default export aliases
export const OFFICIAL_WHATSAPP_NUMBER = WHATSAPP_UAE_DISPLAY;
export const WHATSAPP_RAW_NUMBER = WHATSAPP_UAE_RAW;

/**
 * Returns the appropriate WhatsApp numbers based on user region/currency/phone.
 * Indian customers -> Indian number (+91 8893777727)
 * UAE customers -> UAE number (+971 556787854)
 */
export function getWhatsAppContact(countryOrCurrency?: string, phone?: string): { display: string; raw: string } {
  if (phone) {
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.startsWith('971')) {
      return { display: WHATSAPP_UAE_DISPLAY, raw: WHATSAPP_UAE_RAW };
    }
    if (cleanedPhone.startsWith('91')) {
      return { display: WHATSAPP_IND_DISPLAY, raw: WHATSAPP_IND_RAW };
    }
  }

  const norm = (countryOrCurrency || '').toUpperCase();
  if (norm === 'UAE' || norm === 'AED') {
    return { display: WHATSAPP_UAE_DISPLAY, raw: WHATSAPP_UAE_RAW };
  }
  if (norm === 'INDIA' || norm === 'IND' || norm === 'INR') {
    return { display: WHATSAPP_IND_DISPLAY, raw: WHATSAPP_IND_RAW };
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('velmira_country');
    if (saved === 'UAE') {
      return { display: WHATSAPP_UAE_DISPLAY, raw: WHATSAPP_UAE_RAW };
    }
  }

  // Default to India
  return { display: WHATSAPP_IND_DISPLAY, raw: WHATSAPP_IND_RAW };
}

export interface WhatsAppOrderDetails {
  orderId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: Address;
  items: Array<{
    name: string;
    brand: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    priceAED?: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  couponDiscount?: number;
  totalAmount: number;
  currency: CurrencyType;
  paymentMethod?: string;
  notes?: string;
}

export function formatWhatsAppOrderMessage(data: WhatsAppOrderDetails): string {
  const isAED = data.currency === 'AED' || data.shippingAddress.country === 'UAE';
  const currencySymbol = isAED ? 'AED ' : '₹';
  const countryFlag = data.shippingAddress.country === 'UAE' ? '🇦🇪 UAE' : '🇮🇳 INDIA';

  let msg = `👑 *VELMIRA — HAUTE HORLOGERIE ORDER* 👑\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  if (data.orderId) {
    msg += `🔖 *Order ID:* ${data.orderId}\n`;
  }
  msg += `📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n`;
  msg += `🌍 *Region:* ${countryFlag}\n\n`;

  msg += `👤 *CUSTOMER DETAILS:*\n`;
  msg += `• *Name:* ${data.customerName}\n`;
  msg += `• *WhatsApp Mobile:* ${data.customerPhone}\n`;
  if (data.customerEmail) {
    msg += `• *Email:* ${data.customerEmail}\n`;
  }
  msg += `\n📍 *DELIVERY ADDRESS:*\n`;
  msg += `${data.shippingAddress.addressLine1}\n`;
  if (data.shippingAddress.addressLine2) {
    msg += `${data.shippingAddress.addressLine2}\n`;
  }
  msg += `${data.shippingAddress.city}, ${data.shippingAddress.state}\n`;
  msg += `*Postal / PIN / Makani:* ${data.shippingAddress.pincode}\n`;
  msg += `*Country:* ${data.shippingAddress.country}\n\n`;

  msg += `⌚ *ORDERED TIMEPIECES:*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  data.items.forEach((item, idx) => {
    const itemPrice = isAED && item.priceAED ? item.priceAED : item.price;
    const itemTotal = itemPrice * item.quantity;
    msg += `${idx + 1}. *${item.name}*\n`;
    msg += `   • Brand: ${item.brand}\n`;
    msg += `   • Model/Size: ${item.size} | Shade: ${item.color}\n`;
    msg += `   • Qty: ${item.quantity} × ${currencySymbol}${itemPrice.toLocaleString('en-IN')}\n`;
    msg += `   • Item Total: *${currencySymbol}${itemTotal.toLocaleString('en-IN')}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *ORDER FINANCIAL SUMMARY:*\n`;
  msg += `• Subtotal: ${currencySymbol}${data.subtotal.toLocaleString('en-IN')}\n`;
  if (data.couponDiscount && data.couponDiscount > 0) {
    msg += `• Voucher Discount: -${currencySymbol}${data.couponDiscount.toLocaleString('en-IN')}\n`;
  }
  msg += `• White-Glove Shipping: ${data.deliveryFee === 0 ? 'FREE' : `${currencySymbol}${data.deliveryFee}`}\n`;
  msg += `• *FINAL PAYABLE:* *${currencySymbol}${data.totalAmount.toLocaleString('en-IN')}*\n\n`;

  if (data.paymentMethod) {
    msg += `💳 *Preferred Payment:* ${data.paymentMethod.toUpperCase()}\n`;
  }
  if (data.notes) {
    msg += `📝 *Client Note:* ${data.notes}\n`;
  }

  msg += `\n✨ *Velmira Dispatch Team:* Please confirm availability & dispatch tracking for this order!`;

  return msg;
}

export function openWhatsAppOrder(data: WhatsAppOrderDetails): void {
  const contact = getWhatsAppContact(
    data.shippingAddress?.country || data.currency,
    data.customerPhone
  );
  const message = formatWhatsAppOrderMessage(data);
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${contact.raw}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

export function openDirectProductWhatsApp(product: Product, size: string, color: string, currency: CurrencyType): void {
  const contact = getWhatsAppContact(currency);
  const isAED = currency === 'AED';
  const price = isAED ? (product.priceAED || Math.round(product.discountedPrice / 22.5)) : product.discountedPrice;
  const symbol = isAED ? 'AED ' : '₹';
  const country = isAED ? '🇦🇪 UAE' : '🇮🇳 India';

  let msg = `👑 *VELMIRA — HAUTE HORLOGERIE INQUIRY / ORDER* 👑\n\n`;
  msg += `Hello Velmira Dispatch Concierge, I would like to order this timepiece:\n\n`;
  msg += `⌚ *Timepiece:* ${product.name}\n`;
  msg += `🏷️ *Atelier Brand:* ${product.brand}\n`;
  msg += `📐 *Selected Size / Spec:* ${size || product.sizes[0]}\n`;
  msg += `🎨 *Selected Shade / Dial:* ${color || product.colors[0]?.name}\n`;
  msg += `💰 *Price:* ${symbol}${price.toLocaleString('en-IN')}\n`;
  msg += `🌍 *Region:* ${country}\n\n`;
  msg += `Please send me the ordering details and delivery timeline.`;

  const encodedText = encodeURIComponent(msg);
  window.open(`https://wa.me/${contact.raw}?text=${encodedText}`, '_blank');
}
