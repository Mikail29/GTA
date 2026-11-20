import { cn } from "@/lib/utils/cn";

/**
 * Eigene Zeichnungen im Stil der Spielanzeige (HUD) – aus einfachen Grundformen
 * (Stern, Herz, Blitz, Auto …) und in den Farben, die das Spiel nutzt.
 * Wichtig: Das sind KEINE Original-Grafiken aus dem Spiel und nichts davon ist abgepaust.
 */

const W = "#ffffff";
const PINK = "#ff5c93";
const TEAL = "#3ee0c5";
const VIOLET = "#a07cff";
const GREEN = "#2fbf71";
const RED = "#c8202f";
const YELLOW = "#ffd23f";

function starPath(cx: number, cy: number, R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** Drei Fahndungssterne nebeneinander. */
function Stars({ fill, stroke, strokeWidth = 1.4, className }: { fill: string; stroke: string; strokeWidth?: number; className?: string }) {
  return (
    <g className={className} strokeLinejoin="round">
      {[22, 48, 74].map((x) => (
        <path key={x} d={starPath(x, 28, 11.5, 4.8)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ))}
    </g>
  );
}

/** Roter Kreis mit weißem Bildchen (Merkmale unter den Sternen). */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <circle cx="48" cy="28" r="22" fill={RED} stroke="#3a0a10" strokeWidth="2.5" />
      <g fill={W} stroke={W} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </g>
  );
}

/** Rundes Symbol links, Balken rechts (Gesundheit, Ausdauer, Fokus). */
function Meter({ color, fill = 0.72, divider, children }: { color: string; fill?: number; divider?: number; children: React.ReactNode }) {
  const x0 = 34;
  const w = 56;
  return (
    <g>
      <circle cx="17" cy="28" r="13" fill="#15132a" stroke={color} strokeWidth="2" />
      {children}
      <rect x={x0} y="23" width={w} height="10" rx="2" fill={color} fillOpacity="0.22" />
      <rect x={x0} y="23" width={w * fill} height="10" rx="2" fill={color} />
      {divider !== undefined && <rect x={x0 + w * divider - 1} y="21" width="2" height="14" rx="1" fill={W} />}
    </g>
  );
}

function Face({ cx, mood, skin }: { cx: number; mood: "gut" | "neutral" | "boese"; skin: string }) {
  const cy = 30;
  return (
    <g>
      {mood === "gut" && <ellipse cx={cx} cy={cy - 15} rx="7" ry="2.2" fill="none" stroke={YELLOW} strokeWidth="1.6" />}
      <path d={`M${cx - 9} ${cy - 6} l-3 -7 l7 4 z M${cx + 9} ${cy - 6} l3 -7 l-7 4 z`} fill={skin} stroke="#15132a" strokeWidth="1" strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r="10" fill={skin} stroke="#15132a" strokeWidth="1.2" />
      {mood === "boese" ? (
        <path d={`M${cx - 6} ${cy - 4} l4 2 M${cx + 6} ${cy - 4} l-4 2`} stroke="#15132a" strokeWidth="1.6" strokeLinecap="round" />
      ) : null}
      <circle cx={cx - 3.5} cy={cy - 1} r="1.3" fill="#15132a" />
      <circle cx={cx + 3.5} cy={cy - 1} r="1.3" fill="#15132a" />
      {mood === "gut" && <path d={`M${cx - 4} ${cy + 3.5} q4 3.5 8 0`} fill="none" stroke="#15132a" strokeWidth="1.5" strokeLinecap="round" />}
      {mood === "neutral" && <path d={`M${cx - 3.5} ${cy + 4.5} h7`} stroke="#15132a" strokeWidth="1.5" strokeLinecap="round" />}
      {mood === "boese" && <path d={`M${cx - 4} ${cy + 6} q4 -3.5 8 0`} fill="none" stroke="#15132a" strokeWidth="1.5" strokeLinecap="round" />}
    </g>
  );
}

function HitMarker({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="3.2" strokeLinecap="round">
      <path d="M37 17 l6 6 M59 17 l-6 6 M37 39 l6 -6 M59 39 l-6 -6" />
      <circle cx="48" cy="28" r="1.6" fill={W} stroke="none" />
    </g>
  );
}

/* ---------------- Fahrzeuge (Seitenansicht, nach rechts fahrend) ---------------- */

const DARK = "#0b0a16";
const CHROME = "#d9d7e6";

function Wheel({ x, y = 41, r = 6.5 }: { x: number; y?: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#15132a" stroke={CHROME} strokeWidth="1.6" />
      <circle cx={x} cy={y} r={r * 0.38} fill="#8e8c9c" />
    </g>
  );
}

/** Auto aus Karosserie, Fenstern und zwei Rädern. */
function Car({ body, windows, color, wheels, r, children }: { body: string; windows: string; color: string; wheels: [number, number]; r?: number; children?: React.ReactNode }) {
  return (
    <g>
      <ellipse cx="48" cy="47.5" rx="41" ry="2.2" fill="#000" fillOpacity="0.55" />
      <path d={body} fill={color} stroke="#000" strokeOpacity="0.35" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={windows} fill={DARK} fillOpacity="0.78" stroke={W} strokeOpacity="0.25" strokeWidth="0.6" strokeLinejoin="round" />
      {children}
      <Wheel x={wheels[0]} r={r} />
      <Wheel x={wheels[1]} r={r} />
    </g>
  );
}

const GANADO_BODY = "M7 41 L7 31 L39 31 L42 22.5 Q42.6 21 44.5 21 L56 21 Q58 21 59.4 22.6 L65 30 L84 31.4 Q89 32 89 35.6 L89 41 L80 41 A8 8 0 0 0 64 41 L32 41 A8 8 0 0 0 16 41 Z";
const GANADO_WINDOWS = "M43.6 23 L56 23 Q57 23 57.6 23.8 L62.3 30 L41.2 30 Z";

/* ---------------- Waffen (weiße Umrisse wie im Waffenrad, Mündung rechts) ---------------- */

const GUN = "#f4f2fa";

function Gun({ children, details }: { children: React.ReactNode; details?: React.ReactNode }) {
  return (
    <g>
      <g fill={GUN} stroke={GUN} strokeWidth="0.4" strokeLinejoin="round">
        {children}
      </g>
      {details && (
        <g fill={DARK} stroke={DARK} strokeLinecap="round">
          {details}
        </g>
      )}
    </g>
  );
}

/** Abzugsbügel als Linie. */
function Guard({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={GUN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />;
}

const art: Record<string, React.ReactNode> = {
  // ---- Anzeige & Geld ----
  gesundheit: (
    <Meter color={PINK} fill={0.8} divider={0.62}>
      <path d="M17 34.5 c-6 -4.2 -8.5 -7 -8.5 -10 a4.4 4.4 0 0 1 8.5 -1.8 a4.4 4.4 0 0 1 8.5 1.8 c0 3 -2.5 5.8 -8.5 10 z" fill={PINK} />
    </Meter>
  ),
  ausdauer: (
    <Meter color={TEAL} fill={0.6}>
      <path d="M19 18 l-7 11 h5 l-2 9 l8 -12 h-5 z" fill={TEAL} />
    </Meter>
  ),
  fokus: (
    <Meter color={VIOLET} fill={0.5}>
      <path d="M7 28 q10 -10 20 0 q-10 10 -20 0 z" fill="none" stroke={VIOLET} strokeWidth="2" />
      <circle cx="17" cy="28" r="3.4" fill={VIOLET} />
    </Meter>
  ),
  atemluft: (
    <g>
      <circle cx="48" cy="28" r="22" fill="#15132a" stroke={GREEN} strokeOpacity="0.3" strokeWidth="4" />
      <path d="M48 6 a22 22 0 1 1 -21 28" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <path d="M48 17 v9 M48 22 l-3 3 M48 22 l3 3" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 24 c-6 1 -8 7 -8 12 c0 3 3 4 5 2 l3 -3 z M52 24 c6 1 8 7 8 12 c0 3 -3 4 -5 2 l-3 -3 z" fill={GREEN} />
    </g>
  ),
  sauerstofftank: (
    <g>
      <circle cx="48" cy="28" r="22" fill="#15132a" stroke={GREEN} strokeOpacity="0.3" strokeWidth="4" />
      <path d="M48 6 a22 22 0 1 1 -19 33" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <text x="46" y="34" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="800" fill={GREEN}>
        O
      </text>
      <text x="56" y="38" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="9" fontWeight="800" fill={GREEN}>
        2
      </text>
    </g>
  ),
  bankguthaben: (
    <g>
      <circle cx="17" cy="28" r="13" fill="#6d4dff" stroke="#c9b8ff" strokeWidth="1.5" />
      <text x="17" y="34" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="900" fill={W}>
        B
      </text>
      <text x="36" y="33.5" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="800" fill={W}>
        $12.500
      </text>
    </g>
  ),
  bargeld: (
    <g>
      <rect x="5" y="18" width="24" height="18" rx="3" fill={GREEN} />
      <rect x="5" y="22" width="24" height="3.5" fill="#145c3a" />
      <rect x="9" y="29" width="8" height="3" rx="1" fill="#e9fff3" />
      <text x="36" y="33.5" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="800" fill={W}>
        $850
      </text>
    </g>
  ),

  // ---- Fahndung: Sterne ----
  "sterne-umriss": <Stars fill="#15132a" stroke={W} strokeWidth={1.8} />,
  "sterne-grau": <Stars fill="#8e8c9c" stroke={W} strokeWidth={1} />,
  "sterne-weiss": <Stars fill={W} stroke={W} />,
  "sterne-blinkend": <Stars fill={W} stroke={W} className="hud-blink" />,
  "sterne-rot": <Stars fill={RED} stroke="#ff8a96" strokeWidth={1} />,

  // ---- Fahndung: Merkmale ----
  "merkmal-kleidung": (
    <Badge>
      <path d="M48 15 a3.4 3.4 0 1 1 3.4 3.4 c-1.6 0 -3.4 1 -3.4 3.2 v1.4" fill="none" strokeWidth="2.4" />
      <path d="M48 23 L33 34 h30 z" fill="none" strokeWidth="2.6" />
    </Badge>
  ),
  "merkmal-aussehen": (
    <Badge>
      <circle cx="48" cy="21" r="6" stroke="none" />
      <path d="M36 40 c0 -8 5.5 -11.5 12 -11.5 s12 3.5 12 11.5 z" stroke="none" />
      <path d="M48 29 l-2.2 3 l2.2 7 l2.2 -7 z" fill={RED} stroke="none" />
    </Badge>
  ),
  "merkmal-fahrzeug": (
    <Badge>
      <path d="M36.5 31 l3.5 -8.5 q1 -2 3 -2 h10 q2 0 3 2 l3.5 8.5" fill="none" strokeWidth="2.4" />
      <path d="M33 31 h30 v7 h-30 z" stroke="none" />
      <path d="M35 38 h5 v4 h-5 z M56 38 h5 v4 h-5 z" stroke="none" />
      <circle cx="38" cy="34.5" r="1.8" fill={RED} stroke="none" />
      <circle cx="58" cy="34.5" r="1.8" fill={RED} stroke="none" />
    </Badge>
  ),
  "merkmal-zu-zweit": (
    <Badge>
      <circle cx="41" cy="22" r="5" stroke="none" />
      <path d="M31 39 c0 -7 4.5 -10 10 -10 s10 3 10 10 z" stroke="none" />
      <circle cx="56" cy="20" r="4.6" stroke="none" fillOpacity="0.85" />
      <path d="M52.5 28.5 c1.2 -0.6 2.5 -0.9 3.5 -0.9 c5 0 9 3 9 9.4 h-11.5" stroke="none" fillOpacity="0.85" />
    </Badge>
  ),
  "merkmal-kamera": (
    <Badge>
      <path d="M33 22 l21 -6 l3.4 11 l-21 6 z" stroke="none" />
      <circle cx="36" cy="29" r="1.6" fill={RED} stroke="none" />
      <path d="M56.5 24 l6 2 v12" fill="none" strokeWidth="2.6" />
      <path d="M59 38 h7" fill="none" strokeWidth="2.6" />
    </Badge>
  ),

  // ---- Kampf & Kriminellenprofil ----
  kriminellenprofil: (
    <g>
      <Face cx={18} mood="gut" skin="#f4ecf7" />
      <Face cx={48} mood="neutral" skin="#a9a6b6" />
      <Face cx={78} mood="boese" skin="#7a4636" />
    </g>
  ),
  "treffer-normal": <HitMarker color={W} />,
  "treffer-ausgeschaltet": <HitMarker color={YELLOW} />,
  "treffer-toedlich": <HitMarker color={RED} />,

  // ---- Fahrzeuge ----
  "fahrzeug-ganado": (
    <Car body={GANADO_BODY} windows={GANADO_WINDOWS} color="#c8743a" wheels={[24, 72]}>
      <path d="M9 32.6 H38" stroke={DARK} strokeOpacity="0.55" strokeWidth="1.8" />
      <path d="M10 35.5 H86" stroke={W} strokeOpacity="0.35" strokeWidth="1" />
      <rect x="86.4" y="32.8" width="2.4" height="2" rx="0.6" fill="#ffe9a8" />
      <rect x="7" y="32" width="1.8" height="3" fill="#ff4d5e" />
    </Car>
  ),
  "fahrzeug-ganado-retro": (
    <Car body={GANADO_BODY} windows={GANADO_WINDOWS} color="#efe9f6" wheels={[24, 72]}>
      <path d="M9 32.6 H38" stroke={DARK} strokeOpacity="0.45" strokeWidth="1.8" />
      <path d="M9 35 H88" stroke="#ff9b68" strokeWidth="1.6" />
      <path d="M9 37 H88" stroke="#ff55b8" strokeWidth="1.6" />
      <path d="M9 39 H88" stroke="#9565ff" strokeWidth="1.6" />
      <rect x="86.4" y="32.8" width="2.4" height="2" rx="0.6" fill="#ffe9a8" />
      <rect x="7" y="32" width="1.8" height="2.6" fill="#ff4d5e" />
    </Car>
  ),
  "fahrzeug-phoenix": (
    <Car
      body="M7 41 L7 33.5 Q7 31 10 30.6 L31 29.2 L40 21.8 Q41.4 20.6 43.6 20.6 L54 20.6 Q56 20.6 57.4 22 L63 29.2 L84 30.4 Q89.4 31 89.6 34.4 L89.6 41 L80.5 41 A8 8 0 0 0 64.5 41 L32 41 A8 8 0 0 0 16 41 Z"
      windows="M41.4 22.6 L54 22.6 L60.4 29.1 L33.6 29.1 Z"
      color="#d62839"
      wheels={[24.5, 72.5]}
    >
      <path d="M70 29.6 L79 30.1 L79 28.6 L72 28.2 Z" fill="#8f1424" />
      <path d="M7.6 30.4 V28 H16 V30" fill="#2a0a10" />
      <path d="M10 35.4 H87" stroke={W} strokeOpacity="0.3" strokeWidth="1" />
      <rect x="86.8" y="32.4" width="2.6" height="2" rx="0.6" fill="#ffe9a8" />
      <rect x="7" y="32.4" width="1.8" height="3" fill="#ff8a96" />
    </Car>
  ),
  "fahrzeug-stanier": (
    <Car
      body="M6 41 L6 33 Q6 30.5 9 30 L30 29 L67 28.5 L85 29.5 Q90 30 90.5 33.5 L90.5 41 L81 41 A8 8 0 0 0 65 41 L32 41 A8 8 0 0 0 16 41 Z"
      windows="M36.4 22 L47.4 22 L47.4 28.4 L32.2 28.4 Z M49.4 22 L60 22 Q61 22 61.6 23 L65 28.4 L49.4 28.4 Z"
      color="#3ee0c5"
      wheels={[24, 73]}
    >
      <path d="M30 29 L35 21 Q36 20 39 20 L58 20 Q61 20 62.5 21.5 L67 28.5 Z" fill="#f6f4fb" />
      <path d="M36.4 22 L47.4 22 L47.4 28.4 L32.2 28.4 Z M49.4 22 L60 22 Q61 22 61.6 23 L65 28.4 L49.4 28.4 Z" fill={DARK} fillOpacity="0.78" />
      <path d="M10 34 Q44 31.6 87 34" fill="none" stroke={W} strokeOpacity="0.8" strokeWidth="1.2" />
      <rect x="88.6" y="37.4" width="3" height="3.2" rx="0.8" fill={CHROME} />
      <rect x="4.4" y="37.4" width="3" height="3.2" rx="0.8" fill={CHROME} />
      <circle cx="88" cy="32.6" r="1.3" fill="#ffe9a8" />
    </Car>
  ),
  "fahrzeug-cheetah": (
    <Car
      body="M6 41 L6 34 Q6 31 9 30.6 L28 29.6 L38 23.6 Q40 22.2 43 22.2 L54 22.2 Q56 22.2 57.6 23.2 L68 29.6 L86 32.6 Q90 33.6 90 36.6 L90 41 L81.5 41 A7.5 7.5 0 0 0 66.5 41 L30 41 A7.5 7.5 0 0 0 15 41 Z"
      windows="M40.6 24.1 L54 24.1 L64.6 29.6 L31.6 29.6 Z"
      color="#f2f0f7"
      wheels={[22.5, 74]}
      r={6}
    >
      <path d="M6 30.6 V27 H16.4 V28.6 H10.6 V30.4" fill="#c9c5d8" />
      <path d="M30.6 32 H40.4 L38.6 35.4 H30.6 Z" fill={DARK} fillOpacity="0.45" />
      <path d="M8 36.2 H88" stroke="#ff55b8" strokeWidth="1.6" />
      <path d="M8 38.2 H88" stroke="#42e8d5" strokeWidth="1" />
      <rect x="86.4" y="34" width="3" height="1.4" rx="0.5" fill="#ffe9a8" />
    </Car>
  ),
  "fahrzeug-motorrad": (
    <g>
      <ellipse cx="48" cy="47.5" rx="36" ry="2" fill="#000" fillOpacity="0.55" />
      <circle cx="24" cy="39" r="8.4" fill="none" stroke={CHROME} strokeWidth="2.6" />
      <circle cx="72" cy="39" r="8.4" fill="none" stroke={CHROME} strokeWidth="2.6" />
      <circle cx="24" cy="39" r="1.6" fill="#8e8c9c" />
      <circle cx="72" cy="39" r="1.6" fill="#8e8c9c" />
      <path d="M24 39 L41 33" stroke="#8e8c9c" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 33.6 L44 31.4" stroke="#b9b7c6" strokeWidth="2" strokeLinecap="round" />
      <rect x="40" y="30.4" width="12" height="8" rx="1.6" fill="#5b5d6b" />
      <path d="M17 29.6 L33 26.8 L34 28.6 L19.6 31.4 Z" fill="#7d8b3c" />
      <path d="M30 27.6 L45 26.6 Q47 26.6 46 28.6 L32.6 30.6 Q29.4 30.8 30 27.6 Z" fill="#26242f" />
      <path d="M43 30.4 Q47 23.6 57 24.6 L59.4 27.6 L52.6 30.8 Z" fill="#7d8b3c" />
      <path d="M48.6 26.4 L54.4 25.8" stroke="#4d5826" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M72 39 L63.6 20.6" stroke={CHROME} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M64.4 25.4 Q71 23.4 77.4 26.6 L76.6 28.2 Q70.6 25.6 65.2 27 Z" fill="#7d8b3c" />
      <rect x="63.2" y="20.6" width="5" height="6" rx="1" fill={W} fillOpacity="0.88" />
      <path d="M59.6 19.4 L67.4 18.2" stroke={W} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),

  // ---- Waffen ----
  "waffe-pistole": (
    <Gun
      details={
        <>
          <path d="M31 18.8 V23.2 M33.2 18.8 V23.2 M35.4 18.8 V23.2" strokeWidth="0.9" />
          <rect x="48" y="18.6" width="8" height="2.6" rx="0.6" stroke="none" fillOpacity="0.7" />
        </>
      }
    >
      <path d="M26 17 H75.6 Q77.6 17 77.6 19 V25 H26 Z" />
      <path d="M44 25 H72 V28.4 H44 Z" />
      <path d="M28 25 H44 L40 46 Q39.6 48 37.6 48 H25.6 Q23.6 48 24 46 Z" />
      <path d="M23.6 18.4 L26.4 17.4 V21.4 Z" />
      <Guard d="M56 28.4 Q56 36 49.4 36 H43.6" />
      <path d="M48.2 28.4 Q49.4 31.4 47.6 33.4" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </Gun>
  ),
  "waffe-pistole-kompakt": (
    <Gun
      details={
        <>
          <path d="M31.4 19.6 V24.6 M33.6 19.6 V24.6 M35.8 19.6 V24.6" strokeWidth="0.9" />
          <path d="M46 26.4 H70" strokeWidth="0.7" />
        </>
      }
    >
      <path d="M28 18 H71 Q72 18 72 19 V26.6 H28 Z" />
      <path d="M44 26.6 H70 V29.2 H44 Z" />
      <path d="M29.2 26.6 H45 L42.6 47 Q42.2 48.6 40.6 48.6 H28.6 Q27 48.6 27.2 47 Z" />
      <Guard d="M56 29.2 V31.2 Q56 37 50.6 37 H44.4" />
      <path d="M48.8 29.2 Q50 32 48.4 34" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </Gun>
  ),
  "waffe-revolver": (
    <Gun
      details={
        <>
          <path d="M35.4 20.6 H46 M35.4 26.6 H46" strokeWidth="1" />
          <circle cx="34.2" cy="23.6" r="0.9" stroke="none" />
        </>
      }
    >
      <path d="M48 19 H82 V24.6 H48 Z" />
      <path d="M48 24.4 H78.4 V27.6 H48 Z" />
      <path d="M78.6 19 L79.4 16.6 H81.2 L81.6 19 Z" />
      <path d="M30 18 H50 V31 H30 Z" />
      <rect x="33" y="17" width="15" height="13" rx="2.2" />
      <path d="M28 19 L31.4 18 L30.4 14 L26.6 15.2 Z" />
      <path d="M27 25 L37 29 Q35 38 34 46 Q33.6 48.6 31 48.6 H23.4 Q21 48.6 21.6 46 Q23 36 27 25 Z" />
      <Guard d="M37.6 31 Q38.4 37.6 44 37.4 L46.8 31" />
    </Gun>
  ),
  "waffe-pumpgun": (
    <Gun details={<path d="M57 24.4 V28 M60 24.4 V28 M63 24.4 V28 M66 24.4 V28 M69 24.4 V28" strokeWidth="0.9" />}>
      <path d="M36 20 H92 V23.4 H36 Z" />
      <path d="M40 24.4 H84 V27.4 H40 Z" />
      <rect x="54" y="23" width="18" height="6.2" rx="1.6" />
      <path d="M24 19 H41 V29 H24 Z" />
      <circle cx="90.6" cy="19.4" r="0.9" />
      <Guard d="M30 29 Q30 34.6 35 34.6 H38 V29" />
      <path d="M25 20 L4 25 Q2.6 25.4 2.6 27 V34 Q2.6 35.6 4 35.2 L25 29 Z" />
    </Gun>
  ),
  "waffe-doppelflinte": (
    <Gun
      details={
        <>
          <path d="M36 22.2 H91" strokeWidth="0.8" />
          <circle cx="33" cy="25.6" r="1.1" stroke="none" />
        </>
      }
    >
      <path d="M34 19 H92 V25.4 H34 Z" />
      <rect x="40" y="25" width="20" height="4.2" rx="1.6" />
      <path d="M24 19 H36 V28.6 H24 Z" />
      <path d="M24.4 18.6 L29.6 17" fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <Guard d="M28 28.6 Q28 34 33 34 H35 V28.6" />
      <path d="M24.6 19.6 L4 26 Q2.6 26.4 2.6 28 V34 Q2.6 35.6 4 35.2 L24.6 28.6 Z" />
    </Gun>
  ),
  "waffe-abgesaegt": (
    <g transform="translate(12 3)">
      <Gun
        details={
          <>
            <path d="M36 23.2 H63" strokeWidth="0.8" />
            <circle cx="32.6" cy="26" r="1" stroke="none" />
          </>
        }
      >
        <path d="M34 20 H64 V26.4 H34 Z" />
        <rect x="38" y="26" width="14" height="3.6" rx="1.4" />
        <path d="M24 19.6 H35 V28.6 H24 Z" />
        <path d="M24.4 21 L29.4 28.6 L22.4 42 Q21.6 43.6 19.8 43 L14.8 41 Q13.2 40.2 14 38.8 Z" />
        <Guard d="M29.4 28.6 Q29.4 33 33 33 H35 V28.6" />
      </Gun>
    </g>
  ),
  "waffe-gewehr": (
    <Gun details={<path d="M48 22.4 H70 M48 24.6 H70" strokeWidth="0.7" />}>
      <path d="M50 20.6 H92 V23.2 H50 Z" />
      <path d="M88 20.6 L89.4 18 H90.6 V20.6 Z" />
      <path d="M44 20 H76 Q77 20 77 21.4 V25.6 Q77 27 75.6 27 H44 Z" />
      <path d="M28 18.6 H46 V27.6 H28 Z" />
      <path d="M29 18.6 L31 16.6 H33 V18.6 Z" />
      <path d="M36 27.6 H43 L42.6 35 H36.4 Z" />
      <Guard d="M29 27.6 Q29 32.6 33 32.6 H35 V27.6" />
      <path d="M28 19 L4 23.6 Q2.6 24 2.6 25.6 V33 Q2.6 34.6 4 34.2 L28 27.6 Z" />
    </Gun>
  ),
  "waffe-sturmgewehr": (
    <Gun
      details={
        <>
          <rect x="50" y="21.6" width="3" height="2" rx="0.4" stroke="none" />
          <rect x="55" y="21.6" width="3" height="2" rx="0.4" stroke="none" />
          <rect x="60" y="21.6" width="3" height="2" rx="0.4" stroke="none" />
          <rect x="65" y="21.6" width="3" height="2" rx="0.4" stroke="none" />
          <path d="M33 16.2 V17.2 M36 16.2 V17.2 M39 16.2 V17.2 M42 16.2 V17.2" strokeWidth="0.8" />
        </>
      }
    >
      <path d="M70 21 H91 V23.2 H70 Z" />
      <rect x="87.6" y="20" width="4.6" height="4.2" rx="0.6" />
      <path d="M70.6 21 L72.2 15.4 H74.4 L76 21 Z" />
      <path d="M46 18.6 H72 V27.4 H46 Z" />
      <path d="M30 17.6 H47 V25 H30 Z" />
      <path d="M31 15.6 H46 V17.6 H31 Z" />
      <path d="M30 25 H48 V29 H30 Z" />
      <path d="M38 29 H45 Q46 35 48.6 40.6 L42 42.6 Q39.6 36.6 38 29 Z" />
      <path d="M31 29 H36 L33 39 Q32.6 40.6 31 40.2 L28.6 39.6 Q27.4 39 27.8 37.8 Z" />
      <path d="M35.6 29 V32.6 H37.8" fill="none" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="21" width="17" height="3.6" />
      <path d="M4 18.6 H17 V31 L4 33 Q3 33 3 32 V19.6 Q3 18.6 4 18.6 Z" />
    </Gun>
  ),
  "waffe-scharfschuetze": (
    <Gun details={<path d="M34 14.8 H54" strokeWidth="0.7" />}>
      <path d="M48 24 H93 V26.2 H48 Z" />
      <path d="M62 23 V27 Q62 28.6 60.4 28.6 H34 Q30 28.6 28 30.6 L22 36 Q21 37 19.4 37 H4 Q2.6 37 2.6 35.6 V26.6 Q2.6 25 4 25 H16 Q19 25 21 23 Z" />
      <rect x="28" y="20.4" width="22" height="3.6" rx="0.8" />
      <rect x="32" y="13" width="24" height="3.6" rx="1.6" />
      <path d="M56 12.2 L64 11 V18.6 L56 17.4 Z" />
      <path d="M27 12.6 L32 13 V16.6 L27 17 Z" />
      <rect x="42" y="10.4" width="3.6" height="3" rx="0.6" />
      <rect x="35" y="16.4" width="3" height="4.2" />
      <rect x="50" y="16.4" width="3" height="4.2" />
      <path d="M40 24 H43 L42 28.6 Q42 30.6 40 30.4 Q38.6 30 39.2 28.6 Z" />
      <Guard d="M34 28.6 Q34 33 38 33 H41" />
    </Gun>
  ),
};

export function hasSymbolArt(name?: string): name is string {
  return Boolean(name && name in art);
}

/** Zeichnung im Spiel-Look als kleine „Anzeige-Kachel“. */
export function SymbolArt({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 96 56" className={cn("shrink-0 rounded-xl border border-white/10 bg-[#0b0a16]", className)} aria-hidden="true">
      {art[name]}
    </svg>
  );
}
