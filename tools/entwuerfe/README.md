# Entwürfe, die auf einen Neubau warten

Hier liegen fertige, geprüfte Änderungen für die Website, die wegen der Credit-Grenze
noch nicht online gehen sollen. Sie verändern die Website erst, wenn man sie einspielt.

Einspielen (sobald der Betreiber einen Neubau freigibt):

    git apply tools/entwuerfe/<datei>.patch
    git rm tools/entwuerfe/<datei>.patch

Danach wie gewohnt prüfen (tsc, lint, build), im Zähler tools/netlify-neubauten.md eintragen
und OHNE „[skip netlify]“ hochladen.
