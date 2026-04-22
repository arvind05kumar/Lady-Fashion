"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { getAllProducts, deleteProduct, toggleAvailability } from "@/lib/firestore";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleAvailability(id, !current);
      setProducts(products.map(p => p.id === id ? { ...p, isAvailable: !current } : p));
      toast.success(`Product marked as ${!current ? 'Available' : 'Sold Out'}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Highlights</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No products found. Use the button above to add one.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.images[0] || "/placeholder.png"} alt={product.name} className="w-12 h-12 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>
                    <div>₹{product.price}</div>
                    {product.mrp > product.price && <div className="text-xs text-gray-500 line-through">₹{product.mrp}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={product.isAvailable} 
                        onCheckedChange={() => handleToggle(product.id, product.isAvailable)}
                      />
                      <span className="text-sm">{product.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {product.isNewArrival && <Badge variant="secondary">New</Badge>}
                      {product.isFeatured && <Badge>Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
