# Section by Scroll — GSAP Full Page Scroll Animation

> **Free & open-source animation on scroll template.** One scroll event, one section — buttery-smooth full-page transitions powered by GSAP.

[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![120fps Ready](https://img.shields.io/badge/Performance-120fps%20Ready-ff4d6d?style=flat-square)]()

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

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/section-by-scroll.git
cd section-by-scroll

# Serve locally (any static server works)
npx serve .
```

Open `http://localhost:3000` and scroll.

No build step. No npm install required.

---

## Project Structure

```
section-by-scroll/
├── index.html          # 5 demo sections + SEO meta tags
├── css/
│   └── style.css       # Layout, themes, GPU layer hints
├── js/
│   └── main.js         # GSAP Observer, transitions, easing
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
- Open Graph (`og:title`, `og:description`) — social sharing
- Twitter Card tags
- `canonical` link — update with your repo URL before publishing

---

## Use Cases & Search Terms

This template helps developers searching for:

- **animation on scroll** — scroll-triggered section transitions
- **section by scroll** — discrete full-page section jumps
- **full page scroll javascript** — vanilla JS alternative to fullPage.js
- **GSAP scroll animation tutorial** — working Observer + CustomEase example
- **scroll snap animation** — event-driven snap without CSS scroll-snap
- **one scroll one page** — wheel event mapped to section index
- **open source scroll animation** — MIT licensed, fork-friendly

---

## Contributing

Contributions are welcome! Ideas:

- Horizontal section mode
- URL hash sync (`#section-2`)
- Progress bar animation
- React / Vue / Nuxt port
- More easing presets

1. Fork the repo
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

If this project helped you, consider giving it a **star** on GitHub — it helps others find this scroll animation template.

---

<p align="center">
  <strong>Section by Scroll</strong> — Animation on scroll, done right.<br/>
  <sub>GSAP · Observer · CustomEase · Vanilla JS · Open Source</sub>
</p>
