import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px] bg-white">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-64 bg-gray-100 animate-pulse rounded mb-8"></div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left: Image Skeleton */}
          <div className="w-full lg:w-[55%] flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 aspect-[2/3] bg-gray-100 animate-pulse rounded"></div>
            <div className="flex md:flex-col gap-3 md:w-24 flex-shrink-0">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          </div>

          {/* Right: Info Skeleton */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-0 gap-4">
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-3/4 bg-gray-100 animate-pulse rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-6"></div>

            <div className="bg-gray-50 h-32 w-full animate-pulse rounded-sm border border-gray-100 mb-8"></div>

            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
              <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-4 w-4/6 bg-gray-100 animate-pulse rounded"></div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="h-6 w-32 bg-gray-100 animate-pulse rounded"></div>
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="h-16 w-full bg-gray-100 animate-pulse rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 w-full bg-gray-100 animate-pulse rounded"></div>
                <div className="h-12 w-full bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
