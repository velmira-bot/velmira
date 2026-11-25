import { Product, Coupon, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. User Photo 1: Seiko Collection Vault (Emerald, Cyan & White dials in mahogany box)
  {
    id: 'prod-w1',
    name: 'Velmira Atelier Calibre 5 Automatic Suite',
    brand: 'VELMIRA ATELIER',
    category: "Men's Watches",
    subcategory: 'Automatic Timepieces',
    originalPrice: 28999,
    discountedPrice: 14999,
    originalPriceAED: 1280,
    priceAED: 660,
    discountPercentage: 48,
    rating: 4.9,
    ratingCount: 1240,
    reviewCount: 312,
    images: [
      '/watches/seiko-collection-vault.jpg',
      '/watches/emerald-purple-automatic.jpg',
      '/watches/seiko-collection-vault.jpg'
    ],
    sizes: ['38mm', '40mm', '42mm'],
    colors: [
      { name: 'Sunburst Cyan Teal', hex: '#008080' },
      { name: 'Vivid Emerald Green', hex: '#1B4D3E' },
      { name: 'Pure Snow White', hex: '#FFFFFF' }
    ],
    stock: 8,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isTopDeal: true,
    description: 'Bespoke automatic mechanical timepiece suite showcased in mahogany watch vault. Powered by an ultra-reliable 21-jewel self-winding rotor with quickset day-date complication, faceted baton hour markers, and integrated brushed 316L stainless steel oyster bracelet.',
    watchType: 'Automatic Day-Date',
    dialColor: 'Sunburst Cyan & Emerald',
    strapMaterial: 'Brushed 316L Stainless Steel Bracelet',
    caseMaterial: 'Surgical Grade 316L Stainless Steel',
    availability: 'In Stock (Ships in 24 Hours)',
    fabric: '316L Steel, Hardlex / Mineral Crystal, Luminescent Hands',
    fit: '38mm / 40mm Case Diameter • 11.5mm Thickness',
    pattern: 'Sunburst Radial Dial with Lumibrite Hands',
    occasion: 'Executive Daily Wear & Horology Collections',
    care: 'Water resistant to 100 meters (10 ATM). Microfiber polish recommended.',
    specifications: {
      'Calibre': 'Automatic Calibre 7S26 (21,600 vph)',
      'Complications': 'Day-Date Display (English / Arabic / Spanish)',
      'Power Reserve': '41 Hours',
      'Glass': 'Scratch-Resistant Hardlex Crystal',
      'Water Resistance': '10 ATM / 100 Meters',
      'Case Back': 'Screw-Down Exhibition Mineral Caseback'
    },
    createdAt: '2026-02-01T10:00:00Z'
  },

  // 2. User Photo 2: Emerald Green & Purple Automatic Dials
  {
    id: 'prod-w2',
    name: 'Velmira Royal Sunburst Emerald & Imperial Purple Calibre',
    brand: 'VELMIRA ATELIER',
    category: "Men's Watches",
    subcategory: 'Mechanical Complications',
    originalPrice: 26500,
    discountedPrice: 13499,
    originalPriceAED: 1170,
    priceAED: 590,
    discountPercentage: 49,
    rating: 4.8,
    ratingCount: 890,
    reviewCount: 198,
    images: [
      '/watches/emerald-purple-automatic.jpg',
      '/watches/seiko-collection-vault.jpg',
      '/watches/emerald-purple-automatic.jpg'
    ],
    sizes: ['39mm', '41mm'],
    colors: [
      { name: 'Emerald Forest Sunburst', hex: '#0F52BA' },
      { name: 'Imperial Amethyst Purple', hex: '#4B0082' }
    ],
    stock: 6,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isTopDeal: false,
    description: 'Vivid jewel-toned sunburst dials engineered under warm atelier horology lighting. Features gold-toned faceted indices, day-date window with bilingual calendar wheels, and hand-finished satin-brushed steel case.',
    watchType: 'Automatic Calibre',
    dialColor: 'Sunburst Emerald & Royal Purple',
    strapMaterial: 'Premium Textured Black Calfskin / Steel Mesh',
    caseMaterial: 'Surgical 316L Stainless Steel',
    availability: 'In Stock (Only 6 Units Allocated)',
    fabric: '316L Steel, Luminescent Markers, Sapphire Coated Mineral',
    fit: '39mm Case Diameter • 10.8mm Thickness',
    pattern: 'Radial Brushed Sunburst Reflection',
    occasion: 'Fine Dining, Horology Gatherings & Evening Formals',
    care: 'Wipe with soft cloth. Avoid severe thermal shocks.',
    specifications: {
      'Movement': 'Automatic Calibre 21-Jewel Precision Rotor',
      'Crystal': 'Anti-Reflective Sapphire-Coated Mineral',
      'Luminescence': 'SuperLuminova Gold-Tone Hour Markers',
      'Water Resistance': '5 ATM / 50M',
      'Strap Width': '20mm Standard Lug Width'
    },
    createdAt: '2026-02-05T12:00:00Z'
  },

  // 3. User Photo 3: Cartier Boutique Display (Santos & Geometric Timepieces)
  {
    id: 'prod-w3',
    name: 'Velmira Santos Geometric Boutique Edition',
    brand: 'VELMIRA ATELIER',
    category: 'Luxury Watches',
    subcategory: 'Art Deco Luxury',
    originalPrice: 48000,
    discountedPrice: 24999,
    originalPriceAED: 2100,
    priceAED: 1090,
    discountPercentage: 48,
    rating: 5.0,
    ratingCount: 1680,
    reviewCount: 420,
    images: [
      '/watches/cartier-boutique-display.jpg',
      '/watches/cartier-boutique-display.jpg',
      '/watches/tissot-silver-chronograph.jpg'
    ],
    sizes: ['Medium 35mm', 'Large 39.8mm'],
    colors: [
      { name: 'Brushed Silver & Blued Hands', hex: '#C0C0C0' },
      { name: 'Two-Tone Steel & Champagne Gold', hex: '#D4AF37' },
      { name: 'Alligator Black Leather Edition', hex: '#111111' }
    ],
    stock: 5,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    isTopDeal: true,
    description: 'Iconic Parisian Art Deco square silhouette as seen in luxury flagship boutique vitrines. Features exposed polished bezel screws, blued-steel sword hands, Roman numerals dial, and SmartLink interchangeable steel bracelet.',
    watchType: 'Automatic Luxury Dress',
    dialColor: 'Opaline Silver with Roman Numerals',
    strapMaterial: '316L Steel SmartLink Bracelet + Alligator Leather',
    caseMaterial: 'Mirror-Polished & Brushed 316L Stainless Steel',
    availability: 'Limited Boutique Allocation',
    fabric: 'Surgical Steel, Synthetic Blue Spinel Cabochon, Sapphire Crystal',
    fit: 'Square 39.8mm x 47.5mm • 9.38mm Slim Profile',
    pattern: 'Boutique Satin-Brushed Bezel with Mirror Polished Chamfers',
    occasion: 'Black Tie Galas, Executive Boardrooms & High Society',
    care: 'Pressure tested to 10 ATM. Annual concierge inspection complimentary.',
    specifications: {
      'Movement': 'Manufacture Calibre 1847 MC Automatic',
      'Crown': 'Seven-Sided Crown Set with Faceted Synthetic Spinel',
      'Glass': 'Anti-Reflective Scratchproof Sapphire Crystal',
      'Bracelet System': 'QuickSwitch & SmartLink Size Adjustment',
      'Water Resistance': '10 ATM / 100 Meters'
    },
    createdAt: '2026-01-20T09:00:00Z'
  },

  // 4. User Photo 4: Hublot Chrono Lounge & Fluted Bezel Steel Watch
  {
    id: 'prod-w4',
    name: 'Velmira Titanium Chrono-Lounge Monopusher & Fluted Steel',
    brand: 'VELMIRA ATELIER',
    category: "Men's Watches",
    subcategory: 'Sports Chronograph',
    originalPrice: 52000,
    discountedPrice: 28500,
    originalPriceAED: 2280,
    priceAED: 1250,
    discountPercentage: 45,
    rating: 4.9,
    ratingCount: 750,
    reviewCount: 165,
    images: [
      '/watches/hublot-chrono-lounge.jpg',
      '/watches/hublot-chrono-lounge.jpg',
      '/watches/tissot-silver-chronograph.jpg'
    ],
    sizes: ['42mm', '44mm'],
    colors: [
      { name: 'Brushed Titanium & Saddle Tan', hex: '#8B4513' },
      { name: 'Fluted Steel & Oyster Silver', hex: '#C0C0C0' }
    ],
    stock: 4,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isTopDeal: false,
    description: 'High-complication chronograph captured in evening mood lighting alongside fine vintage wine. Features openwork chronograph registers, H-shaped structural titanium screws, saddle-stitched natural leather strap, accompanied by fluted-bezel dress complication.',
    watchType: 'Automatic Column-Wheel Chronograph',
    dialColor: 'Matte Anthracite Skeleton',
    strapMaterial: 'Hand-Finished Saddle Leather & Rubber Core',
    caseMaterial: 'Grade 5 Satin-Finished Titanium & 316L Steel',
    availability: 'Limited Edition — 4 Units Remaining',
    fabric: 'Grade 5 Titanium, Scratch-Resistant Sapphire, Genuine Calf Leather',
    fit: '44mm Diameter • 14.5mm Bold Stature',
    pattern: 'Skeleton Open-Dial with Dual Bi-Compax Subdials',
    occasion: 'Private Lounges, Cigar Clubs & Yacht Racing',
    care: 'Water resistant to 10 ATM. Service movement every 4 years.',
    specifications: {
      'Movement': 'HUB4100 Self-Winding Chronograph Calibre (28,800 vph)',
      'Bezel': 'Satin-Finished Titanium with 6 H-Shaped Titanium Screws',
      'Power Reserve': '48 Hours Power Reserve',
      'Crystal': 'Sapphire with Anti-Reflective Treatment on Both Sides',
      'Clasp': 'Micro-Blasted Titanium Deployant Buckle'
    },
    createdAt: '2026-02-10T14:00:00Z'
  },

  // 5. User Photo 6: Tissot Silver Chronograph on Leather and Autumn Leaves
  {
    id: 'prod-w5',
    name: 'Velmira Heritage Chronometer Silver Sunburst',
    brand: 'VELMIRA ATELIER',
    category: 'Classic Watches',
    subcategory: 'Heritage Tachymètre',
    originalPrice: 34999,
    discountedPrice: 18999,
    originalPriceAED: 1530,
    priceAED: 830,
    discountPercentage: 46,
    rating: 4.9,
    ratingCount: 1120,
    reviewCount: 290,
    images: [
      '/watches/tissot-silver-chronograph.jpg',
      '/watches/tissot-silver-chronograph.jpg',
      '/watches/cartier-boutique-display.jpg'
    ],
    sizes: ['40mm', '42mm'],
    colors: [
      { name: 'Cognac Alligator & Pure Silver', hex: '#9A5B32' },
      { name: 'Noir Black Leather & Silver', hex: '#111111' }
    ],
    stock: 7,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    isTopDeal: true,
    description: 'An authentic tribute to 1950s Swiss chronometry resting on fine leather binding and autumn foliage. Boasts a concentric silver dial with tachymeter scale, triple chronograph registers, date window at 4 o’clock, and rich chestnut alligator grain leather.',
    watchType: 'Precision Swiss Chronograph',
    dialColor: 'Radiant Silver Sunburst with Black Accents',
    strapMaterial: 'Handcrafted Cognac Alligator-Embossed Leather',
    caseMaterial: 'Polished 316L Surgical Stainless Steel',
    availability: 'In Stock (Ready for Dispatch)',
    fabric: '316L Steel, Anti-Reflective Domed Sapphire, Full-Grain Leather',
    fit: '42mm Case Diameter • 12mm Profile',
    pattern: 'Concentric Guilloché Subdials with Tachymeter Ring',
    occasion: 'Autumn Travel, Heritage Gatherings & Classic Suiting',
    care: 'Protect leather strap from prolonged water exposure.',
    specifications: {
      'Movement': 'Valjoux High-Precision Chronograph Calibre',
      'Glass': 'Scratch-Resistant Domed Sapphire Crystal',
      'Pushers': 'Dual Tactile Pump Chronograph Pushers',
      'Water Resistance': '10 ATM / 100M',
      'Buckle': 'Standard Steel Tang Buckle with Engraved Atelier Shield'
    },
    createdAt: '2026-01-25T11:00:00Z'
  },

  // 6. User Photo 7: Casio Vintage Digital & Ana-Digi Steel Watches
  {
    id: 'prod-w6',
    name: 'Velmira Heritage Steel Digital & Ana-Digi Dual Timepiece',
    brand: 'VELMIRA ATELIER',
    category: 'Minimal Watches',
    subcategory: 'Brushed Steel Digital',
    originalPrice: 14999,
    discountedPrice: 7999,
    originalPriceAED: 650,
    priceAED: 350,
    discountPercentage: 47,
    rating: 4.8,
    ratingCount: 2150,
    reviewCount: 540,
    images: [
      '/watches/vintage-silver-digital.jpg',
      '/watches/vintage-silver-digital.jpg',
      '/watches/seiko-collection-vault.jpg'
    ],
    sizes: ['36mm Unisex', '38.5mm Standard'],
    colors: [
      { name: 'Brushed Stainless Silver', hex: '#CBD5E1' },
      { name: 'Matte Resin Black Dual-Time', hex: '#1E293B' }
    ],
    stock: 15,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isTopDeal: true,
    description: 'The definitive architectural retro-future steel watches on deep slate. Featuring high-contrast illuminated LCD displays, dual time hybrid analog-digital dials, 1/100-second stopwatch, and adjustable sliding-clasp steel mesh links.',
    watchType: 'Digital & Ana-Digi Chrono',
    dialColor: 'Negative Black LCD & Textured Silver Grid',
    strapMaterial: 'Fold-Over Brushed Stainless Steel Mesh Link Bracelet',
    caseMaterial: 'Chrome-Plated Resin / Solid Steel Bezel',
    availability: 'In Stock (High Volume Dispatch)',
    fabric: 'Stainless Steel Bracelet, Water Sealed Casing, Acrylic / Mineral',
    fit: '36.8mm x 33.2mm • 8.2mm Ultra-Slim',
    pattern: 'Geometric Rectangular Minimalist Form',
    occasion: 'Streetwear, Creative Studios & Daily Minimalist Curation',
    care: 'Daily water resistant. Battery life rated for 5+ years.',
    specifications: {
      'Functions': 'Daily Alarm, Hourly Time Signal, Auto-Calendar, 1/100s Stopwatch',
      'Backlight': 'Electro-Luminescent Amber / Green Glow',
      'Battery Life': 'Approx. 5-7 Years on CR2016',
      'Weight': 'Featherlight 48 grams',
      'Clasp': 'Self-Adjustable Slide Clasp'
    },
    createdAt: '2026-02-12T08:00:00Z'
  },

  // 7. User Photo 5: Vintage Horology Atelier Repair Display
  {
    id: 'prod-w7',
    name: 'Velmira Vintage Chronometric Workshop Edition',
    brand: 'VELMIRA ATELIER',
    category: 'Classic Watches',
    subcategory: 'Restored Vintage Horology',
    originalPrice: 32000,
    discountedPrice: 16500,
    originalPriceAED: 1400,
    priceAED: 720,
    discountPercentage: 48,
    rating: 4.9,
    ratingCount: 640,
    reviewCount: 150,
    images: [
      '/watches/horology-atelier-vintage.jpg',
      '/watches/tissot-silver-chronograph.jpg',
      '/watches/seiko-collection-vault.jpg'
    ],
    sizes: ['38mm Vintage Fit'],
    colors: [
      { name: 'Monochrome Silver & Steel', hex: '#A0AAB2' },
      { name: 'Patinated Bronze & Slate', hex: '#6B7280' }
    ],
    stock: 5,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    isTopDeal: false,
    description: 'Captured directly at the watchmaker’s workbench. A curation of historic mechanical calibres, featuring coin-edge bezels, classic linked steel bracelets, and precision-regulated escapements that have stood the test of decades.',
    watchType: 'Manual-Wind Heritage',
    dialColor: 'Classic Ink Black with Applied Steel Indices',
    strapMaterial: 'Vintage 5-Link Steel Jubilee Bracelet',
    caseMaterial: 'Refurbished & Hand-Polished 316L Stainless Steel',
    availability: 'Atelier Certified (Only 5 Pieces)',
    fabric: 'Solid Steel, Restored Escapement, Domed Acrylic / Glass',
    fit: '38mm Classic Heritage Diameter • 10.5mm Thickness',
    pattern: 'Black & White Horology Atelier Finish',
    occasion: 'Collectors Gatherings, Auctions & Vintage Appreciation',
    care: 'Keep dry. Hand-wind gently until resistance is felt.',
    specifications: {
      'Movement': 'Regulated 17-Jewel Manual Wind Movement (18,000 vph)',
      'Accuracy': 'Regulated to ±8s Daily Tolerance on Witschi Timing Machine',
      'Dial': 'Authentic Restored Lacquer Black Face',
      'Certification': 'Velmira Atelier Heritage Certificate of Authenticity'
    },
    createdAt: '2026-02-14T15:00:00Z'
  },

  // 8. External Cinematic Watch: Flying Tourbillon Openwork Masterpiece
  {
    id: 'prod-w8',
    name: 'Velmira Grand Complication Flying Tourbillon 42mm',
    brand: 'VELMIRA ATELIER',
    category: 'Luxury Watches',
    subcategory: 'Haute Horlogerie',
    originalPrice: 65000,
    discountedPrice: 34999,
    originalPriceAED: 2850,
    priceAED: 1530,
    discountPercentage: 46,
    rating: 5.0,
    ratingCount: 420,
    reviewCount: 110,
    images: [
      '/watches/horology-atelier-vintage.jpg',
      '/watches/hublot-chrono-lounge.jpg',
      '/watches/cartier-boutique-display.jpg'
    ],
    sizes: ['42mm'],
    colors: [
      { name: 'Rose Gold & Ruthenium Skeleton', hex: '#B76E79' },
      { name: 'Platinum Silver & Blued Screws', hex: '#CBD5E1' }
    ],
    stock: 3,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    isTopDeal: false,
    description: 'A monument to astronomical timekeeping. Features an exposed 60-second flying tourbillon cage rotating weightlessly at 6 o’clock, skeletonized ruthenium bridges, and dual sapphire crystals for full mechanical transparency.',
    watchType: 'Flying Tourbillon',
    dialColor: 'Openwork Ruthenium Skeleton',
    strapMaterial: 'Hand-Stitched Mississippiensis Alligator Leather',
    caseMaterial: '18K Rose Gold Plated 316L Surgical Steel',
    availability: 'Ultra-Rare — 3 Units In Vault',
    fabric: 'Rose Gold Plated Steel, Tourbillon Titanium Cage, Sapphire Glass',
    fit: '42mm Case • 11.8mm Profile',
    pattern: 'Hand-Chamfered Côtes de Genève Engraving',
    occasion: 'Palace Galas, VIP State Banquets & Horology Connoisseurs',
    care: 'Manual winding. Annual concierge pressure testing included.',
    specifications: {
      'Escapement': '60-Second Co-Axial Flying Tourbillon (28,800 vph)',
      'Power Reserve': '72 Hours Twin-Barrel Power Reserve',
      'Glass': 'Double Domed Sapphire with 5x Anti-Reflective Coating',
      'Water Resistance': '5 ATM / 50M'
    },
    createdAt: '2026-02-15T16:00:00Z'
  },

  // 9. External Cinematic Watch: Sub-Mariner 300M Diver Ceramic Bezel
  {
    id: 'prod-w9',
    name: 'Velmira Deep Diver 300M Ceramic Monobloc',
    brand: 'VELMIRA ATELIER',
    category: 'Sports Watches',
    subcategory: 'Professional Diver',
    originalPrice: 36000,
    discountedPrice: 19500,
    originalPriceAED: 1580,
    priceAED: 850,
    discountPercentage: 46,
    rating: 4.9,
    ratingCount: 1530,
    reviewCount: 380,
    images: [
      '/watches/seiko-collection-vault.jpg',
      '/watches/hublot-chrono-lounge.jpg',
      '/watches/emerald-purple-automatic.jpg'
    ],
    sizes: ['41mm Case'],
    colors: [
      { name: 'Ceramic Onyx Black & Steel', hex: '#111111' },
      { name: 'Abyssal Blue Sunburst', hex: '#1B2A4A' }
    ],
    stock: 9,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    isTopDeal: true,
    description: 'Built to withstand oceanic depths. Features a unidirectional 120-click scratchproof ceramic bezel, helium escape valve, luminescent Chromalight indices, and glide-lock diver extension clasp.',
    watchType: 'Automatic Professional Diver',
    dialColor: 'Onyx Black High-Gloss with Maxi Lume Markers',
    strapMaterial: 'Solid 316L Stainless Steel Oyster Bracelet',
    caseMaterial: 'Surgical Grade 316L Stainless Steel Monobloc',
    availability: 'In Stock (Ready to Ship)',
    fabric: 'Surgical Steel, High-Tech Zirconia Ceramic, Sapphire Crystal',
    fit: '41mm Diameter • 12.8mm Submersible Depth Profile',
    pattern: 'Maxi Dial Luminescent Dots and Bars',
    occasion: 'Scuba Expeditions, Regattas & Everyday Luxury',
    care: 'Rinse with fresh water after ocean diving. 30 ATM rated.',
    specifications: {
      'Water Resistance': '30 ATM / 300 Meters / 1000 Feet',
      'Bezel': 'Unidirectional 120-Click Zirconia Ceramic Insert',
      'Valve': 'Automatic Helium Escape Valve',
      'Movement': 'Calibre V-3135 Automatic (28,800 vph, 48h Reserve)',
      'Clasp': 'Oysterlock Safety with Glidelock Extension'
    },
    createdAt: '2026-02-16T10:00:00Z'
  },

  // 10. External Cinematic Watch: Bauhaus Ultra-Thin Minimalist Dress Watch
  {
    id: 'prod-w10',
    name: 'Velmira Bauhaus Ultra-Thin Monochrome 38mm',
    brand: 'VELMIRA ATELIER',
    category: 'Minimal Watches',
    subcategory: 'Bauhaus Modernism',
    originalPrice: 22000,
    discountedPrice: 11999,
    originalPriceAED: 960,
    priceAED: 520,
    discountPercentage: 45,
    rating: 4.8,
    ratingCount: 940,
    reviewCount: 210,
    images: [
      '/watches/cartier-boutique-display.jpg',
      '/watches/vintage-silver-digital.jpg',
      '/watches/hublot-chrono-lounge.jpg'
    ],
    sizes: ['38mm Ultra-Thin'],
    colors: [
      { name: 'Brushed Silver & Slate Grey', hex: '#E2E8F0' },
      { name: 'Minimal Obsidian Noir', hex: '#0F172A' }
    ],
    stock: 12,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    isTopDeal: true,
    description: 'Pure form following function. A 6.8mm wafer-thin profile featuring tempered blued needle hands, pristine white galvanic dial, sub-seconds register at 6 o’clock, and supple Horween cordovan leather strap.',
    watchType: 'Ultra-Slim Mechanical Dress',
    dialColor: 'Pristine Galvanic White with Minimalist Markers',
    strapMaterial: 'Genuine Shell Cordovan Leather (Black / Grey)',
    caseMaterial: 'Polished 316L Surgical Stainless Steel',
    availability: 'In Stock (Immediate Dispatch)',
    fabric: 'Surgical Steel, Anti-Reflective Sapphire, Horween Leather',
    fit: '38mm Diameter • 6.8mm Ultra-Thin',
    pattern: 'Typographic Bauhaus Grid with Sub-Seconds Dial',
    occasion: 'Architectural Studios, Art Exhibitions & Minimalist Wardrobes',
    care: 'Splash resistant 3 ATM. Wipe clean with microfiber.',
    specifications: {
      'Movement': 'Ultra-Thin Calibre V-7001 Hand-Wound (21,600 vph)',
      'Profile': '6.8mm Thickness (Fits seamlessly beneath dress shirts)',
      'Glass': 'Domed Sapphire Crystal with Dual-Side AR Coating',
      'Power Reserve': '42 Hours'
    },
    createdAt: '2026-02-18T11:00:00Z'
  },

  // 11. External Cinematic Watch: Women's Diamond Bezel Mother-of-Pearl Elegance
  {
    id: 'prod-w11',
    name: 'Velmira Reine Diamond Bezel & Mother-of-Pearl 32mm',
    brand: 'VELMIRA ATELIER',
    category: "Women's Watches",
    subcategory: 'Diamond Complication',
    originalPrice: 38000,
    discountedPrice: 19999,
    originalPriceAED: 1650,
    priceAED: 870,
    discountPercentage: 47,
    rating: 5.0,
    ratingCount: 1380,
    reviewCount: 340,
    images: [
      '/watches/tissot-silver-chronograph.jpg',
      '/watches/cartier-boutique-display.jpg',
      '/watches/vintage-silver-digital.jpg'
    ],
    sizes: ['32mm Petite'],
    colors: [
      { name: 'Mother of Pearl & Diamond Silver', hex: '#F0F8FF' },
      { name: 'Rose Gold & Diamond Pavé', hex: '#B76E79' }
    ],
    stock: 6,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isTopDeal: false,
    description: 'Iridescent natural Tahitian mother-of-pearl dial framed by 48 micro-set pavé crystals. Features a cabochon sapphire crown, polished stainless steel jubilee bracelet, and Swiss quartz precision.',
    watchType: 'Diamond Haute Horlogerie',
    dialColor: 'Natural Tahitian Mother-of-Pearl with Diamond Indices',
    strapMaterial: '316L Jubilee Steel Bracelet with Hidden Butterfly Clasp',
    caseMaterial: 'High-Polish Surgical Grade 316L Stainless Steel',
    availability: 'In Stock (Only 6 Pieces Available)',
    fabric: 'Surgical Steel, Natural Mother-of-Pearl, Lab-Grown Diamonds, Sapphire',
    fit: '32mm Case Diameter • 8.5mm Slim Profile',
    pattern: 'Sunray Mother-of-Pearl with Pavé Gemstone Bezel',
    occasion: 'Weddings, VIP Galas, Anniversaries & Royal Celebrations',
    care: '5 ATM Water Resistant. Complimentary gift box and polishing cloth.',
    specifications: {
      'Gemstones': '48 Brilliant-Cut Pavé Crystals on Bezel',
      'Dial': 'Natural Sustainable Mother-of-Pearl (No two identical)',
      'Movement': 'Swiss Ronda Gold-Plated Precision Quartz Calibre',
      'Glass': 'Scratchproof Flat Sapphire Crystal',
      'Crown': 'Set with Blue Synthetic Cabochon'
    },
    createdAt: '2026-02-19T13:00:00Z'
  },

  // 12. External Cinematic Watch: Classic Moonphase Automatic Calendar
  {
    id: 'prod-w12',
    name: 'Velmira Astronomical Moonphase Calendar 40mm',
    brand: 'VELMIRA ATELIER',
    category: 'Classic Watches',
    subcategory: 'Astronomical Complications',
    originalPrice: 42000,
    discountedPrice: 22500,
    originalPriceAED: 1840,
    priceAED: 980,
    discountPercentage: 46,
    rating: 4.9,
    ratingCount: 890,
    reviewCount: 225,
    images: [
      '/watches/horology-atelier-vintage.jpg',
      '/watches/tissot-silver-chronograph.jpg',
      '/watches/emerald-purple-automatic.jpg'
    ],
    sizes: ['40mm'],
    colors: [
      { name: 'Midnight Blue Guilloché & Gold Moon', hex: '#1B2A4A' },
      { name: 'Silver Clous de Paris & Blue Moon', hex: '#CBD5E1' }
    ],
    stock: 5,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    isTopDeal: true,
    description: 'Tracks the 29.5-day lunar cycle with astronomical precision. Features a golden moon revolving against a starry midnight sky aperture at 6 o’clock, day and month windows, date indicator hand, and fluted lugs.',
    watchType: 'Automatic Moonphase Calendar',
    dialColor: 'Midnight Blue with Clous de Paris Guilloché',
    strapMaterial: 'Hand-Finished Midnight Blue Alligator Leather',
    caseMaterial: 'Polished 316L Surgical Stainless Steel',
    availability: 'In Stock (Atelier Insured Shipment)',
    fabric: 'Surgical 316L Steel, Sapphire Exhibition Back, Premium Leather',
    fit: '40mm Case Diameter • 11.2mm Thickness',
    pattern: 'Starry Sky Moonphase Aperture with Clous de Paris Engraving',
    occasion: 'Astronomy Connoisseurs, Milestone Anniversaries & Formal Occasions',
    care: 'Use included quick-adjust stylus to set moonphase and calendar.',
    specifications: {
      'Movement': 'Automatic Calibre V-9100 Moonphase Complication (28,800 vph)',
      'Lunar Aperture': 'Accurate to One Day in 122 Years',
      'Glass': 'Anti-Reflective Sapphire Crystal Front & Exhibition Caseback',
      'Water Resistance': '5 ATM / 50M'
    },
    createdAt: '2026-02-20T17:00:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'VELMIRA10',
    discountType: 'percentage',
    value: 10,
    valueAED: 10,
    minOrderValue: 5000,
    minOrderValueAED: 220,
    maxDiscount: 2500,
    description: '10% off on your timepiece curation',
    expiryDate: '2027-12-31'
  },
  {
    code: 'HOROLOGYVIP',
    discountType: 'flat',
    value: 2000,
    valueAED: 90,
    minOrderValue: 15000,
    minOrderValueAED: 650,
    description: 'Flat ₹2,000 / AED 90 VIP atelier discount',
    expiryDate: '2027-12-31'
  },
  {
    code: 'DUBAIPRIVE',
    discountType: 'percentage',
    value: 15,
    valueAED: 15,
    minOrderValue: 20000,
    minOrderValueAED: 880,
    maxDiscount: 5000,
    description: '15% off GCC and UAE private appointments',
    expiryDate: '2027-12-31'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-w1',
    userName: 'Karan Mehra',
    userLocation: 'Mumbai, India',
    rating: 5,
    title: 'Exquisite Sunburst Finish & Flawless Accuracy',
    comment: 'The teal cyan dial under natural sunlight is breathtaking. Case finishing matches luxury Swiss calibres at triple the price.',
    verifiedPurchase: true,
    helpfulCount: 42,
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-w2',
    userName: 'Rashid Al Maktoum',
    userLocation: 'Dubai, UAE',
    rating: 5,
    title: 'Emerald Dial Depth is Unmatched',
    comment: 'Received via insured courier in Dubai within 24 hours. The mahogany presentation and weight on the wrist are stellar.',
    verifiedPurchase: true,
    helpfulCount: 38,
    createdAt: '2026-02-12T09:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-w3',
    userName: 'Siddharth Roy',
    userLocation: 'Bangalore, India',
    rating: 5,
    title: 'Pure Geometric Elegance',
    comment: 'The Santos boutique silhouette and cabochon crown are pristine. Looks striking with both formal eveningwear and suits.',
    verifiedPurchase: true,
    helpfulCount: 29,
    createdAt: '2026-02-15T18:40:00Z'
  }
];
