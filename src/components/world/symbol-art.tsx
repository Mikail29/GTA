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
