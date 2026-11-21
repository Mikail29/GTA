#!/usr/bin/env node
/*
 * Kurzvideos im starken Stil (1080 × 1920, 30 fps) für TikTok, Reels und Shorts.
 * Eigene Grafiken, eigene Musik und eigene Soundeffekte – nichts Fremdes.
 *
 * Aufruf:  node tools/video/short/make_short.js storyboard.json ausgabeordner [--tempo 0.85] [--worker 3]
 *          node tools/video/short/make_short.js storyboard.json ausgabeordner --vorschau 0.5,2,6.3   (nur Standbilder)
 *
 * Ergebnis (im Ausgabeordner, Dateiname aus "name" im Storyboard):
 *   <name>-ohne-stimme.mp4               Musik + Effekte + Untertitel – zum Selbst-Einsprechen
 *   <name>-nur-effekte.mp4               ohne Musik (für Sounds direkt aus TikTok/Instagram)
 *   <name>-probe-NICHT-HOCHLADEN.mp4     mit Computerstimme, nur zum Üben
 *   <name>-sprechtext.txt                Sprechtext mit Startzeiten
 * Anleitung und Szenen-Typen: tools/video/short/README.md
 */
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawn } = require('child_process');
const { ill } = require('./illustrations');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const tempo = parseFloat(opt('--tempo', '0.85'));
const WORKERS = parseInt(opt('--worker', String(Math.max(1, Math.min(3, os.cpus().length - 1)))), 10);
const preview = opt('--vorschau', null);
const [sbFile, outDir] = args;
if (!sbFile || !outDir) { console.error('Aufruf: make_short.js storyboard.json ausgabeordner'); process.exit(1); }

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const FPS = 30, W = 1080, H = 1920;
const TTS = path.join(os.homedir(), '.cache/5sk-tts');
const PIPER = process.env.PIPER_BIN || path.join(TTS, 'venv/bin/piper');
const VOICE = process.env.PIPER_VOICE || path.join(TTS, 'de-thorsten-low.onnx');
const PY = process.env.AUDIO_PY || path.join(os.homedir(), '.cache/5sk-audio/bin/python');
const sb = JSON.parse(fs.readFileSync(sbFile, 'utf8'));
const NAME = sb.name || path.basename(sbFile, '.json');
const BPM = sb.bpm || 100;
fs.mkdirSync(outDir, { recursive: true });
const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'kurz-'));
const log = (...a) => console.log('›', ...a);

// ------------------------------------------------------------ Grafiken auflösen
let symbolArt = null;
function loadSymbolArt() {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const Module = require('module');
  let src = fs.readFileSync(path.join(ROOT, 'src/components/world/symbol-art.tsx'), 'utf8');
  src = src.replace('import { cn } from "@/lib/utils/cn";', 'const cn = (...a: any[]) => a.filter(Boolean).join(" ");');
  const out = ts.transpileModule(src, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const m = new Module(path.join(WORK, 'symbol-art.js'));
  m.paths = Module._nodeModulePaths(ROOT);
  m._compile(out.outputText, path.join(WORK, 'symbol-art.js'));
  const req = Module.createRequire(path.join(ROOT, 'package.json'));
  const React = req('react');
  const { renderToStaticMarkup } = req('react-dom/server');
  return (name) => renderToStaticMarkup(React.createElement(m.exports.SymbolArt, { name })).replace(/ class="[^"]*"/, '').replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"');
}
const initials = (txt, c1, c2) => {
  const id = 'g' + crypto.createHash('md5').update(txt + c1 + c2).digest('hex').slice(0, 6);
  return `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><circle cx="48" cy="48" r="44" fill="url(#${id})" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><text x="48" y="60" text-anchor="middle" font-family="InterV, Inter, sans-serif" font-size="34" font-weight="900" fill="#fff">${txt}</text></svg>`;
};
function art(ref) {
  if (!ref || typeof ref !== 'string') return ref;
  const [base, ...recolors] = ref.split('|');
  let out;
  if (base.startsWith('<svg')) out = base;
  else if (base.startsWith('symbol:')) { symbolArt = symbolArt || loadSymbolArt(); out = symbolArt(base.slice(7)); }
  else if (base.startsWith('ill:')) { const f = ill[base.slice(4)]; if (!f) throw new Error('Zeichnung fehlt: ' + base); out = f(); }
  else if (base.startsWith('initials:')) { const [t, c1, c2] = base.slice(9).split(','); out = initials(t, c1 || '#ff9b68', c2 || '#ff55b8'); }
  else throw new Error('Unbekannte Grafik: ' + base);
  for (const rc of recolors) { const [a, b] = rc.split('>'); out = out.split(a).join(b); }
  return out;
}
const ART_KEYS = new Set(['art', 'object', 'target', 'splat']);
function resolveArt(x) {
  if (Array.isArray(x)) return x.map(resolveArt);
  if (x && typeof x === 'object') { const o = {}; for (const [k, v] of Object.entries(x)) o[k] = ART_KEYS.has(k) ? art(v) : resolveArt(v); return o; }
  return x;
}

// ------------------------------------------------------------ Stimme (Probe) und Zeiten
function wavDuration(file) {
  const b = fs.readFileSync(file);
  const sr = b.readUInt32LE(24), ch = b.readUInt16LE(22), bits = b.readUInt16LE(34);
  let off = 12;
  while (off < b.length - 8) { const id = b.toString('ascii', off, off + 4); const sz = b.readUInt32LE(off + 4); if (id === 'data') return sz / (sr * ch * (bits / 8)); off += 8 + sz; }
  return 0;
}
const ttsDir = path.join(outDir, '.stimme-cache');
fs.mkdirSync(ttsDir, { recursive: true });
function tts(text) {
  const f = path.join(ttsDir, crypto.createHash('md5').update(text + '|' + tempo).digest('hex') + '.wav');
  if (!fs.existsSync(f)) execFileSync(PIPER, ['-m', VOICE, '--length-scale', String(tempo), '--sentence-silence', '0.1', '-f', f], { input: text, stdio: ['pipe', 'ignore', 'ignore'] });
  return f;
}

const MIN = { hook: 2.4, map: 2.9, art: 2.3, flyer: 2.4, phone: 2.6, drop: 2.6, list: 1.3, duo: 2.4, step: 2.3, title: 2.8, cta: 3.9 };
const q = 60 / BPM / 2;
let t = 0;
const scenes = sb.scenes.map((s0, i) => {
  const s = resolveArt(s0);
  s.trans = i === 0 ? 'cut' : s.transition || 'whip';
  s.start = +t.toFixed(3);
  const lead = s.type === 'hook' ? 0.22 : s.type === 'title' ? 0.3 : 0.16;
  let speech = 0;
  if (s.say) { s.voice = tts(s.say); speech = wavDuration(s.voice); }
  s.speechStart = s.start + lead;
  s.speechEnd = s.speechStart + speech;
  let min = MIN[s.type] || 2.2;
  if (s.type === 'list') min += 0.42 * (s.items || []).length;
  if (s.type === 'cta') min += 0.28 * (s.options || []).length;
  const dur = Math.max(min, s.minDur || 0, lead + speech + 0.38);
  t = Math.ceil((s.start + dur) / q) * q;
  s.dur = +(t - s.start).toFixed(3);
  return s;
});
const TOTAL = +(t + 0.5).toFixed(3);
scenes[scenes.length - 1].dur += 0.5;

function captionsFor(s) {
  if (!s.show || s.caps === false || !s.say) return [];
  const KEEP = ['GTA 6', 'Vice City', 'Port Gellhorn', 'Skunk Ape', 'Key Lento', 'Leonida Keys', 'Mount Kalaga', 'Cottonmouth Lake', 'Pay ’n’ Spray', 'Hey Arnold!', 'Unwanted Attention', 'Gone Fishing', 'Coming Home', 'Imponte Phoenix', 'Brian Heder', 'Cal Hampton', 'Lucia Caminos', 'Jason Duval', 'Rusty Anchor', 'Hamlet Correctional', '2 Uhr', ...(sb.keep || [])];
  let show = s.show;
  for (const k of KEEP) show = show.split(k).join(k.replace(/ /g, '\u00a0'));
  const words = show.split(/[ \t\n]+/).filter(Boolean);
  const chunks = [];
  let cur = [];
  const SHORT = /^(in|im|am|an|auf|aus|bei|mit|von|vom|zu|zum|zur|den|dem|der|die|das|des|ein|eine|einen|einem|und|oder|um|für|nach|über|vor|es|du|er|sie|wir|ihr|nicht)$/i;
  const len = (a) => a.join(' ').length;
  words.forEach((w, i) => {
    if (cur.length && (len([...cur, w]) > 20 || cur.length >= 4)) {
      const carry = [];
      while (cur.length > 1 && SHORT.test(cur[cur.length - 1])) carry.unshift(cur.pop());
      chunks.push(cur); cur = carry;
    }
    cur.push(w);
    if (/[.!?:;,]$/.test(w) || w === '–') { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  const weight = (w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[.!?]$/.test(w) ? 5 : /[,:;–]$/.test(w) ? 2 : 0);
  const sum = words.reduce((a, w) => a + weight(w), 0);
  let acc = 0;
  const span = s.speechEnd - s.speechStart;
  const out = chunks.map((ch) => ({ words: ch.map((w) => { const tt = s.speechStart + (acc / sum) * span; acc += weight(w); return { text: w, t: +tt.toFixed(3) }; }) }));
  out.forEach((c, i) => { c.t0 = c.words[0].t - 0.06; c.t1 = i + 1 < out.length ? out[i + 1].words[0].t - 0.06 : Math.min(s.speechEnd + 0.4, s.start + s.dur); });
  return out;
}
const captions = scenes.flatMap(captionsFor);

// ------------------------------------------------------------ Seite bauen
const b64 = (f) => fs.readFileSync(f).toString('base64');
const fontDir = path.join(ROOT, 'node_modules/@fontsource-variable');
const fonts = `
@font-face{font-family:'InterV';src:url(data:font/woff2;base64,${b64(path.join(fontDir, 'inter/files/inter-latin-wght-normal.woff2'))}) format('woff2');font-weight:100 900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'InterV';src:url(data:font/woff2;base64,${b64(path.join(fontDir, 'inter/files/inter-latin-ext-wght-normal.woff2'))}) format('woff2');font-weight:100 900;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}\n${fs.readFileSync(path.join(HERE, 'style.css'), 'utf8')}</style></head><body><script>${fs.readFileSync(path.join(HERE, 'engine.js'), 'utf8')}</script></body></html>`;
const data = {
  scenes, captions, total: TOTAL, bpm: BPM,
  handle: sb.handle || '@5sternekompass', site: sb.site || '5-sterne-kompass.de',
  disc: sb.disclaimer || 'Unabhängiges Fanprojekt · nicht von Rockstar Games · eigene Grafiken',
  mapUrl: 'data:image/svg+xml;base64,' + b64(path.join(ROOT, 'public/map/leonida.svg')),
  logo: fs.readFileSync(path.join(HERE, '../logo.svg'), 'utf8'),
};

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('Seitenfehler:', e.message));
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const info = await page.evaluate((d) => window.setup(d), data);
  await page.evaluate(() => document.fonts.ready);
  return { page, info };
}

function run(cmd, a, opts = {}) { return execFileSync(cmd, a, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26, ...opts }); }

async function renderRange(browser, f0, f1, file) {
  const { page } = await openPage(browser);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    await page.evaluate((tt) => window.renderFrame(tt), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await page.close();
}

function fmt(sec) { const m = Math.floor(sec / 60); return `${m}:${(sec - m * 60).toFixed(2).padStart(5, '0')}`; }

(async () => {
  log(`Storyboard „${sb.title || NAME}“: ${scenes.length} Szenen, ${TOTAL.toFixed(1)} s`);
  scenes.forEach((s, i) => log(`  ${String(i + 1).padStart(2)} ${s.type.padEnd(6)} ${fmt(s.start)} – ${fmt(s.start + s.dur)}  (${s.trans})`));
  const browser = await chromium.launch();
  const { page, info } = await openPage(browser);
  if (preview) {
    for (const ts of preview.split(',').map(Number)) {
      await page.evaluate((tt) => window.renderFrame(tt), ts);
      const f = path.join(outDir, `${NAME}-vorschau-${ts.toFixed(2)}s.png`);
      await page.screenshot({ path: f });
      log('Vorschau:', f);
    }
    await browser.close();
    return;
  }
  await page.close();

  // Ton
  const timeline = {
    duration: TOTAL, bpm: BPM, drop: info.drop,
    speech: scenes.filter((s) => s.say).map((s) => [s.speechStart, s.speechEnd]),
    events: info.events,
    voice: scenes.filter((s) => s.voice).map((s) => ({ file: s.voice, t: s.speechStart })),
  };
  fs.writeFileSync(path.join(WORK, 'timeline.json'), JSON.stringify(timeline));
  log('Ton: eigene Musik und Effekte …');
  run(PY, [path.join(HERE, 'audio.py'), path.join(WORK, 'timeline.json'), WORK]);

  // Bild (parallel in Abschnitten)
  const N = Math.round(TOTAL * FPS);
  log(`Bild: ${N} Einzelbilder mit ${WORKERS} Prozessen …`);
  const t0 = Date.now();
  const parts = [];
  const per = Math.ceil(N / WORKERS);
  for (let k = 0; k < WORKERS; k++) { const a = k * per, b = Math.min(N, a + per); if (a < b) parts.push({ a, b, file: path.join(WORK, `teil${k}.mp4`) }); }
  await Promise.all(parts.map((p) => renderRange(browser, p.a, p.b, p.file)));
  await browser.close();
  fs.writeFileSync(path.join(WORK, 'liste.txt'), parts.map((p) => `file '${p.file}'`).join('\n'));
  const video = path.join(WORK, 'bild.mp4');
  run('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(WORK, 'liste.txt'), '-c', 'copy', video]);
  log(`Bild fertig in ${((Date.now() - t0) / 1000).toFixed(0)} s`);

  // Mischen: Lautstärke auf -14 LUFS (üblich für TikTok/Instagram/YouTube)
  const mix = (inputs) => {
    const a = inputs.flatMap((f) => ['-i', path.join(WORK, f)]);
    const chain = `${inputs.map((_, i) => `[${i}:a]`).join('')}amix=inputs=${inputs.length}:normalize=0`;
    return { a, chain };
  };
  const measureI = (inputs) => {
    const { a, chain } = mix(inputs);
    const res = require('child_process').spawnSync('ffmpeg', ['-hide_banner', ...a, '-filter_complex', `${chain},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
    const m = res.stderr.match(/"input_i"\s*:\s*"(-?[\d.]+)"/);
    return m ? parseFloat(m[1]) : -20;
  };
  const gainMusic = -14 - measureI(['musik.wav', 'effekte.wav']);
  const gainProbe = -14 - measureI(['musik.wav', 'effekte.wav', 'stimme.wav']);
  const variants = [
    { file: `${NAME}-ohne-stimme.mp4`, inputs: ['musik.wav', 'effekte.wav'], gain: gainMusic },
    { file: `${NAME}-nur-effekte.mp4`, inputs: ['effekte.wav'], gain: gainMusic },
    { file: `${NAME}-probe-NICHT-HOCHLADEN.mp4`, inputs: ['musik.wav', 'effekte.wav', 'stimme.wav'], gain: gainProbe },
  ];
  for (const v of variants) {
    const { a, chain } = mix(v.inputs);
    run('ffmpeg', ['-loglevel', 'error', '-y', '-i', video, ...a, '-filter_complex', `${chain.replace(/\[(\d+):a\]/g, (_, n) => `[${+n + 1}:a]`)},volume=${v.gain.toFixed(2)}dB,alimiter=limit=0.89:level=false[aout]`, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(outDir, v.file)]);
    log('Fertig:', path.join(outDir, v.file));
  }

  // Sprechtext
  const lines = [`SPRECHTEXT – ${sb.title || NAME}`, '', 'So geht’s: Video „ohne-stimme“ abspielen und ab der angegebenen Zeit sprechen.', 'Die Untertitel im Video zeigen dir genau, was gerade dran ist.', ''];
  scenes.forEach((s, i) => { if (s.show) lines.push(`${fmt(s.speechStart)}  Szene ${i + 1}: ${s.show}`); });
  lines.push('', `Länge: ${fmt(TOTAL)}  ·  Musik und Effekte: selbst erzeugt (frei von Rechten Dritter)`);
  fs.writeFileSync(path.join(outDir, `${NAME}-sprechtext.txt`), lines.join('\n'));
  log('Fertig:', path.join(outDir, `${NAME}-sprechtext.txt`));
  fs.rmSync(WORK, { recursive: true, force: true });
})().catch((e) => { console.error(e); process.exit(1); });
