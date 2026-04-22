"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductById } from "@/lib/firestore";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      const saved = localStorage.getItem("wishlist");
      if (!saved) {
        setLoading(false);
        return;
      }

      const ids: string[] = JSON.parse(saved);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productPromises = ids.map(id => getProductById(id).catch(() => null));
        const results = await Promise.all(productPromises);
        setProducts(results.filter(p => p !== null) as Product[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated.map(p => p.id)));
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px]">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="flex items-center gap-3 mb-10 border-b pb-4">
          <Heart className="w-8 h-8 text-brand-primary fill-brand-primary" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">My Wishlist</h1>
          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-bold ml-auto">
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[2/3] bg-gray-100 animate-pulse rounded-sm"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 border rounded-lg max-w-2xl mx-auto">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Found something you like? Click the heart icon on any product to save it here for later.</p>
            <Link href="/shop">
              <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-8 py-6 rounded-none tracking-wide">
                Start Exploring
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="relative group animate-in fade-in">
                <ProductCard product={product} />
                <button 
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                  className="absolute top-2 left-2 z-30 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-colors"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
