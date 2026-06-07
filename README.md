# Section by Scroll — GSAP Full Page Scroll Animation

> **Free & open-source animation on scroll template.** One scroll event, one section — buttery-smooth full-page transitions powered by GSAP.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://section-by-scroll-gsap-full-page-sc.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![120fps Ready](https://img.shields.io/badge/Performance-120fps%20Ready-ff4d6d?style=flat-square)]()

**Live Demo:** [section-by-scroll-gsap-full-page-sc.vercel.app](https://section-by-scroll-gsap-full-page-sc.vercel.app/)  
**GitHub Repo:** [github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation](https://github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation)

---

## What is this?

**Section by Scroll** is a production-ready, open-source **scroll animation** demo that turns a normal webpage into a **full-page section scroller**. Instead of continuous scrolling, each wheel swipe, touch gesture, or keyboard press triggers an animated jump to the next (or previous) section.

Perfect for:

- Landing pages with cinematic section transitions
- Portfolio showcases
- Product storytelling pages
- GSAP learning & prototyping
- Replacing heavy fullPage.js setups with a lightweight vanilla alternative

**Live keywords people search for:** `animation on scroll` · `section by scroll` · `full page scroll animation` · `GSAP scroll animation` · `one scroll one section` · `scroll triggered animation` · `GSAP Observer example`

---

## Features

| Feature | Description |
|---|---|
| **Event-driven scroll** | One wheel tick = one section. No scrub, no accidental half-scrolls. |
| **GSAP Observer** | Normalizes wheel, touch, and pointer input across devices. |
| **Custom easing** | Slow start → fast middle → snappy end via CustomEase curves. |
| **GPU-accelerated** | `force3D`, `yPercent`, `autoAlpha` — optimized for 60/120fps displays. |
| **Keyboard navigation** | `Arrow Up/Down`, `Page Up/Down`, `Space` |
| **Section nav dots** | Click to jump directly to any section. |
| **Reduced motion** | Respects `prefers-reduced-motion` — falls back to native scroll. |
| **Zero framework** | Plain HTML, CSS, and JavaScript. Drop into any project. |
| **Next.js & Nuxt ready** | Integration guides below for React and Vue ecosystems. |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation.git
cd Section-by-Scroll-GSAP-Full-Page-Scroll-Animation

# Serve locally (any static server works)
npx serve .
```

Open `http://localhost:3000` and scroll.

No build step. No npm install required.

---

## Project Structure

```
Section-by-Scroll-GSAP-Full-Page-Scroll-Animation/
├── index.html          # 5 demo sections + SEO meta tags
├── css/
│   └── style.css       # Layout, themes, GPU layer hints
├── js/
│   └── main.js         # GSAP Observer, transitions, easing
├── LICENSE
└── README.md
```

---

## How It Works

### 1. Stacked sections inside a fixed viewport

All sections live inside `.scroll-track`. The viewport (`.scroll-pin`) stays fixed; the track moves vertically with `transform: translateY`.

### 2. Observer captures scroll events

```javascript
Observer.create({
  type: "wheel,touch,pointer",
  preventDefault: true,
  onDown: () => navigate(1),   // next section
  onUp:   () => navigate(-1),  // previous section
});
```

### 3. GSAP animates the transition

```javascript
gsap.to(track, {
  yPercent: -(index * 100) / totalSections,
  duration: 1.15,
  ease: customEase, // slow → fast → snappy
});
```

Content enter/exit animations run in the same timeline, synced with the scroll motion.

---

## Next.js Integration Guide

Use this template inside a **Next.js App Router** project with a client component and `@gsap/react` for safe cleanup.

### 1. Install dependencies

```bash
npm install gsap @gsap/react
```

### 2. Copy assets

Copy `css/style.css` into your project:

```
your-next-app/
├── app/
│   └── scroll-demo/
│       └── page.tsx
├── components/
│   └── SectionByScroll.tsx
└── styles/
    └── section-scroll.css   ← copy from css/style.css
```

### 3. Create the component

`components/SectionByScroll.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";
import "@/styles/section-scroll.css";

gsap.registerPlugin(Observer, CustomEase, useGSAP);

const EASE_SCROLL = CustomEase.create("sectionScroll", "M0,0 C0.62,0 0.18,1 1,1");
const EASE_CONTENT_IN = CustomEase.create("contentIn", "M0,0 C0.55,0 0.22,1 1,1");
const EASE_CONTENT_OUT = CustomEase.create("contentOut", "M0,0 C0.7,0 0.35,0.6 1,1");

export default function SectionByScroll({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.config({ force3D: true });
      gsap.ticker.lagSmoothing(0);

      const track = rootRef.current?.querySelector(".scroll-track");
      const sections = gsap.utils.toArray<HTMLElement>(".section", rootRef.current);
      if (!track || !sections.length) return;

      let currentIndex = 0;
      let isAnimating = false;
      let activeTimeline: gsap.core.Timeline | null = null;

      const getTrackYPercent = (index: number) => -(index * 100) / sections.length;

      const goToSection = (index: number) => {
        index = gsap.utils.clamp(0, sections.length - 1, index);
        if (index === currentIndex || isAnimating) return;

        isAnimating = true;
        currentIndex = index;
        activeTimeline?.kill();

        activeTimeline = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
            activeTimeline = null;
          },
        });

        activeTimeline.to(track, {
          yPercent: getTrackYPercent(index),
          duration: 1.15,
          ease: EASE_SCROLL,
          force3D: true,
        });
      };

      const observer = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        tolerance: 10,
        preventDefault: true,
        onDown: () => goToSection(currentIndex + 1),
        onUp: () => goToSection(currentIndex - 1),
      });

      return () => observer.kill();
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
```

### 4. Use in a page

`app/scroll-demo/page.tsx`:

```tsx
import SectionByScroll from "@/components/SectionByScroll";

export const metadata = {
  title: "Section by Scroll Animation | Next.js + GSAP",
  description: "Full-page scroll animation on scroll with GSAP Observer in Next.js.",
};

export default function ScrollDemoPage() {
  return (
    <SectionByScroll>
      <main className="scroll-stage">
        <div className="scroll-pin">
          <div className="scroll-track">
            <section className="section section--hero" data-theme="dark">
              <div className="section-content">
                <h1 className="title">Your first section</h1>
              </div>
            </section>
            <section className="section section--discover" data-theme="light">
              <div className="section-content">
                <h2 className="title">Your second section</h2>
              </div>
            </section>
          </div>
        </div>
      </main>
    </SectionByScroll>
  );
}
```

### Next.js tips

- Always use `"use client"` — GSAP touches the DOM and must run client-side only.
- Wrap logic in `useGSAP()` so tweens and Observer are cleaned up on unmount.
- Load Google Fonts in `app/layout.tsx` or use `next/font/google` for Roboto + Inter.
- For full animation logic (content in/out, nav dots), copy functions from `js/main.js` into the component.
- Do **not** import GSAP in Server Components.

---

## Nuxt.js Integration Guide

Use a **client-only composable** in Nuxt 3/4. GSAP must run after mount.

### 1. Install dependencies

```bash
npm install gsap @gsap/vue
```

> `@gsap/vue` is optional but recommended for automatic cleanup in Vue components.

### 2. Copy assets

```
your-nuxt-app/
├── assets/
│   └── css/
│       └── section-scroll.css   ← copy from css/style.css
├── components/
│   └── SectionByScroll.vue
└── composables/
    └── useSectionScroll.ts
```

Import CSS in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ["~/assets/css/section-scroll.css"],
});
```

### 3. Create the composable

`composables/useSectionScroll.ts`:

```ts
import { onMounted, onUnmounted, type Ref } from "vue";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(Observer, CustomEase);

const EASE_SCROLL = CustomEase.create("sectionScroll", "M0,0 C0.62,0 0.18,1 1,1");

export function useSectionScroll(rootRef: Ref<HTMLElement | null>) {
  let observer: Observer | null = null;
  let currentIndex = 0;
  let isAnimating = false;

  onMounted(() => {
    if (!rootRef.value) return;

    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(0);

    const track = rootRef.value.querySelector(".scroll-track");
    const sections = gsap.utils.toArray<HTMLElement>(".section", rootRef.value);
    if (!track || !sections.length) return;

    const getTrackYPercent = (index: number) => -(index * 100) / sections.length;

    const goToSection = (index: number) => {
      index = gsap.utils.clamp(0, sections.length - 1, index);
      if (index === currentIndex || isAnimating) return;

      isAnimating = true;
      currentIndex = index;

      gsap.to(track, {
        yPercent: getTrackYPercent(index),
        duration: 1.15,
        ease: EASE_SCROLL,
        force3D: true,
        onComplete: () => {
          isAnimating = false;
        },
      });
    };

    observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      tolerance: 10,
      preventDefault: true,
      onDown: () => goToSection(currentIndex + 1),
      onUp: () => goToSection(currentIndex - 1),
    });
  });

  onUnmounted(() => {
    observer?.kill();
    gsap.killTweensOf(rootRef.value?.querySelectorAll("*") ?? []);
  });
}
```

### 4. Create the component

`components/SectionByScroll.vue`:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useSectionScroll } from "~/composables/useSectionScroll";

const rootRef = ref<HTMLElement | null>(null);
useSectionScroll(rootRef);
</script>

<template>
  <div ref="rootRef">
    <main class="scroll-stage">
      <div class="scroll-pin">
        <div class="scroll-track">
          <section class="section section--hero" data-theme="dark">
            <div class="section-content">
              <h1 class="title">Your first section</h1>
            </div>
          </section>
          <section class="section section--discover" data-theme="light">
            <div class="section-content">
              <h2 class="title">Your second section</h2>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
```

### 5. Use in a page

`pages/index.vue` or `pages/scroll-demo.vue`:

```vue
<script setup lang="ts">
useSeoMeta({
  title: "Section by Scroll Animation | Nuxt + GSAP",
  description: "Full-page scroll animation on scroll with GSAP Observer in Nuxt.",
});
</script>

<template>
  <SectionByScroll />
</template>
```

### Nuxt tips

- Keep GSAP inside `onMounted` or a composable — never run it during SSR.
- Use `<ClientOnly>` wrapper if you see hydration warnings.
- For full features (nav dots, content animations, keyboard), port remaining logic from `js/main.js`.
- Use `useSeoMeta()` for SEO meta tags per page.

---

## Customization

### Add a new section

1. Copy any `<section class="section">` block in `index.html`.
2. Add a nav dot in `.section-nav`.
3. Update `.progress-total` count.
4. GSAP picks up new sections automatically via `gsap.utils.toArray(".section")`.

### Change transition speed

In `js/main.js`:

```javascript
const SCROLL_DURATION = 1.15; // seconds
```

### Tweak easing curves

Edit the CustomEase SVG paths at the top of `main.js`:

```javascript
const EASE_SCROLL = CustomEase.create("sectionScroll", "M0,0 C0.62,0 0.18,1 1,1");
```

### Swap fonts

Roboto (headings) + Inter (body) are loaded from Google Fonts. Update CSS variables in `style.css`:

```css
--font-display: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-body: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

---

## Tech Stack

- **[GSAP 3.12](https://gsap.com/)** — animation engine
- **[Observer](https://gsap.com/docs/v3/Plugins/Observer/)** — unified wheel/touch/pointer events
- **[CustomEase](https://gsap.com/docs/v3/Eases/CustomEase/)** — custom bezier easing curves
- **Roboto + Inter** — modern Helvetica-style typography via Google Fonts

---

## Performance Notes

- Animations use **transform + opacity only** (compositor-friendly).
- `will-change` is applied only during active transitions.
- Counter text updates only when the displayed number changes (no per-frame DOM writes).
- `gsap.ticker.lagSmoothing(0)` for tighter frame sync on 120Hz monitors.
- Heavy effects removed: `mix-blend-mode`, SVG noise filters, 3D `rotateX`.

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | Full |
| Firefox | Full |
| Safari | Full |
| Mobile Safari / Chrome | Full (touch swipe) |

---

## SEO & Meta Tags

`index.html` includes optimized meta tags for discoverability:

- `<title>` — primary keyword: *Section by Scroll Animation*
- `<meta name="description">` — GSAP, open-source, one-scroll-one-section
- Open Graph (`og:title`, `og:description`, `og:url`) — social sharing
- Twitter Card tags
- Canonical link → live demo URL

---

## Use Cases & Search Terms

This template helps developers searching for:

- **animation on scroll** — scroll-triggered section transitions
- **section by scroll** — discrete full-page section jumps
- **full page scroll javascript** — vanilla JS alternative to fullPage.js
- **GSAP scroll animation tutorial** — working Observer + CustomEase example
- **GSAP scroll animation Next.js** — React client component integration
- **GSAP scroll animation Nuxt** — Vue composable integration
- **scroll snap animation** — event-driven snap without CSS scroll-snap
- **one scroll one page** — wheel event mapped to section index
- **open source scroll animation** — MIT licensed, fork-friendly

---

## Contributing

Contributions are welcome! Ideas:

- Horizontal section mode
- URL hash sync (`#section-2`)
- Progress bar animation
- Pre-built Next.js / Nuxt starter templates
- More easing presets

1. Fork the [repository](https://github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation)
2. Create a feature branch (`git checkout -b feature/amazing-thing`)
3. Commit (`git commit -m 'Add amazing thing'`)
4. Push (`git push origin feature/amazing-thing`)
5. Open a Pull Request

---

## License

MIT License — free for personal and commercial use. See [LICENSE](LICENSE) for details.

---

## Credits

Built with [GSAP](https://gsap.com/) by GreenSock.

**Author:** [umid-abbasli](https://github.com/umid-abbasli)

If this project helped you, consider giving it a **star** on [GitHub](https://github.com/umid-abbasli/Section-by-Scroll-GSAP-Full-Page-Scroll-Animation) — it helps others find this scroll animation template.

---

<p align="center">
  <strong>Section by Scroll</strong> — Animation on scroll, done right.<br/>
  <sub>GSAP · Observer · CustomEase · Vanilla JS · Next.js · Nuxt · Open Source</sub>
</p>
