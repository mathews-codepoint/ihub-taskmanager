# iHub Design System

**Operational Command Center — Tamdeen Entertainment**
Derived from the iHub dashboard. Bilingual (EN / AR), light-first ("Paper") with an optional dark ("Ink") theme.

---

## 1. Foundations

### 1.1 Themes
- **Paper** (default) — light surfaces, per Tamdeen Digital Guideline.
- **Ink** (optional) — dark surfaces, set via `body[data-theme="ink"]`.

The active accent is applied live by the app; Tamdeen Magenta is the default primary brand accent.

### 1.2 Color — Neutrals (Paper)
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#ECECF0` | App canvas |
| `--bg-2` | `#F6F6F8` | Raised chrome: sidebar, inputs, tab strips, hover |
| `--paper` | `#FFFFFF` | Cards, default surface |
| `--paper-2` | `#ECECF0` | Insets, tracks, chip ground |
| `--line` | `#E4E4EA` | Hairlines, dividers |
| `--line-2` | `#D3D3DC` | Input borders, stronger dividers |
| `--text` | `#1A1A1F` | Ink Black — headings, anchors |
| `--text-2` | `#44444C` | Body |
| `--text-3` | `#757575` | Neutral Gray — meta, captions |
| `--text-4` | `#9A9AA3` | Faint labels |

### 1.3 Color — Semantic (meaning, not decoration)
| Token | Hex | Meaning |
|---|---|---|
| `--ok` | `#1E9E63` | Success (Mint family) |
| `--warn` | `#B5791F` | Pending (Amber family) |
| `--bad` | `#D32414` | Risk (Signal Red) |
| `--info` | `#5B53A8` | Neutral info (Periwinkle) |

All tuned for AA contrast on light surfaces.

### 1.4 Color — Brand palette (Tamdeen guideline)
| Token | Hex |
|---|---|
| `--brand-purple` (Tamdeen Magenta) | `#93358D` |
| `--brand-indigo` (Deep Plum) | `#3B2D59` |
| `--brand-red` (Signal Red) | `#EE3124` |
| `--brand-orange` | `#E57828` |
| `--brand-yellow` | `#EFAC37` |
| `--brand-lilac` | `#B282BA` |
| `--brand-pink` | `#DEB0D2` |
| `--brand-periwinkle` | `#7670B3` |
| `--brand-mint` | `#73C69C` |

### 1.5 Color — Interactive blues (guideline §03/02)
Medium Blue is the default interaction color for **buttons and links**. Magenta is a brand accent, **never** a button fill.
| Token | Hex | Role |
|---|---|---|
| `--blue-dark` | `#1E2A4D` | Hover / pressed |
| `--blue-med` | `#4F6FB8` | Default buttons & links |
| `--blue-light` | `#B0BDF5` | Tint |
| `--blue-soft` | `#EAEEFB` | Soft tint / hover ground |

### 1.6 Accent tokens
| Token | Value | Role |
|---|---|---|
| `--accent` | `#93358D` | Primary brand accent (set live) |
| `--accent-dim` | `#93358D1F` | 12% tint — active nav, chips, focus ring |
| `--accent-ink` | `#FFFFFF` | Text/icon on accent |

**Accent options:** Tamdeen Magenta `#93358D` (primary) · Deep Plum `#3B2D59` (support dark) · Signal Red `#EE3124` (secondary).

---

## 2. Typography

### 2.1 Type families
- **Latin primary:** 29LT Zarid Sans (ExtraLight / Regular / Bold). Fallback: Myriad Pro → Calibri → system.
- **Arabic primary:** GE SS (Light / Medium / Bold + Light Italic), then BCN Arabic Rounded. Calibri is the office fallback.
- **Numerals:** always **Calibri** (Carlito / Segoe UI fallback), tabular. Applied via a `unicode-range` override so digits/currency/date punctuation render in Calibri even inside Zarid/Cormorant runs.
- **Emphasis motif:** Cormorant *italic* in magenta — used only for the purple emphasis motif and the leading "i" of the iHub wordmark.

### 2.2 Font tokens
```
--font-sans:    'NumCalibri', 'Zarid Sans', 'Myriad Pro', 'Calibri', system-ui, sans-serif;
--font-serif:   'NumCalibri', 'Cormorant', 'Times New Roman', serif;   /* emphasis motif only */
--font-display: var(--font-sans);
--font-ui:      var(--font-sans);
--font-arabic:  'NumCalibri', 'GE SS', 'GE SS Two', 'GE SS Text', 'BCN Arabic', sans-serif;
--font-num:     'Calibri', 'Carlito', 'Segoe UI', system-ui, sans-serif;
```

### 2.3 Base & rhythm
- Body: 15px / line-height 1.5. Arabic (`body[dir="rtl"]`) gets +5% → 1.58.
- `.display`: display weight 500, letter-spacing −0.02em.
- `.display em`, `h1 em`, `h2 em`: serif optically nudged to 1.06em.
- Font smoothing on; `text-rendering: optimizeLegibility`.

### 2.4 Text treatments
| Class | Use | Spec |
|---|---|---|
| `.display` | Page/hero titles | `--font-display`, 500, −0.02em |
| `.eyebrow` | Kicker / label | mono, 12px, uppercase, +0.16em tracking, `--text-3` |
| `.num` / `.tnum` | Numerals | Calibri, tabular-nums |
| `em` / `.accent-em` | Emphasis motif | serif italic, 500, magenta |

Arabic: emphasis stays upright and bold (no serif-italic motif in RTL).

---

## 3. Shape, elevation & motion

### 3.1 Radii (6px controls / 10px cards)
| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | Controls (buttons, inputs) |
| `--radius` | 8px | Default |
| `--radius-lg` | 10px | Cards, modals |
| `--radius-xl` | 14px | Large containers |
| pills / chips | `999px` | Chips, toggles |

### 3.2 Elevation
- Cards are flat by default (1px `--line` border, no shadow).
- Hover lift (`.lift`): `box-shadow: 0 2px 10px rgba(20,20,30,0.05)` + border → `--line-2`.
- Modal / overlay shadow: `0 24px 80px rgba(26,26,31,0.4)`; scrim `rgba(26,26,31,0.5)`.

### 3.3 Focus ring
3px magenta ring: `outline: 3px solid var(--accent-dim); box-shadow: 0 0 0 1px var(--accent); outline-offset: 2px`. Buttons use a soft Medium-Blue ring instead.

### 3.4 Motion
| Keyframe / class | Effect | Timing |
|---|---|---|
| `.rise` | fade + 6px rise | 0.5s `cubic-bezier(.2,.7,.2,1)` |
| `.grow-bar` | bar scaleX 0→1 (left origin) | 0.9s `cubic-bezier(.2,.7,.2,1)` |
| `slide-in-r` | fade + 8px slide | — |
| `pulse-soft` | opacity 1↔0.55 | — |

Standard easing curve across the system: `cubic-bezier(.2,.7,.2,1)`.

---

## 4. Components

### 4.1 Buttons (guideline §05/01)
One primary per view. Labels sentence case — never all-caps. Default 40px height, 6px radius, 14px/Medium.

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| `.primary` | Medium Blue `--blue-med` | #FFF | none | → `--blue-dark` |
| `.secondary` | `--paper` | `--blue-med` | `--blue-med` | `--blue-soft` bg |
| `.ghost` | transparent | `--text-2` | none | `--bg-2` bg |
| `.tertiary` | transparent (tight pad) | `--blue-med` | none | `--blue-soft` bg |
| `.danger` | `--brand-red` | #FFF | none | brightness 0.92 |
| disabled | `--bg-2` | `--text-4` | `--line` | none |

**Sizes:** `.lg` 48px/15px · default 40px/14px · `.sm` 32px/13px. Active state nudges `translateY(1px)`.

### 4.2 Chips / badges
Pill, 12px/500, `--paper-2` ground + `--line` border. Semantic variants tint at 14% fill / 32% border: `.ok` `.warn` `.bad` `.info` `.accent`.

### 4.3 Cards
`.card` = `--paper` bg + 1px `--line` border + `--radius-lg`. Global card style switch via `body[data-card="…"]`: `soft` (default) · `outlined` (transparent bg) · `flat` (no border; dividers via `.card-divider`).

### 4.4 Navigation (sidebar)
`.nav-item`: 9px/12px pad, 14px/500, `--radius-sm`. Hover → `--bg`. Active → `--accent-dim` ground, magenta text, 600 weight, plus a 3px magenta rail on the inline-start edge (mirrors correctly in RTL).

### 4.5 Tables & rows
`tr.row-open:hover` → `--bg-2`. Column heads use `.eyebrow` styling (uppercase, tracked, `--text-3`). Numeric cells use `.num`.

### 4.6 Other utilities
- `.hairline` — 1px `--line` divider.
- `.bars` — mini bar chart, 40px tall, accent-dim bars.
- `.kbd` — keyboard hint, mono 11px, paper ground + `--line` border.
- Scrollbars: 10px, `--line-2` thumb (→ `--text-4` on hover), transparent track.

### 4.7 Overlays / modals
Full-viewport scrim `rgba(26,26,31,0.5)`, centered card on `--paper`/`--bg`, `--radius-lg`, deep shadow. Rendered through a portal to `document.body` so `position: fixed` measures against the viewport. Sticky header bar (`--paper` + bottom `--line`) with ID + close; scrollable body.

---

## 5. Iconography
Inline SVG set, line style: `viewBox 0 0 24 24`, **1.6px stroke**, round caps/joins, `currentColor`, 20px default. Icons accept `{size, style, className, fill, stroke}`.

---

## 6. Logo
- Full-colour logo on Paper; white logo on Ink (`body[data-theme="ink"]` swaps `.brand-logo-color` / `.brand-logo-white`).
- The wordmark's leading "i" carries the magenta serif-italic emphasis motif.

---

## 7. Bilingual & RTL
- `body[dir="rtl"]` switches to `--font-arabic` and +5% line-height.
- Active-nav rail and directional affordances mirror automatically.
- Arabic drops the Latin serif-italic emphasis motif — emphasis renders upright and bold.
- Numerals stay Calibri/tabular in both directions.

---

*Reference implementation: `index.html` — global tokens & styles in `installGlobalStyles()`.*
