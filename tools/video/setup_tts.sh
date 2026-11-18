#!/bin/bash
# Richtet die Sprecherstimme ein (einmalig pro Rechner): Piper (offline, kostenlos) + deutsche Stimme „Thorsten“
# Datensatz der Stimme: Thorsten-Voice, Lizenz CC0 (frei nutzbar). Ziel: ~/.cache/5sk-tts
set -e
DIR="$HOME/.cache/5sk-tts"; mkdir -p "$DIR"
[ -x "$DIR/venv/bin/piper" ] || { python3 -m venv "$DIR/venv" && "$DIR/venv/bin/pip" install -q piper-tts; }
if [ ! -f "$DIR/de-thorsten-low.onnx" ]; then
  curl -sL -o "$DIR/voice.tar.gz" https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-de-thorsten-low.tar.gz
  tar xzf "$DIR/voice.tar.gz" -C "$DIR" && rm "$DIR/voice.tar.gz"
fi
echo "Stimme bereit: $DIR"
