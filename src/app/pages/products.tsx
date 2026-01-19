import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { NikeProductCard } from "@/app/components/nike-product-card";
import { PreBookDialog } from "@/app/components/pre-book-dialog";
import { ProductDetailModal } from "@/app/components/product-detail-modal";
import { Button } from "@/app/components/ui/button";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

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

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [preBookProduct, setPreBookProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>(categoryParam || "All");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("All");
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [refreshingData, setRefreshingData] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add visibility change listener to refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also listen for focus event
    const handleFocus = () => {
      fetchProducts();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    filterProducts();
    updateAvailableSubcategories();
  }, [products, categoryFilter, subcategoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSampleData = async () => {
    if (!confirm("🔄 This will DELETE ALL products and reload fresh sample data with 2-3 images each.\n\nContinue?")) {
      return;
    }

    setRefreshingData(true);

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
        toast.success("✅ Sample data refreshed! Reloading...");
        await fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Refresh sample data error:", error);
      toast.error("Failed to refresh sample data");
    } finally {
      setRefreshingData(false);
    }
  };

  const updateAvailableSubcategories = () => {
    let relevantProducts = [...products];
    
    if (categoryFilter !== "All") {
      relevantProducts = relevantProducts.filter((p) => p.category === categoryFilter);
    }
    
    const subcategories = new Set<string>();
    relevantProducts.forEach((p) => {
      if (p.subcategory) {
        subcategories.add(p.subcategory);
      }
    });
    
    setAvailableSubcategories(Array.from(subcategories).sort());
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (subcategoryFilter !== "All") {
      filtered = filtered.filter((p) => p.subcategory === subcategoryFilter);
    }

    // Limit to 10 products
    filtered = filtered.slice(0, 10);

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold"
          >
            {categoryFilter === "All" ? "All Products" : `${categoryFilter}'s Collection`}
          </motion.h1>

          {/* Refresh Sample Data Button */}
          <Button
            onClick={handleRefreshSampleData}
            disabled={refreshingData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshingData ? 'animate-spin' : ''}`} />
            {refreshingData ? "Loading..." : "Load Sample Data"}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <button
            onClick={() => {
              setCategoryFilter("All");
              setSubcategoryFilter("All");
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === "All"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setCategoryFilter("Men");
              setSubcategoryFilter("All");
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === "Men"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Men
          </button>
          <button
            onClick={() => {
              setCategoryFilter("Women");
              setSubcategoryFilter("All");
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === "Women"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Women
          </button>
          <button
            onClick={() => {
              setCategoryFilter("Kids");
              setSubcategoryFilter("All");
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === "Kids"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Kids
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <NikeProductCard
                key={product.id}
                product={product}
                onPreBook={setPreBookProduct}
                onViewDetails={setDetailProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products found</p>
            <Button
              onClick={() => setCategoryFilter("All")}
              variant="outline"
              className="mt-4"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <PreBookDialog
        product={preBookProduct}
        open={!!preBookProduct}
        onOpenChange={(open) => !open && setPreBookProduct(null)}
      />

      <ProductDetailModal
        product={detailProduct}
        open={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}