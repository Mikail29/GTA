#!/usr/bin/env python3
"""
Eigene Musik und Soundeffekte für die Kurzvideos des 5-Sterne-Kompass.
Alles wird hier selbst synthetisiert (Sinus, Rauschen, Filter) – keine fremden Samples,
keine fremde Musik. Dadurch gibt es keine Urheberrechts-Probleme.

Aufruf: audio.py timeline.json ausgabeordner
timeline.json: { duration, bpm, drop, speech: [[start,end],…], events: [{t, type, gain}], voice: [{file, t}] }
Schreibt: musik.wav (mit Platz für die Stimme), effekte.wav, stimme.wav
"""
import json, os, sys, wave
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(5)


# ---------------------------------------------------------------- Grundbausteine
def t_axis(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def filt(x, kind, fc, order=2):
    sos = signal.butter(order, fc, kind, fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def sweep_sine(f0, f1, d, curve=6.0):
    """Sinus, dessen Tonhöhe exponentiell von f0 nach f1 gleitet."""
    t = t_axis(d)
    f = f1 + (f0 - f1) * np.exp(-t * curve)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def decay(d, rate):
    return np.exp(-t_axis(d) * rate)


def band_sweep(x, centers, weights):
    """Einfacher „Filter-Sweep“: mehrere Bandpass-Versionen, zeitlich überblendet."""
    out = np.zeros_like(x)
    for c, w in zip(centers, weights):
        lo, hi = c / 1.6, min(c * 1.6, SR / 2 - 100)
        out += filt(x, "bandpass", [lo, hi], 2) * w
    return out


def reverb(x, d=1.0, mix=0.25):
    ir = rng.standard_normal(int(d * SR)) * np.exp(-t_axis(d) * 5.5)
    ir = filt(ir, "lowpass", 5000)
    wet = signal.fftconvolve(x, ir) * 0.06
    out = np.zeros(len(wet))
    out[: len(x)] += x
    return out * (1 - mix) + wet * mix * 4


def stereo(x, pan=0.0, width=0.0):
    """pan: -1 links … +1 rechts; width: leichte Verzögerung für Breite."""
    l = x * np.sqrt((1 - pan) / 2) * 1.41
    r = x * np.sqrt((1 + pan) / 2) * 1.41
    if width:
        k = int(width * SR)
        r = np.concatenate([np.zeros(k), r])[: len(x)]
    return np.stack([l, r], axis=1)


# ---------------------------------------------------------------- Soundeffekte
def sfx_whoosh(d=0.42):
    n = noise(d)
    t = t_axis(d) / d
    w_lo = np.clip(1 - t * 2, 0, 1)
    w_mid = np.sin(np.pi * np.clip(t * 1.4, 0, 1))
    w_hi = np.clip(t * 2 - 0.6, 0, 1)
    x = band_sweep(n, [500, 1600, 4200], [w_lo, w_mid, w_hi])
    env = np.where(t < 0.62, (t / 0.62) ** 2.2, np.exp(-(t - 0.62) * 9))
    return x * env * 0.9


def sfx_boom(d=1.6):
    t = t_axis(d)
    body = sweep_sine(150, 38, d, 9) * np.exp(-t * 2.4)
    click = filt(noise(0.02), "lowpass", 2500) * decay(0.02, 120)
    x = np.tanh(body * 1.8) * 0.9
    x[: len(click)] += click * 0.6
    sub = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 3.2) * 0.35
    return reverb(filt(x + sub, "lowpass", 900), 1.2, 0.18)[: int(d * SR)]


def sfx_hit(d=0.5):
    """Kurzer, harter Schlag (für Schrift, die „einschlägt“)."""
    t = t_axis(d)
    body = sweep_sine(220, 55, d, 18) * np.exp(-t * 9)
    snap = filt(noise(d), "bandpass", [1200, 6000]) * np.exp(-t * 38)
    return np.tanh((body + snap * 0.7) * 1.6) * 0.8


def sfx_riser(d=1.1):
    t = t_axis(d) / d
    n = noise(d)
    x = band_sweep(n, [700, 2200, 6000], [1 - t, np.sin(np.pi * t), t])
    tone = signal.sawtooth(2 * np.pi * np.cumsum(220 + 900 * t ** 2) / SR) * 0.12
    return (x * 0.8 + filt(tone, "lowpass", 3000)) * t ** 2.4


def sfx_pop():
    d = 0.11
    x = sweep_sine(560, 1350, d, -14) * decay(d, 38)
    return filt(x, "lowpass", 5000) * 0.55


def sfx_tick():
    d = 0.05
    x = np.sin(2 * np.pi * 2600 * t_axis(d)) * decay(d, 90) * 0.5 + filt(noise(d), "highpass", 3000) * decay(d, 160) * 0.3
    return x


def sfx_ding():
    d = 1.4
    t = t_axis(d)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * r) for f, a, r in [(1318.5, 0.5, 3), (1975.5, 0.3, 4), (2637, 0.18, 6), (3951, 0.08, 9)])
    return reverb(x * 0.6, 1.0, 0.2)[: int(d * SR)]


def sfx_chime():
    """Aufsteigender Erfolgs-Klang (C–E–G–C)."""
    out = np.zeros(int(1.6 * SR))
    for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        d = 1.2
        t = t_axis(d)
        tone = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 4) * 0.35
        k = int(i * 0.075 * SR)
        out[k : k + len(tone)] += tone[: len(out) - k]
    return reverb(out, 1.0, 0.22)[: len(out)]


def sfx_glitch(d=0.32):
    n = int(d * SR)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        seg = int(rng.uniform(0.012, 0.05) * SR)
        kind = rng.integers(0, 3)
        tt = np.arange(seg) / SR
        if kind == 0:
            s = signal.square(2 * np.pi * rng.uniform(180, 1800) * tt) * 0.35
        elif kind == 1:
            s = rng.standard_normal(seg) * 0.4
        else:
            s = np.zeros(seg)
        x[pos : pos + seg] = s[: n - pos]
        pos += seg
    x = np.round(x * 6) / 6  # „Bitcrusher“
    return filt(x, "lowpass", 7000) * 0.7


def sfx_stamp():
    d = 0.5
    t = t_axis(d)
    x = np.sin(2 * np.pi * 95 * t) * np.exp(-t * 16) + filt(noise(d), "lowpass", 1800) * np.exp(-t * 45) * 0.8
    return reverb(np.tanh(x * 1.5) * 0.8, 0.5, 0.15)[: int(d * SR)]


def sfx_ping():
    d = 1.3
    t = t_axis(d)
    base = np.sin(2 * np.pi * 1150 * t) * np.exp(-t * 6) * 0.45
    out = base.copy()
    for delay, g in [(0.22, 0.4), (0.44, 0.18)]:
        k = int(delay * SR)
        out[k:] += base[: len(out) - k] * g
    return filt(out, "lowpass", 4000)


def sfx_splat():
    d = 0.45
    t = t_axis(d)
    n = noise(d)
    x = band_sweep(n, [2500, 900, 300], [np.exp(-t * 20), np.exp(-t * 8) * (1 - np.exp(-t * 40)), np.exp(-t * 5) * 0.8])
    squish = sweep_sine(320, 70, d, 10) * np.exp(-t * 9) * 0.6
    return np.tanh((x * 1.2 + squish) * 1.3) * 0.75


def sfx_ring():
    out = np.zeros(int(1.4 * SR))
    for k0 in (0.0, 0.55):
        d = 0.38
        t = t_axis(d)
        tone = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * t))) * 0.18
        tone *= np.minimum(1, t * 60) * np.minimum(1, (d - t) * 60)
        k = int(k0 * SR)
        out[k : k + len(tone)] += tone
    return out


def sfx_paper():
    d = 0.35
    t = t_axis(d)
    x = filt(noise(d), "highpass", 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * t)) * np.sin(np.pi * t / d) ** 1.5
    return x * 0.45


def sfx_type():
    d = 0.03
    return filt(noise(d), "bandpass", [2000, 7000]) * decay(d, 140) * 0.35


SFX = {
    "whoosh": sfx_whoosh, "boom": sfx_boom, "hit": sfx_hit, "riser": sfx_riser, "pop": sfx_pop,
    "tick": sfx_tick, "ding": sfx_ding, "chime": sfx_chime, "glitch": sfx_glitch, "stamp": sfx_stamp,
    "ping": sfx_ping, "splat": sfx_splat, "ring": sfx_ring, "paper": sfx_paper, "type": sfx_type,
}
PAN = {"whoosh": 0.0, "pop": 0.0}


# ---------------------------------------------------------------- Musik (eigener Synthwave-Beat)
def note_freq(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def kick():
    d = 0.42
    t = t_axis(d)
    x = sweep_sine(165, 46, d, 26) * np.exp(-t * 7.5)
    x[: int(0.004 * SR)] += 0.4
    return np.tanh(x * 2.2) * 0.95


def clap():
    d = 0.32
    t = t_axis(d)
    n = filt(noise(d), "bandpass", [900, 5200])
    env = np.exp(-t * 18)
    for k in (0.0, 0.011, 0.022):
        i = int(k * SR)
        env[i : i + int(0.008 * SR)] += 0.8
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.4
    return (filt(n, "lowpass", 4200) * env * 0.65 + tone) * 0.58


def hat(open_=False):
    d = 0.28 if open_ else 0.05
    t = t_axis(d)
    return filt(noise(d), "highpass", 7500) * np.exp(-t * (11 if open_ else 75)) * (0.22 if open_ else 0.3)


def saw(f, d, detune=(0, 7, -7)):
    t = t_axis(d)
    return sum(signal.sawtooth(2 * np.pi * f * 2 ** (c / 1200) * t + rng.uniform(0, 6)) for c in detune) / len(detune)


def build_music(duration, bpm, drop):
    beat = 60.0 / bpm
    bar = beat * 4
    n = int((duration + 2) * SR)
    drums = np.zeros(n)
    bass = np.zeros(n)
    pad = np.zeros(n)
    arp = np.zeros(n)
    duck = np.ones(n)
    prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]  # Am F C G
    K, C, H, HO = kick(), clap(), hat(), hat(True)

    def put(buf, x, t, g=1.0):
        i = int(t * SR)
        if i >= len(buf):
            return
        m = min(len(x), len(buf) - i)
        buf[i : i + m] += x[:m] * g

    bars = int(np.ceil((duration + 1) / bar))
    end_drums = duration - 1.0
    for b in range(bars):
        t0 = b * bar
        root, chord = prog[b % 4]
        # Flächen (Pad) – ganze Takte
        d = bar + 0.4
        tt = t_axis(d)
        env = np.minimum(1, tt / 0.25) * np.minimum(1, np.maximum(0, (d - tt) / 0.4))
        chord_x = sum(saw(note_freq(m), d) for m in chord) / 3
        put(pad, filt(chord_x, "lowpass", 1500) * env * 0.46, t0)
        # Arpeggio in Sechzehnteln
        notes = chord + [m + 12 for m in chord] + [chord[1] + 12]
        for s in range(16):
            ts = t0 + s * beat / 4
            m = notes[(s * 2 + (s // 4)) % len(notes)] + 12
            dd = 0.16
            x = signal.square(2 * np.pi * note_freq(m) * t_axis(dd), duty=0.35) * np.exp(-t_axis(dd) * 22)
            put(arp, filt(x, "lowpass", 2600) * 0.16, ts)
        # Bass (808-artig) auf den Kick-Schlägen
        for k_beat in (0, 1.5, 2, 3.5):
            tb = t0 + k_beat * beat
            dd = beat * (1.5 if k_beat in (0, 2) else 0.5)
            tt = t_axis(dd)
            f = note_freq(root - 24)
            x = np.tanh(np.sin(2 * np.pi * f * tt) * 1.6) * np.minimum(1, tt * 200) * np.exp(-tt * 1.8)
            put(bass, x * 0.55, tb)
        # Schlagzeug
        for i8 in range(8):
            ts = t0 + i8 * beat / 2
            if ts >= end_drums:
                break
            if ts < drop - 0.01:
                if i8 % 2 == 1:
                    put(drums, H, ts, 0.6)
                continue
            if i8 in (0, 4) or (i8 == 5 and b % 2 == 1):
                put(drums, K, ts)
                i = int(ts * SR)
                m = min(int(0.28 * SR), n - i)
                if m > 0:
                    duck[i : i + m] = np.minimum(duck[i : i + m], 1 - 0.55 * np.exp(-np.arange(m) / SR / 0.11))
            if i8 in (2, 6):
                put(drums, C, ts)
            put(drums, HO if i8 == 7 and b % 2 == 0 else H, ts, 0.9)
            if b % 4 == 3 and i8 >= 6:
                put(drums, H, ts + beat / 4, 0.7)
    # Vor dem Drop: alles gedämpft (Tiefpass) – danach geht der Filter auf
    pre = np.zeros(n)
    i_drop = int(max(0, drop) * SR)
    music_body = pad + arp * 1.0 + bass
    if i_drop > 0:
        muffled = filt(music_body, "lowpass", 650)
        fade = np.clip((np.arange(n) - i_drop) / (0.08 * SR), 0, 1)
        music_body = muffled * (1 - fade) + music_body * fade
    mix = music_body * duck + drums + pre
    # Ende: sanft ausblenden
    t = np.arange(n) / SR
    mix *= np.clip((duration + 0.2 - t) / 1.4, 0, 1)
    mix = np.tanh(mix * 1.1)
    mix /= np.max(np.abs(mix)) + 1e-9
    st = np.stack([mix, mix], axis=1)
    # Arpeggio leicht nach rechts, Pad etwas breiter
    st[:, 1] = np.concatenate([np.zeros(int(0.012 * SR)), st[:-int(0.012 * SR), 1]])
    return st[: int(duration * SR)] * 0.9


# ---------------------------------------------------------------- Zusammenbau
def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def read_wav_mono(path):
    with wave.open(path) as w:
        sr = w.getframerate()
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768
    if ch > 1:
        data = data.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        g = np.gcd(sr, SR)
        data = signal.resample_poly(data, SR // g, sr // g)
    return data


def main():
    tl = json.load(open(sys.argv[1], encoding="utf-8"))
    out = sys.argv[2]
    dur = tl["duration"]
    n = int(dur * SR)
    # Musik
    music = build_music(dur, tl.get("bpm", 100), tl.get("drop", 0.0))
    # Platz für die Stimme: Musik während des Sprechens leiser
    duck = np.ones(n)
    for a, b in tl.get("speech", []):
        i0, i1 = int(max(0, a - 0.08) * SR), int(min(dur, b + 0.15) * SR)
        duck[i0:i1] = 0.38
    duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), mode="same")
    music = music[:n] * duck[: len(music), None]
    write_wav(os.path.join(out, "musik.wav"), music * 0.5)
    # Effekte
    fx = np.zeros((n + SR * 2, 2))
    for e in tl.get("events", []):
        fn = SFX.get(e["type"])
        if not fn:
            continue
        x = fn()
        st = stereo(x, e.get("pan", PAN.get(e["type"], 0.0)), 0.0)
        i = int(max(0, e["t"]) * SR)
        m = min(len(st), len(fx) - i)
        fx[i : i + m] += st[:m] * e.get("gain", 1.0)
    # Original-Ton aus eigenen Clips (falls gewünscht)
    for c in tl.get("clips", []):
        x = read_wav_mono(c["file"])[: int(c.get("dur", 30) * SR)]
        fade = np.minimum(1, np.minimum(np.arange(len(x)) / (0.15 * SR), (len(x) - np.arange(len(x))) / (0.25 * SR)))
        i = int(c["t"] * SR)
        m = min(len(x), len(fx) - i)
        if m > 0:
            fx[i : i + m] += np.stack([x[:m], x[:m]], axis=1) * fade[:m, None] * c.get("gain", 0.8)
    fx = fx[:n]
    peak = np.max(np.abs(fx)) + 1e-9
    if peak > 0.95:
        fx *= 0.95 / peak
    write_wav(os.path.join(out, "effekte.wav"), fx * 0.8)
    # Stimme (Probe)
    voice = np.zeros(n)
    for v in tl.get("voice", []):
        x = read_wav_mono(v["file"])
        i = int(v["t"] * SR)
        m = min(len(x), n - i)
        if m > 0:
            voice[i : i + m] += x[:m]
    voice = filt(voice, "highpass", 90)
    write_wav(os.path.join(out, "stimme.wav"), np.stack([voice, voice], axis=1) * 0.95)
    print("Audio fertig:", round(dur, 2), "s")


if __name__ == "__main__":
    main()
