import { getProductById, getProductsByCategory, getFeaturedProducts } from "@/lib/firestore";
import { Product } from "@/lib/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Saree Store";
    return {
      title: `${product.name} | ${storeName}`,
      description: product.description.substring(0, 150) + "...",
      openGraph: {
        images: product.images[0] ? [product.images[0]] : [],
      }
    };
  } catch (e) {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product;
  try {
    product = await getProductById(id);
  } catch (e) {
    notFound();
  }

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  
  // Fetch related products
  let relatedProducts: Product[] = [];
  try {
    const catProducts = await getProductsByCategory(product.categoryId);
    relatedProducts = catProducts.filter(p => p.id !== id).slice(0, 4);
    if (relatedProducts.length === 0) {
      const featured = await getFeaturedProducts();
      relatedProducts = featured.filter(p => p.id !== id).slice(0, 4);
    }
  } catch (e) {}

  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px] bg-white">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32 lg:pb-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide py-1">
          <Link href="/" className="hover:text-brand-primary">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/shop" className="hover:text-brand-primary">Shop</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/shop?category=${product.slug}`} className="hover:text-brand-primary">{product.categoryName}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%]">
            <ImageGallery images={product.images} isAvailable={product.isAvailable} isNewArrival={product.isNewArrival} />
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-0">
            <Link href={`/shop?category=${product.slug}`} className="text-sm uppercase tracking-widest text-brand-primary font-bold mb-2 hover:underline">
              {product.categoryName}
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-dark font-bold mb-4">{product.name}</h1>
            
            {/* Stars */}
            <div className="flex text-brand-gold mb-6">
              {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
              <span className="text-gray-400 text-sm ml-2.5 translate-y-0.5">(Review coming soon)</span>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 mb-8">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-brand-primary">₹{product.price.toLocaleString('en-IN')}</span>
                {product.mrp > product.price && (
                  <span className="text-lg text-gray-400 line-through mb-1">₹{product.mrp.toLocaleString('en-IN')}</span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 mb-1.5 ml-2 uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Inclusive of all taxes</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {product.isAvailable ? (
                    <span className="text-sm font-bold text-gray-800">In Stock</span>
                  ) : (
                    <span className="text-sm font-bold text-red-600">Currently Sold Out</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6 mb-10 text-sm border-t border-b py-6">
              <h3 className="font-bold text-base uppercase tracking-wider mb-4 border-l-4 border-brand-gold pl-3">Saree Details</h3>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Fabric</span>
                <span className="col-span-2 font-medium text-gray-900">{product.fabric || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Blouse</span>
                <span className="col-span-2 font-medium text-gray-900">{product.blouseDetails || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Occasion</span>
                <div className="col-span-2 flex flex-wrap gap-1.5">
                  {product.occasion?.map(occ => (
                    <span key={occ} className="bg-gray-100 px-2 py-0.5 text-xs text-gray-700 rounded-sm border border-gray-200">{occ}</span>
                  ))}
                </div>
              </div>
              {product.color && product.color.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Color</span>
                  <span className="col-span-2 font-medium text-gray-900 capitalize">{product.color.join(", ")}</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
                  <span className="text-gray-500">Tags</span>
                  <div className="col-span-2 flex flex-wrap gap-1.5">
                    {product.tags.map(tag => (
                      <Link key={tag} href={`/shop`} className="text-brand-primary lowercase bg-brand-primary/5 hover:bg-brand-primary/10 px-2 py-0.5 text-xs rounded-sm transition-colors border border-brand-primary/10">#{tag}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {product.careInstructions && (
              <div className="mb-10 text-sm bg-brand-cream/50 p-6 rounded-sm border border-brand-gold/10">
                <h3 className="font-bold text-brand-dark mb-2 uppercase tracking-wider">Care Instructions</h3>
                <p className="text-gray-600 leading-relaxed">{product.careInstructions}</p>
              </div>
            )}

            {/* Actions */}
            <div className="hidden lg:block">
              <WhatsAppButton number={number} product={product} />
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t pt-16 border-gray-100">
            <h2 className="font-serif text-3xl font-bold text-center mb-10">You May Also Like</h2>
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-6 scrollbar-hide">
              {relatedProducts.map(p => (
                <div key={p.id} className="w-64 flex-shrink-0 md:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Sticky Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
        <div className="flex-1 shrink-0">
          <div className="text-xs text-gray-500 uppercase">Total Price</div>
          <div className="font-bold text-lg text-brand-primary">₹{product.price.toLocaleString('en-IN')}</div>
        </div>
        <div className="w-[60%] flex-shrink-0 max-w-[250px]">
          <WhatsAppButton number={number} product={product} />
        </div>
      </div>
    </div>
  );
}
