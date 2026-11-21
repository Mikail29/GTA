#!/usr/bin/env bash
# Einmalig: Ton-Werkzeuge für die Kurzvideos (eigene Musik und Soundeffekte) einrichten.
set -euo pipefail
python3 -m venv "$HOME/.cache/5sk-audio"
"$HOME/.cache/5sk-audio/bin/pip" install -q numpy scipy
echo "Ton-Werkzeuge bereit: $HOME/.cache/5sk-audio"
