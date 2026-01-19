import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const collections: Collection[] = [
  {
    id: "1",
    title: "Summer Collection",
    subtitle: "Light & Breezy",
    image: "https://images.unsplash.com/photo-1714046298190-7c33737ddc94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VtbWVyJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjgyNDQzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/products?category=Summer",
  },
  {
    id: "2",
    title: "Winter Collection",
    subtitle: "Cozy & Elegant",
    image: "https://i.pinimg.com/736x/b1/74/e6/b174e6c73b4b9061bb7fff4a90b55032.jpg",
    link: "/products?category=Winter",
  },
  {
    id: "3",
    title: "Wedding Special",
    subtitle: "Bridal & Festive",
    image: "https://bharatreshma.com/cdn/shop/files/3680_26920_1713530289_1.jpg?v=1714674792",
    link: "/products?category=Wedding",
  },
  {
    id: "4",
    title: "Streetwear",
    subtitle: "Urban & Casual",
    image: "https://images.unsplash.com/photo-1599681906238-c4f97c8b4454?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzdHJlZXR3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgxODE1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/products?category=Casual",
  },
  {
    id: "5",
    title: "Luxury Formal",
    subtitle: "Premium & Sophisticated",
    image: "https://images.unsplash.com/photo-1761164920874-b3bc052f6473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZm9ybWFsfGVufDF8fHx8MTc2ODI4MjA1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/products?category=Formal",
  },
  {
    id: "6",
    title: "Traditional Wear",
    subtitle: "Ethnic & Timeless",
    image: "https://www.outfittrends.com/wp-content/uploads/2021/02/9-Indian-Summer-Wedding-Guest-Outfits.jpg.webp",
    link: "/products?category=Traditional",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 0.8,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.15,
    rotate: 2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

const overlayVariants = {
  hover: {
    opacity: 0.95,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

const contentVariants = {
  hover: {
    y: -12,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.2,
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.3,
    },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      delay: 0.4,
    },
  },
  hover: {
    x: 5,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export function PhotoCollections() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Explore Our Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.4,
            }}
            className="text-gray-600 text-lg"
          >
            Discover curated styles for every occasion
          </motion.p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {collections.map((collection, index) => (
            <motion.a
              key={collection.id}
              href={collection.link}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image with parallax effect */}
              <motion.div
                variants={imageVariants}
                className="w-full h-full"
              >
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <motion.div
                variants={overlayVariants}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"
              />

              {/* Content */}
              <motion.div
                variants={contentVariants}
                className="absolute inset-0 flex flex-col justify-end p-6 text-white"
              >
                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  variants={subtitleVariants}
                  viewport={{ once: true }}
                  className="text-sm font-medium mb-1 tracking-wider uppercase opacity-90"
                >
                  {collection.subtitle}
                </motion.p>
                <motion.h3
                  initial="hidden"
                  whileInView="visible"
                  variants={titleVariants}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  {collection.title}
                </motion.h3>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  variants={ctaVariants}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <span>Shop Now</span>
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Hover Border Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-lg pointer-events-none"
              />

              {/* Corner Accent Animation */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                whileHover={{ width: 40, height: 40 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 right-0 border-t-2 border-r-2 border-white/0 group-hover:border-white/50 rounded-tr-lg"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                whileHover={{ width: 40, height: 40 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-white/0 group-hover:border-white/50 rounded-bl-lg"
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/products"
            className="inline-flex items-center gap-2 text-lg font-semibold hover:underline"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            View All Collections
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}