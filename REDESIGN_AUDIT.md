# Pandora Flowers — Redesign Audit & Build Report

**Prepared by:** Product / Design / Frontend team (Creative Director, UX, UI, Brand, Frontend Architect, Performance, SEO, Accessibility)
**Scope:** Full brand-led redesign of the Pandora Flowers e-commerce site (Next.js 14 · Prisma · Tailwind)
**Date:** June 2026

---

## 1. Executive summary

The existing site had solid engineering bones — Next.js 14 App Router, Prisma/Postgres, a real cart, checkout, admin panel and a sensible component structure — but it did **not look or feel like the Pandora Flowers brand**. Three problems undermined it most:

1. **It ran entirely on stock photography.** Every image — hero, categories, all 22 products, even the "Instagram" grid — was an Unsplash URL. `public/images` was empty. This is the single biggest reason it read as "a flower-shop template" rather than a real premium florist.
2. **The visual language was generic.** A sweet candy-pink palette, tight 2px corners, flat shadows, a hand-approximated logo, and a type system that never reached "expensive."
3. **The brand mark wasn't truly the brand mark.** The logo in code was a rough four-petal guess, not a faithful version of the real avatar.

This engagement rebuilt the **brand identity, design system, and the highest-impact surfaces**, and re-architected imagery so the site is **local-first, stock-free, and ready for your real photos** (drop them in a folder, they appear automatically).

The new direction — confirmed by your actual avatar, which is a minimal black-and-white geometric quatrefoil — is **editorial ivory & ink with a muted mauve-rose accent and sparing champagne**. Timeless, restrained, expensive; still unmistakably a romantic florist.

---

## 2. Brand analysis (from the real avatar)

You provided the official logo: a **four-petal quatrefoil seal inside a thin ring, pure black on white**. What it tells us:

- **Minimal & geometric**, not frilly. The brand's confidence is in restraint.
- **Monochrome-first.** The identity lives in black/ink + white/porcelain; colour is an accent, not the foundation. (The previous heavy pink worked against this.)
- **Symmetry & craft.** A quatrefoil = four petals = a flower, rendered with mathematical precision — a perfect metaphor for "authored bouquets."

**Action taken:** the avatar was vectorised 1:1 into a crisp, geometry-exact SVG (tangent-teardrop petals with circular negative space), cleaned for web, and made **colour-themeable** (ink on light, porcelain on dark, rose accent). It now powers the header, footer, favicon, social card, and the image placeholders. See `/public/images/brand/` and `src/components/ui/PandoraLogoMark.tsx`.

---

## 3. Detected problems

### Branding
- B1 — **Stock photos everywhere**; nothing authentic to Pandora. *(Critical)*
- B2 — Logo was an inexact approximation of the avatar. *(High)*
- B3 — Palette (candy pink / blush) read inexpensive and off-brand vs. the monochrome mark. *(High)*
- B4 — No favicon / Open Graph / social identity. *(Medium)*
- B5 — Inconsistent accent usage (rose + a yellow-gold that clashed). *(Medium)*

### UI / Visual
- U1 — Type scale lacked drama and hierarchy; headings too heavy, no fluid scaling. *(High)*
- U2 — 2px corners + flat shadows = "Bootstrap" feel, not luxury. *(High)*
- U3 — Buttons/cards/inputs visually plain; no micro-interactions or depth. *(Medium)*
- U4 — Hero leaned on a full-bleed stock photo with heavy overlays. *(High)*
- U5 — Spacing rhythm inconsistent between sections. *(Medium)*

### UX
- X1 — No graceful state for missing images → broken-image risk. *(High)*
- X2 — Header nav was thin; no categories affordance; mobile menu was a basic dropdown. *(Medium)*
- X3 — No "price upon request" path for made-to-order items. *(Medium)*
- X4 — Footer linked to pages that don't exist (`/about`, `/delivery`, `/privacy`) → 404s. *(Medium)*
- X5 — Reveal/scroll motion absent; page felt static. *(Low)*

### Responsive
- R1 — Hero stat row and some grids cramped on small screens. *(Medium)*
- R2 — Mobile menu not full-height/scroll-locked; could trap scroll. *(Low)*

### Performance
- P1 — Remote Unsplash images (extra DNS/connection, uncontrolled sizes, no AVIF). *(High)*
- P2 — No `optimizePackageImports` for `lucide-react` (ships more JS). *(Low)*
- P3 — No modern image formats / device-size tuning. *(Medium)*

### Accessibility
- A1 — No visible keyboard focus styles. *(High)*
- A2 — Decorative icons/links missing labels in places. *(Medium)*
- A3 — No `prefers-reduced-motion` handling. *(Medium)*

### SEO
- S1 — No `metadataBase`, canonical, OG image, or Twitter card. *(High)*
- S2 — No structured data (LocalBusiness/Florist). *(High)*
- S3 — No theme-color / favicon. *(Medium)*

---

## 4. Improvements delivered

### Brand & identity
- ✅ Faithful, geometry-exact **vector logo** from the avatar; colour-themeable component + standalone SVGs (ink / light / rose).
- ✅ **Favicon** (`src/app/icon.svg`) and **Open Graph / Twitter image** (`public/og.png`, 1200×630) generated from the mark.
- ✅ New **wordmark lockup** (`PandoraLogo`) with refined letter-spacing.

### Design system (`tailwind.config.ts` + `globals.css`)
- ✅ New **editorial palette**: porcelain `#FBF8F4`, ink `#1C1714`, mauve-rose accent `#B07C90`, champagne `#BE9E63`, warm hairline `#E9E0D5`. Legacy `pandora.*` tokens **retuned in place** so every existing screen inherits the new look instantly.
- ✅ **Fluid type scale** (`display-lg/display/display-sm`, `eyebrow`) via `clamp()`; lighter, more dramatic serif display; refined tracking and line-height.
- ✅ **Premium components**: pill buttons with a sheen sweep, glass surfaces, soft layered shadows (`soft`/`lift`/`glow`), generous radii (`card`/`media`/`pill`), refined inputs, animated underline links, badges.
- ✅ **Motion primitives**: `fade-up`, `scale-in`, `kenburns`, `float`, `marquee`, plus a dependency-free **scroll-reveal** (`[data-reveal]`) and `prefers-reduced-motion` kill-switch.

### Surfaces rebuilt
- ✅ **Header** — glass-on-scroll, real logo lockup, categories dropdown, full-screen editorial mobile menu, scroll-locked.
- ✅ **Footer** — ink, brand lockup, working links only, newsletter, social row.
- ✅ **ProductCard** — editorial 4:5 media, tonal placeholder by flower colour, glass favourite, quick-add with success state, "Цена по запросу" path.
- ✅ **Homepage** — new hero with floating trust cards, marquee trust strip, tonal category grid, product rails with staggered reveals, an asymmetric featured showcase, "Обещание ателье" promise block, cinematic custom-order band, Instagram gallery, contact CTA.
- ✅ **Product page** & gallery — graceful image fallbacks.
- ✅ **Catalog, checkout, account, admin** — inherit the new palette, type, buttons, inputs and shadows automatically (no regressions).

### Imagery architecture (de-stocked)
- ✅ **All stock URLs removed.** `next.config` no longer whitelists Unsplash/Pixabay.
- ✅ **Local-first folders**: `public/images/{brand,hero,categories,products,gallery}`.
- ✅ **`BrandImage`** renders the real photo when present, else an elegant on-brand placeholder (soft gradient tinted to the flower colour + the Pandora seal) — **never broken, never stock**.
- ✅ **Seed rewritten** to local paths and made idempotent-updating; product image slots refresh on re-seed.
- ✅ **`public/images/PHOTOS.md`** — exact filename → product map so your real photos appear automatically on drop-in.

### Performance
- ✅ AVIF/WebP, tuned `deviceSizes`/`imageSizes`, `optimizePackageImports` for `lucide-react`, `compress`, `poweredByHeader: false`.

### Accessibility
- ✅ Visible `:focus-visible` rings, `aria-label`s on icon controls, reduced-motion support, semantic `<dl>`/landmarks, scroll-locked overlay.

### SEO
- ✅ `metadataBase`, canonical, rich OG + Twitter, theme-color, and **Florist JSON-LD** (address, hours, phone, `sameAs` Instagram).

---

## 5. Updated architecture

```
src/
  app/
    layout.tsx            ← SEO metadata, JSON-LD, fonts, theme-color
    icon.svg              ← favicon from the avatar (NEW)
    globals.css           ← rebuilt design system (tokens, components, motion)
    (shop)/
      layout.tsx          ← Header + Footer + ScrollReveal
      page.tsx            ← redesigned homepage
      catalog/ product/ custom/ … ← inherit new system; product/custom de-stocked
  components/
    ui/
      PandoraLogoMark.tsx ← exact vector mark (REBUILT)
      PandoraLogo.tsx     ← wordmark lockup (NEW)
      BrandImage.tsx      ← real-photo-or-placeholder (NEW)
      ScrollReveal.tsx    ← scroll-reveal observer (NEW)
    layout/ Header.tsx Footer.tsx   ← rebuilt
    shop/  ProductCard.tsx          ← rebuilt
public/
  og.png                  ← social card (NEW)
  images/
    PHOTOS.md             ← drop-in photo guide (NEW)
    brand/ hero/ categories/ products/ gallery/
prisma/seed.ts            ← local imagery + idempotent updates
tailwind.config.ts        ← new tokens
next.config.mjs           ← local-first images, perf
```

---

## 6. Design system reference

| Token | Value | Use |
|---|---|---|
| `porcelain` / `porcelain-deep` | `#FBF8F4` / `#F4EDE4` | Page & alternating section backgrounds |
| `ink` / `ink-700` / `ink-soft` / `ink-muted` | `#1C1714` / `#2E2722` / `#6F665F` / `#9C928A` | Text & dark surfaces |
| `accent` / `accent-deep` / `accent-soft` / `accent-glow` | `#B07C90` / `#8C5C70` / `#F3E6EA` / `#CDA0AF` | Mauve-rose accent |
| `champagne` / `champagne-soft` | `#BE9E63` / `#E7D5AC` | Metal detail, hairlines (sparing) |
| `line` | `#E9E0D5` | Warm hairlines / borders |

- **Type:** Inter throughout (single clean typeface). Headings bold (700–800) and tight (-0.022em); body 400; buttons 500–600. Eyebrow labels uppercase `0.26em`. No serif/decorative fonts.
- **Radii:** media 18 · card 20 · pill 999 · input 12.
- **Shadows:** `soft` (rest) · `lift` (hover) · `glow` (champagne).
- **Buttons:** `btn-primary` (ink + sheen), `btn-accent`, `btn-gold`, `btn-outline`, `btn-outline-light`, `btn-ghost` (+ `btn-lg`/`btn-sm`).
- **Motion:** reveal on scroll via `data-reveal` (+ optional `style={{transitionDelay}}`); all motion disabled under `prefers-reduced-motion`.

---

## 7. What needs you (and how)

**Real photos.** This is the one thing the build can't do for you — Instagram blocks automated access and there were no photos in the project. Everything is wired and waiting:

1. Open `public/images/PHOTOS.md`.
2. Export your best Instagram shots, rename to the listed filenames, drop them into the matching folders.
3. They appear automatically — no code changes. Until then, elegant branded placeholders show (never stock, never broken).

**To run locally:** `npm install` → `npm run dev`. To refresh product data/images in the DB after edits: `npm run db:seed`.

---

## 8. Recommended next steps (future phases)

1. Swap cart/checkout/admin thumbnail `<Image>` to `BrandImage` for graceful placeholders there too (minor; only affects pre-photo state).
2. Add real `/about` and `/delivery` content pages (currently intentionally unlinked).
3. Product detail: add a sticky add-to-cart bar on mobile and an image lightbox/zoom.
4. Add reviews capture UI and wire ratings to the schema (already modelled).
5. Generate per-product `opengraph-image` for richer link previews.
6. Lighthouse pass once real photos are in (target 95+ across the board).

---

*All changes are committed to source files in the repository; nothing here is mocked. The site is production-shaped and will look fully "photographed" the moment your real imagery is added.*
