"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, GripVertical } from "lucide-react";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (name && !slug && !editingId) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  }, [name, slug, editingId]);

  async function fetchCategories() {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length.toString());
    setIsActive(true);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setDisplayOrder(cat.displayOrder.toString());
    setIsActive(cat.isActive);
    setImageFile(null);
    setImagePreview(cat.imageUrl);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "categories");
      }

      if (!imageUrl && !editingId) {
        toast.error("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      const catData = {
        name,
        slug,
        description,
        displayOrder: Number(displayOrder),
        isActive,
        imageUrl,
      };

      if (editingId) {
        await updateCategory(editingId, catData);
        toast.success("Category updated");
      } else {
        await addCategory(catData);
        toast.success("Category added");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this category? This might affect products linked to it.")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted");
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (loading) return <div className="p-8">Loading categories...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className={!cat.isActive ? "opacity-60" : ""}>
            <CardContent className="p-0">
              <div className="relative h-40 bg-gray-100 overflow-hidden rounded-t-xl">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {!cat.isActive && (
                  <Badge variant="destructive" className="absolute top-2 right-2">Inactive</Badge>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{cat.description || "No description"}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t text-sm">
                  <span className="text-gray-500">Order: {cat.displayOrder}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(cat)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} required />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center space-x-2 h-10">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image *</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-400">None</div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
