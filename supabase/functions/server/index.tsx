import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const BUCKET_NAME = "make-61eed344-products";

// Initialize storage bucket on startup
async function initializeStorage() {
  try {
    console.log("Checking storage bucket...");
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log("Creating storage bucket:", BUCKET_NAME);
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false, // Private bucket for security
        fileSizeLimit: 5242880, // 5MB limit per file
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });
      
      if (error) {
        console.log("Bucket creation error:", error);
      } else {
        console.log("✅ Storage bucket created successfully");
      }
    } else {
      console.log("✅ Storage bucket already exists");
    }
  } catch (error) {
    console.log("Storage initialization error:", error);
  }
}

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-61eed344/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin login endpoint
app.post("/make-server-61eed344/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // Get admin credentials from KV store
    const adminCreds = await kv.get("admin_credentials");
    
    // Initialize default admin if not exists
    if (!adminCreds) {
      await kv.set("admin_credentials", {
        username: "admin",
        password: "admin123" // Change this in production
      });
    }
    
    const creds = adminCreds || { username: "admin", password: "admin123" };
    
    if (username === creds.username && password === creds.password) {
      return c.json({ success: true, message: "Login successful" });
    } else {
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }
  } catch (error) {
    console.log("Admin login error:", error);
    return c.json({ success: false, message: "Login failed: " + error }, 500);
  }
});

// Get all products
app.get("/make-server-61eed344/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product_");
    return c.json({ success: true, products });
  } catch (error) {
    console.log("Get products error:", error);
    return c.json({ success: false, message: "Failed to get products: " + error }, 500);
  }
});

// Get single product
app.get("/make-server-61eed344/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product_${id}`);
    
    if (!product) {
      return c.json({ success: false, message: "Product not found" }, 404);
    }
    
    return c.json({ success: true, product });
  } catch (error) {
    console.log("Get product error:", error);
    return c.json({ success: false, message: "Failed to get product: " + error }, 500);
  }
});

// Add new product (Admin only)
app.post("/make-server-61eed344/admin/products", async (c) => {
  try {
    const product = await c.req.json();
    const id = `product_${Date.now()}`;
    
    await kv.set(id, {
      ...product,
      id,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ success: true, message: "Product added successfully", id });
  } catch (error) {
    console.log("Add product error:", error);
    return c.json({ success: false, message: "Failed to add product: " + error }, 500);
  }
});

// Update product (Admin only)
app.put("/make-server-61eed344/admin/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existingProduct = await kv.get(id);
    if (!existingProduct) {
      return c.json({ success: false, message: "Product not found" }, 404);
    }
    
    await kv.set(id, {
      ...existingProduct,
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    return c.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log("Update product error:", error);
    return c.json({ success: false, message: "Failed to update product: " + error }, 500);
  }
});

// Delete product (Admin only)
app.delete("/make-server-61eed344/admin/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Delete product error:", error);
    return c.json({ success: false, message: "Failed to delete product: " + error }, 500);
  }
});

// Pre-booking endpoint
app.post("/make-server-61eed344/pre-bookings", async (c) => {
  try {
    const booking = await c.req.json();
    const id = `prebooking_${Date.now()}`;
    
    // Save to database
    await kv.set(id, {
      ...booking,
      id,
      createdAt: new Date().toISOString(),
      status: "pending"
    });
    
    // Send WhatsApp message using Twilio
    try {
      const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const twilioWhatsAppNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER");
      
      console.log("Twilio Config Check:", {
        hasSid: !!twilioAccountSid,
        hasToken: !!twilioAuthToken,
        hasNumber: !!twilioWhatsAppNumber,
        number: twilioWhatsAppNumber
      });
      
      if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
        console.log("Missing Twilio credentials - skipping WhatsApp notification");
      } else {
        // Format the message
        const whatsappMessage = `🔔 *New Pre-Booking Request*\n\n` +
          `👤 *Name:* ${booking.name}\n` +
          `📱 *Phone:* ${booking.phone}\n` +
          `📧 *Email:* ${booking.email}\n` +
          `👕 *Product:* ${booking.productName}\n` +
          `📏 *Size:* ${booking.size || 'Not specified'}\n` +
          `🕒 *Time:* ${new Date().toLocaleString()}\n` +
          `📦 *Booking ID:* ${id}`;
        
        // Send via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
        
        console.log("Sending WhatsApp to +918147008048 via Twilio...");
        
        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: twilioWhatsAppNumber,
            To: "whatsapp:+918147008048",
            Body: whatsappMessage,
          }),
        });
        
        const responseText = await twilioResponse.text();
        console.log("Twilio Response Status:", twilioResponse.status);
        console.log("Twilio Response Body:", responseText);
        
        if (!twilioResponse.ok) {
          console.log("❌ Twilio WhatsApp send failed:", responseText);
        } else {
          const twilioData = JSON.parse(responseText);
          console.log("✅ WhatsApp message sent successfully! SID:", twilioData.sid);
        }
      }
    } catch (whatsappError) {
      console.log("WhatsApp send error (non-fatal):", whatsappError);
      console.log("Error details:", whatsappError.message);
    }
    
    return c.json({ success: true, message: "Pre-booking submitted successfully", id });
  } catch (error) {
    console.log("Pre-booking error:", error);
    return c.json({ success: false, message: "Failed to submit pre-booking: " + error }, 500);
  }
});

// Get all pre-bookings (Admin only)
app.get("/make-server-61eed344/admin/pre-bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("prebooking_");
    return c.json({ success: true, bookings });
  } catch (error) {
    console.log("Get pre-bookings error:", error);
    return c.json({ success: false, message: "Failed to get pre-bookings: " + error }, 500);
  }
});

// Pre-order request endpoint (for seasonal/event orders via chatbot)
app.post("/make-server-61eed344/pre-order-request", async (c) => {
  try {
    const request = await c.req.json();
    const id = `preorder_${Date.now()}`;
    
    // Save to database
    await kv.set(id, {
      ...request,
      id,
      createdAt: new Date().toISOString(),
      status: "pending"
    });
    
    // Send WhatsApp message using Twilio
    try {
      const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const twilioWhatsAppNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER");
      
      console.log("Twilio Config Check:", {
        hasSid: !!twilioAccountSid,
        hasToken: !!twilioAuthToken,
        hasNumber: !!twilioWhatsAppNumber,
        number: twilioWhatsAppNumber
      });
      
      if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
        console.log("Missing Twilio credentials - skipping WhatsApp notification");
      } else {
        // Format the message
        const whatsappMessage = `🎊 *New Pre-Order Request*\\n\\n` +
          `👤 *Name:* ${request.name}\\n` +
          `📱 *Phone:* ${request.phone}\\n` +
          `🎉 *Occasion:* ${request.occasion}\\n` +
          `${request.message ? `💬 *Details:* ${request.message}\\n` : ''}` +
          `🕒 *Time:* ${new Date().toLocaleString()}\\n` +
          `📦 *Order ID:* ${id}`;
        
        // Send via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
        
        console.log("Sending WhatsApp to +918147008048 via Twilio...");
        
        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: twilioWhatsAppNumber,
            To: "whatsapp:+918147008048",
            Body: whatsappMessage,
          }),
        });
        
        const responseText = await twilioResponse.text();
        console.log("Twilio Response Status:", twilioResponse.status);
        console.log("Twilio Response Body:", responseText);
        
        if (!twilioResponse.ok) {
          console.log("❌ Twilio WhatsApp send failed:", responseText);
        } else {
          const twilioData = JSON.parse(responseText);
          console.log("✅ WhatsApp message sent successfully! SID:", twilioData.sid);
        }
      }
    } catch (whatsappError) {
      console.log("WhatsApp send error (non-fatal):", whatsappError);
      console.log("Error details:", whatsappError.message);
    }
    
    return c.json({ success: true, message: "Pre-order request submitted successfully", id });
  } catch (error) {
    console.log("Pre-order request error:", error);
    return c.json({ success: false, message: "Failed to submit pre-order request: " + error }, 500);
  }
});

// Get all pre-order requests (Admin only)
app.get("/make-server-61eed344/admin/pre-order-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("preorder_");
    return c.json({ success: true, requests });
  } catch (error) {
    console.log("Get pre-order requests error:", error);
    return c.json({ success: false, message: "Failed to get pre-order requests: " + error }, 500);
  }
});

// Contact/Chat message endpoint
app.post("/make-server-61eed344/contact", async (c) => {
  try {
    const message = await c.req.json();
    const id = `contact_${Date.now()}`;
    
    await kv.set(id, {
      ...message,
      id,
      createdAt: new Date().toISOString(),
      status: "unread"
    });
    
    return c.json({ 
      success: true, 
      message: "Your message has been sent. We'll get back to you soon.",
      id 
    });
  } catch (error) {
    console.log("Contact message error:", error);
    return c.json({ success: false, message: "Failed to send message: " + error }, 500);
  }
});

// Get all contact messages (Admin only)
app.get("/make-server-61eed344/admin/contacts", async (c) => {
  try {
    const messages = await kv.getByPrefix("contact_");
    return c.json({ success: true, messages });
  } catch (error) {
    console.log("Get contact messages error:", error);
    return c.json({ success: false, message: "Failed to get messages: " + error }, 500);
  }
});

// Cleanup invalid products (Admin only)
app.post("/make-server-61eed344/admin/cleanup-products", async (c) => {
  try {
    console.log("Starting product cleanup...");
    
    // Get all products
    const allProducts = await kv.getByPrefix("product_");
    console.log(`Found ${allProducts.length} total products`);
    
    const validProducts = [];
    const invalidProducts = [];
    
    // Identify valid vs invalid products
    for (const product of allProducts) {
      const isValid = 
        product &&
        product.id &&
        product.name &&
        product.description &&
        typeof product.price === 'number' &&
        product.category &&
        Array.isArray(product.images) &&
        product.images.length > 0 &&
        product.images.every(img => typeof img === 'string' && img.length > 0);
      
      if (isValid) {
        validProducts.push(product);
      } else {
        invalidProducts.push(product);
      }
    }
    
    console.log(`Valid products: ${validProducts.length}`);
    console.log(`Invalid products: ${invalidProducts.length}`);
    
    // Delete invalid products
    const keysToDelete = invalidProducts
      .filter(p => p && p.id)
      .map(p => p.id);
    
    if (keysToDelete.length > 0) {
      await kv.mdel(keysToDelete);
      console.log(`Deleted ${keysToDelete.length} invalid products`);
    }
    
    return c.json({ 
      success: true, 
      message: `Cleanup complete. Kept ${validProducts.length} valid products, removed ${keysToDelete.length} invalid products.`,
      stats: {
        total: allProducts.length,
        valid: validProducts.length,
        removed: keysToDelete.length
      }
    });
  } catch (error) {
    console.log("Cleanup products error:", error);
    return c.json({ success: false, message: "Failed to cleanup products: " + error }, 500);
  }
});

// Initialize sample products
app.post("/make-server-61eed344/admin/init-sample-data", async (c) => {
  try {
    // First, check if we already have the new multi-image products
    const existingProducts = await kv.getByPrefix("product_");
    const hasMultiImageProducts = existingProducts.some(p => 
      p.images && Array.isArray(p.images) && p.images.length > 1
    );
    
    // Only initialize if we don't have multi-image products yet
    if (hasMultiImageProducts) {
      console.log("Multi-image sample products already exist, skipping initialization");
      return c.json({ success: true, message: "Sample data already initialized" });
    }

    const sampleProducts = [
      {
        name: "Premium Cotton Kurta",
        description: "Hand-stitched cotton kurta with intricate embroidery",
        price: 2999,
        category: "Men",
        subcategory: "Traditional",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800",
          "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800"
        ],
        gsm: "180 GSM",
        sizes: ["S", "M", "L", "XL"],
        fabric: "100% Cotton",
        stitchingDetails: "Hand-stitched with reinforced seams"
      },
      {
        name: "Silk Designer Saree",
        description: "Elegant silk saree with traditional patterns",
        price: 5999,
        category: "Women",
        subcategory: "Traditional",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800",
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"
        ],
        gsm: "250 GSM",
        sizes: ["Free Size"],
        fabric: "Pure Silk",
        stitchingDetails: "Machine stitched borders with hand-worked details"
      },
      {
        name: "Linen Formal Shirt",
        description: "Breathable linen shirt perfect for summer",
        price: 1999,
        category: "Men",
        subcategory: "Casual",
        inStock: false,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"
        ],
        gsm: "120 GSM",
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "100% Linen",
        stitchingDetails: "French seams for durability"
      },
      {
        name: "Embroidered Palazzo Set",
        description: "Stylish palazzo with matching kurta",
        price: 3499,
        category: "Women",
        subcategory: "Traditional",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800",
          "https://images.unsplash.com/photo-1612990485791-c893ddf7a5e9?w=800",
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"
        ],
        gsm: "160 GSM",
        sizes: ["S", "M", "L", "XL"],
        fabric: "Cotton Blend",
        stitchingDetails: "Hand-embroidered details with machine stitching"
      },
      {
        name: "Designer Floral Dress",
        description: "Elegant floral print maxi dress with flowing silhouette",
        price: 2799,
        category: "Women",
        subcategory: "Casual",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"
        ],
        gsm: "140 GSM",
        sizes: ["XS", "S", "M", "L", "XL"],
        fabric: "Georgette",
        stitchingDetails: "Flowy fit with side zipper"
      },
      {
        name: "Classic Denim Jacket",
        description: "Timeless denim jacket with modern fit",
        price: 3299,
        category: "Men",
        subcategory: "Casual",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
        ],
        gsm: "300 GSM",
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "Denim",
        stitchingDetails: "Double-stitched seams with button closures"
      },
      {
        name: "Kids Cotton T-Shirt Set",
        description: "Comfortable and colorful 3-piece t-shirt set for kids",
        price: 1499,
        category: "Kids",
        subcategory: "Casual",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800"
        ],
        gsm: "150 GSM",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        fabric: "100% Cotton",
        stitchingDetails: "Soft-touch cotton with comfortable fit"
      },
      {
        name: "Kids Designer Lehenga",
        description: "Beautiful hand-embroidered lehenga for special occasions",
        price: 3999,
        category: "Kids",
        subcategory: "Traditional",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800",
          "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800"
        ],
        gsm: "200 GSM",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        fabric: "Silk Blend",
        stitchingDetails: "Hand-embroidered with intricate mirror work"
      },
      {
        name: "Kids Denim Jacket",
        description: "Trendy denim jacket with modern fit",
        price: 2499,
        category: "Kids",
        subcategory: "Casual",
        inStock: false,
        images: [
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800"
        ],
        gsm: "280 GSM",
        sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
        fabric: "Denim",
        stitchingDetails: "Reinforced stitching with button closures"
      },
      {
        name: "Kids Ethnic Kurta Set",
        description: "Traditional kurta pajama set for boys",
        price: 1899,
        category: "Kids",
        subcategory: "Traditional",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800"
        ],
        gsm: "170 GSM",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        fabric: "Cotton Silk",
        stitchingDetails: "Machine stitched with hand-finished details"
      }
    ];

    for (const product of sampleProducts) {
      const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(id, {
        ...product,
        id,
        createdAt: new Date().toISOString()
      });
    }

    return c.json({ success: true, message: "Sample data initialized" });
  } catch (error) {
    console.log("Initialize sample data error:", error);
    return c.json({ success: false, message: "Failed to initialize data: " + error }, 500);
  }
});

// Refresh sample data - clears old and adds new multi-image products
app.post("/make-server-61eed344/admin/refresh-sample-data", async (c) => {
  try {
    console.log("Refreshing sample data...");
    
    // Delete ALL existing products
    const existingProducts = await kv.getByPrefix("product_");
    console.log(`Found ${existingProducts.length} existing products to delete`);
    
    // Filter for valid IDs and delete them one by one to avoid batch errors
    for (const product of existingProducts) {
      if (product && product.id) {
        try {
          await kv.del(product.id);
          console.log(`Deleted product: ${product.id}`);
        } catch (delError) {
          console.log(`Failed to delete product ${product.id}:`, delError);
        }
      }
    }
    
    console.log("Starting to add new products...");
    
    // Add new multi-image products
    const sampleProducts = [
      {
        name: "Premium Cotton Kurta",
        description: "Hand-stitched cotton kurta with intricate embroidery",
        price: 2999,
        category: "Men",
        subcategory: "Shirts",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800",
          "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800"
        ],
        gsm: "180 GSM",
        sizes: ["S", "M", "L", "XL"],
        fabric: "100% Cotton",
        stitchingDetails: "Hand-stitched with reinforced seams"
      },
      {
        name: "Silk Designer Saree",
        description: "Elegant silk saree with traditional patterns",
        price: 5999,
        category: "Women",
        subcategory: "Dresses",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800",
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"
        ],
        gsm: "250 GSM",
        sizes: ["Free Size"],
        fabric: "Pure Silk",
        stitchingDetails: "Machine stitched borders with hand-worked details"
      },
      {
        name: "Linen Formal Shirt",
        description: "Breathable linen shirt perfect for summer",
        price: 1999,
        category: "Men",
        subcategory: "Shirts",
        inStock: false,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"
        ],
        gsm: "120 GSM",
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "100% Linen",
        stitchingDetails: "French seams for durability"
      },
      {
        name: "Embroidered Palazzo Set",
        description: "Stylish palazzo with matching kurta",
        price: 3499,
        category: "Women",
        subcategory: "Matching Sets",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800",
          "https://images.unsplash.com/photo-1612990485791-c893ddf7a5e9?w=800",
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"
        ],
        gsm: "160 GSM",
        sizes: ["S", "M", "L", "XL"],
        fabric: "Cotton Blend",
        stitchingDetails: "Hand-embroidered details with machine stitching"
      },
      {
        name: "Designer Floral Dress",
        description: "Elegant floral print maxi dress with flowing silhouette",
        price: 2799,
        category: "Women",
        subcategory: "Dresses",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800"
        ],
        gsm: "140 GSM",
        sizes: ["XS", "S", "M", "L", "XL"],
        fabric: "Georgette",
        stitchingDetails: "Flowy fit with side zipper"
      },
      {
        name: "Classic Denim Jacket",
        description: "Timeless denim jacket with modern fit",
        price: 3299,
        category: "Men",
        subcategory: "Jackets & Coats",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
        ],
        gsm: "300 GSM",
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "Denim",
        stitchingDetails: "Double-stitched seams with button closures"
      },
      {
        name: "Cotton Casual Pants",
        description: "Comfortable cotton chinos for everyday wear",
        price: 1999,
        category: "Men",
        subcategory: "Pants",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800"
        ],
        gsm: "200 GSM",
        sizes: ["28", "30", "32", "34", "36", "38"],
        fabric: "Cotton Twill",
        stitchingDetails: "Reinforced pockets with belt loops"
      },
      {
        name: "Women's Silk Blouse",
        description: "Elegant silk blouse with delicate details",
        price: 2499,
        category: "Women",
        subcategory: "Tops",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1564257577802-218beb0c4b63?w=800",
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"
        ],
        gsm: "120 GSM",
        sizes: ["XS", "S", "M", "L", "XL"],
        fabric: "Silk Satin",
        stitchingDetails: "French seams with mother-of-pearl buttons"
      },
      {
        name: "Kids Denim Shorts",
        description: "Comfortable denim shorts perfect for playtime",
        price: 899,
        category: "Kids",
        subcategory: "Shorts",
        inStock: true,
        images: [
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800"
        ],
        gsm: "250 GSM",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        fabric: "Denim",
        stitchingDetails: "Adjustable waist with reinforced stitching"
      },
      {
        name: "Kids Cotton T-Shirt",
        description: "Soft cotton t-shirt with fun graphic print",
        price: 599,
        category: "Kids",
        subcategory: "Tops",
        inStock: false,
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800"
        ],
        gsm: "170 GSM",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        fabric: "100% Cotton",
        stitchingDetails: "Ribbed collar with comfortable fit"
      }
    ];

    for (const product of sampleProducts) {
      const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(id, {
        ...product,
        id,
        createdAt: new Date().toISOString()
      });
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`✅ Added ${sampleProducts.length} new multi-image products`);
    return c.json({ 
      success: true, 
      message: `Sample data refreshed! Deleted ${existingProducts.length} old products, added ${sampleProducts.length} new multi-image products.`
    });
  } catch (error) {
    console.log("Refresh sample data error:", error);
    return c.json({ success: false, message: "Failed to refresh data: " + error }, 500);
  }
});

// Image upload endpoint (Admin only)
app.post("/make-server-61eed344/admin/upload-images", async (c) => {
  try {
    const formData = await c.req.formData();
    const files = formData.getAll("images");
    
    if (!files || files.length === 0) {
      return c.json({ success: false, message: "No images provided" }, 400);
    }

    console.log(`Uploading ${files.length} image(s)...`);

    // Upload each file and collect signed URLs
    const imageUrls: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const fileName = `${timestamp}-${randomStr}-${file.name}`;

        console.log(`Uploading file: ${fileName}`);

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, uint8Array, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false
          });

        if (error) {
          console.log(`Upload error for ${fileName}:`, error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        // Create signed URL (valid for 1 year)
        const { data: signedUrlData, error: signedError } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(fileName, 31536000); // 1 year

        if (signedError) {
          console.log(`Signed URL error for ${fileName}:`, signedError);
          throw new Error(`Failed to create signed URL: ${signedError.message}`);
        }

        if (signedUrlData?.signedUrl) {
          imageUrls.push(signedUrlData.signedUrl);
          console.log(`✅ Uploaded: ${fileName}`);
        }
      }
    }

    return c.json({ 
      success: true, 
      message: `${imageUrls.length} image(s) uploaded successfully`,
      imageUrls 
    });
  } catch (error) {
    console.log("Image upload error:", error);
    return c.json({ success: false, message: "Failed to upload images: " + error.message }, 500);
  }
});

Deno.serve(app.fetch);