import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Globe,
  Sparkles,
  Shield,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { getWhatsAppContact } from '../utils/whatsapp';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, setFilters } = useShop();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { country, setRegion, setIsRegionModalOpen } = useCurrency();
  const whatsappContact = getWhatsAppContact(country);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const matchingWatches = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.watchType && p.watchType.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setIsRegionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, searchQuery: searchQuery.trim(), category: 'All' }));
      navigate(`/watches?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Watches', path: '/watches' },
    { label: "Men's Watches", path: "/watches?category=Men's%20Watches" },
    { label: "Women's Watches", path: "/watches?category=Women's%20Watches" },
    { label: 'Luxury Watches', path: '/watches?category=Luxury%20Watches' }
  ];

  const trendingSearches = [
    'Seiko',
    'Cartier',
    'Hublot',
    'Tissot',
    'Casio Steel',
    'Tourbillon',
    'Emerald Dial'
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 text-[#111111] shadow-xs transition-all">
        {/* Subtle Top Utility Bar in Clean Off-White */}
        <div className="bg-[#F8F9FA] border-b border-neutral-200 text-[11px] py-1.5 px-4 sm:px-8 flex items-center justify-between text-[#64748B] font-sans">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-semibold text-[#111111] tracking-wider uppercase font-serif text-[10px]">
              VELMIRA ATELIER
            </span>
            <span className="text-neutral-300">|</span>
            <span className="truncate text-[#64748B] text-[10px] sm:text-[11px]">
              Complimentary Insured Delivery (India & UAE) • Concierge: <a href={`https://wa.me/${whatsappContact.raw}`} target="_blank" rel="noreferrer" className="text-[#111111] font-semibold hover:underline">{whatsappContact.display}</a>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs shrink-0">
            {/* Region / Currency Switcher */}
            <div ref={regionRef} className="relative">
              <button
                onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
                className="flex items-center space-x-1.5 py-0.5 px-2 rounded border border-neutral-300 bg-white text-[#111111] hover:border-black transition text-[11px]"
              >
                <span>{country === 'UAE' ? '🇦🇪 UAE (AED)' : '🇮🇳 India (INR ₹)'}</span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {isRegionMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white text-[#111111] rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs">
                  <button
                    onClick={() => { setRegion('India'); setIsRegionMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 ${country === 'India' ? 'font-bold text-black' : 'text-[#64748B]'}`}
                  >
                    <span>🇮🇳 India (₹ INR)</span>
                    {country === 'India' && <span className="text-[10px] bg-neutral-100 text-black px-1.5 rounded font-mono">Active</span>}
                  </button>
                  <button
                    onClick={() => { setRegion('UAE'); setIsRegionMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-neutral-50 ${country === 'UAE' ? 'font-bold text-black' : 'text-[#64748B]'}`}
                  >
                    <span>🇦🇪 UAE (AED د.إ)</span>
                    {country === 'UAE' && <span className="text-[10px] bg-neutral-100 text-black px-1.5 rounded font-mono">Active</span>}
                  </button>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button
                      onClick={() => { setIsRegionMenuOpen(false); setIsRegionModalOpen(true); }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-[#64748B] hover:text-black font-medium"
                    >
                      🗺️ Change Destination
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/admin" className="text-[#64748B] hover:text-black transition flex items-center space-x-1 text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
          {/* Left: Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 text-[#111111] hover:text-black"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex flex-col group">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#111111] transition">
                VELMIRA
              </span>
              <span className="text-[8px] font-medium tracking-[0.3em] text-[#777777] uppercase -mt-0.5 font-sans">
                Haute Horlogerie
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map(link => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors py-1 relative ${
                    isActive 
                      ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#111111]' 
                      : 'text-[#64748B] hover:text-[#111111]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Icons (Search, Wishlist, Bag) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#111111] hover:text-black transition rounded-full hover:bg-neutral-100"
              aria-label="Search watches"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/watches"
              className="relative p-2 text-[#111111] hover:text-black transition rounded-full hover:bg-neutral-100"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#111111] text-white font-bold text-[9px] flex items-center justify-center font-mono">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center space-x-2 py-2 px-3.5 rounded-full bg-[#111111] text-white hover:bg-black transition shadow-xs font-bold"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Minimal Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 bg-white p-4 shadow-lg animate-in fade-in duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search timepieces by name, collection, or complication (e.g., Seiko, Cartier, Santos, Hublot, Tissot)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-[#111111] placeholder-[#94A3B8] pl-11 pr-24 py-3 rounded-xl text-xs font-medium border border-neutral-300 focus:border-black focus:bg-white focus:outline-none transition"
                />
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition"
                >
                  Search
                </button>
              </form>

              {/* Instant Search Results Preview */}
              {matchingWatches.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-neutral-100 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717A] block">
                    Matching Timepieces ({matchingWatches.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingWatches.map(watch => (
                      <Link
                        key={watch.id}
                        to={`/products/${watch.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center space-x-3 p-2 border border-neutral-200 hover:border-black transition bg-[#FAFAFA] hover:bg-white"
                      >
                        <img
                          src={watch.images[0]}
                          alt={watch.name}
                          className="w-10 h-12 object-cover border border-neutral-200 bg-white shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] uppercase font-mono text-[#71717A] truncate">
                            {watch.brand}
                          </p>
                          <p className="text-xs font-serif font-bold text-[#111111] truncate">
                            {watch.name}
                          </p>
                          <span className="text-xs font-mono font-bold text-neutral-800">
                            {country === 'UAE' ? `AED ${watch.priceAED}` : `₹${watch.discountedPrice.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center flex-wrap gap-2 text-[11px] text-[#64748B]">
                <span className="flex items-center text-[#111111] font-semibold mr-1">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#111111]" /> Popular:
                </span>
                {trendingSearches.map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setFilters(prev => ({ ...prev, searchQuery: term, category: 'All' }));
                      navigate(`/watches?search=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#F8F9FA] border border-neutral-200 text-[#111111] hover:bg-[#111111] hover:text-white transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white py-4 px-6 space-y-3 animate-in fade-in duration-200 shadow-lg">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold tracking-wider text-[#111111] hover:text-black border-b border-neutral-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappContact.raw}?text=${encodeURIComponent('Hello Velmira Concierge, I would like to inquire about your watch collections.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#111111] py-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Concierge ({whatsappContact.display})</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
