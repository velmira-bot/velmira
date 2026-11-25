import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { openDirectProductWhatsApp } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice, currency } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const inWish = isInWishlist(product.id);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDirectProductWhatsApp(
      product,
      product.sizes[0] || 'Standard',
      product.colors[0]?.name || 'Standard',
      currency
    );
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#FBFBFB]">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center filter contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Minimal Luxury Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-[#111111] text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.2em] font-mono shadow-xs">
              NEW ALLOCATION
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-white/95 backdrop-blur-xs text-[#111111] border border-neutral-300 text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.15em] font-mono shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 shadow-xs border ${
            inWish
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white/90 text-neutral-600 border-neutral-200 hover:text-black hover:border-black hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Subtle quick indicator on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <div className="bg-white/92 backdrop-blur-md px-2.5 py-1 border border-neutral-200 text-center">
            <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-700">
              {product.watchType || 'AUTOMATIC CALIBRE'} • {product.sizes[0] || '40MM'}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between bg-white border-t border-neutral-100">
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#71717A]">
            <span className="font-semibold text-neutral-800">{product.brand}</span>
            <span className="truncate max-w-[120px] font-mono text-[8px] text-neutral-500">
              {product.subcategory || product.category}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-serif text-xs sm:text-sm font-bold text-[#111111] line-clamp-1 hover:text-neutral-600 transition-colors tracking-tight leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Available Colors Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 mt-2">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300 transition-transform hover:scale-125"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[8px] text-[#71717A] font-mono">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & View Product Button */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#111111] font-mono">
                {formatPrice(product.discountedPrice, product.priceAED)}
              </span>
              {product.originalPrice > product.discountedPrice && (
                <span className="text-[9px] text-[#A1A1AA] line-through font-mono">
                  {formatPrice(product.originalPrice, product.originalPriceAED)}
                </span>
              )}
            </div>
            <span className="text-[8px] text-emerald-700 font-medium hidden xs:inline">
              Insured
            </span>
          </div>

          <div className="flex items-center space-x-1.5 w-full">
            <button
              onClick={handleWhatsAppOrder}
              className="p-1.5 border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition shrink-0"
              title="Inquire on WhatsApp Concierge"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <Link
              to={`/products/${product.id}`}
              className="flex-1 py-1.5 bg-[#111111] text-white hover:bg-black transition text-[9px] font-bold uppercase tracking-widest font-sans inline-flex items-center justify-center space-x-1"
            >
              <span>View</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
