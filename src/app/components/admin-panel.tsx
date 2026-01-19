import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus, LogOut, Package, MessageSquare, Upload, X, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Switch } from "@/app/components/ui/switch";

// Subcategories matching the mega menu
const SUBCATEGORIES = {
  Men: [
    "All Clothing",
    "Shirts",
    "T-Shirts",
    "Polo Shirts",
    "Blazers",
    "Jackets & Coats",
    "Sweaters & Knits",
    "Hoodies & Sweatshirts",
    "Loungewear",
    "Matching Sets",
    "Denim",
    "Pants",
    "Shorts",
    "Activewear",
  ],
  Women: [
    "All Clothing",
    "Dresses",
    "Tops",
    "Blouses",
    "Blazers",
    "Jackets & Coats",
    "Jumpsuits & Rompers",
    "Sweaters & Knits",
    "Loungewear",
    "Matching Sets",
    "Denim",
    "Pants",
    "Skirts",
    "Shorts",
    "Bodysuits",
    "Activewear",
    "Lehenga",
    "Sarees",
    "Kurta Sets",
  ],
  Kids: [
    "All Clothing",
    "Tops",
    "T-Shirts",
    "Dresses",
    "Rompers",
    "Jackets & Coats",
    "Sweaters",
    "Loungewear",
    "Matching Sets",
    "Pants",
    "Shorts",
    "Activewear",
  ],
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  inStock: boolean;
  images: string[];
  gsm?: string;
  sizes?: string[];
  fabric?: string;
  stitchingDetails?: string;
}

interface PreBooking {
  id: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  status: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: string;
}

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [preBookings, setPreBookings] = useState<PreBooking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [visibleProductCount, setVisibleProductCount] = useState(10); // Show 10 by default

  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    subcategory: "",
    inStock: true,
    images: "",
    gsm: "",
    sizes: "",
    fabric: "",
    stitchingDetails: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchPreBookings();
    fetchMessages();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      console.log("📦 Fetched products:", data.products?.length, "products");
      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    }
  };

  const fetchPreBookings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/pre-bookings`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPreBookings(data.bookings);
      }
    } catch (error) {
      console.error("Fetch pre-bookings error:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/contacts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        inStock: formData.inStock,
        images: formData.images.split(",").map((url) => url.trim()),
        gsm: formData.gsm,
        sizes: formData.sizes ? formData.sizes.split(",").map((s) => s.trim()) : [],
        fabric: formData.fabric,
        stitchingDetails: formData.stitchingDetails,
      };

      const url = editingProduct
        ? `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/products/${editingProduct.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingProduct ? "Product updated" : "Product added");
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Product save error:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "Men",
      subcategory: product.subcategory || "",
      inStock: product.inStock ?? true,
      images: product.images?.join(", ") || "",
      gsm: product.gsm || "",
      sizes: product.sizes?.join(", ") || "",
      fabric: product.fabric || "",
      stitchingDetails: product.stitchingDetails || "",
    });
    setUploadedImageUrls(product.images || []);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Men",
      subcategory: "",
      inStock: true,
      images: "",
      gsm: "",
      sizes: "",
      fabric: "",
      stitchingDetails: "",
    });
    setUploadedImageUrls([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/upload-images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.imageUrls) {
        const newUrls = [...uploadedImageUrls, ...data.imageUrls];
        setUploadedImageUrls(newUrls);
        setFormData({ ...formData, images: newUrls.join(", ") });
        toast.success(`${data.imageUrls.length} image(s) uploaded successfully`);
      } else {
        toast.error(data.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeUploadedImage = (index: number) => {
    const newUrls = uploadedImageUrls.filter((_, i) => i !== index);
    setUploadedImageUrls(newUrls);
    setFormData({ ...formData, images: newUrls.join(", ") });
  };

  const handleCleanupProducts = async () => {
    const confirmMessage = 
      `⚠️ WARNING: This will remove all invalid products from the database.\n\n` +
      `Valid products must have:\n` +
      `✓ Name, description, price, category\n` +
      `✓ At least one valid image URL\n\n` +
      `Do you want to continue?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/cleanup-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error("Failed to cleanup products");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSampleData = async () => {
    const confirmMessage = 
      `🔄 This will DELETE ALL existing products and reload fresh sample data with multiple images.\\n\\n` +
      `✨ New products will have 2-3 images each\\n` +
      `📸 Perfect for testing the multi-image gallery feature\\n\\n` +
      `⚠️ Current products: ${products.length}\\n\\n` +
      `Do you want to continue?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/refresh-sample-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Refresh sample data error:", error);
      toast.error("Failed to refresh sample data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      handleEdit(product);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    // Implement mark as read functionality
    toast.info("Mark as read functionality - coming soon");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="prebookings">
              Pre-Bookings ({preBookings.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Category Reference Guide */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  📋 Category Reference Guide - Shop by Category
                </CardTitle>
                <p className="text-sm text-gray-600">Use these exact subcategories when uploading products</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Men's Categories */}
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">👔 MEN ({SUBCATEGORIES.Men.length} categories)</h3>
                    <ul className="space-y-1.5 text-sm">
                      {SUBCATEGORIES.Men.map((subcat) => (
                        <li key={subcat} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                          <span className="text-gray-700">{subcat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Women's Categories */}
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h3 className="font-bold text-lg mb-3 text-indigo-700">👗 WOMEN ({SUBCATEGORIES.Women.length} categories)</h3>
                    <ul className="space-y-1.5 text-sm">
                      {SUBCATEGORIES.Women.map((subcat) => (
                        <li key={subcat} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                          <span className="text-gray-700">{subcat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Kids' Categories */}
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">👶 KIDS ({SUBCATEGORIES.Kids.length} categories)</h3>
                    <ul className="space-y-1.5 text-sm">
                      {SUBCATEGORIES.Kids.map((subcat) => (
                        <li key={subcat} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                          <span className="text-gray-700">{subcat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-100">
                  <p className="text-xs text-gray-600 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Important:</strong> Select the correct category and subcategory below when adding products. This helps customers find products through the mega menu navigation.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Kids">Kids</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory *</Label>
                        <select
                          id="subcategory"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select a subcategory</option>
                          {SUBCATEGORIES[formData.category as keyof typeof SUBCATEGORIES]?.map((subcat) => (
                            <option key={subcat} value={subcat}>
                              {subcat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="inStock"
                        checked={formData.inStock}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, inStock: checked })
                        }
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Product Images</h3>
                    <div className="space-y-2">
                      <Label>Product Images *</Label>
                      
                      {/* Upload Button */}
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id="imageUpload"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("imageUpload")?.click()}
                          disabled={uploadingImages}
                          className="flex items-center gap-2"
                        >
                          {uploadingImages ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Images
                            </>
                          )}
                        </Button>
                        <span className="text-sm text-gray-500">
                          {uploadedImageUrls.length > 0 ? `${uploadedImageUrls.length} image(s) uploaded` : "No images uploaded"}
                        </span>
                      </div>

                      {/* Image Previews */}
                      {uploadedImageUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {uploadedImageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hidden input for form submission */}
                      <input type="hidden" value={formData.images} required={uploadedImageUrls.length === 0} />
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fabric">Fabric</Label>
                        <Input
                          id="fabric"
                          value={formData.fabric}
                          onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                          placeholder="e.g., Cotton, Silk, Polyester"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gsm">GSM</Label>
                        <Input
                          id="gsm"
                          value={formData.gsm}
                          onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                          placeholder="e.g., 180, 200, 220"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stitchingDetails">Stitching Details</Label>
                      <Textarea
                        id="stitchingDetails"
                        value={formData.stitchingDetails}
                        onChange={(e) =>
                          setFormData({ ...formData, stitchingDetails: e.target.value })
                        }
                        rows={4}
                        placeholder="Describe stitching details, craftsmanship, and special features..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {editingProduct && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products ({products.length})</CardTitle>
                  <Button
                    onClick={fetchProducts}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Grid View of Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {products.slice(0, visibleProductCount).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{product.category}</Badge>
                            {product.subcategory && (
                              <Badge variant="outline" className="bg-purple-50">{product.subcategory}</Badge>
                            )}
                            {product.inStock ? (
                              <Badge className="bg-green-500">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Product Images Gallery */}
                      {product.images && product.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Images ({product.images.length})
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {product.images.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img
                                  src={img}
                                  alt={`${product.name} - Image ${idx + 1}`}
                                  className="w-full h-full object-cover rounded border border-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">#{idx + 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Price:</span>
                          <span className="ml-2 text-lg font-bold text-purple-600">₹{(product.price || 0).toLocaleString("en-IN")}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-gray-700">Description:</span>
                          <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        </div>

                        {product.fabric && (
                          <div>
                            <span className="font-semibold text-gray-700">Fabric:</span>
                            <span className="ml-2 text-gray-600">{product.fabric}</span>
                          </div>
                        )}

                        {product.gsm && (
                          <div>
                            <span className="font-semibold text-gray-700">GSM:</span>
                            <span className="ml-2 text-gray-600">{product.gsm}</span>
                          </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                          <div>
                            <span className="font-semibold text-gray-700">Sizes:</span>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {product.sizes.map((size, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{size}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.stitchingDetails && (
                          <div>
                            <span className="font-semibold text-gray-700">Stitching Details:</span>
                            <p className="text-gray-600 mt-1 text-xs line-clamp-2">{product.stitchingDetails}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100">
                          <span className="font-semibold text-gray-700">Product ID:</span>
                          <span className="ml-2 text-gray-500 text-xs font-mono">{product.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No products found. Add your first product above!</p>
                  </div>
                )}

                {products.length > visibleProductCount && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => setVisibleProductCount(visibleProductCount + 10)}
                      variant="outline"
                      size="sm"
                    >
                      Show More ({products.length - visibleProductCount} remaining)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cleanup Button */}
            <Card className="border-2 border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Database Cleanup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Remove invalid products that don't have all required fields (name, description, price, category, and images).
                  This will keep only products that are properly formatted and visible in the user panel.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCleanupProducts}
                    variant="destructive"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {loading ? "Cleaning..." : "Clean Up Invalid Products"}
                  </Button>
                  <span className="text-sm text-gray-600">
                    ({products.length} products currently visible)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Refresh Sample Data Button */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Upload className="h-5 w-5" />
                  Refresh Sample Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Delete all existing products and reload fresh sample data with multiple images.
                  This is perfect for testing the multi-image gallery feature.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRefreshSampleData}
                    variant="destructive"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {loading ? "Refreshing..." : "Refresh Sample Data"}
                  </Button>
                  <span className="text-sm text-gray-600">
                    ({products.length} products currently visible)
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pre-Bookings Tab */}
          <TabsContent value="prebookings" className="space-y-6">
            {/* Pre-Bookings List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pre-Bookings ({preBookings.length})</CardTitle>
                  <Button
                    onClick={fetchPreBookings}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Customer Email</TableHead>
                      <TableHead>Customer Phone</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.productName}</TableCell>
                        <TableCell>{booking.customerName}</TableCell>
                        <TableCell>{booking.customerEmail}</TableCell>
                        <TableCell>{booking.customerPhone}</TableCell>
                        <TableCell>{booking.notes || "-"}</TableCell>
                        <TableCell>
                          {booking.status === "pending" ? (
                            <Badge className="bg-yellow-500">Pending</Badge>
                          ) : (
                            <Badge className="bg-green-500">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(booking.productName)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Messages List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Messages ({messages.length})</CardTitle>
                  <Button
                    onClick={fetchMessages}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.message}</TableCell>
                        <TableCell>
                          {message.status === "unread" ? (
                            <Badge className="bg-yellow-500">Unread</Badge>
                          ) : (
                            <Badge className="bg-green-500">Read</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}