import { motion } from "motion/react";
import { Sparkles, Shield, Truck, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Hand-Selected",
    description: "Each piece is carefully curated for quality and style"
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Hand-stitched with attention to every detail"
  },
  {
    icon: Truck,
    title: "Pre-Book Available",
    description: "Reserve your favorites even when out of stock"
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "Crafted by skilled artisans with passion"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of traditional craftsmanship and modern design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-pink-600 rounded-full mb-4"
                >
                  <Icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
