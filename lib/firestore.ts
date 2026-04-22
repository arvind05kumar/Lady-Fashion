import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Product, Category, Banner, Enquiry } from "./types";

// ========================
// PRODUCTS
// ========================

const productsCollection = collection(db, "products");

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection, orderBy("createdAt", "desc")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product> {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) throw new Error("Product not found");
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(productsCollection, where("categoryId", "==", categoryId));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products.sort((a, b) => {
    const aTime = typeof (a as any).createdAt?.toMillis === 'function' ? (a as any).createdAt.toMillis() : new Date(a.createdAt).getTime();
    const bTime = typeof (b as any).createdAt?.toMillis === 'function' ? (b as any).createdAt.toMillis() : new Date(b.createdAt).getTime();
    return (bTime || 0) - (aTime || 0);
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(productsCollection, where("isFeatured", "==", true));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products.sort((a, b) => {
    const aTime = typeof (a as any).createdAt?.toMillis === 'function' ? (a as any).createdAt.toMillis() : new Date(a.createdAt).getTime();
    const bTime = typeof (b as any).createdAt?.toMillis === 'function' ? (b as any).createdAt.toMillis() : new Date(b.createdAt).getTime();
    return (bTime || 0) - (aTime || 0);
  });
}

export async function getNewArrivals(): Promise<Product[]> {
  const q = query(productsCollection, where("isNewArrival", "==", true));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products.sort((a, b) => {
    const aTime = typeof (a as any).createdAt?.toMillis === 'function' ? (a as any).createdAt.toMillis() : new Date(a.createdAt).getTime();
    const bTime = typeof (b as any).createdAt?.toMillis === 'function' ? (b as any).createdAt.toMillis() : new Date(b.createdAt).getTime();
    return (bTime || 0) - (aTime || 0);
  });
}

export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(productsCollection, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

export async function toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, { isAvailable, updatedAt: new Date() });
}

// ========================
// CATEGORIES
// ========================

const categoriesCollection = collection(db, "categories");

export async function getAllCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(categoriesCollection, orderBy("displayOrder", "asc")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(data: Omit<Category, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(categoriesCollection, {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
}

// ========================
// BANNERS
// ========================

const bannersCollection = collection(db, "banners");

export async function getAllBanners(): Promise<Banner[]> {
  const snapshot = await getDocs(query(bannersCollection, orderBy("displayOrder", "asc")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
}

export async function addBanner(data: Omit<Banner, "id">): Promise<string> {
  const docRef = await addDoc(bannersCollection, data);
  return docRef.id;
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  const docRef = doc(db, "banners", id);
  await updateDoc(docRef, data);
}

export async function deleteBanner(id: string): Promise<void> {
  const docRef = doc(db, "banners", id);
  await deleteDoc(docRef);
}

// ========================
// ENQUIRIES
// ========================

const enquiriesCollection = collection(db, "enquiries");

export async function saveEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "isRead">): Promise<string> {
  const docRef = await addDoc(enquiriesCollection, {
    ...data,
    createdAt: new Date(),
    isRead: false,
  });
  return docRef.id;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const snapshot = await getDocs(query(enquiriesCollection, orderBy("createdAt", "desc")));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Enquiry;
  });
}

export async function markEnquiryRead(id: string, isRead: boolean = true): Promise<void> {
  const docRef = doc(db, "enquiries", id);
  await updateDoc(docRef, { isRead });
}
