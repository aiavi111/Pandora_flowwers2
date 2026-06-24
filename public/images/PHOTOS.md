# 📸 Pandora Flowers — where to drop your real photos

The website is wired to **local images only** (no stock photos). Until a file
exists, the site shows an elegant on-brand placeholder (soft gradient + the
Pandora seal). **The moment you drop a correctly-named photo into the folders
below, it appears on the site automatically** — no code changes needed.

> Tip: export your best shots straight from Instagram, rename them to match the
> filenames below, and copy them into the matching folder. Keep originals; the
> app optimises them automatically (AVIF/WebP, responsive sizes).

## Recommended formats
- **Format:** `.jpg` (or `.webp`). Keep the exact filenames below.
- **Products:** portrait **4:5**, ≥ **1200 × 1500 px**.
- **Categories:** portrait **3:4**, ≥ **800 × 1066 px**.
- **Hero:** `hero-1.jpg` portrait **4:5**, ≥ **1400 × 1750 px**.
- **Custom band:** `custom-1.jpg` landscape **16:9**, ≥ **1600 × 900 px**.
- **Instagram gallery:** square **1:1**, ≥ **800 × 800 px**.

---

## 1) Hero & banners — `/public/images/hero/`
| File | Used on | Ratio |
|---|---|---|
| `hero-1.jpg` | Homepage hero (main bouquet) | 4:5 |
| `custom-1.jpg` | "Букет на заказ" band (home + custom page) | 16:9 |

## 2) Instagram gallery — `/public/images/gallery/`
`post-1.jpg`, `post-2.jpg`, `post-3.jpg`, `post-4.jpg`, `post-5.jpg`, `post-6.jpg`

## 3) Categories — `/public/images/categories/`
| File | Category |
|---|---|
| `roses.jpg` | Розы |
| `peonies.jpg` | Пионы |
| `bouquets.jpg` | Авторские букеты |
| `tulips.jpg` | Тюльпаны |
| `mono.jpg` | Монобукеты |
| `gifts.jpg` | Подарки |
| `wedding.jpg` | Свадебные |
| `chrysanthemums.jpg` | Хризантемы |

## 4) Products — `/public/images/products/`
Each product needs `-1` (main) and `-2` (hover/gallery). Two flagships also use `-3`.

| Files | Product |
|---|---|
| `passion-25-red-roses-1.jpg` · `-2` · `-3` | Страсть — 25 красных роз |
| `monaco-51-mixed-roses-1.jpg` · `-2` | Монако — 51 роза микс |
| `eternity-101-roses-1.jpg` · `-2` | Вечность — 101 роза |
| `tenderness-15-white-roses-1.jpg` · `-2` | Нежность — 15 белых роз |
| `pink-dream-35-roses-1.jpg` · `-2` | Розовая мечта — 35 роз |
| `peony-paradise-15-1.jpg` · `-2` | Пионовый рай — 15 пионов |
| `french-chic-25-peonies-1.jpg` · `-2` | Французский шик — 25 пионов |
| `pandora-secret-1.jpg` · `-2` · `-3` | Pandora Secret — авторский |
| `botanical-garden-1.jpg` · `-2` | Ботанический сад — авторский |
| `moonlight-white-author-1.jpg` · `-2` | Лунный свет — белый авторский |
| `spring-hello-25-tulips-1.jpg` · `-2` | Весенний привет — 25 тюльпанов |
| `holland-51-tulips-1.jpg` · `-2` | Голландия — 51 тюльпан |
| `orchid-tenderness-1.jpg` · `-2` | Орхидея — Нежность |
| `hydrangea-luxury-7-1.jpg` · `-2` | Гортензия люкс — 7 веток |
| `pandora-belgian-chocolate-1.jpg` · `-2` | Бельгийский шоколад Pandora |
| `teddy-bear-35cm-1.jpg` · `-2` | Мишка Тедди 35 см |
| `birthday-balloons-1.jpg` · `-2` | Шары «С Днём Рождения» |
| `romantic-gift-set-1.jpg` · `-2` | Подарочный набор «Романтика» |
| `bridal-bouquet-blanc-1.jpg` · `-2` | Букет невесты «Blanc» |
| `chrysanthemums-autumn-garden-1.jpg` · `-2` | Хризантемы — Осенний сад |

---

## Notes
- **Product images live in the database.** The seed already points every product
  at the paths above, so just dropping the files in is enough. If you ever change
  product data, run `npm run db:seed` to refresh (it now updates existing rows).
- **Logo / favicon** are already done from your avatar — see `/public/images/brand/`
  (`pandora-mark-ink.svg`, `-light.svg`, `-rose.svg`) and `src/app/icon.svg`.
- Don't have all photos yet? No problem — ship as-is; placeholders look intentional
  and you can fill folders over time.
