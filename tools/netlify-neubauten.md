# Netlify-Neubauten (Credit-Zähler)

Jeder Push OHNE „[skip netlify]“ startet einen Neubau (ca. 15 von 300 Credits im Monat).
Regel des Betreibers: Die 300 Credits dürfen nicht erreicht werden → höchstens 12 Neubauten pro Monat,
höchstens 1 pro Tag, nur bei wichtigen Inhalten. Jeden Neubau hier im selben Commit eintragen.
Die echten Zahlen stehen bei Netlify unter Team settings → Billing → Usage (dort auch das Datum, an dem die Credits zurückgesetzt werden).

## November 2026
- bis 18.11.: geschätzt 7 Neubauten (Einrichtung, Probelauf, Startseite, Rechtstexte, Clips, Zurück-Knopf/News) – mit Netlify Usage abgleichen
- 18.11.: Neubau, damit die Registrierung den genauen Fehlergrund (Code) anzeigt (Fehlersuche Registrierung)
- 18.11.: Neubau mit Fix: Supabase-Adresse wird auf den Grundteil gekürzt (Registrierung scheiterte mit HTTP 404)
- 18.11.: Neubau: Kanal-Links bei „GTA 6 Clips“, Knopf „Etwas mitteilen“, keine Mindestlänge mehr (Datenbank Teil 3 nötig)
- 18.11.: Neubau: Knöpfe „Ich habe eine Frage…“ / „Ich möchte etwas mitteilen…“ auf Startseite, Community und Fragen
- 19.11.: Neubau: Handy-/iPad-Menü repariert (Safari zeigte nur das Suchfeld), Login/Registrieren auf Handy und iPad sofort sichtbar → Stand geschätzt 12 von 12
- 19.11.: Neubau (zweiter heute, auf ausdrücklichen Wunsch des Betreibers): 21 Symbole (Anzeige, Fahndung, Kampf), eigene Skizze von Leonida mit den 6 Regionen, erste Mission „Gone Fishing“, Release-News, Zurück-Knopf überall → Stand geschätzt 13 (ca. 195 Credits + Besucher). Ab jetzt nur noch nach Rücksprache mit dem Betreiber.
- 19.11.: Neubau (dritter heute, auf ausdrücklichen Wunsch des Betreibers „sehr echt nachbauen“): Symbole als eigene Zeichnungen im Spiel-Look, eigene Leonida-Karte aus gemeinfreien Natural-Earth-Daten, Missionen Prolog, Gear Up, Lab Fees → Stand geschätzt 14 (ca. 210 Credits + Besucher). Im November nur noch nach Rücksprache.

## Wartet auf den nächsten Neubau (schon im Code, noch nicht online)
- 19.11.: Quellen auf der Website ausgeblendet (Symbole, Personen, Missionen, News, Karte) – Wunsch des Betreibers; Quellen bleiben intern in den Daten. Mit [skip netlify] hochgeladen, geht beim nächsten Neubau online (oder sofort per Netlify „Trigger deploy“).
- 19.11.: Prüfung der ganzen Seite: Beispiel-Geheimnisse entfernt (ehrlicher Hinweis statt Demo-Einträgen), doppelte Logo-IDs behoben, 404-Seite mit eigenem Titel, Überschriften-Reihenfolge für Screenreader, Beispiel-Fragen nur noch ohne Datenbank, zwei veraltete Texte angepasst. Mit [skip netlify] hochgeladen.
