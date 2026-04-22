"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Heart, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getAllProducts } from "@/lib/firestore";
import { Product } from "@/lib/types";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update wishlist count consistently
  const updateWishlistCount = () => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setWishlistCount(JSON.parse(saved).length);
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateWishlistCount();
    // In case wishlist is updated in same window without 'storage' event:
    const interval = setInterval(updateWishlistCount, 2000);
    return () => clearInterval(interval);
  }, [pathname]);

  // Load products for search once when search is toggled
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      getAllProducts().then(setAllProducts).catch(console.error);
    }
  }, [isSearchOpen, allProducts.length]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
      setSearchResults(results.slice(0, 5)); // max 5 results
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Marquee Ticker */}
      <div className="bg-brand-gold text-brand-dark py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] inline-block font-medium text-xs md:text-sm tracking-wide">
          ✨ New Arrivals Every Week  •  100% Authentic Handpicked Sarees  •  Free Shipping on Orders Above ₹999  ✨
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ✨ New Arrivals Every Week  •  100% Authentic Handpicked Sarees  •  Free Shipping on Orders Above ₹999  ✨
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 w-full relative ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white/95 py-4 lg:py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden relative z-20">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-brand-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 relative z-20">
            <Image
              src="/logo1.png"
              alt="The Lady Fashion"
              width={48}
              height={48}
              className="object-contain h-12 w-12 rounded-full"
              priority
            />
            <span className="font-serif text-xl md:text-2xl font-bold text-brand-gold leading-tight">
              The Lady Fashion
            </span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <div className="hidden lg:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-800 hover:text-brand-primary transition-colors uppercase tracking-wider relative group"
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 relative z-20">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-800 hover:text-brand-primary transition-colors"
              aria-label="Search"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <Link href="/wishlist" className="text-gray-800 hover:text-brand-primary transition-colors relative" aria-label="Wishlist">
              <Heart className="w-5 h-5 flex-shrink-0" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 origin-top overflow-hidden z-0
          ${isSearchOpen ? 'opacity-100 max-h-[500px] border-b' : 'opacity-0 max-h-0 pointer-events-none'}`}>
          <div className="max-w-3xl mx-auto p-4 md:p-6">
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sarees, fabrics, colors..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all font-medium text-brand-dark"
              />
            </form>

            <div className="space-y-2">
              {searchQuery.trim() === "" ? (
                <div className="text-sm text-gray-500 text-center py-4">Start typing to search across our collection.</div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3 px-2">Top Results</div>
                  {searchResults.map(product => (
                    <Link key={product.id} href={`/product/${product.id}`} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded transition-colors group">
                      <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                        <img src={product.images[0] || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 group-hover:text-brand-primary transition-colors text-sm line-clamp-1">{product.name}</h4>
                        <div className="text-xs text-gray-500">{product.categoryName}</div>
                      </div>
                      <div className="font-bold text-brand-dark text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </Link>
                  ))}
                  <button onClick={handleSearchSubmit} className="w-full text-center py-3 mt-2 text-sm font-bold text-brand-primary hover:text-brand-primary-light hover:underline">
                    View all results for "{searchQuery}" &rarr;
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  No products found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 flex justify-between items-center border-b pt-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="The Lady Fashion" width={40} height={40} className="object-contain h-10 w-10 rounded-full" />
              <h2 className="font-serif text-xl font-bold text-brand-gold">The Lady Fashion</h2>
            </div>
          </div>
          <div className="py-6 px-5 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-gray-800 hover:text-brand-primary uppercase tracking-wider block"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
