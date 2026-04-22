export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  fabric: string;
  occasion: string[];
  color: string[];
  price: number;
  mrp: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  isAvailable: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  tags: string[];
  careInstructions: string;
  blouseDetails: string;
  whatsappNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  address: string;
  email: string;
  instagram: string;
  facebook: string;
  primaryColor: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
