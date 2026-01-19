import { motion } from "motion/react";

interface CategoryGridProps {
  onCategoryClick: (category: string) => void;
}

const categories = [
  {
    name: "Men's Collection",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=1600&fit=crop",
    category: "Men",
  },
  {
    name: "Women's Collection",
    image: "https://cdn.pixabay.com/photo/2022/12/04/07/03/woman-7633843_1280.jpg",
    category: "Women",
  },
  {
    name: "Kids' Collection",
    image: "https://tse2.mm.bing.net/th/id/OIP.TjD9bcTM_N_S7nxh9dbttQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Kids",
  },
];

export function NikeCategoryGrid({ onCategoryClick }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold mb-8"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onCategoryClick(category.category)}
              className="relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer group"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-4xl font-bold text-white mb-4">{category.name}</h3>
                <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Explore
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}