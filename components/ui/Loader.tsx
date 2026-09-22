type LoaderVariant = "default" | "brand" | "light";

type LoaderProps = {
  /** Rendered size. Maps to the `.pl` box (default 6em). */
  size?: number | string;
  variant?: LoaderVariant;
  className?: string;
  label?: string;
};

const variantClass: Record<LoaderVariant, string> = {
  default: "",
  brand: "pl--brand",
  light: "pl--light",
};

/**
 * The site-wide four-ring loader. Colours come from `.pl__ring--*` in
 * globals.css so the markup stays identical to the original animation.
 */
export default function Loader({
  size,
  variant = "brand",
  className = "",
  label = "Loading",
}: LoaderProps) {
  const style =
    size === undefined
      ? undefined
      : { width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size };

  return (
    <span role="status" aria-label={label} className={`inline-flex ${className}`}>
      <svg
        viewBox="0 0 240 240"
        height="240"
        width="240"
        className={`pl ${variantClass[variant]}`}
        style={style}
        aria-hidden="true"
      >
        <circle
          strokeLinecap="round"
          strokeDashoffset={-330}
          strokeDasharray="0 660"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={105}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--a"
        />
        <circle
          strokeLinecap="round"
          strokeDashoffset={-110}
          strokeDasharray="0 220"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={35}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--b"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={85}
          className="pl__ring pl__ring--c"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={155}
          className="pl__ring pl__ring--d"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
