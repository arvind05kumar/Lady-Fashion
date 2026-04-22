"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      const wishlist = JSON.parse(saved);
      if (wishlist.includes(product.id)) {
        setIsWishlisted(true);
      }
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let wishlist: string[] = [];
    const saved = localStorage.getItem("wishlist");
    if (saved) wishlist = JSON.parse(saved);
    
    if (isWishlisted) {
      wishlist = wishlist.filter(id => id !== product.id);
    } else {
      wishlist.push(product.id);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const discountMatch = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="group relative flex flex-col items-center w-full">
      <Link href={`/product/${product.id}`} className="w-full relative aspect-[2/3] overflow-hidden bg-gray-100 rounded-sm block">
        <Image 
          src={product.images?.[0] || "https://picsum.photos/seed/placeholder/600/900"} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Overlays */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-black/80 text-white text-xs font-bold px-3 py-1 tracking-widest uppercase">Sold Out</span>
          </div>
        )}

        {/* Badges */}
        {product.isNewArrival && product.isAvailable && (
          <div className="absolute top-2 left-2 bg-brand-gold text-brand-dark text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">
            New
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur hover:bg-white rounded-full text-gray-600 transition-all z-20 shadow-sm"
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-brand-primary text-brand-primary' : 'hover:text-brand-primary'}`} />
        </button>

        {/* Quick View CTA (appears on hover) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="bg-white/95 backdrop-blur-sm text-brand-dark font-medium text-xs uppercase tracking-widest py-3 text-center border shadow-lg">
            View Details
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="w-full mt-4 text-center space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-widest">{product.categoryName}</p>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-brand-primary transition-colors text-sm md:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center space-x-2 mt-1">
          <span className="font-bold text-brand-primary">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-green-600">({discountMatch}% OFF)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
