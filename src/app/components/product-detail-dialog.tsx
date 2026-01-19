import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

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

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>
            View detailed information about this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.inStock ? (
                <Badge className="bg-green-500">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.fabric && (
              <div>
                <h4 className="font-semibold mb-1">Fabric</h4>
                <p className="text-gray-600">{product.fabric}</p>
              </div>
            )}

            {product.gsm && (
              <div>
                <h4 className="font-semibold mb-1">GSM</h4>
                <p className="text-gray-600">{product.gsm}</p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Available Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.stitchingDetails && (
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-1">Stitching Details</h4>
                <p className="text-gray-600">{product.stitchingDetails}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}