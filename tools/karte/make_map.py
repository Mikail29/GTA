# Baut die eigene Leonida-Karte (SVG) aus der gemeinfreien Natural-Earth-Küstenlinie von Florida.
import json, math, sys

data = json.load(open(sys.argv[1], encoding="utf-8"))
out_svg = sys.argv[2]

LON_MIN, LON_MAX, LAT_MIN, LAT_MAX = -87.66, -79.98, 24.50, 31.02
K = math.cos(math.radians(27.8))
W_UNITS = (LON_MAX - LON_MIN) * K
H_UNITS = LAT_MAX - LAT_MIN
S = 830 / W_UNITS
OFF_X = 36
OFF_Y = (1000 - H_UNITS * S) / 2 - 10

def proj(lon, lat):
    return (OFF_X + (lon - LON_MIN) * K * S, OFF_Y + (LAT_MAX - lat) * S)

def dp(points, tol):
    # Douglas-Peucker-Vereinfachung
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    ax, ay = a; bx, by = b
    dx, dy = bx - ax, by - ay
    norm = math.hypot(dx, dy) or 1e-9
    imax, dmax = 0, 0.0
    for i in range(1, len(points) - 1):
        px, py = points[i]
        d = abs(dy * px - dx * py + bx * ay - by * ax) / norm
        if d > dmax:
            imax, dmax = i, d
    if dmax > tol:
        left = dp(points[: imax + 1], tol)
        right = dp(points[imax:], tol)
        return left[:-1] + right
    return [a, b]

def ring_path(ring, tol=0.7):
    pts = [proj(lon, lat) for lon, lat in ring]
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    if len(pts) > 8:
        # Ring an zwei Stellen teilen, damit DP auf geschlossenen Ringen funktioniert
        half = len(pts) // 2
        simp = dp(pts[: half + 1], tol)[:-1] + dp(pts[half:] + [pts[0]], tol)[:-1]
    else:
        simp = pts
    if len(simp) < 3:
        return ""
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in simp) + " Z"

def area(ring):
    pts = [proj(lon, lat) for lon, lat in ring]
    return abs(sum(pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1] for i in range(len(pts) - 1))) / 2

g = data["florida"]
polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
land_paths = []
for poly in polys:
    if area(poly[0]) < 0.6:
        continue
    for ring in poly:
        p = ring_path(ring)
        if p:
            land_paths.append(p)
land_d = " ".join(land_paths)

lake = data["okeechobee"]
lake_polys = lake["coordinates"] if lake["type"] == "MultiPolygon" else [lake["coordinates"]]
lake_d = " ".join(ring_path(r, 0.5) for poly in lake_polys for r in poly)

# Regionen: ungefähre Lage (Vorbild-Orte in Florida), nur zur Orientierung
regions = {
    "vice-city": ("VICE CITY", -80.24, 25.82),
    "leonida-keys": ("LEONIDA KEYS", -80.98, 24.78),
    "grassrivers": ("GRASSRIVERS", -81.05, 25.98),
    "ambrosia": ("AMBROSIA", -81.25, 26.95),
    "mount-kalaga": ("MOUNT KALAGA", -82.45, 29.55),
    "port-gellhorn": ("PORT GELLHORN", -85.60, 30.20),
}
pos = {k: proj(lon, lat) for k, (_, lon, lat) in regions.items()}
for k, (x, y) in pos.items():
    print(f"{k}: x={round(x)} y={round(y)}")

def ell(cx, cy, rx, ry, fill, rot=0):
    return f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx}" ry="{ry}" transform="rotate({rot} {cx:.0f} {cy:.0f})" fill="{fill}"/>'

vc, ke, gr, am, mk, pg = (pos[k] for k in ["vice-city", "leonida-keys", "grassrivers", "ambrosia", "mount-kalaga", "port-gellhorn"])

label_offsets = {"vice-city": (22, -14, "start"), "leonida-keys": (0, 44, "middle"), "grassrivers": (-12, 40, "middle"), "ambrosia": (0, 40, "middle"), "mount-kalaga": (0, 40, "middle"), "port-gellhorn": (0, 42, "middle")}
labels = []
for k, (name, _, _) in regions.items():
    x, y = pos[k]
    dx, dy, anchor = label_offsets[k]
    labels.append(f'<text x="{x + dx:.0f}" y="{y + dy:.0f}" text-anchor="{anchor}">{name}</text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <!-- Eigene Karte von Leonida (5-Sterne-Kompass), im Stil einer Spielkarte gezeichnet.
       Küstenlinie: Natural Earth (gemeinfrei), Vorbild Florida. NICHT von der Spielkarte abgezeichnet.
       Lage der Regionen nur ungefähr (Stand 19.11.2026). -->
  <defs>
    <radialGradient id="sea" cx="0.55" cy="0.45" r="0.8">
      <stop offset="0" stop-color="#1b2a55"/>
      <stop offset="1" stop-color="#0f1430"/>
    </radialGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#3a3f5e"/>
      <stop offset="1" stop-color="#2f3352"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#8fb3ff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
    <pattern id="grass" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M3 12 l2 -6 M7 12 l0 -7 M11 12 l-2 -6" stroke="#46d39a" stroke-opacity="0.45" stroke-width="1.3" stroke-linecap="round"/>
    </pattern>
    <pattern id="forest" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.6" fill="#2f9e63" fill-opacity="0.55"/>
      <circle cx="10" cy="10" r="2.1" fill="#2f9e63" fill-opacity="0.45"/>
    </pattern>
    <pattern id="city" width="9" height="9" patternUnits="userSpaceOnUse">
      <rect x="1" y="1" width="5.5" height="5.5" rx="0.8" fill="#ff7ac6" fill-opacity="0.45"/>
    </pattern>
    <pattern id="fields" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
      <rect width="4" height="10" fill="#ffd166" fill-opacity="0.22"/>
    </pattern>
    <pattern id="town" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect x="2" y="2" width="4" height="4" rx="0.6" fill="#ff9b68" fill-opacity="0.5"/>
    </pattern>
    <radialGradient id="fade" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.7" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="soft" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#fade)"/></mask>
    <clipPath id="landclip"><path d="{land_d}"/></clipPath>
  </defs>

  <rect width="1000" height="1000" fill="url(#sea)"/>
  <rect width="1000" height="1000" fill="url(#grid)"/>

  <!-- flaches Wasser an der Küste -->
  <path d="{land_d}" fill="none" stroke="#2c5a8a" stroke-opacity="0.35" stroke-width="18" stroke-linejoin="round"/>
  <path d="{land_d}" fill="none" stroke="#3f7fb8" stroke-opacity="0.35" stroke-width="8" stroke-linejoin="round"/>

  <!-- Festland und Inseln -->
  <path d="{land_d}" fill="url(#land)" fill-rule="evenodd"/>

  <!-- Gelände-Flächen der Regionen (eigene Gestaltung, ungefähre Lage) -->
  <g clip-path="url(#landclip)">
    <g mask="url(#soft)">{ell(mk[0], mk[1], 130, 85, "url(#forest)", -10)}</g>
    <g mask="url(#soft)">{ell(gr[0], gr[1], 95, 70, "url(#grass)", 15)}</g>
    <g mask="url(#soft)">{ell(am[0], am[1] + 5, 95, 70, "url(#fields)", -20)}</g>
    <g mask="url(#soft)">{ell(vc[0] - 8, vc[1], 30, 60, "url(#city)", 8)}</g>
    <g mask="url(#soft)">{ell(pg[0], pg[1] - 4, 50, 26, "url(#town)", 0)}</g>
  </g>

  <!-- Küste -->
  <path d="{land_d}" fill="none" stroke="#7fe3d6" stroke-opacity="0.7" stroke-width="1.6" stroke-linejoin="round"/>

  <!-- See -->
  <path d="{lake_d}" fill="#1f3c6e" stroke="#7fe3d6" stroke-opacity="0.6" stroke-width="1.2"/>


  <!-- Beschriftungen -->
  <g font-family="Inter, Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="2" fill="#f4f1ff" stroke="#0f1430" stroke-width="4" stroke-linejoin="round" paint-order="stroke">
    {chr(10).join("    " + l for l in labels).strip()}
  </g>

  <!-- Nordpfeil -->
  <g transform="translate(930 90)" fill="#f4f1ff" fill-opacity="0.85">
    <path d="M0 -40 L13 0 L0 -9 L-13 0 Z"/>
    <text y="28" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">N</text>
  </g>

  <g font-family="Inter, Arial, sans-serif" font-size="14" fill="#f4f1ff" fill-opacity="0.55">
    <text x="24" y="972">Eigene Karte · nicht maßstabsgetreu · Lage der Regionen ungefähr</text>
    <text x="24" y="990">Vorbild Florida · © 5-Sterne-Kompass</text>
  </g>
</svg>
'''
open(out_svg, "w", encoding="utf-8").write(svg)
print("SVG:", len(svg) // 1024, "KB")
