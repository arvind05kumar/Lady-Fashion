"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PlusCircle, Tag, Image as ImageIcon, ExternalLink, LogOut, Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/products/new", label: "Add Product", icon: PlusCircle },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-4 bg-white border-b flex items-center justify-between">
        <span className="font-bold text-xl">Admin Panel</span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </Button>
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col h-full min-h-screen`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Saree Store</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin/products' && pathname.startsWith('/admin/products') && pathname !== '/admin/products/new');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-gray-100 text-black font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
