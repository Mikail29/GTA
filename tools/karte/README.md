# Eigene Karte von Leonida

`public/map/leonida.svg` wird aus gemeinfreien Kartendaten erzeugt (Natural Earth, Vorbild Florida).
Sie ist NICHT von der Spielkarte abgezeichnet. Die Lage der Regionen ist nur ungefähr.

## Neu erzeugen
1. Daten laden (in einen eigenen, leeren Ordner, nicht ins Repo):

       mkdir -p /tmp/geo && cd /tmp/geo
       curl -sSO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
       curl -sSO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson
       mv ne_10m_admin_1_states_provinces.geojson states10m.geojson && mv ne_10m_lakes.geojson lakes10m.geojson

2. Florida und den See herauslösen, dann die Karte bauen (gibt die Marker-Koordinaten aus):

       python3 -I tools/karte/extract.py /tmp/geo
       python3 -I tools/karte/make_map.py /tmp/geo/florida-small.json public/map/leonida.svg

3. Die ausgegebenen x/y-Werte in `src/data/map-locations.ts` übernehmen.

## Regeln
- Nur eigene Gestaltung, keine Original-Grafiken, Screenshots oder Fan-Karten (z. B. map.stateofleonida.net).
- Neue Orte nur mit belegter, ungefährer Lage (offizielle Angabe oder mindestens zwei unabhängige Quellen).
