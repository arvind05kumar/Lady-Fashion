"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories, addProduct } from "@/lib/firestore";
import { uploadMultipleImages } from "@/lib/storage";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const OCCASIONS = ["Wedding", "Festival", "Casual", "Party", "Daily Wear", "Office"];

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [whatsappNumber, setWhatsappNumber] = useState(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "");
  const [tagsInput, setTagsInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (name && !slug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  }, [name, slug]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreviews(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return toast.error("Please select a category");
    if (imageFiles.length === 0) return toast.error("Please upload at least one image");
    
    setIsSubmitting(true);
    
    try {
      const selectedCat = categories.find(c => c.id === categoryId);
      
      // Upload images
      const imageUrls = await uploadMultipleImages(imageFiles, "products");
      
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
        images: imageUrls,
        isAvailable,
        isNewArrival,
        isFeatured,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        careInstructions,
        blouseDetails,
        whatsappNumber,
      };

      await addProduct(productData);
      toast.success("Product added successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name *</label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)} 
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fabric</label>
                <Input value={fabric} onChange={e => setFabric(e.target.value)} placeholder="e.g. Pure Silk" />
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
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Product Attributes</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Occasions</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map(occ => (
                  <label key={occ} className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked={selectedOccasions.includes(occ)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedOccasions([...selectedOccasions, occ]);
                        else setSelectedOccasions(selectedOccasions.filter(o => o !== occ));
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{occ}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Colors (comma separated)</label>
                <Input value={colorsInput} onChange={e => setColorsInput(e.target.value)} placeholder="Red, Pink, Gold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Bridal, Zari Work" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blouse Details</label>
                <Input value={blouseDetails} onChange={e => setBlouseDetails(e.target.value)} placeholder="Blouse piece included" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Care Instructions</label>
              <Input value={careInstructions} onChange={e => setCareInstructions(e.target.value)} placeholder="Dry clean only" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Images (Up to 6) *</h2>
            
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                  {idx === 0 && <Badge className="absolute bottom-1 left-1 text-[10px] px-1 py-0">Main</Badge>}
                </div>
              ))}
              
              {imageFiles.length < 6 && (
                <label className="w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <span className="text-2xl text-gray-400">+</span>
                  <span className="text-xs text-gray-500">Add Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Status & Visibility</h2>
            
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
                <label htmlFor="isAvailable" className="text-sm">Available (In Stock)</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isNewArrival" checked={isNewArrival} onCheckedChange={setIsNewArrival} />
                <label htmlFor="isNewArrival" className="text-sm">New Arrival</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <label htmlFor="isFeatured" className="text-sm">Featured</label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
