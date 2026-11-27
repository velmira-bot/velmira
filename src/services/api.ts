import { Product, Order, Coupon, User, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_REVIEWS } from '../data/initialProducts';

const API_BASE = '/api';

// Local storage keys for resilience & fallback
const LS_KEYS = {
  PRODUCTS: 'velmira_products_cache',
  ORDERS: 'velmira_orders_cache',
  COUPONS: 'velmira_coupons_cache',
  WISHLIST: 'velmira_wishlist_cache',
  CART: 'velmira_cart_cache',
  USER: 'velmira_user_cache',
  REVIEWS: 'velmira_reviews_cache',
};

// Helper: Local storage getter & setter
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

export const apiService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setLocal(LS_KEYS.PRODUCTS, json.data);
          return json.data;
        }
      }
    } catch {
      // Backend not reached or proxying, fallback to local storage
    }
    const local = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocal(LS_KEYS.PRODUCTS, local);
    return local;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 4.8,
      ratingCount: 1,
      reviewCount: 0,
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['Free Size'],
      colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Classic Gold', hex: '#D4AF37' }],
      images: product.images && product.images.length > 0 ? product.images : [
        '/watches/seiko-collection-vault.jpg'
      ],
      specifications: product.specifications || {},
    } as Product;

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    const current = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = [newProduct, ...current];
    setLocal(LS_KEYS.PRODUCTS, updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    const current = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      setLocal(LS_KEYS.PRODUCTS, current);
      return current[index];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    // 1. Always purge from local storage cache immediately
    try {
      let current = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      current = current.filter(p => p.id !== id);
      setLocal(LS_KEYS.PRODUCTS, current);
    } catch (e) {
      console.warn('Failed to update local products cache:', e);
    }

    // 2. Call backend DELETE endpoint
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Backend DELETE /api/products/:id failed, fallback to local storage:', err);
    }

    return true;
  },

  async updateProductStock(id: string, stock: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    const current = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = current.find(p => p.id === id);
    if (prod) {
      prod.stock = stock;
      setLocal(LS_KEYS.PRODUCTS, current);
      return true;
    }
    return false;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLocal(LS_KEYS.ORDERS, json.data);
          return json.data;
        }
      }
    } catch {
      // fallback
    }
    return getLocal<Order[]>(LS_KEYS.ORDERS, []);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const id = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `BLUEDART-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      courierPartner: 'BlueDart Luxury Express',
      orderDate: new Date().toISOString(),
      orderStatus: 'Placed',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      trackingEvents: [
        {
          status: 'Placed',
          title: 'Order Confirmed & Payment Verified',
          location: 'Velmira Fulfillment Center, Mumbai',
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          done: true
        },
        {
          status: 'Processing',
          title: 'Quality Inspected & Luxury Packaging',
          location: 'Velmira Hub, Mumbai',
          timestamp: 'Expected within 12 Hours',
          done: false
        },
        {
          status: 'Shipped',
          title: 'Dispatched with BlueDart Luxury Express',
          location: 'Transit Air Hub',
          timestamp: 'Expected within 24 Hours',
          done: false
        },
        {
          status: 'Delivered',
          title: 'Doorstep Handover',
          location: orderData.shippingAddress ? `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}` : 'Destination',
          timestamp: 'Expected within 3-4 Days',
          done: false
        }
      ]
    } as Order;

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    // Deduct stock in local cache
    const products = getLocal<Product[]>(LS_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    setLocal(LS_KEYS.PRODUCTS, products);

    const currentOrders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
    const updated = [newOrder, ...currentOrders];
    setLocal(LS_KEYS.ORDERS, updated);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['orderStatus']): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    const currentOrders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
    const order = currentOrders.find(o => o.id === id);
    if (order) {
      order.orderStatus = status;
      const statusOrder = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
      const currentIdx = statusOrder.indexOf(status);
      if (currentIdx !== -1 && order.trackingEvents) {
        order.trackingEvents.forEach((evt, idx) => {
          evt.done = idx <= currentIdx;
        });
      }
      setLocal(LS_KEYS.ORDERS, currentOrders);
      return order;
    }
    throw new Error('Order not found');
  },

  async requestReturn(id: string, reason: string): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    const currentOrders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
    const order = currentOrders.find(o => o.id === id);
    if (order) {
      order.returnRequested = true;
      order.returnStatus = 'requested';
      order.returnReason = reason;
      setLocal(LS_KEYS.ORDERS, currentOrders);
      return order;
    }
    throw new Error('Order not found');
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch(`${API_BASE}/coupons`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return getLocal<Coupon[]>(LS_KEYS.COUPONS, INITIAL_COUPONS);
  },

  async validateCoupon(code: string, orderValue: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const coupons = await this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (orderValue < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Min order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'flat') {
      discount = coupon.value;
    } else {
      discount = Math.round((orderValue * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied! Saved ₹${discount.toLocaleString('en-IN')}`
    };
  },

  // REVIEWS
  async getReviews(productId?: string): Promise<Review[]> {
    const reviews = getLocal<Review[]>(LS_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return reviews;
  },

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    const reviews = getLocal<Review[]>(LS_KEYS.REVIEWS, INITIAL_REVIEWS);
    const updated = [newReview, ...reviews];
    setLocal(LS_KEYS.REVIEWS, updated);
    return newReview;
  }
};
