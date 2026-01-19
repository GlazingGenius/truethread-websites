import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface NikeHeroProps {
  onShopNow: () => void;
}

export function NikeHero({ onShopNow }: NikeHeroProps) {
  return (
    <div className="relative w-full">
      {/* Main Hero with Video */}
      <div className="relative h-[600px] md:h-[700px] lg:h-[750px] overflow-hidden bg-black">
        {/* Vimeo Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://player.vimeo.com/video/1155452520?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="absolute"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw', /* 16:9 Aspect Ratio */
              minHeight: '100%',
              minWidth: '177.77vh', /* 16:9 Aspect Ratio */
              transform: 'translate(-50%, -50%)',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full mb-8 shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-base font-medium">Premium Collection 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
              style={{ 
                fontFamily: 'Bodoni Moda, serif',
              }}
            >
              DEFINE YOUR
              <br />
              STYLE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-10"
              style={{ fontFamily: 'Alumni Sans, sans-serif' }}
            >
              Experience the art of premium hand-stitched fashion
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-5"
            >
              <Button
                onClick={onShopNow}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-full px-10 py-7 text-lg font-semibold shadow-lg transition-all duration-300 group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                onClick={onShopNow}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white/20 rounded-full px-10 py-7 text-lg font-semibold transition-all duration-300"
              >
                Explore Collection
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 py-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm md:text-base font-medium text-white"
        >
          New Arrivals • Free Shipping on Orders Over ₹2,000 • Premium Quality
        </motion.p>
      </div>
    </div>
  );
}