import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { NikeHero } from "@/app/components/nike-hero";
import { NikeCategoryGrid } from "@/app/components/nike-category-grid";
import { NikeFeaturedBanner } from "@/app/components/nike-featured-banner";
import { PhotoCollections } from "@/app/components/photo-collections";
import { NikeVideoSection } from "@/app/components/nike-video-section";
import { NikeProductCard } from "@/app/components/nike-product-card";
import { PreBookDialog } from "@/app/components/pre-book-dialog";
import { ProductDetailModal } from "@/app/components/product-detail-modal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
  gsm?: string;
  sizes?: string[];
  fabric?: string;
  stitchingDetails?: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [preBookProduct, setPreBookProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

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
      console.log("Fetched products data:", data);
      if (data.success) {
        console.log("Products array:", data.products);
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  // Get first 8 products for featured section
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <NikeHero onShopNow={handleShopNow} />
      <NikeCategoryGrid onCategoryClick={handleCategoryClick} />
      <NikeFeaturedBanner onShopClick={handleShopNow} />
      
      {/* Photo Collections */}
      <PhotoCollections />
      
      {/* Craftsmanship Video Section */}
      <NikeVideoSection onShopNow={handleShopNow} />

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full mb-4"
            >
              <span className="text-sm font-semibold text-purple-700">TRENDING NOW</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: 'Bodoni Moda, serif' }}
            >
              Featured Collection
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'Alumni Sans, sans-serif' }}
            >
              Discover our handpicked selection of premium fashion pieces
            </motion.p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NikeProductCard
                    product={product}
                    onPreBook={() => setPreBookProduct(product)}
                    onViewDetails={() => setDetailProduct(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products available at the moment</p>
            </div>
          )}

          {/* View More Button */}
          {featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button
                onClick={handleShopNow}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-full px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                View More Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pre-Book Dialog */}
      {preBookProduct && (
        <PreBookDialog
          isOpen={!!preBookProduct}
          onClose={() => setPreBookProduct(null)}
          product={preBookProduct}
        />
      )}

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          open={!!detailProduct}
          onClose={() => setDetailProduct(null)}
          product={detailProduct}
        />
      )}
    </div>
  );
}