import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
      <div className="text-center max-w-lg mx-auto bg-white p-10 md:p-16 rounded-lg shadow-xl border border-brand-gold/20">
        
        {/* Simple CSS Mandala/Flower Decorative Element */}
        <div className="w-24 h-24 mx-auto mb-8 relative opacity-80 animate-[spin_40s_linear_infinite]">
          <div className="absolute inset-0 bg-brand-gold opacity-20 rounded-full scale-110"></div>
          <div className="absolute inset-0 rotate-0">
            <div className="w-full h-full border-4 border-brand-primary rounded-[40%]"></div>
          </div>
          <div className="absolute inset-0 rotate-45">
            <div className="w-full h-full border-4 border-brand-primary rounded-[40%]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-brand-gold"></div>
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-brand-dark mb-4">404</h1>
        <h2 className="font-serif text-2xl font-bold text-brand-primary mb-3">Oh dear! Page not found</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          It seems the page or saree you are looking for has been woven into a different thread or is currently lost in our archives.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto border-brand-gold text-brand-dark hover:bg-brand-gold hover:text-white px-8 py-6 rounded-none font-bold">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-light text-white px-8 py-6 rounded-none font-bold">
              Browse Sarees
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
