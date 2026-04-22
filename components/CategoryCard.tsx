import { Category } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link 
      href={`/shop?category=${category.slug}`} 
      className="group block relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 border border-transparent hover:border-brand-gold transition-colors duration-300 shadow-xl"
    >
      <Image 
        src={category.imageUrl || "https://picsum.photos/seed/placeholder/600/600"} 
        alt={category.name} 
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      {/* Text Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-serif text-xl md:text-2xl text-white font-bold">{category.name}</h3>
        <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Shop Now &rarr;
        </p>
      </div>
    </Link>
  );
}
