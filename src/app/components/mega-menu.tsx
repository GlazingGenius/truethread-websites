import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface MegaMenuProps {
  category: "Men" | "Women" | "Kids";
}

const subcategories = {
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

export function MegaMenu({ category }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={`/products?category=${category}`}
        className="text-gray-700 hover:text-black transition-colors font-medium"
      >
        {category}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white shadow-2xl border border-gray-100 rounded-lg overflow-hidden"
            style={{ minWidth: "500px" }}
          >
            <div className="p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                SHOP BY CATEGORY
              </h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                {subcategories[category].map((subcategory) => (
                  <Link
                    key={subcategory}
                    to={`/products?category=${category}&subcategory=${subcategory === "All Clothing" ? "All" : subcategory}`}
                    className="text-sm text-gray-700 hover:text-black hover:underline transition-colors py-1.5 block"
                    onClick={() => setIsOpen(false)}
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}