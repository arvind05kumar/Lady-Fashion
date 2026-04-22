import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User2, CheckCircle2, HeartHandshake, Map, Gem } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Our Story | The Lady Fashion Store",
  description: "Bringing the finest handpicked sarees from trusted weavers across India to your doorstep.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px]">
      <Navbar />

      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="bg-[#FAF7F2] py-16 md:py-24 border-b border-brand-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-6">Our Story</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Bringing the finest sarees from weavers across India to your doorstep.
            </p>
            <div className="w-24 h-1 bg-brand-gold mx-auto mt-8"></div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-light">
                <p>
                  Rooted in family tradition, our store began with a simple vision: to celebrate and preserve the beautiful, authentic fabrics woven by talented artisans across our country.
                </p>
                <p>
                  Every saree in our collection is carefully <span className="font-medium text-brand-dark">handpicked</span> directly from <span className="font-medium text-brand-dark">trusted weavers</span>. We bypass middlemen to ensure that the creators get their rightful reward and you get the finest quality without compromise.
                </p>
                <p>
                  Whether you are looking for a majestic Banarasi silk for a wedding or a comfortable cotton weave for daily wear, our thoughtfully curated catalog represents the living heritage of Indian textiles.
                </p>
              </div>
              <div className="relative h-[500px] rounded overflow-hidden shadow-xl border-4 border-white">
                <Image src="/logo1.png" alt="Weaving tradition" fill className="object-cover" />
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="bg-brand-dark text-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-colors">
                <Gem className="w-10 h-10 text-brand-gold mx-auto mb-6" />
                <h3 className="font-bold text-xl mb-3 text-brand-gold-light">Heritage</h3>
                <p className="text-gray-400 text-sm">We celebrate the rich textile heritage of India.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-10 h-10 text-brand-gold mx-auto mb-6" />
                <h3 className="font-bold text-xl mb-3 text-brand-gold-light">Quality</h3>
                <p className="text-gray-400 text-sm">Every saree passes our strict quality check.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-colors">
                <HeartHandshake className="w-10 h-10 text-brand-gold mx-auto mb-6" />
                <h3 className="font-bold text-xl mb-3 text-brand-gold-light">Trust</h3>
                <p className="text-gray-400 text-sm">Building relationships, not just transactions.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-colors">
                <Map className="w-10 h-10 text-brand-gold mx-auto mb-6" />
                <h3 className="font-bold text-xl mb-3 text-brand-gold-light">Reach</h3>
                <p className="text-gray-400 text-sm">Delivering love to saree connoisseurs across India.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User2 className="w-10 h-10 text-brand-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">Meet the Founder</h3>
            <p className="text-gray-500 mb-10">Passionate about Indian weaves and dedicated to bringing you the best.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-light text-white px-8 py-6 rounded-none text-base font-bold tracking-wide">
                  Browse Our Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white px-8 py-6 rounded-none text-base font-bold tracking-wide">
                  Chat with us on WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
