/* Kurzvideo-Engine 5-Sterne-Kompass (läuft im Browser, Bild für Bild).
 * window.setup(data) baut die Szenen und liefert die Zeitpunkte für Soundeffekte.
 * window.renderFrame(t) zeichnet das Bild zum Zeitpunkt t (Sekunden) – deterministisch.
 */
(function () {
  'use strict';
  const W = 1080, H = 1920, HZ = 1500;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const P = (t, a, d) => clamp((t - a) / d);
  const E = {
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inCubic: (t) => t * t * t,
    inQuad: (t) => t * t,
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    outBounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; },
  };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function rand(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };

  // „Text mit *Akzent*“ → Wort-Spans
  function wordsHTML(text, cls = 'w') {
    const out = [];
    for (const part of String(text).split(/(\*[^*]+\*)/)) {
      if (!part) continue;
      const acc = part.length > 1 && part.startsWith('*') && part.endsWith('*');
      const t = acc ? part.slice(1, -1) : part;
      const toks = t.split(/(\s+)/);
      toks.forEach((w, i) => {
        if (!w || /^\s+$/.test(w)) return;
        const glue = i === 0 && out.length && !acc && /^[^\p{L}\p{N}]/u.test(w);
        if (glue) out[out.length - 1] = out[out.length - 1].replace(/<\/span>$/, `${esc(w)}</span>`);
        else out.push(`<span class="${cls}${acc ? ' acc' : ''}">${esc(w)}</span>`);
      });
    }
    return out.join(' ');
  }
  function popWords(nodes, lt, t0, step, o = {}) {
    nodes.forEach((n, i) => {
      const p = P(lt, t0 + i * step, o.dur || 0.34);
      n.style.opacity = clamp(p * 3);
      n.style.transform = `translateY(${(1 - E.outCubic(p)) * (o.dy ?? 70)}px) scale(${lerp(o.s0 ?? 0.3, 1, E.outBack(p))}) rotate(${(1 - p) * (o.rot ?? -6)}deg)`;
    });
  }
  function appear(n, lt, t0, d = 0.4, o = {}) {
    const p = P(lt, t0, d);
    const e = (o.ease || E.outBack)(p);
    n.style.opacity = clamp(p * 2.5);
    n.style.transform = `translate(${(1 - e) * (o.dx || 0)}px, ${(1 - e) * (o.dy ?? 40)}px) scale(${lerp(o.s0 ?? 0.6, 1, e)}) rotate(${(1 - e) * (o.rot || 0)}deg)`;
    return p;
  }

  let D, cam, capsEl, progEl, flashEl, bgx, sunCanvas, rOff, bOff, camWrap;
  let SC = [];
  const EV = { sfx: [], shakes: [], flashes: [], glitches: [] };
  let drop = null;
  let curCap = null, capWords = [];
  let frameNo = 0;
  const TD = { whip: 0.34, zoom: 0.38, glitch: 0.3, flash: 0.26, slam: 0.3, up: 0.36, cut: 0 };

  const sfx = (t, type, gain = 1, pan = 0) => EV.sfx.push({ t: +t.toFixed(3), type, gain, pan });
  const shake = (t, amp, dur = 0.45) => EV.shakes.push({ t, amp, dur });
  const flash = (t, peak = 0.85, dur = 0.24) => EV.flashes.push({ t, peak, dur });

  // ------------------------------------------------------------------ Szenen-Vorlagen
  const T = {};

  T.hook = {
    build(s, r) {
      const k = s.kicker ? el('div', 'ab center kicker', r, `<span class="pill pink">${esc(s.kicker)}</span>`) : null;
      const lines = el('div', 'ab lines', r);
      (s.lines || []).forEach((ln) => el('div', 'line', lines, wordsHTML(ln)));
      const words = [...lines.querySelectorAll('.w')];
      const tail = s.tail ? el('div', 'ab tail', r, wordsHTML(s.tail)) : null;
      let box = null, glow = null, art = null;
      if (s.art) {
        box = el('div', 'ab artbox', r);
        glow = el('div', 'glow', box);
        art = el('div', 'svgbox', box, s.art);
      }
      const step = s.step || 0.13;
      const tWords = 0.14;
      const tArt = tWords + words.length * step + 0.12;
      const tTail = tArt + 0.55;
      sfx(s.start + 0.0, 'boom', 0.9);
      flash(s.start + 0.0, 0.9, 0.3);
      words.forEach((_, i) => sfx(s.start + tWords + i * step, 'pop', 0.42));
      if (art) { sfx(s.start + tArt - 0.02, 'hit', 0.95); shake(s.start + tArt, 30, 0.5); }
      if (tail) sfx(s.start + tTail, 'whoosh', 0.35);
      if (drop == null) drop = s.start + (art ? tArt : tWords + words.length * step);
      return { k, words, tail, box, glow, art, step, tWords, tArt, tTail, linesEl: lines };
    },
    layout(s, o) {
      const h = o.linesEl.getBoundingClientRect().height;
      const top = 390 + h + 20;
      if (o.box) { o.box.style.top = Math.min(top, 900) + 'px'; o.box.style.height = Math.max(300, Math.min(430, 1200 - Math.min(top, 900))) + 'px'; }
      if (o.tail) o.tail.style.top = (o.box ? Math.min(top, 900) + parseFloat(o.box.style.height) + 10 : top + 10) + 'px';
    },
    update(s, o, lt, c) {
      if (o.k) appear(o.k, lt, 0.0, 0.3, { dy: -30 });
      popWords(o.words, lt, o.tWords, o.step, { dy: 90, s0: 0.2, rot: -8 });
      o.words.forEach((w) => { if (w.classList.contains('acc')) w.style.filter = `drop-shadow(0 0 ${18 + 26 * c.beat}px rgba(255,85,184,.75))`; });
      if (o.box) {
        const p = P(lt, o.tArt - 0.2, 0.26);
        const e = E.outCubic(p);
        const fl = Math.sin(lt * 2.3) * 12;
        o.box.style.opacity = clamp(p * 4);
        o.box.style.transform = `translateY(${fl}px) scale(${lerp(2.6, 1, e)}) rotate(${(1 - e) * -14 + Math.sin(lt * 1.7) * 2}deg)`;
        o.glow.style.opacity = 0.55 + 0.4 * c.beat;
      }
      if (o.tail) appear(o.tail, lt, o.tTail, 0.4, { dy: 50, s0: 0.8 });
    },
  };

  T.map = {
    build(s, r) {
      const view = el('div', 'ab view', r);
      const inner = el('div', 'inner', view, `<img src="${D.mapUrl}">`);
      const shade = el('div', 'shade', view);
      const scan = el('div', 'scanl', view);
      const hud = s.tag ? el('div', 'ab hudtag', r, `<span class="pill">${esc(s.tag)}</span>`) : null;
      const pin = el('div', 'ab pin', r, '<div class="ring"></div><div class="ring"></div><div class="ring"></div><div class="dot"></div>');
      const label = el('div', 'ab center label', r, `<div class="t">${wordsHTML(s.label || '', 'lw')}</div>${s.sub ? `<div class="s">${esc(s.sub)}</div>` : ''}`);
      const tZoom = 1.25, tPin = 1.15, tLabel = 1.35;
      sfx(s.start + 0.02, 'whoosh', 0.55);
      sfx(s.start + tPin, 'ping', 0.75);
      sfx(s.start + tLabel, 'tick', 0.45);
      shake(s.start + tPin + 0.05, 8, 0.3);
      return { view, inner, shade, scan, hud, pin, rings: [...pin.querySelectorAll('.ring')], dot: pin.querySelector('.dot'), label, tZoom, tPin, tLabel };
    },
    update(s, o, lt, c) {
      const Z = s.zoom || 3.2;
      const e = E.inOutCubic(P(lt, 0, o.tZoom));
      const drift = 1 + Math.max(0, lt - o.tZoom) * 0.035;
      const sc = Math.pow(Z, e) * drift;
      const cx = lerp(500, s.x, e), cy = lerp(520, s.y, e);
      const k = 1.08;
      o.inner.style.transform = `translate(${540 - sc * k * cx}px, ${540 - sc * k * cy}px) scale(${sc})`;
      o.shade.style.opacity = s.night ? 1 : 0.55;
      o.shade.style.background = s.night ? 'radial-gradient(circle at 50% 46%, rgba(30,20,110,.12), rgba(3,3,24,.62))' : '';
      const ps = P(lt, 0, o.tZoom);
      o.scan.style.top = lerp(-20, 1080, ps) + 'px';
      o.scan.style.opacity = ps < 1 ? 0.9 : 0;
      if (o.hud) appear(o.hud, lt, 0.1, 0.3, { dx: -200, dy: 0, s0: 1 });
      const pp = P(lt, o.tPin, 0.45);
      o.dot.style.opacity = clamp(pp * 4);
      o.dot.style.transform = `translateY(${(1 - E.outBounce(pp)) * -160}px) scale(${1 + 0.12 * c.beat})`;
      o.rings.forEach((rg, i) => {
        const ph = lt < o.tPin ? 0 : ((lt - o.tPin) / 1.1 + i / 3) % 1;
        rg.style.opacity = lt < o.tPin + 0.05 ? 0 : (1 - ph) * 0.9;
        rg.style.transform = `scale(${0.3 + ph * 2.2})`;
      });
      appear(o.label, lt, o.tLabel, 0.42, { dy: 60, s0: 0.7 });
    },
  };

  T.art = {
    build(s, r) {
      const chip = s.chip ? el('div', 'ab center chip', r, `<span class="pill ${s.chipColor || ''}">${esc(s.chip)}</span>`) : null;
      const box = el('div', 'ab box', r);
      if (s.boxTop) box.style.top = s.boxTop + 'px';
      if (s.boxH) box.style.height = s.boxH + 'px';
      const glow = el('div', 'glow ' + (s.glow || ''), box);
      const holder = el('div', 'svgbox', box, s.art || '');
      const stamp = s.badge ? el('div', 'ab stamp', box, esc(s.badge)) : null;
      if (stamp && s.badgePos === 'bottom') { stamp.style.top = 'auto'; stamp.style.bottom = '-10px'; }
      if (stamp && s.badgePos === 'mid') { stamp.style.top = '44%'; stamp.style.right = '0px'; }
      const title = s.title ? el('div', 'ab title', r, wordsHTML(s.title)) : null;
      if (title && s.titleTop) title.style.top = s.titleTop + 'px';
      const sub = s.sub ? el('div', 'ab sub', r, esc(s.sub)) : null;
      const words = title ? [...title.querySelectorAll('.w')] : [];
      const tStamp = s.badgeAt ?? 0.95;
      sfx(s.start + 0.04, 'pop', 0.45);
      if (stamp) { sfx(s.start + tStamp, 'stamp', 0.85); shake(s.start + tStamp + 0.02, 12, 0.3); }
      if (s.fx === 'tiltup') sfx(s.start + 0.05, 'riser', 0.4);
      const fl = [...holder.querySelectorAll('.flick')], bl = [...holder.querySelectorAll('.blink')];
      return { chip, box, glow, holder, stamp, title, sub, words, tStamp, fl, bl };
    },
    update(s, o, lt, c, f) {
      if (o.chip) appear(o.chip, lt, 0.02, 0.3, { dy: -30 });
      const p = P(lt, 0, 0.5);
      const e = E.outBack(p);
      let ty = Math.sin(lt * 2.1) * 12, rot = (1 - e) * -10 + Math.sin(lt * 1.5) * 1.6, sc = lerp(0.45, 1, e);
      if (s.fx === 'pulse') sc *= 1 + 0.05 * c.beat;
      if (s.fx === 'tiltup') { const q = E.inOutCubic(P(lt, 0, 2.2)); ty = lerp(820, 0, q); sc = 1; rot = 0; o.box.style.opacity = 1; }
      if (s.fx === 'shake') { ty += Math.sin(lt * 53) * 4; rot += Math.sin(lt * 41) * 1.2; }
      if (s.fx !== 'tiltup') o.box.style.opacity = clamp(p * 3);
      o.box.style.transform = `translateY(${ty}px) scale(${sc}) rotate(${rot}deg)`;
      o.glow.style.opacity = 0.45 + 0.45 * c.beat;
      if (o.stamp) {
        const q = P(lt, o.tStamp - 0.12, 0.2);
        o.stamp.style.opacity = clamp(q * 4);
        o.stamp.style.transform = `scale(${lerp(2.8, 1, E.outCubic(q))}) rotate(${lerp(-24, -8, q)}deg)`;
      }
      popWords(o.words, lt, 0.2, 0.08, { dy: 60, s0: 0.4 });
      if (o.sub) appear(o.sub, lt, 0.55, 0.4, { dy: 30, s0: 0.9 });
      flickers(o.fl, o.bl, lt, f);
    },
  };

  T.flyer = {
    build(s, r) {
      const paper = el('div', 'ab paper', r);
      el('div', 'ab tape', paper).style.cssText = 'left:60px;transform:rotate(-8deg)';
      el('div', 'ab tape', paper).style.cssText = 'right:60px;transform:rotate(7deg)';
      el('div', 'head', paper, esc(s.head || ''));
      el('div', 'doodle', paper, s.art || '');
      el('div', 'body', paper, esc(s.body || ''));
      const strips = el('div', 'strips', paper);
      for (let i = 0; i < 8; i++) el('div', 'strip', strips, `<span>${esc(s.strip || '')}</span>`);
      sfx(s.start + 0.02, 'paper', 0.7);
      sfx(s.start + 0.5, 'stamp', 0.75);
      shake(s.start + 0.52, 14, 0.35);
      return { paper };
    },
    update(s, o, lt) {
      const p = P(lt, 0, 0.52);
      const e = E.outCubic(p);
      const sway = Math.sin(lt * 1.8) * 1.2;
      o.paper.style.transform = `translateY(${lerp(-1500, 0, e)}px) rotate(${lerp(-22, -4, E.outBack(p)) + sway}deg) scale(${1 + Math.max(0, lt - 0.6) * 0.02})`;
    },
  };

  T.phone = {
    build(s, r) {
      const body = el('div', 'ab body', r);
      const scr = el('div', 'screen', body);
      el('div', 'ab center lbl', scr, esc(s.label || 'Anruf'));
      const rings = [el('div', 'pring', scr), el('div', 'pring', scr)];
      const av = el('div', 'ab av', scr, esc(s.initials || '?'));
      av.style.background = `linear-gradient(135deg, ${s.c1 || '#2fbf71'}, ${s.c2 || '#42e8d5'})`;
      el('div', 'ab center name', scr, esc(s.name || ''));
      el('div', 'ab center status', scr, esc(s.status || ''));
      const hand = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>';
      el('div', 'ab btn no', scr, hand).firstChild.style.transform = 'rotate(135deg)';
      const yes = el('div', 'ab btn yes', scr, hand);
      sfx(s.start + 0.02, 'whoosh', 0.5);
      sfx(s.start + 0.45, 'ring', 0.75);
      return { body, rings, av, yes };
    },
    update(s, o, lt, c) {
      const p = P(lt, 0, 0.45);
      const vib = (lt > 0.45 && lt < 0.85) || (lt > 1.0 && lt < 1.4) ? Math.sin(lt * 120) * 7 : 0;
      o.body.style.transform = `translate(${vib}px, ${lerp(1300, 0, E.outCubic(p))}px) rotate(${(1 - p) * 8}deg)`;
      o.rings.forEach((rg, i) => { const ph = ((lt / 1.0) + i * 0.5) % 1; rg.style.opacity = (1 - ph) * 0.8; rg.style.transform = `scale(${1 + ph * 0.9})`; });
      o.yes.style.transform = `scale(${1 + 0.12 * c.beat})`;
    },
  };

  T.drop = {
    build(s, r) {
      const target = el('div', 'ab target', r, `<div class="svgbox">${s.target || ''}</div>`);
      const obj = el('div', 'ab obj', r, `<div class="svgbox">${s.object || ''}</div>`);
      const splat = el('div', 'ab splat', r, `<div class="svgbox">${s.splat || ''}</div>`);
      const word = el('div', 'ab center word outline', r, esc(s.word || 'PLATSCH!'));
      const tFall = 0.4, tHit = 1.1;
      sfx(s.start + 0.08, 'pop', 0.4);
      sfx(s.start + tFall + 0.15, 'whoosh', 0.45);
      sfx(s.start + tHit, 'splat', 0.95);
      sfx(s.start + tHit, 'hit', 0.45);
      shake(s.start + tHit, 34, 0.5);
      return { target, obj, splat, word, tFall, tHit };
    },
    update(s, o, lt) {
      appear(o.target, lt, 0.0, 0.45, { dy: 200, s0: 0.9, ease: E.outCubic });
      const pf = P(lt, o.tFall, o.tHit - o.tFall);
      const y = lt < o.tFall ? -40 + Math.sin(lt * 9) * 6 : lerp(-40, 780, E.inQuad(pf));
      o.obj.style.opacity = lt < o.tHit ? clamp(lt * 6) : 0;
      o.obj.style.transform = `translateY(${y + 120}px) rotate(${pf * 520}deg)`;
      const ps = P(lt, o.tHit, 0.25);
      o.splat.style.opacity = lt >= o.tHit ? 1 : 0;
      o.splat.style.transform = `scale(${lerp(0.2, 1, E.outBack(ps))})`;
      const pw = P(lt, o.tHit + 0.05, 0.3);
      o.word.style.opacity = clamp(pw * 4);
      o.word.style.transform = `scale(${lerp(2.4, 1, E.outBack(pw))}) rotate(${-8 + Math.sin(lt * 6) * 2}deg)`;
    },
  };

  T.list = {
    build(s, r) {
      const title = el('div', 'ab title', r, wordsHTML(s.title || ''));
      const rows = el('div', 'ab rows', r);
      const items = (s.items || []).map((it) => el('div', 'row', rows, `<div class="ic">${it.art || ''}</div><div><div class="l">${esc(it.label || '')}</div>${it.sub ? `<div class="s">${esc(it.sub)}</div>` : ''}</div>`));
      const t0 = 0.4, step = s.step || 0.42;
      items.forEach((_, i) => sfx(s.start + t0 + i * step, 'tick', 0.55));
      sfx(s.start + 0.02, 'pop', 0.35);
      const fl = [...rows.querySelectorAll('.flick')], bl = [...rows.querySelectorAll('.blink')];
      return { words: [...title.querySelectorAll('.w')], items, t0, step, fl, bl };
    },
    update(s, o, lt, c, f) {
      popWords(o.words, lt, 0.02, 0.07, { dy: 50, s0: 0.4 });
      o.items.forEach((it, i) => appear(it, lt, o.t0 + i * o.step - 0.05, 0.38, { dx: 760, dy: 0, s0: 0.95, ease: E.outCubic }));
      flickers(o.fl, o.bl, lt, f);
    },
  };

  T.duo = {
    build(s, r) {
      const title = s.title ? el('div', 'ab title', r, wordsHTML(s.title)) : null;
      const mk = (side, d) => el('div', 'ab card ' + side, r, `<div class="ic">${d.art || ''}</div><div class="l">${esc(d.label || '')}</div>${d.sub ? `<div class="s">${esc(d.sub)}</div>` : ''}`);
      const L = mk('left', s.left || {}), R = mk('right', s.right || {});
      const M = el('div', 'ab mid', r, esc(s.mid || 'VS'));
      sfx(s.start + 0.1, 'whoosh', 0.5, -0.6);
      sfx(s.start + 0.45, 'whoosh', 0.5, 0.6);
      sfx(s.start + 0.82, 'hit', 0.7);
      shake(s.start + 0.84, 14, 0.3);
      return { words: title ? [...title.querySelectorAll('.w')] : [], L, R, M };
    },
    update(s, o, lt) {
      popWords(o.words, lt, 0.0, 0.07, { dy: 50, s0: 0.4 });
      appear(o.L, lt, 0.1, 0.4, { dx: -800, dy: 0, s0: 1, rot: -10, ease: E.outCubic });
      appear(o.R, lt, 0.45, 0.4, { dx: 800, dy: 0, s0: 1, rot: 10, ease: E.outCubic });
      const p = P(lt, 0.76, 0.3);
      o.M.style.opacity = clamp(p * 4);
      o.M.style.transform = `scale(${lerp(3, 1, E.outBack(p))}) rotate(${lerp(-90, 0, p)}deg)`;
    },
  };

  T.step = {
    build(s, r) {
      const num = el('div', 'ab num', r, esc(String(s.n).padStart(2, '0')));
      const chip = el('div', 'ab chip', r, `<span class="pill">${esc(s.chip || 'Schritt ' + s.n)}</span>`);
      const title = el('div', 'ab title', r, wordsHTML(s.title || ''));
      let box = null, glow = null, holder = null, items = [];
      if (s.art) { box = el('div', 'ab box', r); glow = el('div', 'glow teal', box); holder = el('div', 'svgbox', box, s.art); }
      if (s.items) { const wrap = el('div', 'ab items', r); items = s.items.map((it, i) => el('div', 'item', wrap, `<div class="k">${i + 1}</div><div>${esc(it)}</div>`)); }
      sfx(s.start + 0.04, 'hit', 0.6);
      if (box) sfx(s.start + 0.42, 'pop', 0.5);
      items.forEach((_, i) => sfx(s.start + 0.6 + i * 0.45, 'tick', 0.55));
      const fl = holder ? [...holder.querySelectorAll('.flick')] : [], bl = holder ? [...holder.querySelectorAll('.blink')] : [];
      return { num, chip, words: [...title.querySelectorAll('.w')], box, glow, items, fl, bl, title };
    },
    layout(s, o) {
      const h = o.title.getBoundingClientRect().height;
      const top = 420 + h + 40;
      if (o.box) { o.box.style.top = top + 'px'; o.box.style.height = Math.max(260, 1210 - top) + 'px'; }
      const it = o.items[0] && o.items[0].parentElement; if (it) it.style.top = top + 'px';
    },
    update(s, o, lt, c, f) {
      appear(o.num, lt, 0.0, 0.45, { dx: -400, dy: 0, s0: 1.4, ease: E.outCubic });
      appear(o.chip, lt, 0.12, 0.3, { dy: -20 });
      popWords(o.words, lt, 0.2, 0.07, { dy: 60, s0: 0.4 });
      if (o.box) {
        const p = appear(o.box, lt, 0.38, 0.5, { dy: 80, s0: 0.5 });
        if (p >= 1) o.box.style.transform = `translateY(${Math.sin(lt * 2) * 10}px)`;
        o.glow.style.opacity = 0.4 + 0.4 * c.beat;
      }
      o.items.forEach((it, i) => appear(it, lt, 0.55 + i * 0.45, 0.38, { dx: 700, dy: 0, s0: 1, ease: E.outCubic }));
      flickers(o.fl, o.bl, lt, f);
    },
  };

  T.title = {
    build(s, r) {
      const k = el('div', 'ab center kicker', r, `<span class="pill pink">${esc(s.kicker || 'Missions-Guide')}</span>`);
      const name = el('div', 'ab name', r);
      let chars = [];
      String(s.name || '').split(/\s+/).forEach((w) => { const wd = el('span', 'wd', name); [...w].forEach((ch) => chars.push(el('span', 'ch', wd, esc(ch)))); });
      const bar = el('div', 'ab bar', r);
      const chip = s.chip ? el('div', 'ab center chip2', r, `<span class="pill">${esc(s.chip)}</span>`) : null;
      let box = null, holder = null;
      if (s.art) { box = el('div', 'ab box', r); el('div', 'glow', box); holder = el('div', 'svgbox', box, s.art); }
      const tC = 0.25, step = 0.035, tEnd = tC + chars.length * step + 0.1;
      sfx(s.start + 0.0, 'riser', 0.45);
      sfx(s.start + tEnd, 'boom', 0.9);
      flash(s.start + tEnd, 0.6, 0.25);
      shake(s.start + tEnd, 22, 0.45);
      if (box) sfx(s.start + tEnd + 0.45, 'pop', 0.5);
      if (drop == null) drop = s.start + tEnd;
      return { k, chars, bar, chip, box, tC, step, tEnd, name };
    },
    layout(s, o) {
      const h = o.name.getBoundingClientRect().height;
      const y = 420 + h + 30;
      o.bar.style.top = y + 'px';
      if (o.chip) o.chip.style.top = y + 50 + 'px';
      if (o.box) { o.box.style.top = y + 150 + 'px'; o.box.style.height = Math.max(240, 1220 - (y + 150)) + 'px'; }
    },
    update(s, o, lt, c) {
      appear(o.k, lt, 0.0, 0.3, { dy: -30 });
      o.chars.forEach((ch, i) => {
        const p = P(lt, o.tC + i * o.step, 0.3);
        ch.style.opacity = clamp(p * 3);
        ch.style.transform = `translateY(${(1 - E.outCubic(p)) * 120}px) scale(${lerp(1.8, 1, E.outCubic(p))})`;
        const sweep = ((lt - o.tEnd) * 1.4 - i / o.chars.length) % 2;
        ch.style.color = sweep > 0 && sweep < 0.12 ? '#ffd23f' : '#fff';
      });
      const pb = P(lt, o.tEnd - 0.05, 0.35);
      o.bar.style.transform = `scaleX(${E.outCubic(pb)})`;
      if (o.chip) appear(o.chip, lt, o.tEnd + 0.15, 0.3, { dy: 30 });
      if (o.box) { const p = appear(o.box, lt, o.tEnd + 0.4, 0.5, { dy: 120, s0: 0.5 }); if (p >= 1) o.box.style.transform = `translateY(${Math.sin(lt * 2) * 10}px)`; }
    },
  };

  T.cta = {
    build(s, r) {
      const q = el('div', 'ab q', r, wordsHTML(s.question || ''));
      const opts = el('div', 'ab opts', r);
      const items = (s.options || []).map((o, i) => el('div', 'opt', opts, `<div class="ic">${o.art || ''}</div><div>${esc(o.label)}</div><div class="n">${i + 1}</div>`));
      const hint = el('div', 'ab center hint', r, esc(s.hint || 'Schreib’s in die Kommentare!'));
      const handle = el('div', 'ab center handle', r, `<span class="pill pink">${esc(D.handle)}</span>`);
      const site = el('div', 'ab center site', r, `<span class="acc">${esc(D.site)}</span>`);
      const logo = el('div', 'ab logo', r, D.logo);
      const t0 = 0.5, step = 0.28;
      const tHint = t0 + items.length * step + 0.15, tHandle = tHint + 0.45, tSite = tHandle + 0.35;
      items.forEach((_, i) => sfx(s.start + t0 + i * step, 'pop', 0.55));
      sfx(s.start + tHint, 'ding', 0.55);
      sfx(s.start + tHandle, 'chime', 0.55);
      sfx(s.start + tSite, 'tick', 0.4);
      return { words: [...q.querySelectorAll('.w')], items, hint, handle, site, logo, t0, step, tHint, tHandle, tSite };
    },
    update(s, o, lt, c) {
      popWords(o.words, lt, 0.02, 0.08, { dy: 60, s0: 0.4 });
      o.items.forEach((it, i) => { const p = appear(it, lt, o.t0 + i * o.step, 0.38, { dx: i % 2 ? 600 : -600, dy: 0, s0: 0.9, ease: E.outBack }); if (p >= 1) it.style.transform = `scale(${1 + 0.025 * c.beat})`; });
      appear(o.hint, lt, o.tHint, 0.35, { dy: 40, s0: 0.8 });
      appear(o.handle, lt, o.tHandle, 0.4, { dy: 0, s0: 2.2 });
      appear(o.site, lt, o.tSite, 0.35, { dy: 30, s0: 0.8 });
      const pl = appear(o.logo, lt, o.tSite + 0.15, 0.45, { dy: 0, s0: 0.2, rot: -180 });
      if (pl >= 1) o.logo.style.transform = `rotate(${Math.sin(lt * 2) * 6}deg) scale(${1 + 0.06 * c.beat})`;
    },
  };

  function flickers(fl, bl, lt, f) {
    if (fl.length) { const r = rand(f * 31 + 7); fl.forEach((n) => (n.style.opacity = r() > 0.3 ? 1 : 0.15)); }
    bl.forEach((n, i) => (n.style.opacity = Math.floor(lt * 2.4 + i * 0.5) % 2 ? 1 : 0.25));
  }

  // ------------------------------------------------------------------ Hintergrund
  function makeSun() {
    const c = document.createElement('canvas');
    c.width = 760; c.height = 400;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 20, 0, 400);
    gr.addColorStop(0, '#ffd23f'); gr.addColorStop(0.45, '#ff8a5c'); gr.addColorStop(1, '#ff3fa4');
    g.fillStyle = gr;
    g.beginPath(); g.arc(380, 380, 340, Math.PI, 2 * Math.PI); g.fill();
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 9; i++) { const y = 200 + i * 22; g.fillRect(0, y, 760, 4 + i * 1.6); }
    return c;
  }
  const STARS = (() => { const r = rand(99); return Array.from({ length: 140 }, () => ({ x: r() * W, y: r() * (HZ - 80), s: 0.8 + r() * 2.2, p: r() * 6 })); })();
  const DUST = (() => { const r = rand(42); return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, s: 1.4 + r() * 3, v: 30 + r() * 70, p: r() * 6, c: r() > 0.5 ? '255,85,184' : '66,232,213' })); })();

  function drawBG(t, night, beat) {
    const g = bgx;
    const sky = g.createLinearGradient(0, 0, 0, HZ);
    sky.addColorStop(0, night ? '#05051a' : '#130b30');
    sky.addColorStop(0.6, night ? '#0e0b33' : '#25104a');
    sky.addColorStop(1, night ? '#1a1150' : '#4a145e');
    g.fillStyle = sky; g.fillRect(0, 0, W, HZ);
    g.globalCompositeOperation = 'lighter';
    const blob = (x, y, r, col) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
    blob(180 + 140 * Math.sin(t * 0.31), 420 + 90 * Math.cos(t * 0.23), 560, `rgba(255,85,184,${0.16 + 0.06 * beat})`);
    blob(900 + 110 * Math.cos(t * 0.27), 980 + 80 * Math.sin(t * 0.29), 600, 'rgba(66,232,213,0.10)');
    g.globalCompositeOperation = 'source-over';
    const starA = 0.25 + night * 0.75;
    STARS.forEach((s) => { g.globalAlpha = starA * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2 + s.p))); g.fillStyle = '#fff'; g.fillRect(s.x, s.y, s.s, s.s); });
    g.globalAlpha = 0.62 * (1 - night * 0.8);
    g.drawImage(sunCanvas, 540 - 380, HZ - 380);
    g.globalAlpha = 1;
    const fl = g.createLinearGradient(0, HZ, 0, H);
    fl.addColorStop(0, '#2a0b3d'); fl.addColorStop(1, '#07060f');
    g.fillStyle = fl; g.fillRect(0, HZ, W, H - HZ);
    g.strokeStyle = '#ff55b8'; g.lineWidth = 2;
    const sp = (t * D.bpm) / 60;
    for (let i = 0; i < 14; i++) {
      const d = (i + (sp % 1)) / 14;
      const y = HZ + (H - HZ) * Math.pow(d, 2.3);
      g.globalAlpha = 0.15 + 0.6 * d; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    }
    for (let i = -14; i <= 14; i++) { g.globalAlpha = 0.45; g.beginPath(); g.moveTo(540 + i * 22, HZ); g.lineTo(540 + i * 210, H); g.stroke(); }
    g.globalAlpha = 1;
    const hz = g.createLinearGradient(0, HZ - 6, 0, HZ + 6);
    hz.addColorStop(0, 'rgba(255,85,184,0)'); hz.addColorStop(0.5, `rgba(255,140,210,${0.8 + 0.2 * beat})`); hz.addColorStop(1, 'rgba(255,85,184,0)');
    g.fillStyle = hz; g.fillRect(0, HZ - 6, W, 12);
    DUST.forEach((p) => { const y = (p.y - t * p.v) % H; const yy = y < 0 ? y + H : y; g.globalAlpha = 0.25 + 0.35 * Math.sin(t * 3 + p.p) ** 2; g.fillStyle = `rgb(${p.c})`; g.beginPath(); g.arc(p.x + 14 * Math.sin(t * 0.8 + p.p), yy, p.s, 0, 7); g.fill(); });
    g.globalAlpha = 1;
  }

  // ------------------------------------------------------------------ Aufbau
  window.setup = function (data) {
    D = data;
    document.body.innerHTML = `
      <canvas id="bg" width="${W}" height="${H}"></canvas>
      <div id="camwrap" style="position:absolute;inset:0"><div id="cam"></div></div>
      <div id="caps"></div>
      <div id="vig"></div>
      <div id="brand">${D.logo}<span>5-Sterne-<b>Kompass</b></span></div>
      <div id="prog"></div>
      <div id="disc">${esc(D.disc)}</div>
      <div id="flash"></div>
      <svg width="0" height="0" style="position:absolute"><filter id="rgb" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/><feOffset id="rOff" in="r" dx="0" dy="0" result="r2"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/><feOffset id="bOff" in="b" dx="0" dy="0" result="b2"/>
        <feBlend in="r2" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b2" mode="screen"/></filter></svg>`;
    bgx = document.getElementById('bg').getContext('2d');
    cam = document.getElementById('cam');
    camWrap = document.getElementById('camwrap');
    capsEl = document.getElementById('caps');
    progEl = document.getElementById('prog');
    flashEl = document.getElementById('flash');
    rOff = document.getElementById('rOff');
    bOff = document.getElementById('bOff');
    capsEl.classList.add('outline');
    sunCanvas = makeSun();
    SC = D.scenes.map((s) => {
      const r = el('div', 'scene ' + (s.type === 'title' ? 'ttl' : s.type), cam);
      const tpl = T[s.type];
      if (!tpl) throw new Error('Unbekannte Szene: ' + s.type);
      const o = tpl.build(s, r);
      return { s, r, tpl, o };
    });
    SC.forEach((x) => { x.r.style.visibility = 'visible'; if (x.tpl.layout) x.tpl.layout(x.s, x.o); x.r.style.visibility = 'hidden'; });
    // Übergänge: Effekte
    SC.forEach((x, i) => {
      if (i === 0) return;
      const tr = x.s.trans, t0 = x.s.start;
      if (tr === 'whip' || tr === 'up') sfx(t0 - 0.2, 'whoosh', 0.7, tr === 'whip' ? 0.4 : 0);
      if (tr === 'zoom') { sfx(t0 - 0.24, 'whoosh', 0.6); sfx(t0, 'hit', 0.35); }
      if (tr === 'glitch') { sfx(t0 - 0.12, 'glitch', 0.6); EV.glitches.push({ t: t0 - 0.15, dur: 0.3 }); }
      if (tr === 'flash') { sfx(t0 - 0.02, 'hit', 0.7); flash(t0, 0.72, 0.26); shake(t0, 16, 0.35); }
      if (tr === 'slam') { sfx(t0 - 0.02, 'boom', 0.6); shake(t0 + 0.05, 24, 0.45); }
    });
    EV.sfx.sort((a, b) => a.t - b.t);
    return { events: EV.sfx, drop: drop ?? 0 };
  };

  // ------------------------------------------------------------------ Bild für Bild
  window.renderFrame = function (t) {
    frameNo = Math.round(t * 30);
    const beatPh = ((t * D.bpm) / 60) % 1;
    const beat = Math.exp(-beatPh * 5.5);
    let curI = 0;
    for (let i = 0; i < SC.length; i++) if (t >= SC[i].s.start) curI = i;
    const cur = SC[curI].s, prev = SC[curI - 1] && SC[curI - 1].s;
    const nightNow = cur.night ? 1 : 0, nightPrev = prev && prev.night ? 1 : 0;
    const night = lerp(nightPrev, nightNow, clamp((t - cur.start) / 0.5));
    drawBG(t, night, beat);

    SC.forEach((x, i) => {
      const s = x.s, end = s.start + s.dur;
      const nx = SC[i + 1] && SC[i + 1].s;
      const tin = i > 0 ? s.trans : 'cut', tout = nx ? nx.trans : 'cut';
      const dIn = TD[tin] ?? 0.3, dOut = TD[tout] ?? 0.3;
      const hardIn = ['glitch', 'flash', 'cut', 'slam'].includes(tin), hardOut = ['glitch', 'flash', 'cut', 'slam'].includes(tout);
      const a = hardIn ? s.start : s.start - dIn / 2;
      const b = nx ? (hardOut ? end : end + dOut / 2) : end + 1;
      if (t < a || t >= b) { x.r.style.visibility = 'hidden'; return; }
      x.r.style.visibility = 'visible';
      const lt = t - s.start;
      let tf = '', filter = '', op = 1;
      const push = 1 + 0.03 * clamp(lt / Math.max(1, s.dur));
      if (i > 0 && !hardIn && t < s.start + dIn / 2) {
        const e = E.inOutCubic((t - a) / dIn);
        if (tin === 'whip') { tf += `translateX(${(1 - e) * W * 1.1}px) `; filter = `blur(${(1 - e) * 18}px)`; }
        if (tin === 'up') { tf += `translateY(${(1 - e) * H}px) `; filter = `blur(${(1 - e) * 14}px)`; }
        if (tin === 'zoom') { tf += `scale(${0.55 + 0.45 * e}) `; op = e; }
      }
      if (i > 0 && tin === 'slam' && lt < 0.3) { const e = E.outCubic(lt / 0.3); tf += `scale(${lerp(1.7, 1, e)}) `; op = clamp(lt / 0.08); }
      if (i > 0 && tin === 'flash' && lt < 0.3) tf += `scale(${lerp(1.15, 1, E.outCubic(lt / 0.3))}) `;
      if (nx && !hardOut && t > end - dOut / 2) {
        const e = E.inOutCubic((t - (end - dOut / 2)) / dOut);
        if (tout === 'whip') { tf += `translateX(${-e * W * 1.1}px) `; filter = `blur(${e * 18}px)`; }
        if (tout === 'up') { tf += `translateY(${-e * H}px) `; filter = `blur(${e * 14}px)`; }
        if (tout === 'zoom') { tf += `scale(${1 + 0.9 * e}) `; op = 1 - e; filter = `blur(${e * 10}px)`; }
      }
      x.r.style.transform = tf + `scale(${push})`;
      x.r.style.filter = filter;
      x.r.style.opacity = op;
      x.tpl.update(s, x.o, lt, { beat, t }, frameNo);
    });

    // Kamera: Wackeln
    let sx = 0, sy = 0, rot = 0;
    EV.shakes.forEach((k, i) => {
      const d = t - k.t;
      if (d < 0 || d > k.dur) return;
      const a = k.amp * Math.exp(-d * 9) * (1 - d / k.dur);
      sx += a * Math.sin(d * 71 + i); sy += a * Math.cos(d * 63 + i * 2); rot += a * 0.03 * Math.sin(d * 50 + i);
    });
    cam.style.transform = `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${1 + 0.004 * beat})`;
    // Glitch
    const gl = EV.glitches.find((g) => t >= g.t && t < g.t + g.dur);
    if (gl) {
      const r = rand(frameNo * 13 + 5);
      const amt = 14 + r() * 26;
      rOff.setAttribute('dx', amt); bOff.setAttribute('dx', -amt);
      camWrap.style.filter = 'url(#rgb)';
      camWrap.style.transform = `translateX(${(r() - 0.5) * 60}px) skewX(${(r() - 0.5) * 8}deg)`;
    } else { camWrap.style.filter = ''; camWrap.style.transform = ''; }
    // Blitz
    let fa = 0;
    EV.flashes.forEach((f) => { const d = t - f.t; if (d >= 0 && d < f.dur) fa = Math.max(fa, f.peak * (1 - d / f.dur) ** 2); });
    flashEl.style.opacity = fa;
    // Untertitel
    const c = D.captions.find((c) => t >= c.t0 && t < c.t1);
    if (!c) { capsEl.style.opacity = 0; curCap = null; }
    else {
      if (c !== curCap) {
        capsEl.innerHTML = `<div class="c">${c.words.map((w) => `<span class="cw">${esc(w.text)}</span>`).join(' ')}</div>`;
        curCap = c; capWords = [...capsEl.querySelectorAll('.cw')];
      }
      capsEl.style.opacity = 1;
      const p = P(t, c.t0, 0.14);
      capsEl.firstChild.style.transform = `scale(${lerp(0.75, 1, E.outBack(p))})`;
      let on = -1;
      c.words.forEach((w, i) => { if (t >= w.t) on = i; });
      capWords.forEach((n, i) => { n.classList.toggle('on', i === on); n.style.transform = i === on ? 'scale(1.1)' : ''; });
    }
    progEl.style.width = (clamp(t / D.total) * 100).toFixed(2) + '%';
    return true;
  };
})();
