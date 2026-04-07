interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoCove({ size = 240, className = "" }: LogoProps) {
  const height = (size * 140) / 240; // Ratio original

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 250 150"
      fill="none"
      className={className}
    >
      {/* C */}
      <path
        d="M 96 12 A 58 58 0 1 0 96 138"
        stroke="#22D3EE"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* O */}
      <circle
        cx="106"
        cy="75"
        r="20"
        stroke="#22D3EE"
        strokeWidth="9"
        fill="none"
      />
      {/* V */}
      <path
        d="M 146 55 L 163 95 L 180 55"
        stroke="#22D3EE"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* E */}
      <path
        d="M 200 76 L 232 76 A 20 20 0 1 0 214 93"
        stroke="#22D3EE"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Logo complet avec texte "My"
interface FullLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoFull({ size = "md", className = "" }: FullLogoProps) {
  const sizes = {
    sm: { text: "text-2xl", svg: 90 },
    md: { text: "text-[40px]", svg: 120 },
    lg: { text: "text-[64px]", svg: 200 },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`${currentSize.text} font-extrabold text-[#F8FAFC] tracking-tight`}
      >
        My
      </span>
      <LogoCove size={currentSize.svg} />
    </div>
  );
}