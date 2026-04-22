"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, CheckCircle2, XCircle } from "lucide-react";
import { getAllProducts, getAllCategories } from "@/lib/firestore";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const availableProducts = products.filter(p => p.isAvailable).length;
  const soldOutProducts = products.length - availableProducts;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link href="/admin/categories">
            <Button variant="outline">Manage Categories</Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>+ Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tags className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldOutProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Products</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          {products.slice(0, 5).map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <img src={product.images[0] || "/placeholder.png"} alt={product.name} className="w-12 h-12 rounded object-cover" />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">₹{product.price} • {product.categoryName}</div>
                </div>
              </div>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button variant="ghost" size="sm">Edit</Button>
              </Link>
            </div>
          ))}
          {products.length === 0 && (
            <div className="p-8 text-center text-gray-500">No products found. Add your first product!</div>
          )}
        </div>
      </div>
    </div>
  );
}
