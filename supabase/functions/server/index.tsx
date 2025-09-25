// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
);

// Health check
app.get('/make-server-0b34730b/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User signup
app.post('/make-server-0b34730b/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log('User creation error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${authData.user.id}`, userProfile);

    return c.json({ success: true, user: userProfile });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get('/make-server-0b34730b/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid access token' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile) {
      // Fallback: create profile from auth data
      const profile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`user:${user.id}`, profile);
      return c.json(profile);
    }

    return c.json(userProfile);
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Admin signin
app.post('/make-server-0b34730b/admin-signin', async (c) => {
  try {
    const { employeeId } = await c.req.json();

    if (!employeeId) {
      return c.json({ error: 'Employee ID is required' }, 400);
    }

    // Check if admin exists in KV store
    let adminProfile = await kv.get(`admin:${employeeId}`);
    
    if (!adminProfile) {
      // Create demo admin if it doesn't exist
      if (employeeId === 'EMP001') {
        adminProfile = {
          id: employeeId,
          employeeId,
          name: 'Demo Admin',
          role: 'admin',
          department: 'Store Management',
          createdAt: new Date().toISOString(),
        };
        await kv.set(`admin:${employeeId}`, adminProfile);
      } else {
        return c.json({ error: 'Invalid employee ID' }, 401);
      }
    }

    return c.json({ success: true, user: adminProfile });
  } catch (error) {
    console.log('Admin signin error:', error);  
    return c.json({ error: 'Internal server error during admin signin' }, 500);
  }
});

// Initialize demo data
app.post('/make-server-0b34730b/init-demo-data', async (c) => {
  try {
    // Create demo admin if it doesn't exist
    const existingAdmin = await kv.get('admin:EMP001');
    if (!existingAdmin) {
      await kv.set('admin:EMP001', {
        id: 'EMP001',
        employeeId: 'EMP001',
        name: 'Demo Admin',
        role: 'admin',
        department: 'Store Management',
        permissions: ['inventory', 'users', 'reports'],
        createdAt: new Date().toISOString(),
      });
    }

    // Add some demo products
    const demoProducts = [
      {
        barcode: '123456789012',
        name: 'Organic Bananas',
        price: 2.99,
        category: 'Produce',
        inStock: true,
      },
      {
        barcode: '123456789013',
        name: 'Whole Milk',
        price: 4.49,
        category: 'Dairy',
        inStock: true,
      },
      {
        barcode: '123456789014',
        name: 'Sourdough Bread',
        price: 3.99,
        category: 'Bakery',
        inStock: true,
      },
    ];

    for (const product of demoProducts) {
      await kv.set(`product:${product.barcode}`, product);
    }

    return c.json({ success: true, message: 'Demo data initialized' });
  } catch (error) {
    console.log('Demo data initialization error:', error);
    return c.json({ error: 'Failed to initialize demo data' }, 500);  
  }
});

// Product lookup by barcode
app.get('/make-server-0b34730b/product/:barcode', async (c) => {
  try {
    const barcode = c.req.param('barcode');
    const product = await kv.get(`product:${barcode}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json(product);
  } catch (error) {
    console.log('Product lookup error:', error);
    return c.json({ error: 'Failed to lookup product' }, 500);
  }
});

// Admin: Add or update product
app.post('/make-server-0b34730b/admin/product', async (c) => {
  try {
    const product = await c.req.json();
    
    if (!product.barcode || !product.name || !product.price) {
      return c.json({ error: 'Barcode, name, and price are required' }, 400);
    }

    await kv.set(`product:${product.barcode}`, {
      ...product,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, product });
  } catch (error) {
    console.log('Add product error:', error);
    return c.json({ error: 'Failed to add product' }, 500);
  }
});

// Admin: Update product
app.put('/make-server-0b34730b/admin/product', async (c) => {
  try {
    const product = await c.req.json();
    
    if (!product.barcode) {
      return c.json({ error: 'Barcode is required' }, 400);
    }

    const existingProduct = await kv.get(`product:${product.barcode}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    await kv.set(`product:${product.barcode}`, {
      ...product,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, product });
  } catch (error) {
    console.log('Update product error:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Admin: Delete product
app.delete('/make-server-0b34730b/admin/product/:barcode', async (c) => {
  try {
    const barcode = c.req.param('barcode');
    
    const existingProduct = await kv.get(`product:${barcode}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    await kv.del(`product:${barcode}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete product error:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Admin: Get all products
app.get('/make-server-0b34730b/admin/products', async (c) => {
  try {
    const productKeys = await kv.getByPrefix('product:');
    const products = productKeys || [];
    
    return c.json({ 
      success: true, 
      products: products,
      count: products.length
    });
  } catch (error) {
    console.log('Get products error:', error);
    return c.json({ error: 'Failed to get products' }, 500);
  }
});

// Admin: Create promotion
app.post('/make-server-0b34730b/admin/promotion', async (c) => {
  try {
    const promotion = await c.req.json();
    
    if (!promotion.title || !promotion.description || !promotion.discountValue) {
      return c.json({ error: 'Title, description, and discount value are required' }, 400);
    }

    const promotionId = `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const promotionData = {
      ...promotion,
      id: promotionId,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    await kv.set(`promotion:${promotionId}`, promotionData);

    return c.json({ success: true, promotion: promotionData });
  } catch (error) {
    console.log('Create promotion error:', error);
    return c.json({ error: 'Failed to create promotion' }, 500);
  }
});

// Admin: Update promotion
app.put('/make-server-0b34730b/admin/promotion', async (c) => {
  try {
    const promotion = await c.req.json();
    
    if (!promotion.id) {
      return c.json({ error: 'Promotion ID is required' }, 400);
    }

    const existingPromotion = await kv.get(`promotion:${promotion.id}`);
    if (!existingPromotion) {
      return c.json({ error: 'Promotion not found' }, 404);
    }

    const updatedPromotion = {
      ...promotion,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`promotion:${promotion.id}`, updatedPromotion);

    return c.json({ success: true, promotion: updatedPromotion });
  } catch (error) {
    console.log('Update promotion error:', error);
    return c.json({ error: 'Failed to update promotion' }, 500);
  }
});

// Admin: Delete promotion
app.delete('/make-server-0b34730b/admin/promotion/:id', async (c) => {
  try {
    const promotionId = c.req.param('id');
    
    const existingPromotion = await kv.get(`promotion:${promotionId}`);
    if (!existingPromotion) {
      return c.json({ error: 'Promotion not found' }, 404);
    }

    await kv.del(`promotion:${promotionId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete promotion error:', error);
    return c.json({ error: 'Failed to delete promotion' }, 500);
  }
});

// Admin: Get all promotions
app.get('/make-server-0b34730b/admin/promotions', async (c) => {
  try {
    const promotionKeys = await kv.getByPrefix('promotion:');
    const promotions = promotionKeys || [];
    
    // Sort by creation date, newest first
    promotions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ 
      success: true, 
      promotions: promotions,
      count: promotions.length
    });
  } catch (error) {
    console.log('Get promotions error:', error);
    return c.json({ error: 'Failed to get promotions' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Not found handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

serve(app.fetch);