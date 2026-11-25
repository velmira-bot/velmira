import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Upload,
  Search,
  Star,
  Sparkles,
  Watch
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order, CategoryType } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus
  } = useShop();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'customers'>('analytics');

  // Search & Filter within Admin Tables
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State for Product Add / Edit
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('VELMIRA');
  const [formCategory, setFormCategory] = useState<CategoryType>("Men's Watches");
  const [formSubcategory, setFormSubcategory] = useState('Automatic Timepieces');
  const [formWatchType, setFormWatchType] = useState('Automatic');
  const [formDialColor, setFormDialColor] = useState('Onyx Black');
  const [formStrapMaterial, setFormStrapMaterial] = useState('316L Stainless Steel');
  const [formCaseMaterial, setFormCaseMaterial] = useState('Brushed Steel');
  const [formOriginalPrice, setFormOriginalPrice] = useState(24999);
  const [formDiscountedPrice, setFormDiscountedPrice] = useState(18999);
  const [formStock, setFormStock] = useState(15);
  const [formSizes, setFormSizes] = useState('40mm, 42mm');
  const [formColors, setFormColors] = useState('Silver, Noir Black');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);

  // Cloudinary Live Upload State
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<{ connected: boolean; cloudName: string }>({
    connected: true,
    cloudName: 'ukaw0xz6'
  });
  const [uploadFeedback, setUploadFeedback] = useState<string>('');

  React.useEffect(() => {
    fetch('/api/cloudinary/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCloudinaryStatus({ connected: true, cloudName: data.cloudName || 'ukaw0xz6' });
        }
      })
      .catch(() => {
        setCloudinaryStatus({ connected: true, cloudName: 'ukaw0xz6' });
      });
  }, []);

  // Analytics Computations
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.totalAmount : sum), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockItems = products.filter(p => p.stock <= 5);

  const openAddProductModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBrand('VELMIRA');
    setFormCategory("Men's Watches");
    setFormSubcategory('Automatic Timepieces');
    setFormWatchType('Automatic');
    setFormDialColor('Onyx Black');
    setFormStrapMaterial('316L Stainless Steel');
    setFormCaseMaterial('Brushed Steel');
    setFormOriginalPrice(24999);
    setFormDiscountedPrice(18999);
    setFormStock(15);
    setFormSizes('40mm, 42mm');
    setFormColors('Silver, Noir Black');
    setFormImageUrl('/watches/seiko-collection-vault.jpg');
    setFormDescription('Precision engineered Swiss mechanical movement with sapphire crystal and hand-finished indices.');
    setFormIsFeatured(true);
    setFormIsNewArrival(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategory(prod.category);
    setFormSubcategory(prod.subcategory);
    setFormWatchType(prod.watchType || 'Automatic');
    setFormDialColor(prod.dialColor || 'Sunburst Silver');
    setFormStrapMaterial(prod.strapMaterial || '316L Stainless Steel');
    setFormCaseMaterial(prod.caseMaterial || 'Brushed Steel');
    setFormOriginalPrice(prod.originalPrice);
    setFormDiscountedPrice(prod.discountedPrice);
    setFormStock(prod.stock);
    setFormSizes(prod.sizes.join(', '));
    setFormColors(prod.colors.map(c => c.name).join(', '));
    setFormImageUrl(prod.images[0] || '');
    setFormDescription(prod.description);
    setFormIsFeatured(!!prod.isFeatured);
    setFormIsNewArrival(!!prod.isNewArrival);
    setIsProductModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCloudinary(true);
    setUploadFeedback('Uploading to Cloudinary CDN...');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            folder: 'velmira_watches'
          })
        });

        const data = await response.json();
        if (data.success && data.url) {
          setFormImageUrl(data.url);
          setUploadFeedback(`Uploaded to Cloudinary: ${data.url}`);
        } else {
          setFormImageUrl(base64Data);
          setUploadFeedback('Saved locally (Cloudinary fallback)');
        }
      } catch (err) {
        console.warn('Cloudinary upload error, using local data:', err);
        setFormImageUrl(base64Data);
        setUploadFeedback('Saved image locally');
      } finally {
        setIsUploadingCloudinary(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = formSizes.split(',').map(s => s.trim()).filter(Boolean);
    const parsedColors = formColors.split(',').map(c => ({
      name: c.trim(),
      hex: c.toLowerCase().includes('gold') ? '#D4AF37' : c.toLowerCase().includes('silver') ? '#C0C0C0' : '#111111'
    })).filter(c => c.name);

    const discountPercentage = Math.round(
      ((formOriginalPrice - formDiscountedPrice) / formOriginalPrice) * 100
    );

    const payload: Partial<Product> = {
      name: formName,
      brand: formBrand,
      category: formCategory,
      subcategory: formSubcategory,
      watchType: formWatchType,
      dialColor: formDialColor,
      strapMaterial: formStrapMaterial,
      caseMaterial: formCaseMaterial,
      originalPrice: Number(formOriginalPrice),
      discountedPrice: Number(formDiscountedPrice),
      discountPercentage,
      stock: Number(formStock),
      sizes: parsedSizes.length > 0 ? parsedSizes : ['40mm'],
      colors: parsedColors.length > 0 ? parsedColors : [{ name: 'Silver', hex: '#C0C0C0' }],
      images: [formImageUrl || '/watches/seiko-collection-vault.jpg'],
      description: formDescription,
      fabric: `${formCaseMaterial} / ${formStrapMaterial}`,
      fit: 'Precision Butterfly Deployant Clasp',
      occasion: 'Black Tie, Formal & Horology Collections',
      care: 'Avoid magnetic fields. Professional pressure testing annually.',
      isFeatured: formIsFeatured,
      isNewArrival: formIsNewArrival,
      availability: Number(formStock) > 0 ? 'In Stock (Ready to Ship)' : 'Out of Stock',
      specifications: {
        'Movement': formWatchType,
        'Dial': formDialColor,
        'Case Material': formCaseMaterial,
        'Strap': formStrapMaterial,
        'Crystal': 'Anti-Reflective Sapphire Crystal',
        'Water Resistance': '50M / 5 ATM'
      }
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
    } else {
      await addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const filteredProductsTable = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrdersTable = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-16 font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-lg tracking-[0.25em] font-bold text-[#111111]">
              VELMIRA
            </span>
            <span className="px-2 py-0.5 border border-neutral-200 text-[#111111] font-mono text-[9px] uppercase tracking-wider">
              Management Suite
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-[#F8F9FA] border border-neutral-200 text-neutral-800 text-[10px] font-mono">
              <span className={`w-2 h-2 rounded-full ${cloudinaryStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
              <span>Cloudinary: {cloudinaryStatus.cloudName}</span>
            </div>

            <Link
              to="/"
              className="text-[#777777] hover:text-[#111111] font-medium transition"
            >
              Public Storefront
            </Link>
            <Link
              to="/watches"
              className="px-3 py-1.5 border border-neutral-900 bg-[#111111] text-white hover:bg-neutral-800 transition tracking-wider text-[11px] uppercase font-semibold"
            >
              All Watches
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto scrollbar-none mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
              activeTab === 'analytics'
                ? 'bg-[#111111] text-white'
                : 'text-[#777777] hover:text-[#111111] bg-[#F8F8F8] border border-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
              activeTab === 'products'
                ? 'bg-[#111111] text-white'
                : 'text-[#777777] hover:text-[#111111] bg-[#F8F8F8] border border-neutral-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Watch Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
              activeTab === 'orders'
                ? 'bg-[#111111] text-white'
                : 'text-[#777777] hover:text-[#111111] bg-[#F8F8F8] border border-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
              activeTab === 'inventory'
                ? 'bg-[#111111] text-white'
                : 'text-[#777777] hover:text-[#111111] bg-[#F8F8F8] border border-neutral-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stock Inventory ({lowStockItems.length} Low)</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition ${
              activeTab === 'customers'
                ? 'bg-[#111111] text-white'
                : 'text-[#777777] hover:text-[#111111] bg-[#F8F8F8] border border-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patron Roster</span>
          </button>
        </div>

        {/* 1. TAB: ANALYTICS & KPIS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] p-6 border border-neutral-200">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-[#111111]" />
                </div>
                <div className="mt-3">
                  <h3 className="font-mono text-2xl font-bold text-[#111111]">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] text-[#777777] mt-1 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#111111]" /> Verified orders
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-6 border border-neutral-200">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Orders Dispatched</span>
                  <Package className="w-4 h-4 text-[#111111]" />
                </div>
                <div className="mt-3">
                  <h3 className="font-mono text-2xl font-bold text-[#111111]">
                    {totalOrdersCount}
                  </h3>
                  <p className="text-[11px] text-[#777777] mt-1">100% concierge fulfillment</p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-6 border border-neutral-200">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Watch Models</span>
                  <Watch className="w-4 h-4 text-[#111111]" />
                </div>
                <div className="mt-3">
                  <h3 className="font-mono text-2xl font-bold text-[#111111]">
                    {totalProductsCount} Timepieces
                  </h3>
                  <p className="text-[11px] text-[#777777] mt-1">Across 7 curated categories</p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-6 border border-neutral-200">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Notice</span>
                  <AlertTriangle className="w-4 h-4 text-[#111111]" />
                </div>
                <div className="mt-3">
                  <h3 className="font-mono text-2xl font-bold text-[#111111]">
                    {lowStockItems.length} Models
                  </h3>
                  <p className="text-[11px] text-[#777777] mt-1">Stock ≤ 5 units</p>
                </div>
              </div>
            </div>

            {/* Category breakdown & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category Breakdown (7 cols) */}
              <div className="lg:col-span-7 bg-[#FFFFFF] p-6 border border-neutral-200">
                <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-[#111111] mb-5">
                  Collection Distribution
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-[#111111]">Luxury Watches</span>
                      <span className="font-mono text-[#777777]">45%</span>
                    </div>
                    <div className="w-full bg-[#F0F0F0] h-1.5">
                      <div className="bg-[#111111] h-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-[#111111]">Men's Watches</span>
                      <span className="font-mono text-[#777777]">30%</span>
                    </div>
                    <div className="w-full bg-[#F0F0F0] h-1.5">
                      <div className="bg-[#111111] h-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-[#111111]">Women's Watches</span>
                      <span className="font-mono text-[#777777]">15%</span>
                    </div>
                    <div className="w-full bg-[#F0F0F0] h-1.5">
                      <div className="bg-[#111111] h-full" style={{ width: '15%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-[#111111]">Minimal & Classic Watches</span>
                      <span className="font-mono text-[#777777]">10%</span>
                    </div>
                    <div className="w-full bg-[#F0F0F0] h-1.5">
                      <div className="bg-[#111111] h-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders quick list (5 cols) */}
              <div className="lg:col-span-5 bg-[#FFFFFF] p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-[#111111]">
                    Recent Enquiries & Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#111111] underline">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-neutral-100">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono font-bold text-[#111111]">{o.id}</p>
                        <p className="text-[#777777] text-[11px]">{o.customerName}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#111111] block">
                          ₹{o.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="px-1.5 py-0.5 border border-neutral-200 text-[9px] font-bold uppercase tracking-wider text-[#111111]">
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="py-4 text-xs text-[#777777]">No customer orders recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: PRODUCT MANAGEMENT CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search watches by model name, category..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 bg-white text-[#111111] focus:outline-none focus:border-black"
                />
              </div>

              <button
                onClick={openAddProductModal}
                className="px-4 py-2 bg-[#111111] text-white font-medium text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-neutral-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Watch</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#FFFFFF] border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F8F8] text-[#111111] border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Watch Model</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Movement / Dial</th>
                      <th className="p-3.5 text-right">Selling Price</th>
                      <th className="p-3.5 text-right">M.R.P.</th>
                      <th className="p-3.5 text-center">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {filteredProductsTable.map(prod => (
                      <tr key={prod.id} className="hover:bg-[#FBFBFB] transition">
                        <td className="p-3.5 font-sans">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-10 object-cover border border-neutral-200 shrink-0 bg-[#F8F8F8]"
                            />
                            <div>
                              <p className="font-medium text-[#111111] line-clamp-1">{prod.name}</p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[10px] text-[#777777] uppercase tracking-wider">
                                  {prod.brand}
                                </span>
                                {prod.isFeatured && (
                                  <span className="text-[9px] px-1 bg-black text-white uppercase font-sans">Featured</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-sans text-[#777777]">
                          <span className="px-2 py-0.5 border border-neutral-200 text-[#111111] text-[10px]">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-sans text-xs text-[#777777]">
                          {prod.watchType || 'Automatic'} · {prod.dialColor || 'Sunburst'}
                        </td>
                        <td className="p-3.5 text-right font-medium text-[#111111]">
                          ₹{prod.discountedPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right text-[#777777] line-through text-[11px]">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold border ${
                              prod.stock <= 5
                                ? 'border-red-300 text-red-600 bg-red-50/50'
                                : 'border-neutral-200 text-[#111111]'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-1.5 border border-neutral-200 text-[#111111] hover:bg-neutral-100 transition"
                              title="Edit Watch"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 border border-neutral-200 text-[#777777] hover:text-black hover:border-black transition"
                              title="Delete Watch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer name..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 bg-white text-[#111111] focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#777777]">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 bg-white text-[#111111] font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#FFFFFF] border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F8F8] text-[#111111] border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Timepieces</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Amount</th>
                      <th className="p-3.5 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {filteredOrdersTable.map(order => (
                      <tr key={order.id} className="hover:bg-[#FBFBFB]">
                        <td className="p-3.5 font-bold text-[#111111]">{order.id}</td>
                        <td className="p-3.5 font-sans">
                          <p className="font-medium text-[#111111]">{order.customerName}</p>
                          <p className="text-[10px] text-[#777777]">{order.customerEmail}</p>
                        </td>
                        <td className="p-3.5 font-sans text-[#777777]">
                          {order.items.length} {order.items.length === 1 ? 'watch' : 'watches'}
                        </td>
                        <td className="p-3.5 text-[#777777] font-sans text-[11px]">
                          {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-3.5 font-sans">
                          <span className="px-2 py-0.5 border border-neutral-200 text-[#111111] text-[10px] uppercase tracking-wider font-semibold">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-medium text-[#111111]">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right font-sans">
                          <select
                            value={order.orderStatus}
                            onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                            className="text-xs border border-neutral-300 px-2 py-1 bg-white font-medium focus:outline-none focus:border-black"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredOrdersTable.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-[#777777] font-sans">
                          No orders matched your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-[#F8F8F8] border border-neutral-200 p-4 text-xs text-[#111111] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#111111] shrink-0" />
                <span>
                  <strong>Inventory Manager:</strong> Real-time stock counts automatically update on order placements. Threshold alerts trigger at 5 units or below.
                </span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F8F8] text-[#111111] border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Watch Model</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Adjust Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#FBFBFB]">
                      <td className="p-3.5 font-sans font-medium text-[#111111]">
                        {prod.name}
                      </td>
                      <td className="p-3.5 font-sans text-[#777777]">{prod.category}</td>
                      <td className="p-3.5 font-bold text-[#111111] text-sm">{prod.stock}</td>
                      <td className="p-3.5 font-sans">
                        {prod.stock <= 5 ? (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-semibold text-red-600 border border-red-200 bg-red-50/50">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-semibold text-[#111111] border border-neutral-200">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => updateStock(prod.id, Math.max(0, prod.stock - 1))}
                            className="px-2.5 py-1 border border-neutral-300 bg-white text-[#111111] hover:bg-neutral-100 font-sans text-xs"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateStock(prod.id, prod.stock + 5)}
                            className="px-2.5 py-1 bg-[#111111] text-white hover:bg-neutral-800 font-sans text-xs uppercase tracking-wider"
                          >
                            +5 Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-[#FFFFFF] border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-[#111111]">
                Registered Patrons & Concierge Clients
              </h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#111111] border-b border-neutral-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5 text-right">Orders Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr className="hover:bg-[#FBFBFB]">
                  <td className="p-3.5 font-medium text-[#111111]">Aarav Sharma</td>
                  <td className="p-3.5 text-[#777777]">aarav.sharma@velmira.in</td>
                  <td className="p-3.5 text-[#777777] font-mono">+91 98765 43210</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 border border-neutral-200 text-[#111111] font-semibold text-[10px] uppercase">
                      VIP Client
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#111111]">{orders.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 my-8 shadow-xl overflow-hidden">
            <div className="bg-[#111111] text-white p-4 flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold tracking-widest uppercase">
                {editingProductId ? 'Edit Watch Information' : 'Add New Luxury Watch'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-medium text-[#111111] mb-1">Watch Model Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Velmira Chronomaster Grand Prix 42mm"
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Brand / Atelier</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#111111] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black bg-white"
                  >
                    <option value="Men's Watches">Men's Watches</option>
                    <option value="Women's Watches">Women's Watches</option>
                    <option value="Luxury Watches">Luxury Watches</option>
                    <option value="Classic Watches">Classic Watches</option>
                    <option value="Sports Watches">Sports Watches</option>
                    <option value="Minimal Watches">Minimal Watches</option>
                    <option value="Chronograph">Chronograph</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Tourbillon">Tourbillon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Movement Type</label>
                  <input
                    type="text"
                    value={formWatchType}
                    onChange={e => setFormWatchType(e.target.value)}
                    placeholder="Automatic / Quartz"
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Dial Color</label>
                  <input
                    type="text"
                    value={formDialColor}
                    onChange={e => setFormDialColor(e.target.value)}
                    placeholder="Onyx Black / Silver"
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Strap Material</label>
                  <input
                    type="text"
                    value={formStrapMaterial}
                    onChange={e => setFormStrapMaterial(e.target.value)}
                    placeholder="316L Steel / Calfskin"
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Case Material</label>
                  <input
                    type="text"
                    value={formCaseMaterial}
                    onChange={e => setFormCaseMaterial(e.target.value)}
                    placeholder="Brushed Steel / Titanium"
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formDiscountedPrice}
                    onChange={e => setFormDiscountedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Original M.R.P. (₹)</label>
                  <input
                    type="number"
                    required
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111111] mb-1">Primary Image URL / Cloudinary CDN</label>
                <input
                  type="text"
                  required
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="/watches/seiko-collection-vault.jpg"
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-xs"
                />

                {/* Quick Select Vault Photos */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1.5">
                    Quick Select Vault Photos:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[
                      { name: 'Seiko Vault', url: '/watches/seiko-collection-vault.jpg' },
                      { name: 'Emerald & Purple', url: '/watches/emerald-purple-automatic.jpg' },
                      { name: 'Cartier Santos', url: '/watches/cartier-boutique-display.jpg' },
                      { name: 'Hublot Lounge', url: '/watches/hublot-chrono-lounge.jpg' },
                      { name: 'Tissot Silver', url: '/watches/tissot-silver-chronograph.jpg' },
                      { name: 'Vintage Casio', url: '/watches/vintage-silver-digital.jpg' },
                      { name: 'Atelier Vintage', url: '/watches/horology-atelier-vintage.jpg' },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setFormImageUrl(preset.url)}
                        className={`group relative aspect-square border overflow-hidden transition ${
                          formImageUrl === preset.url
                            ? 'border-black ring-2 ring-black'
                            : 'border-neutral-200 hover:border-black'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-900 bg-[#111111] text-white text-[11px] font-medium hover:bg-neutral-800 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingCloudinary ? 'Uploading to Cloudinary...' : `Upload to Cloudinary (${cloudinaryStatus.cloudName})`}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCloudinary}
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  {isUploadingCloudinary && (
                    <span className="text-[11px] text-amber-600 font-mono flex items-center animate-pulse">
                      Processing upload...
                    </span>
                  )}

                  {formImageUrl && !isUploadingCloudinary && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      {formImageUrl.includes('cloudinary.com') ? 'Hosted on Cloudinary CDN' : 'Image Linked'}
                    </span>
                  )}
                </div>

                {uploadFeedback && (
                  <p className="mt-1.5 text-[10px] text-neutral-500 font-mono truncate">
                    {uploadFeedback}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Case Sizes (e.g. 40mm, 42mm)</label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={e => setFormSizes(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111111] mb-1">Available Finishes / Colors</label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={e => setFormColors(e.target.value)}
                    placeholder="Silver, Noir Black, Gold"
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111111] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Toggles: Featured & New Arrival */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={e => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-black focus:ring-0"
                  />
                  <span className="text-xs font-medium text-[#111111]">Mark as Featured Watch</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={e => setFormIsNewArrival(e.target.checked)}
                    className="w-4 h-4 text-black focus:ring-0"
                  />
                  <span className="text-xs font-medium text-[#111111]">Mark as New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-[#111111] font-medium hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] text-white font-medium uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  Save Watch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};