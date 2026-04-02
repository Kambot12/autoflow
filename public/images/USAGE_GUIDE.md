# 📁 IMAGE FOLDER STRUCTURE - How to Use

Your AutoFlow Pro app now has a dedicated folder for images: `/public/images/`

---

## 🗂️ FOLDER ORGANIZATION

```
public/
└── images/
    ├── README.md                    ← Instructions (included)
    ├── hero/                        ← Hero section images
    │   ├── banner-car.jpg
    │   ├── service-hero.jpg
    │   └── dashboard-hero.jpg
    ├── backgrounds/                 ← Background images
    │   ├── dashboard-bg.jpg
    │   ├── hero-bg.jpg
    │   └── pattern-bg.png
    ├── cars/                        ← Car marketplace images
    │   ├── toyota-camry.jpg
    │   ├── honda-accord.jpg
    │   └── ...
    ├── icons/                       ← Custom SVG icons
    │   ├── service-icon.svg
    │   ├── repair-icon.svg
    │   └── ...
    └── logos/                       ← Company logos
        ├── autoflow-logo.png
        ├── autoflow-dark.png
        └── favicon.ico
```

---

## 📸 HOW TO ADD IMAGES

### Step 1: Prepare Your Images
- Recommended formats: `.jpg`, `.png`, `.webp`
- Optimize size: Compress before uploading
- Resolution: 1920x1080 or larger for hero images

### Step 2: Place in Correct Folder
Place images in the appropriate subfolder:
```
/public/images/hero/my-car-image.jpg
/public/images/cars/listing-image.jpg
/public/images/backgrounds/dashboard-bg.jpg
```

### Step 3: Use in Components

#### For Hero Section (Landing Page):
```jsx
import Image from "next/image";

<Image
  src="/images/hero/banner-car.jpg"
  alt="Banner"
  width={1920}
  height={1080}
  priority
/>
```

#### For Car Listings (Marketplace):
```jsx
<img
  src="/images/cars/toyota-camry.jpg"
  alt="Toyota Camry"
  className="w-full h-64 object-cover rounded-lg"
/>
```

#### For Background Images (CSS):
```javascript
// In tailwind or inline styles
style={{
  backgroundImage: "url('/images/backgrounds/dashboard-bg.jpg')"
}}
```

---

## 🎨 RECOMMENDED IMAGE SPECIFICATIONS

### Hero Images
- **Size**: 1920x1080px (16:9 ratio)
- **Format**: .jpg (optimized)
- **Usage**: Landing page, section headers
- **Examples**:
  - Car service banner
  - Mechanic at work
  - Dashboard preview

### Car Listing Images
- **Size**: 800x600px (4:3 ratio)
- **Format**: .jpg or .webp
- **Usage**: Marketplace listings
- **Examples**:
  - Front view of vehicles
  - Multiple angles of cars

### Background Images
- **Size**: 1920x1200px
- **Format**: .png or .webp
- **Usage**: Page backgrounds
- **Examples**:
  - Subtle patterns
  - Gradients
  - Dashboard mockups

### Icons
- **Size**: 256x256px or larger
- **Format**: .svg (preferred) or .png
- **Usage**: UI elements, service icons
- **Examples**:
  - Repair icon
  - Service type icons
  - Custom SVG graphics

---

## 🔍 IMAGE PATHS REFERENCE

| Image Type | Folder Path | Usage |
|-----------|-----------|--------|
| Hero Banner | `/images/hero/` | Landing page, sections |
| Car Listings | `/images/cars/` | Marketplace |
| Backgrounds | `/images/backgrounds/` | Page backgrounds |
| Custom Icons | `/images/icons/` | UI elements |
| Logos | `/images/logos/` | Branding |

---

## 💡 EXAMPLE: ADDING A HERO IMAGE TO LANDING PAGE

### Current (Without Image):
```jsx
<div className="bg-gradient-to-br from-red-400 to-red-800 rounded-xl">
  <div className="text-8xl">🚗</div>
</div>
```

### With Your Image:
```jsx
import Image from "next/image";

<div className="bg-gradient-to-br from-red-400 to-red-800 rounded-xl overflow-hidden">
  <Image
    src="/images/hero/banner-car.jpg"
    alt="Car Service"
    width={500}
    height={400}
    className="w-full h-full object-cover"
  />
</div>
```

---

## 🚀 WHERE TO FIND & OPTIMIZE IMAGES

### Free Stock Images:
- **Unsplash**: https://unsplash.com (cars, mechanics)
- **Pexels**: https://pexels.com (auto service)
- **Pixabay**: https://pixabay.com (car images)

### Image Optimization:
- **TinyPNG**: https://tinypng.com (compress)
- **CloudConvert**: https://cloudconvert.com (format conversion)
- **Squoosh**: https://squoosh.app (online optimizer)

---

## ⚡ QUICK SETUP INSTRUCTIONS

1. **Create folders** (if not already done):
   ```bash
   mkdir -p public/images/{hero,cars,backgrounds,icons,logos}
   ```

2. **Add your images**:
   - Download or prepare images
   - Place in appropriate folders
   - Ensure proper naming (lowercase, hyphens)

3. **Reference in code**:
   ```jsx
   src="/images/hero/your-image.jpg"
   // or
   src="/images/cars/car-listing.jpg"
   ```

4. **Get hot reload**:
   - Save image file
   - Next.js automatically detects
   - Refresh browser to see

---

## 🖼️ IMAGE NAMING CONVENTIONS

Use lowercase with hyphens:
- ✅ `banner-car-service.jpg`
- ✅ `toyota-camry-listing.jpg`
- ✅ `dashboard-bg-pattern.png`
- ❌ `BannerCarService.jpg`
- ❌ `Toyota_Camry.jpg`

---

## 📊 FOLDER SIZE RECOMMENDATIONS

| Folder | Max Size | Notes |
|--------|----------|-------|
| `/hero/` | 10MB | Load slowly = slower site |
| `/cars/` | 50MB | User listings, compress well |
| `/backgrounds/` | 5MB | Usually small patterns |
| `/icons/` | 2MB | SVG preferred |
| `/logos/` | 1MB | Small brand files |

---

## 🎯 NEXT STEPS

1. **Gather images** (hero, cars, backgrounds)
2. **Optimize** them (compress, resize)
3. **Add to folders** (`/public/images/...`)
4. **Reference in components** (`src="/images/...`)
5. **Test** in browser at http://localhost:3001

---

## ❓ TROUBLESHOOTING

### Images not showing?
- ✅ Check file path (exact match)
- ✅ Use forward slashes: `/images/...`
- ✅ Files must be in `public/` folder
- ✅ Clear browser cache

### Images load slowly?
- ✅ Compress images (use TinyPNG)
- ✅ Use `.webp` format (smaller)
- ✅ Resize to needed dimensions

### "File not found" error?
- ✅ Verify file exists in folder
- ✅ Check spelling (case-sensitive on Linux)
- ✅ Ensure public/ path visible

---

**Ready to add your images? Start with `/public/images/hero/` folder! 🎨**
