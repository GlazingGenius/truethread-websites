import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Play } from "lucide-react";

interface NikeVideoSectionProps {
  onShopNow?: () => void;
}

export function NikeVideoSection({ onShopNow }: NikeVideoSectionProps) {
  return (
    <section className="relative w-full bg-black">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Crafted With Precision
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
            Experience the art of hand-stitched fashion. Every thread tells a story of dedication and craftsmanship.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Vimeo Video Embed */}
          <iframe
            src="https://player.vimeo.com/video/1152487944?autoplay=1&loop=1&title=0&byline=0&portrait=0&muted=1&background=1"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Craftsmanship Video"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Button
            onClick={onShopNow}
            size="default"
            className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-medium group"
          >
            Explore Collection
            <Play className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">100%</div>
            <p className="text-gray-300 text-xs md:text-sm">Hand-Stitched</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">Premium</div>
            <p className="text-gray-300 text-xs md:text-sm">Fabric</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">Artisan</div>
            <p className="text-gray-300 text-xs md:text-sm">Craftsmanship</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}