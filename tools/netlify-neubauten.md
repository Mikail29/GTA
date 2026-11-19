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

## Wartet auf den nächsten Neubau (schon im Code, noch nicht online)
- 19.11.: Zurück-Knopf auf jeder Seite (auch Startseite, dort ausgegraut ohne vorherige Seite), ab Tablet mit Schrift „Zurück“ – mit [skip netlify] hochgeladen, geht beim nächsten Neubau mit online (oder sofort per Netlify „Trigger deploy“)
- 19.11.: Release-News „GTA 6 ist da – 99 von 100 Punkten“, Bonus-Frist korrigiert („vor dem 20. November“), Texte „folgt nach dem Release“ → „wird gerade ergänzt“ – fertig als tools/entwuerfe/2026-11-19-release-news.patch, wartet auf Freigabe des Betreibers
