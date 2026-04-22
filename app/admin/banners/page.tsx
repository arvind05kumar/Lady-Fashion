"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { getAllBanners, addBanner, updateBanner, deleteBanner } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setLinkUrl("");
    setDisplayOrder(banners.length.toString());
    setIsActive(true);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setLinkUrl(banner.linkUrl);
    setDisplayOrder(banner.displayOrder.toString());
    setIsActive(banner.isActive);
    setImageFile(null);
    setImagePreview(banner.imageUrl);
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
        imageUrl = await uploadImage(imageFile, "banners");
      }

      if (!imageUrl && !editingId) {
        toast.error("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      const bannerData = {
        title,
        subtitle,
        linkUrl,
        displayOrder: Number(displayOrder),
        isActive,
        imageUrl,
      };

      if (editingId) {
        await updateBanner(editingId, bannerData);
        toast.success("Banner updated");
      } else {
        await addBanner(bannerData);
        toast.success("Banner added");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted");
        setBanners(banners.filter(b => b.id !== id));
      } catch (error) {
        toast.error("Failed to delete banner");
      }
    }
  };

  if (loading) return <div className="p-8">Loading banners...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Homepage Banners</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <Card key={banner.id} className={!banner.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4 flex items-center gap-6">
              <div className="cursor-move text-gray-400">
                <GripVertical />
              </div>
              
              <div className="w-48 h-24 bg-gray-100 rounded border overflow-hidden shrink-0">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-lg">{banner.title || "No Title"}</h3>
                <p className="text-sm text-gray-500">{banner.subtitle || "No Subtitle"}</p>
                {banner.linkUrl && <a href={banner.linkUrl} target="_blank" className="text-xs text-blue-500 hover:underline">{banner.linkUrl}</a>}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
                  <span>Order: {banner.displayOrder}</span>
                  <span className={banner.isActive ? "text-green-600" : "text-red-500"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditModal(banner)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500 border rounded-lg bg-white">
            No banners found. Add one to show on your homepage.
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summer Sale" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Up to 50% off" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link URL (Optional)</label>
              <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="/shop/sarees" />
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
              <div className="text-xs text-gray-500 mb-2">Recommended size: 1920x600px</div>
              <div className="flex flex-col gap-4">
                {imagePreview && (
                  <div className="w-full h-32 bg-gray-100 rounded border overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Banner"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
