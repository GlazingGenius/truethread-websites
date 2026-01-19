import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Heart, Share2, Package, Ruler, Sparkles, ChevronLeft, ChevronRight, Link2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { PreBookDialog } from "@/app/components/pre-book-dialog";
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

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [preBookProduct, setPreBookProduct] = useState<Product | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    // Reset selected image when product changes
    setSelectedImage(0);
  }, [product?.id]);

  useEffect(() => {
    // Reset selected size when product changes
    setSelectedSize(null);
  }, [product?.id]);

  useEffect(() => {
    // Disable body scroll when modal is open
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!product) return null;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    // Add to cart logic
    toast.success(`${product.name} added to cart!`, {
      description: `Price: ₹${(product.price || 0).toLocaleString("en-IN")}`,
    });
    
    // Here you can add actual cart logic later
    // e.g., dispatch to Redux, update context, or call API
  };

  const handleBuyNow = () => {
    // Buy now logic - could redirect to checkout
    toast.success("Proceeding to checkout...", {
      description: `${product.name} - ₹${(product.price || 0).toLocaleString("en-IN")}`,
    });
    
    // Here you can redirect to checkout page
    // e.g., router.push('/checkout') with product data
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Added to wishlist!", {
        description: product.name,
      });
    } else {
      toast("Removed from wishlist", {
        description: product.name,
      });
    }
    
    // Here you can add actual wishlist logic
    // e.g., save to localStorage, dispatch to Redux, or call API
  };

  const handleShare = async () => {
    setShowShareMenu(true);
  };

  const shareToSocialMedia = (platform: string) => {
    const productUrl = window.location.href;
    const shareText = `Check out ${product.name} at True Thread!\n\n${product.description}\n\nPrice: ₹${(product.price || 0).toLocaleString("en-IN")}`;
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(product.name);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(productUrl).then(() => {
          toast.success("Link copied to clipboard!", {
            description: "Share this link with your friends",
          });
          setShowShareMenu(false);
        }).catch(() => {
          toast.error("Failed to copy link");
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
      toast.success("Opening share dialog...");
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[90vw] lg:w-[80vw] xl:w-[70vw] bg-white z-50 overflow-y-auto"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onClose}
                className="fixed top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left - Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Image Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* Stock Badge */}
                      <div className="absolute top-4 left-4">
                        {product.inStock ? (
                          <Badge className="bg-green-500 text-white">In Stock</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                        )}
                      </div>
                    </motion.div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-4 gap-3"
                      >
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? "border-black"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Right - Product Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Category */}
                    <div>
                      <Badge variant="outline" className="text-sm">
                        {product.category}
                      </Badge>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      {product.name}
                    </h1>

                    {/* Price */}
                    <div className="text-3xl font-bold">₹{(product.price || 0).toLocaleString("en-IN")}</div>

                    {/* Description */}
                    <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

                    <Separator />

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {product.fabric && (
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                          <Package className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold">Fabric</h4>
                            <p className="text-gray-600 text-sm">{product.fabric}</p>
                          </div>
                        </div>
                      )}

                      {product.gsm && (
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                          <Ruler className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold">GSM</h4>
                            <p className="text-gray-600 text-sm">{product.gsm}</p>
                          </div>
                        </div>
                      )}

                      {product.sizes && product.sizes.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">
                            Select Size {selectedSize && <span className="text-sm font-normal text-gray-600">(Selected: {selectedSize})</span>}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                                  selectedSize === size
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {product.stitchingDetails && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-xl font-bold mb-2">Stitching Details</h3>
                          <p className="text-gray-600 leading-relaxed">{product.stitchingDetails}</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Care Instructions */}
                    <div>
                      <h3 className="text-xl font-bold mb-3">Care Instructions</h3>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Hand wash or dry clean only</li>
                        <li>• Do not bleach</li>
                        <li>• Iron on low heat</li>
                        <li>• Store in a cool, dry place</li>
                      </ul>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sticky bottom-0 bg-white pt-4 pb-2">
                      {product.inStock ? (
                        <>
                          <div className="flex gap-3">
                            <Button size="lg" className="flex-1 text-lg font-semibold py-6" onClick={handleAddToCart}>
                              <ShoppingBag className="mr-2 h-5 w-5" />
                              Add to Cart
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline" 
                              className={`py-6 ${isLiked ? 'text-red-500 border-red-500 hover:text-red-600 hover:border-red-600' : ''}`}
                              onClick={handleToggleLike}
                            >
                              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                            </Button>
                          </div>
                          <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-lg font-semibold py-6"
                            onClick={handleBuyNow}
                          >
                            Buy Now
                          </Button>
                        </>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            size="lg"
                            onClick={() => setPreBookProduct(product)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 text-lg font-semibold py-6"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Pre-Order Now
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className={`py-6 ${isLiked ? 'text-red-500 border-red-500 hover:text-red-600 hover:border-red-600' : ''}`}
                            onClick={handleToggleLike}
                          >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                          </Button>
                        </div>
                      )}
                      <Button size="lg" variant="outline" className="w-full py-6" onClick={handleShare}>
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pre-Book Dialog */}
      <PreBookDialog
        product={preBookProduct}
        open={!!preBookProduct}
        onOpenChange={(open) => !open && setPreBookProduct(null)}
      />

      {/* Share Menu Dialog */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Share Menu Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[70] p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  Share Product
                </h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Social Media Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("whatsapp")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </motion.button>

                {/* Facebook */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("facebook")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </motion.button>

                {/* Twitter/X */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("twitter")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">X</span>
                </motion.button>

                {/* LinkedIn */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("linkedin")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </motion.button>

                {/* Telegram */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("telegram")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Telegram</span>
                </motion.button>

                {/* Email */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocialMedia("email")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </motion.button>
              </div>

              {/* Copy Link Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareToSocialMedia("copy")}
                className="w-full mt-4 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Link2 className="h-5 w-5" />
                Copy Link
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}