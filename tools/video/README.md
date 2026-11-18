# Info-Videos (Reels) für Social Media

Erzeugt Hochkant-Videos (1080 × 1920) im Design des 5-Sterne-Kompass – nur mit eigenen Grafiken und Texten, ohne Rockstar-Material.

1. Folien als JSON anlegen (Beispiel: `beispiel-folien.json`). Felder pro Folie: `tag`, `title` (HTML, `<span>` = Farbverlauf), `text` oder `items`, `source`, `big`.
2. Folien rendern: `node tools/video/make_reel.js tools/video/beispiel-folien.json <ordner>`
3. Video bauen: `tools/video/build_video.sh <ordner> reel.mp4 5.5` (Sekunden pro Folie)

Nur geprüfte Infos mit Quelle verwenden. Keine fremden Clips, Trailer oder Screenshots einbauen.
