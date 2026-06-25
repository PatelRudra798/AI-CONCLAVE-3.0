# AI Conclave 3.0 — Website
### Vite + React 18 + Tailwind CSS v3 + Three.js

> IEEE Signal Processing Society Student Branch Chapter  
> Silver Oak University, Ahmedabad | **10 July 2026**

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build → /dist
npm run preview    # preview production build
```

---

## Features

### 🎨 Light / Dark Mode
- Toggle button in the navbar (sun/moon icon)
- Persists via `localStorage`
- Respects `prefers-color-scheme` on first visit
- All colours use CSS custom properties (`var(--bg)`, `var(--card)`, etc.)
- Smooth 350ms transition between modes

### 📱 Fully Responsive
- Mobile-first design using Tailwind breakpoints (`xs:` `sm:` `lg:`)
- Hamburger drawer menu on mobile/tablet
- Countdown timer, hero buttons, cards — all reflow gracefully
- Three.js 3D scene shown only on `lg:` and above (saves resources on mobile)
- Cursor glow hidden on touch devices automatically

### ⚡ Zero-lag Mouse Tracking
- `CursorGlow` uses `requestAnimationFrame` + direct DOM (no React re-renders)
- `useMouse` hook uses `pointermove` + `{ passive: true }` for maximum responsiveness
- Three.js lerp factor 0.08 for snappy feel

### 🔢 Live Countdown
- Ticks every second to event date: **10 July 2026 08:00 IST**
- Displayed prominently in the hero section

### 🌐 Animated Particle Network
- Fixed canvas behind everything
- Opacity adapts: 40% in dark mode, 18% in light mode

---

## Project Structure

```
src/
├── main.jsx
├── App.jsx                    ← assembles all sections
├── index.css                  ← Tailwind + CSS vars (theme tokens)
├── data/
│   └── index.js               ← ALL content lives here (edit to update)
├── hooks/
│   ├── useCountdown.js        ← live countdown
│   ├── useMouse.js            ← zero-lag NDC mouse ref
│   └── useTheme.js            ← dark/light toggle + localStorage
└── components/
    ├── CursorGlow.jsx         ← RAF cursor glow (touch-safe)
    ├── ParticleCanvas.jsx     ← background network
    ├── ThreeScene.jsx         ← Three.js 3D (desktop only)
    ├── Navbar.jsx             ← responsive + mobile drawer + theme toggle
    ├── SectionHeader.jsx      ← reusable label/title/sub
    ├── HeroSection.jsx
    ├── AboutSection.jsx
    ├── TopicsSection.jsx
    ├── ScheduleSection.jsx
    ├── WorkshopsSection.jsx
    ├── SpeakersSection.jsx
    ├── ActivitiesSection.jsx
    ├── RegistrationSection.jsx
    ├── FaqSection.jsx
    ├── ContactSection.jsx
    └── Footer.jsx
```

---

## Customise Content

Everything is in **`src/data/index.js`** — edit the arrays for speakers, schedule, topics, pricing, FAQ, and contact info.

### Change event date
```js
// src/data/index.js
export const EVENT_DATE = new Date('2026-07-10T08:00:00+05:30');
```

### Adjust theme colours
Edit CSS custom properties in `src/index.css`:
```css
:root {
  --bg: #060B14;   /* dark background */
  --card: #0C1826; /* dark card */
  ...
}
html.light {
  --bg: #EEF5FF;   /* light background */
  --card: #FFFFFF; /* light card */
  ...
}
```

---

## Deploy

**Vercel (recommended)**
```bash
npx vercel --prod
```

**Netlify** — drag the `/dist` folder to [netlify.com/drop](https://netlify.com/drop)

**GitHub Pages**
```bash
# Add to vite.config.js: base: '/repo-name/'
npm run build && push /dist to gh-pages branch
```

---

© 2026 AI Conclave 3.0. All Rights Reserved.
