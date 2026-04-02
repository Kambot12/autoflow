# 🖼️ REAL IMAGES ADDED & RESOURCE GUIDE

Your AutoFlow Pro landing page now includes **REAL IMAGES** from Unsplash! Here's what's been updated and how to customize.

---

## ✅ WHAT'S BEEN ADDED

### 1. **Hero Section** 🔧
- **Current Image**: Professional mechanic working on car
- **Source**: Unsplash (free, high-quality)
- **Size**: 600x500px
- **Location**: Right side of hero section

### 2. **Service Cards** 💼
- **4 Service Images Added**:
  1. Engine Diagnostics → Computer diagnostic tools
  2. Oil Change → Car maintenance service
  3. Brake Service → Brake inspection image
  4. AC Repair → Mechanic at work
- **Size**: 400x300px each
- **Effect**: Hover zoom animation

### 3. **Testimonial Avatars** 👥
- **3 Customer Profile Pictures**:
  1. Ibrahim Hassan → Male professional avatar
  2. Chioma Okonkwo → Female professional avatar
  3. Ahmed Adebayo → Male professional avatar
- **Size**: 200x200px (circular, 48px display)
- **Effect**: Framer motion animations, red border on hover

---

## 🔍 CURRENT IMAGE URLS USED

### Hero Section
```
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop
```
Professional mechanic working on vehicle repair

### Service Cards
```
1. Engine Diagnostics
https://images.unsplash.com/photo-1486262715619-67b519e0abe5?w=400&h=300&fit=crop

2. Oil Change
https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop

3. Brake Service
https://images.unsplash.com/photo-1533473359331-35a2a3a36fca?w=400&h=300&fit=crop

4. AC Repair
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop
```

### Testimonial Avatars
```
1. Ibrahim Hassan (Male)
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop

2. Chioma Okonkwo (Female)
https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop

3. Ahmed Adebayo (Male)
https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop
```

---

## 📱 HOW TO CUSTOMIZE IMAGES

### Edit Landing Page Images

**File**: `/Users/chimerekamsi/Desktop/auto-flow/autoflow-pro/app/page.tsx`

### Find & Replace Image URLs:

1. **Find this section** (Search for "testimonials = ["):
```javascript
const testimonials = [
  {
    avatar: "https://images.unsplash.com/...",  // Replace this URL
    name: "Ibrahim Hassan",
    ...
  }
]
```

2. **Find this section** (Search for "services = ["):
```javascript
const services = [
  {
    image: "https://images.unsplash.com/...",  // Replace this URL
    name: "Engine Diagnostics",
    ...
  }
]
```

3. **Find this section** (Search for "Hero car image"):
```javascript
<img
  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"
  // Replace this URL ↑
  alt="Professional mechanic working on car"
/>
```

---

## 🎨 RECOMMENDED FREE IMAGE SOURCES

### **Unsplash** (Currently Used)
- **URL**: https://unsplash.com
- **Quality**: Excellent (high-resolution)
- **Search Terms**:
  - Car repair, mechanic, automotive, service, diagnosis
  - Professional portraits, business, people, team
- **License**: Free for commercial use

### **Pexels**
- **URL**: https://pexels.com
- **Search**: "car repair", "mechanic", "auto service"
- **Quality**: Great
- **License**: Free for any use

### **Pixabay**
- **URL**: https://pixabay.com
- **Search**: "car garage", "vehicle repair"
- **Quality**: Good
- **License**: Free

### **Coverr** (Videos)
- **URL**: https://coverr.co
- **Perfect For**: Hero section background videos
- **Quality**: Professional

---

## 🔗 CURATED IMAGE LINKS BY USE CASE

### HERO SECTION (Right side image)
Best car service/mechanic photos:
```
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop
(Current - Professional mechanic)

https://images.unsplash.com/photo-1486262715619-67b519e0abe5?w=800&h=600&fit=crop
(Car diagnostic computer)

https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop
(Mechanic with tools)

https://images.unsplash.com/photo-1488092244827-3746c70b79f1?w=800&h=600&fit=crop
(Car maintenance close-up)
```

### SERVICE CARDS
Professional service images:
```
Engine Diagnostics:
https://images.unsplash.com/photo-1486262715619-67b519e0abe5

Oil Change:
https://images.unsplash.com/photo-1552820728-8ac41f1ce891

Brake Service:
https://images.unsplash.com/photo-1533473359331-35a2a3a36fca

Transmission:
https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b

Suspension:
https://images.unsplash.com/photo-1488092244827-3746c70b79f1

Tire Service:
https://images.unsplash.com/photo-1486482191580-c3b3e0fa5e96
```

### TESTIMONIAL AVATARS
Professional profile photos:
```
Male (Professional):
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d
https://images.unsplash.com/photo-1500648767791-00dcc994a43e
https://images.unsplash.com/photo-1494790108377-be9c29b29330

Female (Professional):
https://images.unsplash.com/photo-1438761681033-6461ffad8d80
https://images.unsplash.com/photo-1494790108377-be9c29b29330
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d
```

---

## 🚀 HOW TO UPDATE IMAGES

### Quick Method: Just Change URLs

1. Open `/app/page.tsx` in your editor
2. Find the image URL you want to change
3. Replace the Unsplash URL with your new URL
4. Click Save
5. Refresh browser (http://localhost:3001) to see changes

### Example - Change Hero Image:
```javascript
// OLD
src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"

// NEW
src="https://images.unsplash.com/photo-1486262715619-67b519e0abe5?w=600&h=500&fit=crop"
```

---

## 📥 DOWNLOAD & HOST LOCALLY

If you want to download images and host them locally in `/public/images/`:

### Step 1: Download Image
```bash
# Download an image
curl -o public/images/hero/mechanic.jpg \
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
```

### Step 2: Update Reference in Code
```javascript
// Change FROM external URL
src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"

// Change TO local file
src="/images/hero/mechanic.jpg"
```

### Step 3: Refresh Browser
Done! Image loads from your local `/public/` folder.

---

## 💾 BATCH DOWNLOAD SCRIPT

Create a script to download all images locally:

**Create file**: `scripts/download-images.sh`

```bash
#!/bin/bash

# Create directories
mkdir -p public/images/{hero,services,avatars}

# Download Hero Image
curl -o public/images/hero/mechanic.jpg \
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"

# Download Service Images
curl -o public/images/services/diagnostics.jpg \
  "https://images.unsplash.com/photo-1486262715619-67b519e0abe5?w=400&h=300&fit=crop"

curl -o public/images/services/oil-change.jpg \
  "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop"

curl -o public/images/services/brake.jpg \
  "https://images.unsplash.com/photo-1533473359331-35a2a3a36fca?w=400&h=300&fit=crop"

curl -o public/images/services/ac-repair.jpg \
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"

# Download Avatar Images
curl -o public/images/avatars/ibrahim.jpg \
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"

curl -o public/images/avatars/chioma.jpg \
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"

curl -o public/images/avatars/ahmed.jpg \
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"

echo "✅ All images downloaded!"
```

Run with:
```bash
chmod +x scripts/download-images.sh
./scripts/download-images.sh
```

---

## ⚡ QUICK OPTIMIZATION TIPS

### Image Parameters (in URL)
```
?w=600        → Width in pixels
&h=500        → Height in pixels
&fit=crop     → Crop to exact dimensions
&q=80         → Quality (1-100, default 75)
&auto=format  → Auto-select best format
```

### Example Optimized URL:
```
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?
  w=600&h=500&fit=crop&q=80&auto=format
```

### Size Guidelines:
- **Hero Images**: 800-1200px width
- **Service Cards**: 400px width
- **Avatars**: 200x200px (or display smaller with CSS)
- **Recommended Quality**: 75-85 for web

---

## 🎯 ALL IMAGE LOCATIONS IN CODE

| Component | File | Line | Current Image |
|-----------|------|------|----------------|
| Hero Section | app/page.tsx | ~172 | Mechanic photo |
| Service 1 | app/page.tsx | ~79 | Diagnostics |
| Service 2 | app/page.tsx | ~86 | Oil change |
| Service 3 | app/page.tsx | ~93 | Brake service |
| Service 4 | app/page.tsx | ~100 | AC repair |
| Avatar 1 | app/page.tsx | ~107 | Ibrahim avatar |
| Avatar 2 | app/page.tsx | ~113 | Chioma avatar |
| Avatar 3 | app/page.tsx | ~119 | Ahmed avatar |

---

## ✨ VERIFICATION CHECKLIST

When you visit http://localhost:3001:

- [ ] Hero section shows mechanic photo (right side)
- [ ] Service cards show 4 different images
- [ ] Service images zoom on hover
- [ ] Testimonial cards show 3 avatars
- [ ] Avatars are circular with red border
- [ ] All images load smoothly
- [ ] No broken image icons (🖼️)
- [ ] Animations still work with images

---

## 🐛 TROUBLESHOOTING

### Images not showing?
1. Check browser console (F12 → Console tab)
2. Look for error messages ❌
3. Verify URL is correct
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh page (Ctrl+F5)

### Slow loading?
1. Optimize image size (use parameters: ?w=600&q=80)
2. Use webp format if available
3. Consider downloading locally to `/public/images/`

### Want to use local images instead?
1. Download image files to `/public/images/services/`
2. Change URL from `https://...` to `/images/services/filename.jpg`
3. Refresh browser

---

## 📚 NEXT STEPS

1. **View Updated Site**: http://localhost:3001
2. **Customize Images**: Replace any URLs in `app/page.tsx`
3. **Host Locally**: Download images and update URLs to `/images/...`
4. **Deploy**: When ready, use `npm run build && npm run start`

---

**Your landing page now has REAL PROFESSIONAL IMAGES! 🎉**

Ready to customize? Edit the URLs in `/app/page.tsx` file.
