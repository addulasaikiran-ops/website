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

Vehicle visuals use remote Unsplash photography as illustrative imagery and are not interactive 3D models. GSAP ScrollTrigger provides scroll-linked perspective, scale and stage pinning; no GLB/GLTF assets were supplied.

## Enquiry behavior

The form validates locations and pickup/return date-times, then opens WhatsApp with an encoded enquiry to the publicly listed phone number. It does not confirm availability, calculate prices or process payments. The phone action uses the same public number.

## Deployment

This is a frontend-only Vite app. Deploy the generated `dist/` directory to a static hosting provider configured for Vite.
