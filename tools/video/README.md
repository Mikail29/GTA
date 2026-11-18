# Videos für Social Media

Hochkant-Videos (1080 × 1920) im Design des 5-Sterne-Kompass – nur eigene Grafiken, Texte und eine freie Computerstimme, ohne Rockstar-Material.

## Info-Reel ohne Stimme
1. Folien als JSON anlegen (Beispiel: `beispiel-folien.json`). Felder: `tag`, `title` (HTML, `<span>` = Farbverlauf), `text` oder `items`, `source`, `big`.
2. `node tools/video/make_reel.js folien.json <ordner>` rendert die Folien.
3. `tools/video/build_video.sh <ordner> reel.mp4 5.5` baut das Video (Sekunden pro Folie).

## Guide mit Sprecher (schnelles Tempo)
1. Einmalig: `tools/video/setup_tts.sh` (Piper + deutsche Stimme „Thorsten“, Datensatz-Lizenz CC0).
2. Jede Folie bekommt zusätzlich `say` = Sprechtext. Aussprache-freundlich schreiben: „G T A 6“, „Ex Box“, Zahlen als Wörter, keine Abkürzungen.
3. `tools/video/make_guide.py folien.json guide.mp4 --tempo 0.8` (kleiner = schneller; 0.8 ist zügig, aber verständlich).
   Beispiel: `beispiel-guide.json`.

## Regeln
Nur geprüfte Infos mit Quelle. Keine fremden Clips, Trailer, Screenshots oder Musik. Spielszenen nur aus eigenen Aufnahmen (z. B. über OpusClip).
