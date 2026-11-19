# Holt Florida (Umriss) und Lake Okeechobee aus Natural Earth (gemeinfrei) und speichert sie klein ab.
import json, sys
geo = sys.argv[1]
states = json.load(open(f"{geo}/states10m.geojson", encoding="utf-8"))
fl = [f for f in states["features"] if f["properties"].get("name") == "Florida" and f["properties"].get("admin") == "United States of America"]
print("Florida-Treffer:", len(fl), fl[0]["geometry"]["type"] if fl else None)
lakes = json.load(open(f"{geo}/lakes10m.geojson", encoding="utf-8"))
ok = [f for f in lakes["features"] if (f["properties"].get("name") or "").lower().startswith("okeechobee") or (f["properties"].get("name") or "") == "Lake Okeechobee"]
print("See-Treffer:", [f["properties"].get("name") for f in ok])
out = {"florida": fl[0]["geometry"], "okeechobee": ok[0]["geometry"] if ok else None}
json.dump(out, open(f"{geo}/florida-small.json", "w"))
g = fl[0]["geometry"]
polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
print("Polygone:", len(polys), "Punkte gesamt:", sum(len(p[0]) for p in polys))
xs = [c[0] for p in polys for c in p[0]]; ys = [c[1] for p in polys for c in p[0]]
print("BBox:", min(xs), min(ys), max(xs), max(ys))
