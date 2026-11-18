// Rendert Folien (1080x1920) als PNG. Aufruf: node make_reel.js slides.json outdir
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
</style></head><body><div class="wrap">
<div class="brand">${logo}<span>5-Sterne-<b>Kompass</b></span></div>
<div class="mid">${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}
<h1>${s.title}</h1>
${s.text ? `<p class="text">${esc(s.text)}</p>` : ''}
${s.items ? `<ul>${s.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>
<div class="foot"><div class="src">${esc(s.source || 'Unabhängiges Fanprojekt · nicht von Rockstar Games')}</div><div class="dots">${Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div></div>
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
