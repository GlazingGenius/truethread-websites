import { motion } from "motion/react";

export function TrueThreadLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon/Monogram - Smaller */}
      <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
        {/* Outer circle */}
        <div className="absolute inset-0 border-2 border-black rounded-full"></div>
        {/* Thread needle icon - stylized */}
        <svg className="absolute inset-0 w-full h-full p-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Needle */}
          <path d="M6 12 L18 12 M12 6 L12 18" strokeLinecap="round"/>
          {/* Thread curve */}
          <path d="M15 9 Q18 12 15 15" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      
      {/* Text - Compact */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>
          <span className="text-lg md:text-xl font-bold tracking-tight">TRUE</span>
          <span className="text-lg md:text-xl font-bold tracking-tight">THREAD</span>
        </div>
        <div 
          className="text-[8px] md:text-[9px] tracking-[0.2em] mt-0.5 text-gray-500 uppercase font-medium" 
          style={{ fontFamily: "'Alumni Sans', sans-serif" }}
        >
          Wear What's Real
        </div>
      </div>
    </div>
  );
}