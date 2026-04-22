# Saree Store Checkout Flow

This is a premium Indian Saree e-commerce catalog website built with Next.js 14, Tailwind CSS, shadcn/ui, and Firebase.

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Image Storage:** Cloudinary
- **Forms & Validation:** react-hook-form + zod
- **Icons:** lucide-react

## Local Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Firebase Config (from Firebase Console)
   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_FIREBASE_APP_ID=""

   # Cloudinary Config
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="unsigned_preset_name"

   # Store details
   NEXT_PUBLIC_STORE_NAME="The Saree Store"
   NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210" # include country code without +
   ```

3. **Firebase Setup**
   - Create a Firebase project and enable Firestore Database and Email/Password Authentication.
   - Manually register your admin email and password in the auth console to access the admin dashboard later.
   - Refer to `DEPLOYMENT.md` for the exact security rules to copy for Firestore.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Using the Admin Panel

The admin panel is natively built-in at `/admin`.
- Log in explicitly using the admin credentials you created manually in the Firebase Auth console.
- **Adding Products**: Add basic attributes, assign categories, explicitly drag & drop Cloudinary images, and toggle `isFeatured`, `isNewArrival`, or `isAvailable` flags.
- **Categories**: The store navigations are managed dynamically through your Category listings. Toggle them `Active` to appear globally.

## Modifying WhatsApp Contact Paths
The globally exposed WhatsApp functionality derives directly from your `.env.local`: `NEXT_PUBLIC_WHATSAPP_NUMBER`. Changing this numeric string automatically remaps:
- Global floating chat widgets
- The primary "Order via WhatsApp" product CTA
- The standard Contact forms "Contact directly via WhatsApp" action button.

## Folder Structure
- `app/` - Next.js App Router root mapping customer and `/admin` routes.
- `components/` - Standardized UI components (Product Cards, Gallery modals).
- `components/ui/` - Exported isolated modules from shadcn/ui.
- `lib/` - Internal SDK wrappers dealing natively with Firebase interfaces.
