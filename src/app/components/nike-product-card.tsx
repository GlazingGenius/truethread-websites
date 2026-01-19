import { motion } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import { Image } from "lucide-react";

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

interface NikeProductCardProps {
  product: Product;
  onPreBook?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function NikeProductCard({ product, onPreBook, onViewDetails }: NikeProductCardProps) {
  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else if (!product.inStock) {
      onPreBook?.(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Multiple Images Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-black/70 text-white border-none backdrop-blur-sm text-xs flex items-center gap-1">
              <Image className="h-3 w-3" />
              {product.images.length}
            </Badge>
          </div>
        )}
        
        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive">Pre-Order</Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white text-black border-white">{product.category}</Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm text-red-600 font-medium">Just In</p>
            <h3 className="font-medium text-base group-hover:underline">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">{product.category}'s Collection</p>
            {product.fabric && (
              <p className="text-sm text-gray-500">{product.fabric}</p>
            )}
          </div>
        </div>
        
        <p className="font-medium text-base">₹ {(product.price || 0).toLocaleString("en-IN")}</p>
      </div>
    </motion.div>
  );
}