"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  isAvailable: boolean;
  isNewArrival: boolean;
}

export default function ImageGallery({ images, isAvailable, isNewArrival }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[activeIndex] || "https://picsum.photos/seed/placeholder/800/1200";

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image */}
      <div className="flex-1 relative aspect-[2/3] bg-gray-100 rounded overflow-hidden cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
        <Image 
          src={activeImage} 
          alt="Product" 
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover" 
        />

        {/* Badges */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
            <span className="bg-black/80 text-white text-sm font-bold px-4 py-2 tracking-widest uppercase">Sold Out</span>
          </div>
        )}
        
        {isNewArrival && isAvailable && (
          <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1.5 uppercase tracking-wider z-10 pointer-events-none">
            New Arrival
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide py-1 md:w-24 flex-shrink-0">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${idx === activeIndex ? "border-brand-gold scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image src={img} alt={`Thumbnail ${idx+1}`} fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={() => setIsLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2" onClick={() => setIsLightboxOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          
          <button className="absolute left-4 md:left-10 text-white/50 hover:text-white p-4" onClick={prevImage}>
            <ChevronLeft className="w-12 h-12" />
          </button>
          
          <div className="relative w-full h-[90vh] max-w-4xl mx-auto flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={activeImage} 
              alt="Product Fullscreen" 
              fill
              className="object-contain" 
            />
          </div>
          
          <button className="absolute right-4 md:right-10 text-white/50 hover:text-white p-4" onClick={nextImage}>
            <ChevronRight className="w-12 h-12" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
