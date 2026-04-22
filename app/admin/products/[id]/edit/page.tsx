"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAllCategories, getProductById, updateProduct } from "@/lib/firestore";
import { uploadMultipleImages, deleteImage } from "@/lib/storage";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const OCCASIONS = ["Wedding", "Festival", "Casual", "Party", "Daily Wear", "Office"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [blouseDetails, setBlouseDetails] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, product] = await Promise.all([
          getAllCategories(),
          getProductById(id)
        ]);
        
        setCategories(cats);
        
        setName(product.name);
        setSlug(product.slug);
        setCategoryId(product.categoryId);
        setDescription(product.description);
        setFabric(product.fabric || "");
        setPrice(product.price.toString());
        setMrp(product.mrp.toString());
        setBlouseDetails(product.blouseDetails || "");
        setCareInstructions(product.careInstructions || "");
        setWhatsappNumber(product.whatsappNumber || "");
        setTagsInput(product.tags?.join(", ") || "");
        setColorsInput(product.color?.join(", ") || "");
        
        setSelectedOccasions(product.occasion || []);
        setIsFeatured(product.isFeatured);
        setIsNewArrival(product.isNewArrival);
        setIsAvailable(product.isAvailable);
        
        setExistingImages(product.images || []);
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = existingImages.length + newImageFiles.length + files.length;
      if (totalImages > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setNewImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) setNewImagePreviews(prev => [...prev, e.target!.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (idx: number) => {
    const url = existingImages[idx];
    setImagesToDelete(prev => [...prev, url]);
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return toast.error("Please select a category");
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      return toast.error("Please ensure at least one image is added");
    }
    
    setIsSubmitting(true);
    
    try {
      // Delete images marked for deletion
      for (const url of imagesToDelete) {
        await deleteImage(url);
      }
      
      // Upload new images
      let newImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        newImageUrls = await uploadMultipleImages(newImageFiles, "products");
      }
      
      const finalImages = [...existingImages, ...newImageUrls];
      const selectedCat = categories.find(c => c.id === categoryId);
      
      const productData = {
        name,
        slug,
        description,
        fabric,
        occasion: selectedOccasions,
        color: colorsInput.split(",").map(c => c.trim()).filter(Boolean),
        price: Number(price),
        mrp: Number(mrp),
        categoryId,
        categoryName: selectedCat?.name || "",
        images: finalImages,
        isAvailable,
        isNewArrival,
        isFeatured,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        careInstructions,
        blouseDetails,
        whatsappNumber,
      };

      await updateProduct(id, productData);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name *</label>
                <Input value={name} onChange={e =>setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fabric</label>
                <Input value={fabric} onChange={e => setFabric(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selling Price (₹) *</label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MRP (₹) *</label>
                <Input type="number" value={mrp} onChange={e => setMrp(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Product Attributes */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Product Attributes</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Occasions</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map(occ => (
                  <label key={occ} className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={selectedOccasions.includes(occ)} onChange={(e) => {
                      if (e.target.checked) setSelectedOccasions([...selectedOccasions, occ]);
                      else setSelectedOccasions(selectedOccasions.filter(o => o !== occ));
                    }} className="rounded" />
                    <span className="text-sm">{occ}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Colors (comma separated)</label>
                <Input value={colorsInput} onChange={e => setColorsInput(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blouse Details</label>
                <Input value={blouseDetails} onChange={e => setBlouseDetails(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Care Instructions</label>
              <Input value={careInstructions} onChange={e => setCareInstructions(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Images (Up to 6)</h2>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img, idx) => (
                <div key={`ext-${idx}`} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={img} alt="Existing" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                  {idx === 0 && <Badge className="absolute bottom-1 left-1 text-[10px] px-1 py-0">Main</Badge>}
                </div>
              ))}
              
              {newImagePreviews.map((preview, idx) => (
                <div key={`new-${idx}`} className="relative w-24 h-24 border rounded border-blue-400 overflow-hidden">
                  <img src={preview} alt="New" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                  <Badge className="absolute top-1 left-1 bg-blue-500 text-[10px] px-1 py-0">New</Badge>
                </div>
              ))}
              
              {existingImages.length + newImageFiles.length < 6 && (
                <label className="w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <span className="text-2xl text-gray-400">+</span>
                  <span className="text-xs text-gray-500">Add</span>
                  <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="hidden" />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Status & Visibility</h2>
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={isNewArrival} onCheckedChange={setIsNewArrival} />
                <span className="text-sm">New Arrival</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <span className="text-sm">Featured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
