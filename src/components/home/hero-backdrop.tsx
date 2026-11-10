/**
 * Selbst erstellter Vice-City-inspirierter Hintergrund (CSS + SVG):
 * Sonnenuntergang, Retro-Sonne, Skyline-Silhouette, Palmen, Meer und Raster.
 * Keine Fremdgrafiken, keine Screenshots.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Himmel */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,#ff9b68_0%,#ff55b8_22%,#5b2a8a_48%,#19172e_72%,#100f20_100%)] opacity-90" />
      {/* Sterne */}
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(1px_1px_at_20%_15%,white,transparent),radial-gradient(1px_1px_at_70%_10%,white,transparent),radial-gradient(1.5px_1.5px_at_85%_25%,white,transparent),radial-gradient(1px_1px_at_40%_8%,white,transparent),radial-gradient(1px_1px_at_10%_30%,white,transparent),radial-gradient(1px_1px_at_60%_22%,white,transparent)]" />
      {/* Retro-Sonne */}
      <div className="absolute bottom-[14%] left-1/2 size-[17rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffd29a] via-sunset to-pink shadow-[0_0_120px_40px_rgb(255_85_184/0.35)] [mask-image:linear-gradient(to_bottom,black_0_50%,transparent_50%_54%,black_54%_62%,transparent_62%_67%,black_67%_74%,transparent_74%_80%,black_80%_86%,transparent_86%_93%,black_93%)] sm:size-[26rem]" />
      {/* Skyline */}
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute bottom-[24%] left-0 h-[18%] w-full text-[#1a1030]">
        <path
          fill="currentColor"
          d="M0 200 V140 H40 V110 H70 V150 H100 V90 H120 V70 H140 V90 H160 V130 H200 V100 H230 V60 H250 V40 H262 V60 H280 V120 H320 V150 H360 V95 H390 V75 H420 V115 H460 V140 H500 V105 H520 V50 H535 V30 H548 V50 H560 V110 H600 V135 H640 V85 H670 V65 H700 V125 H740 V150 H780 V100 H800 V80 H830 V55 H850 V80 H870 V120 H910 V140 H950 V95 H980 V70 H1010 V115 H1050 V145 H1090 V105 H1120 V85 H1150 V130 H1200 V200 Z"
        />
      </svg>
      {/* Meer mit Lichtreflexen */}
      <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-b from-[#2a1450] to-night" />
      <div className="absolute inset-x-0 bottom-[6%] h-[19%] opacity-60 [background-image:repeating-linear-gradient(to_bottom,transparent_0_10px,rgb(255_155_104/0.25)_10px_12px)] [mask-image:radial-gradient(40%_100%_at_50%_0%,black,transparent)]" />
      {/* Raster-Boden */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] origin-bottom opacity-40 [background-image:linear-gradient(rgb(66_232_213/0.35)_1px,transparent_1px),linear-gradient(90deg,rgb(66_232_213/0.35)_1px,transparent_1px)] [background-size:60px_30px] [transform:perspective(400px)_rotateX(60deg)] [mask-image:linear-gradient(to_top,black,transparent)]" />
      {/* Palmen links und rechts */}
      <Palm className="absolute -left-6 bottom-0 h-[70%] text-[#0d0a1a] sm:left-0" />
      <Palm className="absolute -right-10 bottom-0 h-[82%] -scale-x-100 text-[#0d0a1a] sm:right-0" />
      {/* Abdunklung hinter dem Text für gute Lesbarkeit */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_42%,rgb(16_15_32/0.6),transparent)]" />
      {/* Verlauf zum Seiteninhalt */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
    </div>
  );
}

function Palm({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 400" className={className} fill="currentColor">
      <path d="M92 400 C96 320 104 240 122 150 L130 152 C114 240 108 320 106 400 Z" />
      <path d="M126 150 C100 120 60 115 20 135 C60 118 95 126 124 156 Z" />
      <path d="M126 150 C150 110 185 100 200 110 C180 110 155 122 130 156 Z" />
      <path d="M126 150 C118 105 90 75 55 70 C88 82 112 110 124 154 Z" />
      <path d="M126 150 C145 130 180 135 200 160 C175 142 150 142 130 156 Z" />
      <path d="M126 150 C100 150 70 175 60 210 C78 180 100 165 126 158 Z" />
      <path d="M126 150 C135 115 160 90 190 85 C165 98 145 120 130 154 Z" />
    </svg>
  );
}
