"use client";

import { MessageCircle, Share, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function WhatsAppButton({ number, product, mode = "full" }: { number: string; product?: Product; mode?: "full" | "order" | "actions" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Floating Mode handling
  if (!product) {
    const defaultUrl = `https://wa.me/${number}?text=${encodeURIComponent("Hi! I would like to know more about your sarees")}`;
    return (
      <a
        href={defaultUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat on WhatsApp"
      >
        <div className={`
          bg-white text-green-600 font-medium px-4 py-2 rounded-full shadow-lg mr-3 
          transition-all duration-300 origin-right
          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-x-4 pointer-events-none'}
        `}>
          Chat with us!
        </div>
        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      </a>
    );
  }

  // Inline Product Mode handling
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      if (JSON.parse(saved).includes(product.id)) {
        setIsWishlisted(true);
      }
    }
  }, [product.id]);

  const toggleWishlist = () => {
    let wishlist: string[] = [];
    const saved = localStorage.getItem("wishlist");
    if (saved) wishlist = JSON.parse(saved);

    if (isWishlisted) {
      wishlist = wishlist.filter(id => id !== product.id);
      toast.success("Removed from wishlist");
    } else {
      wishlist.push(product.id);
      toast.success("Saved to wishlist ♥");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Saree Store`,
      text: `Check out this beautiful ${product.fabric} saree!`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const handleOrder = () => {
    const productUrl = window.location.href;
    const discountPercent = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    const message = `🛍️ *Order Inquiry — ${product.name}*

Hello! I'm interested in ordering this saree:

📌 *Product:* ${product.name}
🏷️ *Category:* ${product.categoryName}
🎨 *Fabric:* ${product.fabric}
💰 *Price:* ₹${product.price} _(MRP: ₹${product.mrp} — ${discountPercent}% OFF)_
🎭 *Occasion:* ${product.occasion?.join(", ")}

🔗 *Product Link:* ${productUrl}

Please confirm availability and share payment details. Thank you! 🙏`.trim();

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const ActionsLayout = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Button onClick={handleShare} variant="outline" className="w-full py-6 text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 flex items-center justify-center gap-2">
        <Share className="w-4 h-4" />
        Share
      </Button>
      <Button onClick={toggleWishlist} variant="outline" className={`w-full py-6 flex items-center justify-center gap-2 border-gray-200 ${isWishlisted ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" : "text-gray-700 bg-gray-50 hover:bg-gray-100"}`}>
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        {isWishlisted ? "Saved" : "Save to Wishlist"}
      </Button>
    </div>
  );

  const OrderLayout = () => (
    <div className="w-full">
      {product.isAvailable ? (
        <Button onClick={handleOrder} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 md:py-8 text-base md:text-lg font-bold flex flex-col items-center justify-center rounded-sm group relative overflow-hidden h-auto">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="flex items-center gap-2 relative z-10">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span>Order on WhatsApp</span>
          </div>
          <span className="hidden md:block text-xs font-normal opacity-90 mt-1 relative z-10">Get instant response • Easy ordering • 100% Secure</span>
        </Button>
      ) : (
        <Button onClick={handleOrder} variant="outline" className="w-full border-red-200 text-red-600 bg-red-50 hover:bg-red-100 py-6 text-sm md:text-base font-bold flex gap-2">
          Contact for availability
        </Button>
      )}
    </div>
  );

  if (mode === "actions") return <ActionsLayout />;
  if (mode === "order") return <OrderLayout />;

  return (
    <div className="space-y-4">
      <OrderLayout />
      <ActionsLayout />
    </div>
  );
}
