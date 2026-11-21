# Kurzvideos im starken Stil (Standard für alle Tagesvideos)

Hochkant-Videos (1080 × 1920, 30 fps) für TikTok, Instagram Reels und YouTube Shorts – gebaut, damit Leute dranbleiben:

- **Hook in der ersten Sekunde:** große Wörter, die einschlagen, Blitz, Bass-Schlag, Wackeln
- **Schnelle Schnitte** mit Übergängen: `whip` (Wisch mit Bewegungsunschärfe), `zoom`, `glitch` (Farb-Störung), `flash` (Blitz), `up`, `slam`
- **Kamerafahrt über unsere eigene Leonida-Karte** mit pulsierendem Marker
- **Große Untertitel** im TikTok-Stil, das gesprochene Wort leuchtet gelb
- **Eigener Synthwave-Beat** (Vice-City-Gefühl) und **eigene Soundeffekte** (Whoosh, Bass-Schlag, Ping, Stempel, Glitch, Platsch, Klingelton …)
- Synthwave-Hintergrund mit Sonne, Neon-Gitter und Lichtpartikeln, Fortschrittsbalken oben

Alles ist selbst erzeugt (Grafiken, Musik, Sounds) – keine fremden Clips, Trailer, Screenshots oder Musik.

## Stil-Regeln des Betreibers (seit 21.11.2026)
- **Keine gezeichneten „Spielbilder“** mehr (wirken unecht). Standard ist der **Schrift-Stil**: große animierte Schrift,
  Emojis als Gesten, Chat-Blasen, Zahlen, die hochzählen, handgezeichnete Kreise/Unterstreichungen (Beispiel: `beispiele/geheimnisse-schrift.json`).
- **Echte Spielszenen nur aus eigenen Aufnahmen** (Screenshots/Clips von PS5 oder Xbox) über die Szene `shot`.
  **Niemals Bilder oder Clips aus dem Internet** (gehören Rockstar oder anderen; viele sind Fälschungen oder Leaks → Sperren/Strikes).
- Rockstars Regeln für Fan-Videos mit Spielmaterial (Take-Two „Policy on posting copyrighted Rockstar Games material“):
  nur **nicht-kommerziell** (kein Geld mit den Spielaufnahmen), **keine großen Story-Spoiler**, **keine einzelnen Zwischensequenzen** als eigenes Video,
  nichts aus Leaks. Radio im Spiel leise/aus, sonst sperren Plattformen oft den Ton.

## Einrichten (einmalig)
```bash
tools/video/setup_tts.sh     # Computerstimme für die Probe-Fassung
tools/video/setup_audio.sh   # numpy + scipy für Musik und Effekte
```

## Benutzen
```bash
# 1) Standbilder prüfen (schnell): Überlappungen, Lesbarkeit
node tools/video/short/make_short.js storyboard.json ausgabe/ --vorschau 0.5,3,8
# 2) Video bauen (ca. 2 Minuten pro Minute Video)
node tools/video/short/make_short.js storyboard.json ausgabe/
```

Ergebnis:

| Datei | Wofür |
| --- | --- |
| `<name>-ohne-stimme.mp4` | Hauptversion: Musik + Effekte + Untertitel – selbst einsprechen (Musik wird beim Sprechen automatisch leiser) |
| `<name>-nur-effekte.mp4` | ohne Musik – wenn ein Sound direkt aus TikTok/Instagram darunter soll |
| `<name>-probe-NICHT-HOCHLADEN.mp4` | mit Computerstimme, nur zum Üben |
| `<name>-sprechtext.txt` | Sprechtext mit Startzeiten |

## Storyboard (JSON)
Beispiele: `beispiele/geheimnisse-reel.json` (Reel) und `beispiele/unwanted-attention-guide.json` (Guide).

```json
{ "name": "datei-name", "title": "…", "bpm": 100,
  "scenes": [ { "type": "hook", "lines": ["In GTA 6", "lebt *Bigfoot*."], "art": "ill:fuss",
                "say": "In G T A sechs lebt Bigfoot.", "show": "In GTA 6 lebt Bigfoot." } ] }
```

- `say` = Text für die Computerstimme (aussprache-freundlich: „G T A sechs“, „Ex Box“, „Fiinix“), bestimmt die Länge der Szene.
- `show` = Text so, wie du ihn liest – daraus entstehen die Untertitel. `caps: false` blendet sie aus.
- `*Wort*` färbt ein Wort im Farbverlauf ein.
- `transition`: `whip` (Standard), `zoom`, `glitch`, `flash`, `up`, `slam`.
- Grafiken: `symbol:<name>` (Zeichnungen der Website, z. B. `symbol:fahrzeug-phoenix`, `symbol:suchgebiet-polizei`),
  `ill:<name>` (Zeichnungen aus `illustrations.js`), `initials:BH,#farbe1,#farbe2` (Kreis mit Initialen für Figuren),
  Umfärben mit `|#alt>#neu`.

### Szenen-Typen
| Typ | Felder | Wirkung |
| --- | --- | --- |
| `hook` | `kicker`, `lines[]`, `art`, `tail` | Wörter schlagen nacheinander ein, Bild knallt rein (Beat setzt ein) |
| `map` | `x`, `y` (0–1000 auf `public/map/leonida.svg`), `zoom`, `label`, `sub`, `tag`, `night` | Kamerafahrt auf den Ort, Marker mit Puls |
| `art` | `art`, `title`, `chip`, `badge` (Stempel), `badgePos` (`mid`/`bottom`), `fx` (`pulse`, `shake`, `tiltup`), `glow`, `night` | großes Bild mit Leuchten, Stempel |
| `flyer` | `head`, `art`, `body`, `strip` | Zettel flattert rein |
| `phone` | `label`, `name`, `initials`, `status`, `c1`, `c2` | Handy mit Anruf, klingelt und vibriert |
| `drop` | `object`, `target`, `splat`, `word` | etwas fällt und landet mit Platsch |
| `list` | `title`, `items[{art,label,sub}]` | Punkte fliegen nacheinander rein |
| `duo` | `title`, `left`, `right`, `mid` | Vergleich / Vorher–Nachher / ODER |
| `step` | `n`, `chip`, `title`, `art` oder `items[]` | Schritt einer Anleitung mit großer Nummer |
| `title` | `kicker`, `name`, `chip`, `art` | Titel einer Anleitung, Buchstabe für Buchstabe |
| `cta` | `question`, `options[{art,label}]` oder `options[{emoji,label}]`, `hint` | Umfrage am Ende, Kanal-Name, Website, Logo |
| `text` | `kicker`, `lines[]` (Zeile mit `~` = klein), `emoji`, `mark` (`circle`/`underline`) | große Schrift, Emoji-Geste, Kreis um das `*Akzent*`-Wort |
| `fact` | `kicker`, `value` (Zahlen zählen hoch), `unit`, `text`, `emoji` | eine Zahl groß in Szene |
| `chat` | `title`, `messages[{from:"du"|"k", text}]`, `gap` | Chat-Blasen mit Tipp-Animation (keine erfundenen Zitate von Spielfiguren!) |
| `shot` | `media` (Pfad zu eigenem Screenshot/Clip), `from` (Startsekunde), `fit` (`cover`/`contain`), `zoom` (`in`/`out`/`pan`), `ton` (Originalton), `title`, `tag`, `live`, `credit` | **echte Spielszene** aus eigener Aufnahme |

Emojis gehen überall, wo sonst eine Grafik steht (`emoji`-Felder, bei `drop` direkt in `object`/`target`/`splat`).

## Regeln
- Nur geprüfte Infos. Keine echten Menschen, keine Original-Grafiken, keine fremde Musik.
- Am Ende immer eine Frage an die Zuschauer (Kommentare bringen Reichweite) und der Hinweis auf 5-sterne-kompass.de.
- Unten steht automatisch: „Unabhängiges Fanprojekt · nicht von Rockstar Games · eigene Grafiken“.

## Eigene Aufnahmen machen (für den Betreiber)
- **PS5:** Während des Spielens die **Create-Taste** drücken → „Screenshot“ oder „Letztes Gameplay speichern“.
  Aufs Handy: PlayStation-App → Bibliothek → Aufnahmen (dafür an der PS5 „Automatisch hochladen“ einschalten).
- **Xbox:** **Xbox-Taste** → „Aufnehmen & teilen“ → „Screenshot“ oder „Aufzeichnen, was passiert ist“. Aufs Handy: Xbox-App → Aufnahmen.
- Dann die Dateien in den Chat laden. Claude baut sie mit `shot` ins Video ein (Zoom, Untertitel, Effekte, Musik).
