"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getNewArrivals } from "@/lib/firestore";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getNewArrivals();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px]">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 text-brand-gold mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm font-bold">Latest Collection</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4">New Arrivals</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">Fresh sarees added just for you — handpicked weaves for the upcoming season.</p>
          <div className="w-24 h-1 bg-brand-gold mx-auto mt-8"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="aspect-[2/3] bg-gray-100 animate-pulse rounded-sm"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 border rounded-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">Stay tuned!</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Our weavers are working on beautiful new collections. New arrivals coming very soon.</p>
            <Link href="/shop">
              <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-8 py-6 rounded-none tracking-wide">
                Shop All Sarees
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(product => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
