# Sriram Travels & Towing Services

A responsive premium frontend for Sriram Travels & Towing Services in Gooty, Andhra Pradesh. Built with React, Vite, GSAP ScrollTrigger and Lucide icons.

## Run locally

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Structure

- `src/App.jsx` — header, fleet navigation, scroll-linked showcase, enquiry form, services, about, contact and footer.
- `src/data.js` — central business details, six editable vehicle entries and towing entry.
- `src/styles.css` — responsive design system, mobile fleet selector and reduced-motion styling.
- `index.html` — metadata, font loading and app entry point.

## Business details checked against public listing

- Business: Sriram Travels & Towing Services
- Address: Door No. 1, 960, RTC Bus Stand Road, Gooty, Andhra Pradesh 515401
- Phone listed publicly: +91 99493 79737
- Listing: https://magicpin.in/Gooty/Gooty/Brand/Sriram-Travels-And-Towing-Services/store/43ab857

The Justdial search redirected to its homepage without exposing a matching listing. Magicpin displayed the matching business name and Gooty address.

## Owner follow-up required

The public listing did not provide a verified list of fleet model names, passenger/luggage capacities, rates, opening hours, driver options, towing coverage or response-time guarantees. Fleet labels and imagery in `src/data.js` are editable visual placeholders, not claims about the actual fleet. Replace these with owner-approved details and photos before launch.

Vehicle images remain illustrative local assets and are not interactive 3D models. The 3D stage uses a clearly labeled primitive placeholder until an owner-approved GLB is supplied.

## Enquiry behavior

The form validates locations and pickup/return date-times, then opens WhatsApp with an encoded enquiry to the publicly listed phone number. It does not confirm availability, calculate prices or process payments. The phone action uses the same public number.

## Deployment

This is a frontend-only Vite app. Deploy the generated `dist/` directory to a static hosting provider configured for Vite.


## Scroll-driven 3D experience

The premium experience uses React Three Fiber, Three.js, Drei, GSAP ScrollTrigger, Lenis and Framer Motion. The scene is lazy-loaded, the canvas is fixed behind the content, and motion is simplified for mobile and disabled for users who prefer reduced motion.

### Swap in a real vehicle model

1. Export a clean, web-optimized GLB (ideally under 5 MB; remove unseen geometry and reduce texture sizes).
2. Add it as `public/models/sriram-vehicle.glb`.
3. If the model uses Draco-compressed geometry, place the matching Draco decoder assets in `public/draco/` (or update `dracoPath` in `src/motionConfig.js`).
4. In `src/motionConfig.js`, set `modelConfig.enabled` to `true`. The model path is already configured as `/models/sriram-vehicle.glb`.
5. Check the model's scale, origin and forward-facing axis in `src/VehicleModel.jsx`; adjust the GLB export or the primitive's scale/position to fit the stage.
6. Verify mobile, reduced-motion and production builds before deploying.

Until a GLB is supplied, `src/VehicleModel.jsx` renders a lightweight primitive car and labels it **REPLACE WITH REAL MODEL**. This is an intentional placeholder, not a claim that the current vehicle photos are 3D models.

### Swap vehicle photos

The existing vehicle image paths live in `src/data.js`. Keep the `business`, `fleet` and `towing` exports and their object structure unchanged; replace the files at the referenced paths with owner-approved local photos. For production, prefer WebP/AVIF derivatives with sensible responsive dimensions and preserve descriptive alt text. No business details or WhatsApp enquiry fields need to change.

### Motion modules

- `src/Scene.jsx` — fixed Canvas, studio environment, lighting, contact shadows and desktop bloom.
- `src/VehicleModel.jsx` — GLB/Draco loader and labeled primitive fallback.
- `src/ScrollRig.jsx` — Lenis/GSAP synchronization, page-progress choreography and pinned horizontal fleet track.
- `src/Reveal.jsx` and `src/SplitText.jsx` — reusable reveal and accessible split headline animations.
- `src/Preloader.jsx` and `src/ExperienceChrome.jsx` — branded loader, scroll progress, animated road line, custom cursor and quick contact links.
- `src/motionConfig.js` — model path, scroll timings, scene poses, colors and performance settings.

The fleet gallery uses the existing vehicle data and image assets. Claims such as years in business, completed trips and customer ratings are not present in the source data, so the interface does not fabricate those figures.
