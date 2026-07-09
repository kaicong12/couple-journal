const SIZES = {
  sm: "w-5 h-5 text-[10px]",
  md: "w-7 h-7 text-[11px]",
};

export default function Avatar({ who, size = "sm", className = "" }) {
  const isYou = who === "you";
  return (
    <span
      className={`${SIZES[size]} rounded-full inline-flex items-center justify-center font-display text-white leading-none shrink-0 ${
        isYou
          ? "bg-gradient-to-br from-[#C9A788] to-[#6F4B36]"
          : "bg-gradient-to-br from-[#B07A6B] to-[#7A4A3A]"
      } ${className}`}
    >
      {isYou ? "Y" : "M"}
    </span>
  );
}
