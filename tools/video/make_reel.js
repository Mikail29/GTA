// Rendert Folien (1080x1920) als PNG. Aufruf: node make_reel.js slides.json outdir
// Optional je Folie: art = [{ svg: "<svg…>", label: "…" }] mit layout "rows" | "grid" | "row3" (eigene Zeichnungen).
// Optional: menu = { section, rows: [{ label, value, count, on }], to } – nachgebaute Einstellungs-Tafel (eigene Gestaltung).
// Optional: art-Einträge mit sub (kleine Erklärzeile), handle (Kanal-Name als Pille), nodots: true (ohne Fortschrittspunkte, z. B. für Einzelbilder).
const { chromium } = require('playwright');
const fs = require('fs');
const [, , slidesFile, outDir] = process.argv;
const slides = JSON.parse(fs.readFileSync(slidesFile, 'utf8'));
const logo = fs.readFileSync(__dirname + '/logo.svg', 'utf8');
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const page = (s, i, n) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;
background:radial-gradient(1200px 900px at 85% -10%,rgba(255,85,184,.35),transparent 60%),radial-gradient(1000px 800px at -10% 110%,rgba(66,232,213,.22),transparent 60%),linear-gradient(180deg,#151331,#100f20 55%,#0b0a17);}
.wrap{position:absolute;inset:0;padding:150px 90px 170px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:22px;font-weight:700;font-size:40px;letter-spacing:-.5px}
.brand svg{width:86px;height:86px}
.brand b{background:linear-gradient(90deg,#ff9b68,#ff55b8 50%,#9565ff);-webkit-background-clip:text;color:transparent}
.mid{margin:auto 0;display:flex;flex-direction:column}
.tag{display:inline-block;align-self:flex-start;padding:14px 30px;border-radius:999px;border:3px solid rgba(66,232,213,.6);color:#42e8d5;font-weight:700;font-size:34px;letter-spacing:4px;text-transform:uppercase}
h1{margin-top:44px;font-family:"Inter Display",Inter,sans-serif;font-weight:800;font-size:${s.big ? 118 : 92}px;line-height:1.05;letter-spacing:-2px}
h1 span{background:linear-gradient(95deg,#ff9b68,#ff55b8 45%,#9565ff);-webkit-background-clip:text;color:transparent}
ul{margin-top:60px;list-style:none;padding:0;display:grid;gap:34px}
li{font-size:46px;line-height:1.3;padding-left:62px;position:relative;color:#ece9ff}
li:before{content:"";position:absolute;left:0;top:14px;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#ff55b8,#9565ff)}
p.text{margin-top:56px;font-size:48px;line-height:1.35;color:#d8d4f0}
.foot{display:flex;justify-content:space-between;align-items:flex-end;font-size:28px;color:#b8b4d1}
.dots{display:flex;gap:12px}.dots i{width:18px;height:18px;border-radius:50%;background:#332e57}.dots i.on{background:#42e8d5}
.src{max-width:720px;line-height:1.35}
.art{margin-top:56px;display:grid;gap:30px}
.art.rows .it{display:flex;align-items:center;gap:34px}
.art.grid{grid-template-columns:1fr 1fr;gap:44px 34px}
.art.grid .it{display:flex;flex-direction:column;align-items:flex-start;gap:18px}
.art.row3{grid-template-columns:1fr 1fr 1fr;gap:26px}
.art svg{width:280px;height:163px;border-radius:26px;border:3px solid rgba(255,255,255,.12);background:#0b0a16;flex-shrink:0}
.art.grid svg,.art.row3 svg{width:100%;height:auto;aspect-ratio:96/56}
.art span{font-size:44px;font-weight:700;line-height:1.25;color:#f1eeff}
.art span small{display:block;margin-top:8px;font-size:34px;font-weight:500;line-height:1.3;color:#cfc9ee}
.handle{margin-top:40px;display:inline-flex;align-self:flex-start;padding:16px 30px;border-radius:999px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.14);font-size:40px;font-weight:700;color:#fff}
.menu{margin-top:60px;border-radius:30px;background:linear-gradient(180deg,rgba(74,52,128,.92),rgba(40,28,74,.95));border:2px solid rgba(255,255,255,.10);padding:30px 0 34px;box-shadow:0 30px 80px -30px rgba(0,0,0,.8)}
.menu .mh{padding:0 40px 22px;font-weight:800;font-size:33px;letter-spacing:2.5px;color:#f1ecff;text-transform:uppercase}
.menu .row{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:26px 40px;font-size:40px;color:#ece6ff}
.menu .row.on{background:#f6f3ff;color:#1b1430;font-weight:600}
.menu .row .v{display:flex;gap:18px;align-items:center;white-space:nowrap}
.menu .row .v i{font-style:normal;opacity:.6;font-size:31px}
.menu .row .v b{font-weight:700;opacity:.55;font-size:33px}
.menu .to{margin:32px 40px 0;display:inline-flex;align-items:center;gap:16px;padding:18px 34px;border-radius:999px;background:linear-gradient(90deg,#ff55b8,#9565ff);font-weight:800;font-size:44px;color:#fff}
</style></head><body><div class="wrap">
<div class="brand">${logo}<span>5-Sterne-<b>Kompass</b></span></div>
<div class="mid">${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}
<h1>${s.title}</h1>
${s.text ? `<p class="text">${esc(s.text)}</p>` : ''}
${s.handle ? `<div class="handle">${esc(s.handle)}</div>` : ''}
${s.items ? `<ul>${s.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
${s.menu ? `<div class="menu"><div class="mh">${esc(s.menu.section)}</div>${s.menu.rows.map((r) => `<div class="row${r.on ? ' on' : ''}"><span>${esc(r.label)}</span><span class="v">${esc(r.value)}${r.count ? ` <i>${esc(r.count)}</i>` : ''} <b>‹ ›</b></span></div>`).join('')}${s.menu.to ? `<div class="to">→ ${esc(s.menu.to)}</div>` : ''}</div>` : ''}
${s.art ? `<div class="art ${esc(s.layout || 'rows')}">${s.art.map((a) => `<div class="it">${a.svg}${a.label ? `<span>${esc(a.label)}${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</span>` : ''}</div>`).join('')}</div>` : ''}</div>
<div class="foot"><div class="src">${esc(s.source || 'Unabhängiges Fanprojekt · nicht von Rockstar Games')}</div>${s.nodots ? '' : `<div class="dots">${Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>`}</div>
</div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (let i = 0; i < slides.length; i++) {
    await p.setContent(page(slides[i], i, slides.length));
    await p.waitForTimeout(150);
    await p.screenshot({ path: `${outDir}/s${String(i).padStart(2, '0')}.png` });
  }
  await b.close();
})();
