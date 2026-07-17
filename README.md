# W Steak Restaurant — Editorial Landing Page (v2)

> **Unofficial redesign concept.** This project is not affiliated with, endorsed by, or maintained by [W Steak Restaurant](https://wrestaurant.cz/) (W Restaurant & Whiskey Bar, Prague).

An **alternative editorial** UI/UX concept for the landing page of **W Steak Restaurant — Meat, Wine & Whiskey**, built as a second portfolio exploration alongside the [original dark & gold concept](https://github.com/Zirvey/w-steak-restaurant-landing-page).

[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-d49653?style=for-the-badge)](https://zirvey.github.io/w-steak-restaurant-landing-page-v2/)
[![License: MIT](https://img.shields.io/badge/license-MIT-44403C?style=for-the-badge)](LICENSE)
[![v1 concept](https://img.shields.io/badge/related-v1%20concept-231F20?style=for-the-badge)](https://github.com/Zirvey/w-steak-restaurant-landing-page)

![Hero section — desktop preview](docs/screenshots/hero-desktop.jpg)

---

## Preview

Screenshots and atmosphere video below are from **this editorial (v2) site only** — not from the official restaurant site or the v1 concept.

### Desktop

| Hero | Experience |
|:---:|:---:|
| ![Hero](docs/screenshots/hero-desktop.jpg) | ![Experience](docs/screenshots/experience.jpg) |

| Menu | About |
|:---:|:---:|
| ![Menu](docs/screenshots/menu.jpg) | ![About](docs/screenshots/about.jpg) |

### Mobile

![Mobile hero](docs/screenshots/hero-mobile.jpg)

### Atmosphere video

Local grill / steak clips used on the page:

- `assets/video/hero-grill.mp4`
- `assets/video/steak-cut.mp4`
- `assets/video/meat-grill.mp4` (fallback)

---

## About this project

This repository contains a **non-production, unofficial** front-end concept that reimagines the public landing experience for [wrestaurant.cz](https://wrestaurant.cz/) with an **Amrit Palace–inspired editorial** system (parchment canvas, saffron accent, sharp edges).

| | |
|---|---|
| **Purpose** | UI/UX redesign study & portfolio showcase (alternative direction) |
| **Status** | Concept / demo only |
| **Sibling concept** | [w-steak-restaurant-landing-page](https://github.com/Zirvey/w-steak-restaurant-landing-page) (dark & gold) |
| **Official website** | [wrestaurant.cz](https://wrestaurant.cz/) |
| **Reservations** | [wrestaurant.cz/book-a-table](https://wrestaurant.cz/book-a-table) |

Content (copy, menu prices, imagery, logo) is sourced from the official website for demonstration purposes. All restaurant branding and trademarks belong to their respective owners.

---

## Features

- **Editorial parchment & saffron** visual language (Amrit Palace token set)
- **Full-bleed dark hero** with typography entrance and steak still
- **Local atmosphere video** sections (grill / cut) with `prefers-reduced-motion` fallbacks
- **Marquee** dish-name scroll as primary extended motion
- **Menu highlights** with pricing from the official menu
- **Sharp cards**, ghost outlined buttons, hairline dividers
- **Fully responsive** layout (mobile → desktop)
- **`noindex`** meta — concept demo only

### Design system

| File | Purpose |
|------|---------|
| `design-system/tokens.json` | Design tokens (colors, type, spacing) |
| `design-system/variables.css` | CSS custom properties |
| `design-system/theme.css` | Tailwind v4 `@theme` reference |
| `design-system/DESIGN.md` | Full style reference and component rules |

**Applied for W Steak:**

- Parchment canvas `#d8cbb8`, saffron accent `#d49653`, warm onyx text
- Display: **Cormorant Garamond** 300
- UI/body: **DM Sans** 500

---

## Quick start

No build step required — static HTML, CSS, and vanilla JavaScript.

```bash
# Clone
git clone https://github.com/Zirvey/w-steak-restaurant-landing-page-v2.git
cd w-steak-restaurant-landing-page-v2

# Serve locally (recommended — avoid file://)
python3 -m http.server 8765 --bind 127.0.0.1
# → http://127.0.0.1:8765/
```

Or:

```bash
npm start
```

### Regenerate screenshots

Serve the site, then:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 &
npm install puppeteer --no-save
npm run screenshots
# converts PNGs → optimized JPGs via sips (macOS)
```

---

## Project structure

```
├── index.html              # Main landing page
├── css/styles.css          # Custom styles & animations
├── js/main.js              # Nav, video, reveals, marquee
├── assets/
│   ├── logo.png
│   ├── favicon.ico
│   ├── images/             # Photography from wrestaurant.cz
│   └── video/              # Local atmosphere clips (v2 only)
├── design-system/          # Amrit Palace editorial tokens
├── docs/screenshots/       # README preview images (v2 site)
├── scripts/
│   ├── serve.sh
│   └── capture-screenshots.mjs
├── LICENSE                 # MIT — code in this repo
├── NOTICE.md               # Third-party assets & trademarks
└── DISCLAIMER.md           # Unofficial concept notice
```

---

## Deployment

### GitHub Pages (recommended)

This repo includes a GitHub Actions workflow that deploys on every push to `main`.

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**
3. After the first successful workflow run, the site is available at:
   `https://zirvey.github.io/w-steak-restaurant-landing-page-v2/`

Manual fallback (branch deploy):

1. **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` / root (`/`)

`.nojekyll` is included so asset paths are served as-is.

### Any static host

Upload the repository root to Netlify, Vercel, Cloudflare Pages, or any static file server.

---

## Disclaimer

This is a **personal design concept**. It must not be presented as the official website of W Steak Restaurant. For real bookings, menu, and events always use [wrestaurant.cz](https://wrestaurant.cz/).

See [DISCLAIMER.md](DISCLAIMER.md) for the full legal notice.

---

## Third-party content

Logo, photography, menu data, and brand elements are property of W Steak Restaurant / wrestaurant.cz. See [NOTICE.md](NOTICE.md).

---

## Author

**Zirvey** · [temirlankakishev@gmail.com](mailto:temirlankakishev@gmail.com)

---

## License

Source code in this repository is licensed under the [MIT License](LICENSE).

Third-party brand assets and content are **not** covered by this license. See [NOTICE.md](NOTICE.md).
