import { useState } from "react";

/**
 * Avatar wajah skin Minecraft via mc-heads.net (pixelated, retina 2x).
 * Fallback: inisial nama dengan gradient jika render gagal (offline/nama bedrock).
 */
export function Avatar({
  name,
  size = 40,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = `https://mc-heads.net/avatar/${encodeURIComponent(name)}/${size * 2}`;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-night-800 ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      {!failed ? (
        <img
          src={url}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover [image-rendering:pixelated]"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-grass-500/30 to-creeper-500/15 font-display font-bold text-grass-300"
          style={{ fontSize: size * 0.36 }}
        >
          {name.replace(/^[.*_]+/, "").slice(0, 2).toUpperCase() || "??"}
        </span>
      )}
    </div>
  );
}
