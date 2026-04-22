"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAdminAuth();
  
  if (pathname === "/admin") {
    return <>{children}<Toaster/></>;
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
