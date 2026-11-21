// Eigene Zeichnungen für die Kurzvideos (keine Original-Grafiken, nichts abgepaust).
// Jede Funktion liefert ein SVG. Klassen für Effekte: .flick (flackert), .blink (blinkt im Takt).
const svg = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

const FOOT = 'M48 50 C40 50 37 44 38 37 C39 31 37 27 38 23 C39 18 44 15 50 16 C57 17 60 22 59 28 C58 33 56 36 57 41 C58 47 55 50 48 50 Z';
const TOES = '<circle cx="40" cy="12" r="3.6"/><circle cx="46" cy="9" r="3"/><circle cx="52" cy="9.5" r="2.7"/><circle cx="57" cy="12" r="2.4"/><circle cx="61" cy="16" r="2.1"/>';

const ill = {
  fuss: () => svg('0 0 120 90', `
    <ellipse cx="60" cy="80" rx="52" ry="7" fill="#3d2a1c" opacity=".55"/>
    <g transform="translate(-6 22) scale(.78)" fill="#8f6345" opacity=".55"><path d="${FOOT}"/>${TOES}</g>
    <g transform="translate(34 4) scale(1.12)" fill="#c08a62" stroke="#5a3a24" stroke-width=".9"><path d="${FOOT}"/>${TOES}</g>
    <path d="M10 86 l3 -9 M16 86 l1 -11 M22 86 l-2 -8 M98 86 l2 -9 M104 86 l0 -11 M110 86 l-2 -8" stroke="#2fbf71" stroke-width="2" stroke-linecap="round"/>`),
  fussSkizze: () => svg('0 0 70 60', `<g fill="none" stroke="#3a3a3a" stroke-width="1.6" stroke-linejoin="round"><path d="${FOOT}"/>${TOES.replace(/<circle/g, '<circle fill="none"')}</g>`),
  zweigfigur: () => svg('0 0 100 110', `
    <rect x="8" y="0" width="18" height="110" fill="#4a3424"/><path d="M12 10 v90 M20 0 v110" stroke="#2d1f15" stroke-width="1.5"/>
    <g stroke="#c9a27a" stroke-width="3.2" stroke-linecap="round" fill="none">
      <circle cx="62" cy="24" r="11"/><path d="M62 35 V75 M62 44 L40 58 M62 44 L84 56 M62 75 L48 100 M62 75 L76 100 M54 18 L70 30 M70 18 L54 30"/>
    </g>
    <path d="M26 46 L56 46 M26 50 L56 52" stroke="#e8d5b0" stroke-width="2"/>
    <circle cx="58" cy="24" r="1.8" fill="#ff3b4e" class="blink"/><circle cx="66" cy="24" r="1.8" fill="#ff3b4e" class="blink"/>`),
  mond: () => svg('0 0 100 80', `
    <path d="M58 8 A32 32 0 1 0 82 60 A26 26 0 1 1 58 8 Z" fill="#ffe9a8"/>
    <g fill="#fff"><circle cx="18" cy="16" r="1.6" class="blink"/><circle cx="88" cy="14" r="1.2"/><circle cx="12" cy="56" r="1.4"/><circle cx="92" cy="40" r="1.7" class="blink"/><circle cx="30" cy="70" r="1"/></g>`),
  ufo: () => svg('0 0 120 100', `
    <defs><linearGradient id="ufoStrahl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7df0e0" stop-opacity=".85"/><stop offset="1" stop-color="#42e8d5" stop-opacity="0"/></linearGradient></defs><path d="M44 34 L76 34 L100 100 L20 100 Z" fill="url(#ufoStrahl)" class="flick"/>
    <path d="M4 100 L14 72 L24 100 Z M22 100 L30 80 L38 100 Z M96 100 L106 70 L116 100 Z M84 100 L91 82 L98 100 Z" fill="#1f6b48"/>
    <path d="M44 26 Q60 2 76 26 Z" fill="#7df0e0" opacity=".9"/>
    <ellipse cx="60" cy="29" rx="34" ry="9" fill="#b9b7c6" stroke="#f4f2fa" stroke-width="1"/>
    <g class="blink"><circle cx="38" cy="31" r="2.2" fill="#ffd23f"/><circle cx="60" cy="35" r="2.2" fill="#ffd23f"/><circle cx="82" cy="31" r="2.2" fill="#ffd23f"/></g>
    <g><circle cx="49" cy="34" r="2.2" fill="#ff55b8"/><circle cx="71" cy="34" r="2.2" fill="#ff55b8"/></g>`),
  autoLicht: () => svg('0 0 120 70', `
    <path d="M0 62 H120" stroke="#3a3758" stroke-width="3"/>
    <path d="M10 56 L10 46 Q10 42 15 41 L32 40 L42 31 Q44 29 48 29 L72 29 Q75 29 77 31 L86 40 L104 42 Q110 43 110 48 L110 56 Z" fill="#26243a" stroke="#4a4668" stroke-width="1"/>
    <path d="M46 32 L72 32 L80 40 L40 40 Z" fill="#0b0a16"/>
    <circle cx="30" cy="57" r="7" fill="#15132a" stroke="#6b6880" stroke-width="2"/><circle cx="90" cy="57" r="7" fill="#15132a" stroke="#6b6880" stroke-width="2"/>
    <g class="flick"><ellipse cx="109" cy="47" rx="3" ry="2.2" fill="#ffe9a8"/><path d="M111 44 L140 36 L140 60 L111 50 Z" fill="#ffe9a8" opacity=".35"/></g>
    <g class="flick"><rect x="9" y="45" width="3" height="4" fill="#ff3b4e"/></g>`),
  pokal: () => svg('0 0 100 100', `
    <path d="M30 14 H70 V34 Q70 56 50 60 Q30 56 30 34 Z" fill="#ffd23f" stroke="#c99a10" stroke-width="2"/>
    <path d="M30 20 H18 Q16 38 32 42 M70 20 H82 Q84 38 68 42" fill="none" stroke="#ffd23f" stroke-width="5"/>
    <rect x="44" y="60" width="12" height="14" fill="#e0b52a"/><rect x="32" y="74" width="36" height="10" rx="2" fill="#c99a10"/>
    <text x="50" y="44" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="22" fill="#7a5a00">?</text>
    <g fill="#fff" class="blink"><path d="M14 8 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M86 62 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z"/></g>`),
  turm: () => svg('0 0 60 200', `
    <g stroke="#d9d6e8" stroke-width="2.2" fill="none">
      <path d="M30 26 L12 200 M30 26 L48 200"/>
      ${Array.from({ length: 9 }, (_, i) => { const y = 40 + i * 18; const dx = 2 + (y - 26) * 0.1; return `<path d="M${30 - dx} ${y} H${30 + dx} M${30 - dx} ${y} L${30 + dx + 1.8} ${y + 18} M${30 + dx} ${y} L${30 - dx - 1.8} ${y + 18}"/>`; }).join('')}
    </g>
    <circle cx="30" cy="26" r="2.4" fill="#ff3b4e" class="blink"/><circle cx="21" cy="110" r="1.8" fill="#ff3b4e" class="blink"/><circle cx="39" cy="110" r="1.8" fill="#ff3b4e" class="blink"/>
    <path d="M17 18 Q30 30 43 18 L41 23 Q30 31 19 23 Z" fill="#8a5a3c" stroke="#5a3a24" stroke-width=".6"/>
    <ellipse cx="25" cy="15" rx="3.6" ry="4.6" fill="#ff9bd2" stroke="#15132a" stroke-width=".5"/>
    <ellipse cx="30" cy="13" rx="3.8" ry="4.8" fill="#ffd23f" stroke="#15132a" stroke-width=".5"/>
    <ellipse cx="35" cy="15" rx="3.6" ry="4.6" fill="#7df0e0" stroke="#15132a" stroke-width=".5"/>`),
  nest: () => svg('0 0 100 70', `
    <ellipse cx="50" cy="30" rx="8" ry="10" fill="#ffd23f" stroke="#15132a" stroke-width=".8"/>
    <ellipse cx="38" cy="34" rx="7.4" ry="9.2" fill="#ff9bd2" stroke="#15132a" stroke-width=".8"/>
    <ellipse cx="62" cy="34" rx="7.4" ry="9.2" fill="#7df0e0" stroke="#15132a" stroke-width=".8"/>
    <path d="M18 36 Q50 64 82 36 L78 46 Q50 66 22 46 Z" fill="#8a5a3c" stroke="#5a3a24" stroke-width="1"/>
    <path d="M24 42 l8 5 M36 49 l6 -3 M52 50 l8 -4 M66 46 l8 -3 M30 46 l-6 2" stroke="#c08a62" stroke-width="1.6"/>`),
  ei: () => svg('0 0 40 50', `<ellipse cx="20" cy="27" rx="15" ry="20" fill="#ffd23f" stroke="#15132a" stroke-width="1"/><circle cx="14" cy="22" r="2.4" fill="#ff9bd2"/><circle cx="25" cy="32" r="3" fill="#7df0e0"/><circle cx="23" cy="17" r="1.8" fill="#ff55b8"/>`),
  scheibe: () => svg('0 0 200 110', `
    <path d="M20 108 L34 40 Q38 24 56 22 L144 22 Q162 24 166 40 L180 108 Z" fill="#2a2742" stroke="#56527a" stroke-width="2"/>
    <path d="M44 96 L54 44 Q57 34 68 34 L132 34 Q143 34 146 44 L156 96 Z" fill="#7fd4ff" opacity=".35"/>
    <path d="M60 92 L96 52 M110 92 L146 56" stroke="#fff" stroke-width="2" opacity=".35"/>
    <path d="M70 98 L104 86 M112 98 L146 86" stroke="#15132a" stroke-width="3" stroke-linecap="round"/>`),
  splat: () => svg('0 0 120 100', `
    <path d="M60 18 C70 4 80 22 88 16 C100 8 98 30 110 34 C122 40 104 52 112 62 C120 74 98 72 92 82 C86 94 72 82 62 92 C52 100 46 84 34 88 C20 92 26 76 14 70 C2 62 18 54 10 44 C2 32 22 32 24 22 C26 8 46 22 60 18 Z" fill="#fff6d0"/>
    <ellipse cx="62" cy="52" rx="20" ry="17" fill="#ffc21a"/><ellipse cx="56" cy="46" rx="6" ry="4" fill="#fff" opacity=".6"/>
    <circle cx="16" cy="18" r="5" fill="#fff6d0"/><circle cx="108" cy="90" r="4" fill="#fff6d0"/><circle cx="6" cy="86" r="3" fill="#fff6d0"/>`),
  karten: () => svg('0 0 96 56', `
    <g transform="rotate(-14 36 30)"><rect x="24" y="12" width="22" height="31" rx="3" fill="#2a2550" stroke="#9565ff" stroke-width="1.6"/></g>
    <g transform="rotate(10 60 30)"><rect x="50" y="12" width="22" height="31" rx="3" fill="#2a2550" stroke="#42e8d5" stroke-width="1.6"/></g>
    <rect x="37" y="9" width="22" height="34" rx="3" fill="#3a2f6e" stroke="#ff55b8" stroke-width="1.8"/>
    <path d="M48 18 l2.6 5.4 5.9 .8 -4.3 4.1 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.1 5.9 -.8 z" fill="#ffd23f"/>`),
  meteor: () => svg('0 0 96 56', `
    <path d="M28 40 L33 26 L45 19 L60 21 L69 31 L66 43 L52 48 L36 47 Z" fill="#4a4658" stroke="#8e8c9c" stroke-width="1"/>
    <path d="M38 30 L46 34 L44 41 M52 26 L55 33 L62 36 M47 23 L50 28" stroke="#ff9b68" stroke-width="1.6" fill="none" stroke-linecap="round" class="blink"/>
    <path d="M74 14 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z" fill="#ffd23f"/>`),
  scan: () => svg('0 0 96 56', `
    <rect x="33" y="4" width="30" height="48" rx="5" fill="#15132a" stroke="#f4f2fa" stroke-width="1.6"/>
    <path d="M38 14 v-4 h4 M58 14 v-4 h-4 M38 40 v4 h4 M58 40 v4 h-4" stroke="#42e8d5" stroke-width="1.6" fill="none"/>
    <path d="M45 40 L46.5 20 L49.5 20 L51 40 Z" fill="#f4f2fa"/><path d="M45.6 33 h4.8 M46 26 h4" stroke="#ff3b4e" stroke-width="2.4"/>
    <path d="M36 27 H60" stroke="#42e8d5" stroke-width="1.2" class="blink"/>`),
  haken: () => svg('0 0 60 60', `<circle cx="30" cy="30" r="26" fill="#2fbf71"/><path d="M18 31 L27 40 L43 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`),
  zaun: () => svg('0 0 120 70', `
    <rect x="62" y="22" width="54" height="42" rx="2" fill="#c8743a"/><path d="M70 26 V60 M80 26 V60 M90 26 V60 M100 26 V60 M108 26 V60" stroke="#8c4f24" stroke-width="2"/>
    <g stroke="#b9b7c6" stroke-width="1.4"><path d="M4 18 H60 M4 64 H60"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${4 + i * 8} 18 L${12 + i * 8} 64 M${12 + i * 8} 18 L${4 + i * 8} 64"/>`).join('')}</g>
    <path d="M4 14 H60" stroke="#ff3b4e" stroke-width="2" stroke-dasharray="4 3"/>`),
  hebebuehne: () => svg('0 0 80 90', `
    <rect x="14" y="10" width="52" height="8" rx="2" fill="#ffd23f"/><path d="M14 10 V2 M66 10 V2 M14 4 H66" stroke="#ffd23f" stroke-width="2.4"/>
    <g stroke="#b9b7c6" stroke-width="3"><path d="M20 18 L60 44 M60 18 L20 44 M20 44 L60 70 M60 44 L20 70"/></g>
    <rect x="10" y="70" width="60" height="10" rx="2" fill="#5b5d6b"/><circle cx="20" cy="84" r="5" fill="#15132a" stroke="#8e8c9c" stroke-width="2"/><circle cx="60" cy="84" r="5" fill="#15132a" stroke="#8e8c9c" stroke-width="2"/>`),
  abschlepp: () => svg('0 0 140 70', `
    <path d="M6 54 V36 Q6 30 12 30 H34 L42 18 H58 Q62 18 62 22 V54 Z" fill="#ffd23f"/><path d="M44 22 H56 V32 H38 Z" fill="#0b0a16" opacity=".8"/>
    <rect x="62" y="40" width="70" height="14" fill="#5b5d6b"/><path d="M66 40 L120 20" stroke="#8e8c9c" stroke-width="4"/><path d="M120 20 V36" stroke="#b9b7c6" stroke-width="2"/>
    <circle cx="22" cy="58" r="8" fill="#15132a" stroke="#b9b7c6" stroke-width="2"/><circle cx="110" cy="58" r="8" fill="#15132a" stroke="#b9b7c6" stroke-width="2"/>
    <rect x="20" y="24" width="8" height="5" fill="#ff9b68" class="blink"/>`),
  garage: () => svg('0 0 120 80', `
    <path d="M8 34 L60 8 L112 34 V78 H8 Z" fill="#2a2742" stroke="#56527a" stroke-width="2"/>
    <rect x="26" y="40" width="68" height="38" fill="#15132a" stroke="#8e8c9c" stroke-width="1.5"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M26 ${46 + i * 6} H94" stroke="#3a3758" stroke-width="1.5"/>`).join('')}
    <text x="60" y="30" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="9" fill="#ffd23f">GARAGE</text>`),
  spraydose: () => svg('0 0 80 100', `
    <rect x="24" y="30" width="32" height="64" rx="6" fill="#ff55b8"/><rect x="24" y="48" width="32" height="18" fill="#fff" opacity=".85"/>
    <rect x="31" y="18" width="18" height="12" rx="2" fill="#b9b7c6"/><rect x="36" y="10" width="8" height="8" rx="1" fill="#f4f2fa"/>
    <g fill="#42e8d5" class="flick"><circle cx="54" cy="10" r="3"/><circle cx="62" cy="6" r="2.4"/><circle cx="64" cy="14" r="2"/><circle cx="70" cy="9" r="1.6"/></g>`),
  rohr: () => svg('0 0 120 80', `
    <path d="M10 20 H70 Q84 20 84 34 V70" fill="none" stroke="#b9b7c6" stroke-width="12"/><path d="M10 20 H70 Q84 20 84 34 V70" fill="none" stroke="#e4e2ee" stroke-width="4" opacity=".6"/>
    <rect x="74" y="62" width="20" height="10" rx="2" fill="#8e8c9c"/><path d="M84 76 q-5 8 0 12 q5 -4 0 -12z" fill="#42e8d5" class="blink"/>
    <g transform="rotate(-30 40 56)"><rect x="18" y="52" width="46" height="9" rx="4" fill="#ffd23f"/><circle cx="66" cy="56" r="9" fill="none" stroke="#ffd23f" stroke-width="6"/></g>`),
  hutBrille: () => svg('0 0 120 80', `
    <path d="M20 40 Q60 30 100 40 L90 44 Q60 38 30 44 Z" fill="#26242f"/><path d="M38 40 Q40 14 60 14 Q80 14 82 40 Z" fill="#3a3758"/><rect x="38" y="34" width="44" height="6" fill="#ff55b8"/>
    <g fill="#15132a" stroke="#f4f2fa" stroke-width="2"><rect x="30" y="54" width="24" height="16" rx="6"/><rect x="66" y="54" width="24" height="16" rx="6"/></g><path d="M54 60 H66" stroke="#f4f2fa" stroke-width="2"/>`),
};

module.exports = { ill };
