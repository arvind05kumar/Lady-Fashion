import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Saree Store";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <footer className="bg-brand-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo1.png"
                alt="The Lady Fashion"
                width={56}
                height={56}
                className="object-contain h-14 w-14 rounded-full"
              />
              <h2 className="font-serif text-2xl font-bold text-brand-gold">The Lady Fashion</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Discover handpicked sarees for every occasion — from timeless silks to festive weaves. Elegance woven in every thread.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Center Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-brand-gold"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-brand-gold transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-brand-gold"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-brand-gold mr-4 flex-shrink-0 mt-1" />
                <span className="text-sm text-gray-400">123 Fashion Street, Silk Arcade<br />Boutique Hub, India 400001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-brand-gold mr-4 flex-shrink-0" />
                <span className="text-sm text-gray-400">+{whatsappNumber}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-brand-gold mr-4 flex-shrink-0" />
                <span className="text-sm text-gray-400">hello@sareestore.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with ❤️ by <a href="https://wa.me/919501303799" className="text-brand-gold">Arvind Kumar</a></p>
        </div>
      </div>
    </footer>
  );
}
