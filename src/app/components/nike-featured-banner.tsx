import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";

interface NikeFeaturedBannerProps {
  onShopClick: () => void;
}

export function NikeFeaturedBanner({ onShopClick }: NikeFeaturedBannerProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Large Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] md:h-[600px] overflow-hidden rounded-none"
        >
          {/* Vimeo Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <iframe
              src="https://player.vimeo.com/video/1153932944?autoplay=1&loop=1&muted=1&background=1&controls=0"
              className="w-full h-full object-cover"
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '100vh',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="Premium Collection Video"
            />
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <div className="text-center text-white max-w-2xl px-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base font-medium mb-2 tracking-wider"
              >
                HANDCRAFTED EXCELLENCE
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Premium Collection
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl mb-8"
              >
                Experience the perfect blend of style and craftsmanship
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onShopClick}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-8 font-medium"
                >
                  Shop Collection
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { title: "Free Shipping", desc: "On orders over ₹2,000" },
            { title: "Easy Returns", desc: "Within 30 days" },
            { title: "Secure Payment", desc: "Safe and protected" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 text-center"
            >
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}