#!/usr/bin/env python3
"""Baut ein Hochkant-Video MIT Sprecherstimme aus Folien.

Aufruf: make_guide.py folien.json ausgabe.mp4 [--tempo 0.8]
Jede Folie braucht zusätzlich ein Feld "say" (Sprechtext, Aussprache-freundlich geschrieben,
z. B. „G T A 6“, „Ex Box“). Die Folie bleibt so lange stehen, wie der Text gesprochen wird.
Stimme: Piper (offline). Einmalig einrichten mit tools/video/setup_tts.sh.
"""
import json, os, subprocess, sys, tempfile, wave

HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]
tempo = 0.8
if "--tempo" in args:
    i = args.index("--tempo"); tempo = float(args[i + 1]); del args[i:i + 2]
slides_file, out = args[0], args[1]
TTS = os.path.expanduser("~/.cache/5sk-tts")  # wird von setup_tts.sh angelegt
voice = os.environ.get("PIPER_VOICE", os.path.join(TTS, "de-thorsten-low.onnx"))
piper = os.environ.get("PIPER_BIN", os.path.join(TTS, "venv", "bin", "piper"))
reel = os.path.join(HERE, "make_reel.js")
slides = json.load(open(slides_file, encoding="utf-8"))
T = 0.3  # Überblendung in Sekunden (kurz = schnelles Tempo)

work = tempfile.mkdtemp(prefix="guide-")
frames = os.path.join(work, "frames"); os.makedirs(frames)
subprocess.run(["node", reel, slides_file, frames], check=True)

durs, wavs = [], []
for i, s in enumerate(slides):
    wav = os.path.join(work, f"a{i:02d}.wav")
    subprocess.run([piper, "-m", voice, "--length-scale", str(tempo), "--sentence-silence", "0.12", "-f", wav],
                   input=s["say"].encode("utf-8"), check=True, stderr=subprocess.DEVNULL)
    with wave.open(wav) as w:
        d = w.getnframes() / w.getframerate()
    wavs.append(wav)
    durs.append(round(d + 2 * T + 0.15, 3))  # Platz für Überblendung davor/danach

n = len(slides)
inputs, filt = [], []
for i in range(n):
    inputs += ["-loop", "1", "-t", str(durs[i]), "-i", os.path.join(frames, f"s{i:02d}.png")]
for w in wavs:
    inputs += ["-i", w]
prev, off, starts = "[0:v]", 0.0, [0.1]
for i in range(1, n):
    off = round(off + durs[i - 1] - T, 3)
    filt.append(f"{prev}[{i}:v]xfade=transition=slideleft:duration={T}:offset={off}[v{i}]")
    prev = f"[v{i}]"; starts.append(off + T)
total = round(sum(durs) - (n - 1) * T, 3)
for i in range(n):
    ms = int(starts[i] * 1000)
    filt.append(f"[{n + i}:a]aresample=44100,adelay={ms}|{ms}[a{i}]")
filt.append("".join(f"[a{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,apad,atrim=0:{total}[aout]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt),
                "-map", prev, "-map", "[aout]", "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "128k", "-ac", "2",
                "-t", str(total), "-movflags", "+faststart", out], check=True)
print(f"{out} ({total} s)")
