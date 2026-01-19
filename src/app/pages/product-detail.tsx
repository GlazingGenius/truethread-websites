import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, Heart, Share2, Package, Ruler, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { NikeProductCard } from "@/app/components/nike-product-card";
import { PreBookDialog } from "@/app/components/pre-book-dialog";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";

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

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [preBookProduct, setPreBookProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
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
        const currentProduct = data.products.find((p: Product) => p.id === id);
        if (currentProduct) {
          setProduct(currentProduct);
          // Get related products from same category
          const related = data.products
            .filter((p: Product) => p.category === currentProduct.category && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          toast.error("Product not found");
          navigate("/products");
        }
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Page */}
      <section className="relative h-screen">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-gray-900"
        >
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-8 left-8 z-10"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-8 right-8 z-10 flex gap-2"
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              {/* Left Side - Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className="text-white"
              >
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 400, damping: 20 }}
                  className="mb-4"
                >
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-sm px-4 py-1">
                    {product.category}
                  </Badge>
                  {product.inStock ? (
                    <Badge className="bg-green-500 text-white ml-2 text-sm px-4 py-1">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white ml-2 text-sm px-4 py-1">
                      Out of Stock
                    </Badge>
                  )}
                </motion.div>

                {/* Product Name */}
                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                  className="text-5xl md:text-7xl font-bold mb-4"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  {product.name}
                </motion.h1>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
                  className="text-4xl md:text-5xl font-bold mb-6"
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
                  className="text-lg text-gray-200 mb-8 max-w-xl"
                >
                  {product.description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-wrap gap-4"
                >
                  {product.inStock ? (
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => setPreBookProduct(product)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg font-semibold"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Pre-Order Now
                    </Button>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Side - Image Thumbnails */}
              {product.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex lg:justify-end gap-3"
                >
                  {product.images.slice(0, 4).map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-white shadow-lg"
                          : "border-white/30 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            y: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center"
        >
          <p className="text-sm mb-2">Scroll for Details</p>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Product Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {product.fabric && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <Package className="h-8 w-8 mb-3" />
                  <h4 className="font-semibold mb-2 text-lg">Fabric</h4>
                  <p className="text-gray-600">{product.fabric}</p>
                </motion.div>
              )}

              {product.gsm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <Ruler className="h-8 w-8 mb-3" />
                  <h4 className="font-semibold mb-2 text-lg">GSM</h4>
                  <p className="text-gray-600">{product.gsm}</p>
                </motion.div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <h4 className="font-semibold mb-3 text-lg">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Badge key={size} variant="outline" className="text-sm">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {product.stitchingDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Separator className="mb-8" />
                <h3 className="text-2xl font-bold mb-4">Stitching Details</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{product.stitchingDetails}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
              className="mt-12"
            >
              <Separator className="mb-8" />
              <h3 className="text-2xl font-bold mb-4">Care Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Hand wash or dry clean only</li>
                <li>• Do not bleach</li>
                <li>• Iron on low heat</li>
                <li>• Store in a cool, dry place</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                You May Also Like
              </h2>
              <p className="text-gray-600 text-lg">
                More from the {product.category} collection
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <NikeProductCard
                    product={relatedProduct}
                    onPreBook={setPreBookProduct}
                    onViewDetails={(p) => {
                      navigate(`/product/${p.id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pre-Book Dialog */}
      <PreBookDialog
        product={preBookProduct}
        open={!!preBookProduct}
        onOpenChange={(open) => !open && setPreBookProduct(null)}
      />
    </div>
  );
}