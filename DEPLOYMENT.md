# Deployment Guide

This document captures the end-to-end framework necessary to deploy the store live globally onto Vercel.

## 1. Firebase Configuration

**Step 1:** Navigate to [Firebase Console](https://console.firebase.google.com).
**Step 2:** Generate a new Web App under "Project Overview" configs to acquire your `.env` string sequences.
**Step 3:** Enable **Email/Password** inside the Authentication sector. Register a singular Admin User account locally inside the dashboard.
**Step 4:** Launch **Firestore Database** starting strictly inside Test Mode. 

Go into rules and inject the production ruleset:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads for products, categories, banners
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /categories/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /banners/{doc} { allow read: if true; allow write: if request.auth != null; }
    
    // Enquiries: anyone can write (contact form), only auth can read
    match /enquiries/{doc} { allow create: if true; allow read, update: if request.auth != null; }
  }
}
```

## 2. Cloudinary Setup
Images are strictly intercepted off Firebase completely via Cloudinary Unsigned Uploads rendering storage bills zero.
Set up an unsigned upload preset within the Cloudinary Settings -> Upload interface ensuring the preset limits explicitly match standard web formatting parameters (JPG/WEBP). Extract `cloud_name` and the exact Preset name mapping them to `.env.local`.

## 3. Vercel Deployment

**Step 1:** Push the Saree Store repository upwards into your Github directory.
**Step 2:** Log into [Vercel](https://vercel.com/) and declare a "New Project", selecting your Github target repo.
**Step 3:** Overwrite the identical Environment variables derived internally inside `.env.local` strictly into Vercel's Environment configuration step prior to deploying.
**Step 4:** Deploy.

## 4. Custom Domains (Optional)
Vercel assigns `.vercel.app` freely out of the box dynamically mapping SSL wrappers.
Navigate into Project -> Settings -> Domains matching any nameservers independently from GoDaddy/Hostgator into the explicit parameters automatically offered by Vercel's GUI interfaces natively.
