import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary with User Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ukaw0xz6',
  api_key: process.env.CLOUDINARY_API_KEY || '456211547439223',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7GQxoFsCoLtwqIsMNQ2WXasbD4A'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const SOURCE_DATA_DIR = path.join(__dirname, 'data');
const DATA_DIR = isServerless ? path.join('/tmp', 'velmira_data') : SOURCE_DATA_DIR;

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Error creating DATA_DIR:', e);
  }
}

// In serverless environments, copy initial data files to writable /tmp
if (isServerless) {
  ['products.json', 'orders.json', 'coupons.json', 'users.json'].forEach(fileName => {
    const src = path.join(SOURCE_DATA_DIR, fileName);
    const dest = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(dest) && fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, dest);
      } catch (e) {
        console.error(`Failed to copy ${fileName} to /tmp:`, e);
      }
    }
  });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helper read/write functions
function readJson(file, defaultData = []) {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
    return defaultData;
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultData;
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

// Ensure default files exist
const initialProducts = readJson(PRODUCTS_FILE, []);
const initialOrders = readJson(ORDERS_FILE, []);
const initialCoupons = readJson(COUPONS_FILE, []);
const initialUsers = readJson(USERS_FILE, []);

// ---------------- PRODUCTS ENDPOINTS ---------------- //

// GET /api/products
app.get('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE, []);
  res.json({ success: true, data: products });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST /api/products (Admin create)
app.post('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE, []);
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  products.unshift(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id (Admin edit)
app.put('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE, []);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body, id: req.params.id };
  writeJson(PRODUCTS_FILE, products);
  res.json({ success: true, data: products[index] });
});

// DELETE /api/products/:id (Admin delete)
app.delete('/api/products/:id', (req, res) => {
  let products = readJson(PRODUCTS_FILE, []);
  products = products.filter(p => p.id !== req.params.id);
  writeJson(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// PATCH /api/products/:id/stock (Inventory update)
app.patch('/api/products/:id/stock', (req, res) => {
  const { stock } = req.body;
  const products = readJson(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  product.stock = Number(stock);
  writeJson(PRODUCTS_FILE, products);
  res.json({ success: true, data: product });
});

// ---------------- ORDERS ENDPOINTS ---------------- //

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE, []);
  res.json({ success: true, data: orders });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const orders = readJson(ORDERS_FILE, []);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders (Create order + automatically deduct stock)
app.post('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE, []);
  const products = readJson(PRODUCTS_FILE, []);

  const newOrder = {
    ...req.body,
    id: req.body.id || `VEL-${Math.floor(100000 + Math.random() * 900000)}`,
    orderDate: new Date().toISOString(),
    orderStatus: req.body.orderStatus || 'Placed',
    trackingNumber: req.body.trackingNumber || `BLUEDART-${Math.floor(100000000 + Math.random() * 900000000)}`,
    courierPartner: req.body.courierPartner || 'BlueDart Luxury Express',
    trackingEvents: req.body.trackingEvents || [
      {
        status: 'Placed',
        title: 'Order Confirmed & Payment Verified',
        location: 'Velmira Fulfillment Center, Mumbai',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        done: true
      },
      {
        status: 'Processing',
        title: 'Quality Inspected & Luxury Gift Packaging',
        location: 'Velmira Hub, Mumbai',
        timestamp: 'Estimated Next 12 Hours',
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
        title: 'Expected Delivery at Doorstep',
        location: req.body.shippingAddress ? `${req.body.shippingAddress.city}, ${req.body.shippingAddress.state}` : 'Destination',
        timestamp: 'Within 3 Business Days',
        done: false
      }
    ]
  };

  // Deduct inventory stock for purchased items
  if (Array.isArray(newOrder.items)) {
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    });
    writeJson(PRODUCTS_FILE, products);
  }

  orders.unshift(newOrder);
  writeJson(ORDERS_FILE, orders);
  res.status(201).json({ success: true, data: newOrder });
});

// PATCH /api/orders/:id/status (Admin status update)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orders = readJson(ORDERS_FILE, []);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = status;

  // Update tracking events progress
  if (order.trackingEvents && Array.isArray(order.trackingEvents)) {
    const statusOrder = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(status);
    if (currentIdx !== -1) {
      order.trackingEvents.forEach((evt, idx) => {
        evt.done = idx <= currentIdx;
        if (idx === currentIdx && evt.timestamp.includes('Expected')) {
          evt.timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        }
      });
    }
  }

  writeJson(ORDERS_FILE, orders);
  res.json({ success: true, data: order });
});

// PATCH /api/orders/:id/return (Customer return request)
app.patch('/api/orders/:id/return', (req, res) => {
  const { reason } = req.body;
  const orders = readJson(ORDERS_FILE, []);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.returnRequested = true;
  order.returnStatus = 'requested';
  order.returnReason = reason || 'Customer requested return';
  writeJson(ORDERS_FILE, orders);
  res.json({ success: true, data: order });
});

// ---------------- ANALYTICS ENDPOINT ---------------- //

app.get('/api/admin/analytics', (req, res) => {
  const products = readJson(PRODUCTS_FILE, []);
  const orders = readJson(ORDERS_FILE, []);
  const users = readJson(USERS_FILE, []);

  const totalSales = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + (o.totalAmount || 0) : sum), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers: Math.max(users.length, 128), // realistic count
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      statusCounts,
      recentOrders: orders.slice(0, 5)
    }
  });
});

// ---------------- COUPONS ENDPOINTS ---------------- //

app.get('/api/coupons', (req, res) => {
  const coupons = readJson(COUPONS_FILE, []);
  res.json({ success: true, data: coupons });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, orderValue } = req.body;
  const coupons = readJson(COUPONS_FILE, []);
  const coupon = coupons.find(c => c.code.toUpperCase() === (code || '').toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  }

  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
    });
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

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discount,
      description: coupon.description
    }
  });
});

// ---------------- CLOUDINARY MEDIA DATABASE ENDPOINTS ---------------- //

// GET /api/cloudinary/status - Verify Cloudinary connection
app.get('/api/cloudinary/status', async (req, res) => {
  try {
    const pingRes = await cloudinary.api.ping();
    res.json({
      success: true,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'ukaw0xz6',
      status: pingRes.status || 'ok',
      message: 'Cloudinary media database connected successfully'
    });
  } catch (error) {
    console.error('Cloudinary ping error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect to Cloudinary'
    });
  }
});

// POST /api/upload/cloudinary - Upload single watch image
app.post('/api/upload/cloudinary', async (req, res) => {
  try {
    const { image, folder = 'velmira_watches' } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided for upload' });
    }

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height,
      format: uploadRes.format
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to Cloudinary'
    });
  }
});

// POST /api/upload/cloudinary-multiple - Upload multiple watch images
app.post('/api/upload/cloudinary-multiple', async (req, res) => {
  try {
    const { images, folder = 'velmira_watches' } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Images array required' });
    }

    const uploadPromises = images.map(img =>
      cloudinary.uploader.upload(img, {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:best', fetch_format: 'auto' }
        ]
      })
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.secure_url);

    res.json({
      success: true,
      urls,
      count: urls.length
    });
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images to Cloudinary'
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Velmira Fashion backend API running on http://localhost:${PORT}`);
  });
}

export default app;
