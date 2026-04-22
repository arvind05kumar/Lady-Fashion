"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getAllCategories } from "@/lib/firestore";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, ChevronDown } from "lucide-react";

const FABRICS = ["Silk", "Cotton", "Georgette", "Banarasi", "Chiffon", "Linen", "Chanderi", "Net", "Crepe"];
const OCCASIONS = ["Wedding", "Festival", "Casual", "Party", "Daily Wear", "Office"];
const COLORS = [
  { name: "Red", hex: "#EF4444" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Gold", hex: "#D4AF37" }
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([getAllCategories(), getAllProducts()]);
        setCategories(cats.filter(c => c.isActive));
        setAllProducts(prods);
        
        // Parse URL params
        const catParam = searchParams.get("category");
        if (catParam) {
          const cat = cats.find(c => c.slug === catParam);
          if (cat) setSelectedCats([cat.id]);
        }
        
        const sortParam = searchParams.get("sort");
        if (sortParam) {
          setSortBy(sortParam);
        }

        const featParam = searchParams.get("featured");
        if (featParam === "true") {
          setSortBy("featured");
        }

        const searchParam = searchParams.get("search");
        if (searchParam) {
          setSearchQuery(searchParam);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update URL params when category filter changes (for shareable links)
  // We'll keep it simple: just update main category for URL
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCats.length === 1) {
      const cat = categories.find(c => c.id === selectedCats[0]);
      if (cat) params.set("category", cat.slug);
    } else {
      params.delete("category");
    }
    
    // We update without reloading the page
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }, [selectedCats, loading]);

  const toggleArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCats([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedColors([]);
    setOnlyAvailable(false);
    setMaxPrice(50000);
    setSearchQuery("");
    router.replace(`/shop`, { scroll: false });
  };

  const filteredProducts = allProducts.filter(p => {
    if (selectedCats.length > 0 && !selectedCats.includes(p.categoryId)) return false;
    if (selectedFabrics.length > 0 && (!p.fabric || !selectedFabrics.some(f => p.fabric.toLowerCase().includes(f.toLowerCase())))) return false;
    if (selectedOccasions.length > 0 && (!p.occasion || !selectedOccasions.some(o => p.occasion.includes(o)))) return false;
    
    // Color check
    if (selectedColors.length > 0) {
      if (!p.color || p.color.length === 0) return false;
      const productColors = p.color.map(c => c.toLowerCase());
      const hasColorMatch = selectedColors.some(c => productColors.some(pc => pc.includes(c.toLowerCase())));
      if (!hasColorMatch) return false;
    }
    
    if (onlyAvailable && !p.isAvailable) return false;
    if (p.price > maxPrice) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || 
                          (p.fabric && p.fabric.toLowerCase().includes(q)) || 
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
      if (!matchSearch) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "featured") return (a.isFeatured === b.isFeatured) ? 0 : a.isFeatured ? -1 : 1;
    // newest default
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const activeFiltersCount = selectedCats.length + selectedFabrics.length + selectedOccasions.length + selectedColors.length + (onlyAvailable ? 1 : 0) + (maxPrice < 50000 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-4 flex items-center justify-between">
          Categories 
          {selectedCats.length > 0 && <span className="text-xs bg-brand-gold/20 text-brand-dark px-2 rounded">{selectedCats.length}</span>}
        </h3>
        <div className="space-y-3">
          {categories.map(c => (
            <div key={c.id} className="flex items-center space-x-2 border-b border-gray-100 pb-2">
              <Checkbox id={`cat-${c.id}`} checked={selectedCats.includes(c.id)} onCheckedChange={() => toggleArrayItem(selectedCats, setSelectedCats, c.id)} />
              <label htmlFor={`cat-${c.id}`} className="text-sm cursor-pointer w-full">{c.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 flex items-center justify-between">Fabric</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
          {FABRICS.map(f => (
            <div key={f} className="flex items-center space-x-2">
              <Checkbox id={`fab-${f}`} checked={selectedFabrics.includes(f)} onCheckedChange={() => toggleArrayItem(selectedFabrics, setSelectedFabrics, f)} />
              <label htmlFor={`fab-${f}`} className="text-sm cursor-pointer w-full text-gray-700">{f}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 flex items-center justify-between">Price Range</h3>
        <div className="space-y-4">
          <input 
            type="range" 
            min="0" max="50000" step="1000" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-gold"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹0</span>
            <span className="font-bold text-brand-primary">Up to ₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 flex items-center justify-between">Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(c => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => toggleArrayItem(selectedColors, setSelectedColors, c.name.toLowerCase())}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColors.includes(c.name.toLowerCase()) ? 'border-brand-primary scale-110 shadow-md ring-2 ring-brand-primary/20' : 'border-gray-200 hover:scale-105'}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 flex items-center justify-between">Occasion</h3>
        <div className="space-y-3">
          {OCCASIONS.map(o => (
            <div key={o} className="flex items-center space-x-2">
              <Checkbox id={`occ-${o}`} checked={selectedOccasions.includes(o)} onCheckedChange={() => toggleArrayItem(selectedOccasions, setSelectedOccasions, o)} />
              <label htmlFor={`occ-${o}`} className="text-sm cursor-pointer w-full text-gray-700">{o}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 border rounded">
        <label htmlFor="avail-toggle" className="text-sm font-bold cursor-pointer">In Stock Only</label>
        <Switch id="avail-toggle" checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
      </div>

      {activeFiltersCount > 0 && (
        <Button onClick={clearAllFilters} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px]">
      <Navbar />
      
      {/* Mobile Sticky Filter/Sort Bar */}
      <div className="lg:hidden sticky top-[104px] z-30 bg-white border-b shadow-sm w-full p-4 flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setIsMobileFilterOpen(true)} 
          className="flex-1 flex justify-center gap-2"
        >
          <Filter className="w-4 h-4" /> 
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
        <Select value={sortBy} onValueChange={(val) => setSortBy(val || "newest")}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8 relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-[140px] h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-hide pb-10">
          <FilterPanel />
        </aside>

        {/* Mobile Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden flex flex-col justify-end">
            <div className="bg-white w-full h-[85vh] rounded-t-2xl flex flex-col relative animate-in slide-in-from-bottom-full duration-300">
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <FilterPanel />
              </div>
              <div className="p-4 border-t sticky bottom-0 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-brand-primary text-white py-6 text-lg">
                  Show {sortedProducts.length} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {searchQuery && (
            <div className="mb-6 flex justify-between items-center bg-brand-gold/10 p-4 rounded text-sm text-brand-dark">
              <span>Showing results for: <span className="font-bold">"{searchQuery}"</span></span>
              <button 
                onClick={() => { setSearchQuery(""); const p = new URLSearchParams(searchParams.toString()); p.delete("search"); router.replace(`/shop?${p.toString()}`, {scroll: false}) }}
                className="text-gray-500 hover:text-red-500 tracking-wider text-xs uppercase"
              >
                Clear Search &times;
              </button>
            </div>
          )}
          {/* Header & Desktop Sort */}
          <div className="mb-8 block lg:flex justify-between items-end border-b pb-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-brand-dark">Shop Sarees</h1>
              <p className="text-gray-500 mt-2">Showing {sortedProducts.length} product{sortedProducts.length !== 1 && 's'}</p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val || "newest")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">New Arrivals First</SelectItem>
                  <SelectItem value="featured">Bestsellers</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="aspect-[2/3] bg-gray-100 animate-pulse rounded-sm"></div>)}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No sarees found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
              <Button onClick={clearAllFilters} variant="outline" className="border-brand-primary text-brand-primary">Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {sortedProducts.map(product => (
                <div key={product.id} className="animate-in fade-in duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
