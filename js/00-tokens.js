// Design tokens + global styles for iHub — Tamdeen Entertainment guideline applied.
// Exports T (tokens), accent swatches, and installs CSS variables + base styles.
// Default theme: "paper" (light, per Tamdeen Digital Guideline). "ink" = dark surfaces.

// Brand colors per Tamdeen guideline. Three accent options from primary/secondary/support palettes.
const ACCENTS = {
  purple: {
    name: 'Tamdeen Magenta',
    hex: '#93358D',
    ink: '#FFFFFF'
  },
  // primary
  indigo: {
    name: 'Deep Plum',
    hex: '#3B2D59',
    ink: '#FFFFFF'
  },
  // support dark
  crimson: {
    name: 'Signal Red',
    hex: '#EE3124',
    ink: '#FFFFFF'
  } // secondary
};
const CARD_STYLES = {
  soft: {
    name: 'Soft'
  },
  outlined: {
    name: 'Outlined'
  },
  flat: {
    name: 'Flat'
  }
};
function installGlobalStyles() {
  if (document.getElementById('ihub-global-styles')) return;
  const s = document.createElement('style');
  s.id = 'ihub-global-styles';
  s.textContent = `
    /* ── Brand typefaces (Tamdeen guideline) ──────────────────────────────
       Latin primary: 29LT Zarid Sans (ExtraLight / Regular / Bold)
       Arabic primary: BCN Arabic Rounded (Medium / Bold)
       Calibri is the office fallback per the guideline. */
    @font-face {
      font-family: 'Zarid Sans';
      src: url('${(window.__resources&&window.__resources.fontZaridExtraLight)||'fonts/ZaridSans-ExtraLight.otf'}') format('opentype');
      font-weight: 200 350; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'Zarid Sans';
      src: url('${(window.__resources&&window.__resources.fontZaridRegular)||'fonts/ZaridSans-Regular.otf'}') format('opentype');
      font-weight: 360 550; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'Zarid Sans';
      src: url('${(window.__resources&&window.__resources.fontZaridBold)||'fonts/ZaridSans-Bold.otf'}') format('opentype');
      font-weight: 560 900; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'BCN Arabic';
      src: url('${(window.__resources&&window.__resources.fontBcnMedium)||'fonts/BCNArabicRounded-Medium.otf'}') format('opentype');
      font-weight: 300 550; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'BCN Arabic';
      src: url('${(window.__resources&&window.__resources.fontBcnBold)||'fonts/BCNArabicRounded-Bold.otf'}') format('opentype');
      font-weight: 560 900; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'Myriad Pro';
      src: url('${(window.__resources&&window.__resources.fontMyriad)||'fonts/MyriadPro-Regular.otf'}') format('opentype');
      font-weight: 400; font-style: normal; font-display: swap;
    }
    /* Arabic primary: GE SS (Light / Medium / Bold + Light Italic) */
    @font-face {
      font-family: 'GE SS';
      src: url('${(window.__resources&&window.__resources.fontGessLight)||'fonts/GESS-Light.otf'}') format('opentype');
      font-weight: 200 350; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'GE SS';
      src: url('${(window.__resources&&window.__resources.fontGessMedium)||'fonts/GESS-Medium.otf'}') format('opentype');
      font-weight: 360 550; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'GE SS';
      src: url('${(window.__resources&&window.__resources.fontGessBold)||'fonts/GESS-Bold.otf'}') format('opentype');
      font-weight: 560 900; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'GE SS';
      src: url('${(window.__resources&&window.__resources.fontGessLightItalic)||'fonts/GESS-LightItalic.otf'}') format('opentype');
      font-weight: 200 550; font-style: italic; font-display: swap;
    }

    :root {
      /* ── PAPER (light) — default per Tamdeen guideline ── */
      --bg:        #ECECF0;   /* app canvas (Surface Tint family) */
      --bg-2:      #F6F6F8;   /* raised chrome: sidebar, inputs, tab strips, hover */
      --paper:     #FFFFFF;   /* cards, default surface */
      --paper-2:   #ECECF0;   /* insets, tracks, chip ground */
      --line:      #E4E4EA;   /* hairlines, dividers */
      --line-2:    #D3D3DC;   /* input borders, stronger dividers */
      --text:      #1A1A1F;   /* Ink Black — headings, anchors */
      --text-2:    #44444C;   /* body */
      --text-3:    #757575;   /* Neutral Gray — meta, captions */
      --text-4:    #9A9AA3;   /* faint labels */

      /* Semantic — tuned for AA contrast on light surfaces. Meaning, not decoration. */
      --ok:    #1E9E63;   /* Mint family — success */
      --warn:  #B5791F;   /* Amber family — pending */
      --bad:   #D32414;   /* Signal Red — risk */
      --info:  #5B53A8;   /* Periwinkle — neutral info */

      --accent:      #93358D;   /* Tamdeen Magenta — primary action (set live by App) */
      --accent-dim:  #93358D1F;
      --accent-ink:  #FFFFFF;

      /* Brand palette (Tamdeen guideline) */
      --brand-purple:   #93358D;
      --brand-indigo:   #3B2D59;
      --brand-red:      #EE3124;
      --brand-orange:   #E57828;
      --brand-yellow:   #EFAC37;
      --brand-lilac:    #B282BA;
      --brand-pink:     #DEB0D2;
      --brand-periwinkle:#7670B3;
      --brand-mint:     #73C69C;

      /* Interactive blues (guideline §03/02): Medium Blue = default for buttons & links,
         Dark Blue = hover/pressed, Light Blue + Soft = tints. Magenta stays a brand accent, not a button color. */
      --blue-dark:  #1E2A4D;
      --blue-med:   #4F6FB8;
      --blue-light: #B0BDF5;
      --blue-soft:  #EAEEFB;

      /* 6px controls / 8px cards per guideline component anatomy */
      --radius-sm: 6px;
      --radius:    8px;
      --radius-lg: 10px;
      --radius-xl: 14px;

      /* Primary type: 29LT Zarid Sans (Latin) + BCN Arabic Rounded (Arabic); Myriad Pro / Calibri fallback.
         Cormorant italic in magenta is kept ONLY for the purple emphasis motif. */
      --font-sans:    'Zarid Sans', 'Myriad Pro', 'Calibri', system-ui, sans-serif;
      --font-serif:   'Cormorant', 'Times New Roman', serif;
      --font-display: var(--font-sans);
      --font-ui:      var(--font-sans);
      --font-arabic:  'GE SS', 'GE SS Two', 'GE SS Text', 'BCN Arabic', sans-serif;
      --font-mono:    var(--font-sans);
    }

    /* ── INK (dark) — optional, original surface set ── */
    body[data-theme="ink"] {
      --bg:        oklch(0.18 0.008 240);
      --bg-2:      oklch(0.21 0.008 240);
      --paper:     oklch(0.235 0.009 240);
      --paper-2:   oklch(0.27 0.01 240);
      --line:      oklch(0.32 0.01 240);
      --line-2:    oklch(0.40 0.012 240);
      --text:      oklch(0.97 0.005 240);
      --text-2:    oklch(0.78 0.01 240);
      --text-3:    oklch(0.58 0.01 240);
      --text-4:    oklch(0.45 0.008 240);

      --ok:    oklch(0.80 0.15 155);
      --warn:  oklch(0.82 0.14 75);
      --bad:   oklch(0.72 0.16 22);
      --info:  oklch(0.78 0.12 235);

      /* Blues lifted for legibility on dark surfaces */
      --blue-med:  #8AA4E6;
      --blue-soft: color-mix(in srgb, #4F6FB8 26%, transparent);
    }

    * { box-sizing: border-box; }
    html, body, #root { height: 100%; }
    body {
      margin: 0;
      font-family: var(--font-ui);
      font-size: 15px;
      line-height: 1.5;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    /* Arabic gets +5% line-height per guideline */
    body[dir="rtl"] { line-height: 1.58; }

    /* ── Logo: full-colour on Paper, white on Ink (guideline §02/02) ── */
    .brand-logo { display: block; }
    .brand-logo-color { display: block; }
    .brand-logo-white { display: none; }
    body[data-theme="ink"] .brand-logo-color { display: none; }
    body[data-theme="ink"] .brand-logo-white { display: block; }

    /* scrollbars */
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--line-2); border-radius: 8px; border: 2px solid var(--bg); }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-4); }

    /* utility: card */
    .card {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
    }
    body[data-card="outlined"] .card {
      background: transparent;
      border: 1px solid var(--line);
    }
    body[data-card="flat"] .card {
      background: transparent;
      border: 1px solid transparent;
    }
    body[data-card="flat"] .card-divider { border-color: var(--line); }

    /* RTL */
    body[dir="rtl"] { font-family: var(--font-arabic); }
    body[dir="rtl"] .display { font-family: var(--font-arabic); }
    /* Arabic does not use the Latin serif-italic motif — keep emphasis upright */
    body[dir="rtl"] em, body[dir="rtl"] .accent-em { font-family: var(--font-arabic); font-style: normal; font-weight: 700; }

    /* animations */
    @keyframes pulse-soft { 0%,100% { opacity: 1 } 50% { opacity: 0.55 } }
    @keyframes rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes slide-in-r { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
    @keyframes width-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

    .rise { animation: rise 0.5s cubic-bezier(.2,.7,.2,1) both; }
    .grow-bar { transform-origin: left; animation: width-grow 0.9s cubic-bezier(.2,.7,.2,1) both; }

    button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
    a { color: inherit; text-decoration: none; }

    /* focus ring — guideline 3px magenta ring */
    :where(button, a, [tabindex]):focus-visible {
      outline: 3px solid var(--accent-dim);
      box-shadow: 0 0 0 1px var(--accent);
      outline-offset: 2px;
      border-radius: 6px;
    }

    /* number styling — tabular numerals per guideline */
    .num { font-family: var(--font-sans); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
    .display { font-family: var(--font-display); font-weight: 500; letter-spacing: -0.02em; }

    /* ── Emphasis motif (guideline): key words set in Cormorant italic magenta ──
       Applies to any <em> or .accent-em. The leading "i" of the iHub wordmark
       uses the same treatment. */
    em, .accent-em, .display em {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 500;
      color: var(--accent);
      letter-spacing: 0;
    }
    /* serif sits optically smaller than the sans around it — nudge up */
    .display em, h1 em, h2 em { font-size: 1.06em; line-height: 1; }

    /* text treatments — Label / eyebrow: DM Mono, +tracking (guideline §04) */
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--text-3);
      font-weight: 500;
    }

    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 9px; border-radius: 999px;
      font-size: 12px; font-weight: 500;
      background: var(--paper-2); color: var(--text-2);
      border: 1px solid var(--line);
    }
    .chip.ok   { background: color-mix(in srgb, var(--ok) 14%, transparent); color: var(--ok); border-color: color-mix(in srgb, var(--ok) 32%, transparent); }
    .chip.warn { background: color-mix(in srgb, var(--warn) 14%, transparent); color: var(--warn); border-color: color-mix(in srgb, var(--warn) 32%, transparent); }
    .chip.bad  { background: color-mix(in srgb, var(--bad) 14%, transparent); color: var(--bad); border-color: color-mix(in srgb, var(--bad) 32%, transparent); }
    .chip.info { background: color-mix(in srgb, var(--info) 14%, transparent); color: var(--info); border-color: color-mix(in srgb, var(--info) 32%, transparent); }
    .chip.accent { background: var(--accent-dim); color: var(--accent); border-color: color-mix(in srgb, var(--accent) 32%, transparent); }

    /* ── Buttons (guideline §05/01) ────────────────────────────────
       Primary = Medium Blue (the interaction color); magenta is a brand
       accent, never a button fill. One primary per view. Labels sentence
       case — never all-caps. 40px default height · 6px radius · 14/Medium.
       Variants by weight: primary › secondary › ghost / tertiary › danger. */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      height: 40px; padding: 0 20px;
      border-radius: var(--radius-sm);
      font-family: var(--font-sans); font-weight: 500; font-size: 14px; letter-spacing: 0;
      background: var(--paper); color: var(--text);
      border: 1px solid var(--line-2);
      white-space: nowrap;
      transition: transform .12s, background .15s, border-color .15s, color .15s, box-shadow .15s;
    }
    .btn:hover { background: var(--bg-2); border-color: var(--text-4); }
    .btn:active { transform: translateY(1px); }
    .btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue-med) 35%, transparent);
    }

    /* Primary — Medium Blue → Dark Blue on hover */
    .btn.primary { background: var(--blue-med); color: #FFFFFF; border-color: transparent; }
    .btn.primary:hover { background: var(--blue-dark); filter: none; }

    /* Secondary — outlined Medium Blue */
    .btn.secondary { background: var(--paper); color: var(--blue-med); border-color: var(--blue-med); }
    .btn.secondary:hover { background: var(--blue-soft); border-color: var(--blue-med); color: var(--blue-dark); }

    /* Ghost — quiet, borderless (low-emphasis + icon actions) */
    .btn.ghost { background: transparent; border-color: transparent; color: var(--text-2); }
    .btn.ghost:hover { background: var(--bg-2); color: var(--text); border-color: transparent; }

    /* Tertiary — text-only blue, tighter padding */
    .btn.tertiary { background: transparent; color: var(--blue-med); border-color: transparent; padding: 0 12px; }
    .btn.tertiary:hover { background: var(--blue-soft); color: var(--blue-dark); }

    /* Danger — Signal Red, destructive only */
    .btn.danger { background: var(--brand-red); color: #FFFFFF; border-color: transparent; }
    .btn.danger:hover { background: var(--brand-red); filter: brightness(0.92); }

    /* Disabled */
    .btn.disabled, .btn:disabled, .btn[disabled] {
      background: var(--bg-2); color: var(--text-4); border-color: var(--line);
      cursor: not-allowed; pointer-events: none; filter: none; transform: none;
    }

    /* Sizes — Large 48/15 · Default 40/14 · Small 32/13 */
    .btn.lg { height: 48px; padding: 0 24px; font-size: 15px; }
    .btn.sm { height: 32px; padding: 0 14px; font-size: 13px; gap: 8px; }

    .hairline { height: 1px; background: var(--line); border: 0; }

    /* mini bar chart */
    .bars { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
    .bars > span { flex: 1; background: var(--accent-dim); border-radius: 2px; display: block; }

    /* hover lift */
    .lift { transition: transform .15s, border-color .15s, background .15s, box-shadow .15s; }
    .lift:hover { border-color: var(--line-2); box-shadow: 0 2px 10px rgba(20,20,30,0.05); }

    /* sidebar item */
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-2);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background .12s, color .12s;
      position: relative;
      white-space: nowrap;
    }
    .nav-item:hover { background: var(--bg); color: var(--text); }
    .nav-item.active { background: var(--accent-dim); color: var(--accent); font-weight: 600; }
    .nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px;
      background: var(--accent); border-radius: 0 2px 2px 0;
    }
    body[dir="rtl"] .nav-item.active::before { left: auto; right: 0; border-radius: 2px 0 0 2px; }

    .kbd {
      font-family: var(--font-mono); font-size: 11px;
      padding: 2px 5px; border-radius: 4px;
      background: var(--paper); border: 1px solid var(--line);
      color: var(--text-3);
    }
  `;
  document.head.appendChild(s);
}
Object.assign(window, {
  ACCENTS,
  CARD_STYLES,
  installGlobalStyles
});