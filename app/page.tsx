"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, CheckCircle2, ShieldCheck, HeartHandshake, MessageCircle, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { getAllCategories, getFeaturedProducts, getNewArrivals } from "@/lib/firestore";
import { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, featured, newProds] = await Promise.all([
          getAllCategories(),
          getFeaturedProducts(),
          getNewArrivals()
        ]);
        setCategories(cats.filter(c => c.isActive));
        setFeaturedProducts(featured.slice(0, 8));
        setNewArrivals(newProds.slice(0, 6));
      } catch (e) {
        console.error("Failed to fetch home data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[104px] lg:pt-[116px]">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[calc(100vh-104px)] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image src="/hero-banner.jpg" alt="Saree Collection Banner" fill priority className="object-cover object-center" sizes="100vw" />
            {/* Gradient Overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-0">
            <div className="max-w-2xl text-left space-y-6 lg:space-y-8">
              <div className="inline-block px-4 py-1.5 border border-brand-gold/50 rounded-full bg-brand-dark/40 backdrop-blur-sm shadow-sm text-brand-gold text-xs font-bold tracking-widest uppercase">
                ✨ New Collection 2024
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Elegance Woven <br className="hidden md:block"/>
                in Every <span className="text-brand-gold relative inline-block">Thread<span className="absolute bottom-2 left-0 w-full h-2 bg-brand-gold/30 -z-10"></span></span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 max-w-lg font-light leading-relaxed">
                Discover handpicked sarees for every occasion — from timeless silks to festive weaves.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/shop">
                  <Button className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-light text-brand-dark rounded-none px-8 py-6 text-base font-semibold tracking-wide">
                    Explore Collection
                  </Button>
                </Link>
                <Link href="/shop?sort=new">
                  <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-dark rounded-none px-8 py-6 text-base font-semibold tracking-wide backdrop-blur-sm bg-white/10">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 hidden md:block text-brand-gold">
            <ArrowDown className="w-8 h-8 opacity-70" />
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-brand-cream border-y border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-brand-gold/20">
              <div className="px-2">
                <div className="text-xl font-bold text-brand-primary mb-1">🎁 500+</div>
                <div className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Sarees</div>
              </div>
              <div className="px-2">
                <div className="text-xl font-bold text-brand-primary mb-1">🌟 50+</div>
                <div className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Categories</div>
              </div>
              <div className="px-2 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-xl font-bold text-brand-primary mb-1">✅ 100%</div>
                <div className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Authentic</div>
              </div>
              <div className="px-2 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-xl font-bold text-brand-primary mb-1">🚀 Fast</div>
                <div className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">Shop by Category</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mt-4"></div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(n => <div key={n} className="aspect-square bg-gray-100 animate-pulse rounded-sm"></div>)}
              </div>
            ) : (
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
                <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-4 md:gap-6 min-w-max md:min-w-0">
                  {categories.slice(0, 8).map(cat => (
                    <div key={cat.id} className="w-64 md:w-auto">
                      <CategoryCard category={cat} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">Our Bestsellers</h2>
              <div className="w-full flex items-center justify-center max-w-md">
                <div className="flex-1 h-px bg-brand-gold/30"></div>
                <div className="mx-4 text-brand-gold">✦</div>
                <div className="flex-1 h-px bg-brand-gold/30"></div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[2/3] bg-gray-200 animate-pulse rounded-sm"></div>)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {featuredProducts.length > 0 ? (
                    featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
                  ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">No products found.</div>
                  )}
                </div>
                {featuredProducts.length > 0 && (
                  <div className="text-center mt-12">
                    <Link href="/shop?featured=true">
                      <Button variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-none px-8 py-6 text-sm tracking-widest uppercase">
                        View All Bestsellers
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* PROMOTIONAL BANNER */}
        <section className="bg-brand-dark text-brand-gold relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 py-20 lg:py-24 relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-2xl text-center md:text-left mb-8 md:mb-0">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-white">Festive Season Special</h2>
              <p className="text-xl lg:text-2xl text-brand-gold-light mb-8 font-light">Flat 20% off on all Banarasi Silk Sarees</p>
              <Link href="/shop?category=banarasi">
                <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark rounded-none px-10 py-6 text-lg font-bold">
                  Shop Now
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-white/10 p-4 border border-brand-gold/30 rounded">
              <div className="w-full h-full border border-dashed border-brand-gold/50 flex flex-col items-center justify-center p-4 text-center">
                <span className="font-serif text-xl">✨ New Collection</span><br/>
                <span className="text-sm opacity-80">(Dynamic banners coming soon)</span>
              </div>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">Just Arrived</h2>
              <Link href="/shop?sort=new" className="text-sm font-semibold text-brand-primary uppercase tracking-widest hover:underline whitespace-nowrap ml-4">
                View All &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3].map(n => <div key={n} className="aspect-[2/3] bg-gray-100 animate-pulse rounded-sm"></div>)}
              </div>
            ) : (
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-6 scrollbar-hide">
                {newArrivals.map(product => (
                  <div key={product.id} className="w-64 flex-shrink-0 md:w-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="bg-brand-cream py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-sm shadow-sm text-center border border-brand-gold/10 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 mx-auto bg-brand-gold/10 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="font-bold text-lg mb-3">Handpicked Collection</h3>
                <p className="text-gray-600 text-sm">Every saree is carefully selected for uncompromised quality and absolute beauty.</p>
              </div>

              <div className="bg-white p-8 rounded-sm shadow-sm text-center border border-brand-gold/10 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 mx-auto bg-brand-gold/10 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="font-bold text-lg mb-3">Pure Fabrics</h3>
                <p className="text-gray-600 text-sm">We source only authentic, high-quality fabrics directly from trusted weavers.</p>
              </div>

              <div className="bg-white p-8 rounded-sm shadow-sm text-center border border-brand-gold/10 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 mx-auto bg-brand-gold/10 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="font-bold text-lg mb-3">Safe Packaging</h3>
                <p className="text-gray-600 text-sm">Your sarees arrive perfectly folded securely, protected from any transit damage.</p>
              </div>

              <div className="bg-white p-8 rounded-sm shadow-sm text-center border border-brand-gold/10 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 mx-auto bg-brand-gold/10 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="font-bold text-lg mb-3">WhatsApp Support</h3>
                <p className="text-gray-600 text-sm">Order easily and securely via WhatsApp, we're always here to assist you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">What Our Customers Say</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Priya Sharma", city: "Mumbai", quote: "The Banarasi silk saree I received is absolutely gorgeous. The quality is premium and the WhatsApp ordering process was so smooth!" },
                { name: "Ananya Desai", city: "Ahmedabad", quote: "I was hesitant to buy expensive sarees online, but their authentic collection proved me wrong. Will definitely shop again for the next festival." },
                { name: "Kavita Reddy", city: "Hyderabad", quote: "Incredible customer service. They sent extra photos via WhatsApp before I confirmed my order. The Kanjivaram saree exceeded my expectations." }
              ].map((t, i) => (
                <div key={i} className="bg-[#FAF7F2] p-8 rounded relative">
                  <div className="text-brand-gold text-4xl font-serif absolute top-4 left-4 opacity-20">"</div>
                  <div className="flex text-brand-gold mb-4 relative z-10">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-700 italic mb-6 relative z-10 leading-relaxed text-sm lg:text-base">"{t.quote}"</p>
                  <div className="font-bold text-brand-primary uppercase text-sm tracking-wider">{t.name}</div>
                  <div className="text-xs text-gray-500 uppercase">{t.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
