import type { Shape } from "../data/types";

type Pt = [number, number];

/** Left half of each silhouette, running from top-centre down to bottom-centre. */
const HALF: Record<Shape, Pt[]> = {
  gamis: [
    [150, 58], [134, 60], [120, 68], [96, 80], [82, 96], [70, 252], [90, 256], [101, 150],
    [104, 205], [96, 300], [88, 372], [150, 372],
  ],
  abaya: [
    [150, 52], [132, 54], [116, 64], [90, 78], [72, 100], [48, 300], [82, 306], [96, 170],
    [100, 240], [92, 320], [84, 376], [150, 376],
  ],
  khimar: [
    [150, 34], [124, 40], [104, 62], [94, 100], [88, 160], [80, 236], [104, 270], [150, 258],
  ],
  set: [], // drawn from two pieces below
  outer: [
    [150, 60], [128, 62], [112, 70], [86, 82], [74, 100], [62, 262], [84, 266], [98, 160],
    [96, 260], [90, 380], [144, 380],
  ],
};

const mirror = (pts: Pt[]): Pt[] => [...pts, ...[...pts].reverse().map(([x, y]): Pt => [300 - x, y])];

const toPath = (pts: Pt[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") + " Z";

const tunic: Pt[] = [
  [150, 60], [132, 62], [118, 70], [92, 82], [80, 98], [68, 210], [88, 214], [100, 150],
  [102, 205], [150, 205],
];
const skirt: Pt[] = [[150, 218], [110, 218], [92, 376], [150, 376]];

interface Props {
  shape: Shape;
  color: string;
  className?: string;
  label?: string;
  /** "slice" fills the box (cards); "meet" shows the whole garment (wide banners). */
  fit?: "slice" | "meet";
}

/**
 * Flat, hand-cut style garment illustration used until real photography exists.
 * Everything derives from one colour so swatch changes re-tint the whole plate.
 */
export default function Garment({ shape, color, className = "", label, fit = "slice" }: Props) {
  const stroke = `color-mix(in srgb, ${color} 62%, #1e1a15)`;
  const plate = `color-mix(in srgb, ${color} 16%, #f1e9da)`;
  const fill = color;

  return (
    <svg
      viewBox="0 0 300 420"
      role="img"
      aria-label={label}
      className={`block h-full w-full ${className}`}
      preserveAspectRatio={`xMidYMid ${fit}`}
      style={{ background: plate }}
    >
      <rect width="300" height="420" fill={plate} />
      <ellipse cx="150" cy="394" rx="78" ry="6" fill={stroke} opacity=".12" />
      <path d="M150 20v20" stroke={stroke} strokeWidth="1" opacity=".5" />
      <circle cx="150" cy="18" r="3" fill="none" stroke={stroke} strokeWidth="1" opacity=".5" />

      <g fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {shape === "set" ? (
          <>
            <path d={toPath(mirror(tunic))} />
            <path d={toPath(mirror(skirt))} />
            <path d="M150 62v30" fill="none" />
            <path d="M104 216h92" fill="none" opacity=".5" />
          </>
        ) : shape === "outer" ? (
          <>
            <path d={toPath(HALF.outer.slice(0, -1).concat([[144, 380]]))} />
            <path d={toPath(HALF.outer.slice(0, -1).concat([[144, 380]]).map(([x, y]): Pt => [300 - x, y]))} />
          </>
        ) : (
          <path d={toPath(mirror(HALF[shape]))} />
        )}

        {shape === "gamis" && (
          <>
            <path d="M150 66v306" fill="none" opacity=".55" />
            <path d="M126 70q24 22 48 0" fill="none" opacity=".7" />
            <path d="M72 246l16 4" fill="none" opacity=".6" />
            <path d="M228 246l-16 4" fill="none" opacity=".6" />
          </>
        )}
        {shape === "abaya" && (
          <>
            <path d="M150 58v318" fill="none" opacity=".55" />
            <path d="M104 190q46 12 92 0" fill="none" opacity=".7" />
            <path d="M52 296l30 6" fill="none" opacity=".5" />
            <path d="M248 296l-30 6" fill="none" opacity=".5" />
          </>
        )}
        {shape === "khimar" && (
          <ellipse cx="150" cy="104" rx="27" ry="36" fill={plate} stroke={stroke} />
        )}
        {shape === "outer" && (
          <>
            <path d="M116 200h-14v18h14z" fill="none" opacity=".55" />
            <path d="M184 200h14v18h-14z" fill="none" opacity=".55" />
          </>
        )}
      </g>
    </svg>
  );
}
