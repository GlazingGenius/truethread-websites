import { motion } from "motion/react";
import { ShoppingBag, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";

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

interface ProductCardProps {
  product: Product;
  onPreBook?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onPreBook, onViewDetails }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl transition-shadow duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-4 right-4">
            {product.inStock ? (
              <Badge className="bg-green-500 text-white">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="space-y-2 text-sm text-gray-500">
            {product.fabric && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Fabric:</span>
                <span>{product.fabric}</span>
              </div>
            )}
            {product.gsm && (
              <div className="flex items-center gap-2">
                <span className="font-medium">GSM:</span>
                <span>{product.gsm}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 gap-2">
          {product.inStock ? (
            <Button onClick={() => onViewDetails?.(product)} className="flex-1" size="lg">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Details
            </Button>
          ) : (
            <Button
              onClick={() => onPreBook?.(product)}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Package className="mr-2 h-4 w-4" />
              Pre-Book
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
