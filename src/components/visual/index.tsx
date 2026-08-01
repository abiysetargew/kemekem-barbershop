"use client";
import { motion } from "framer-motion";

/**
 * Floating scissors animation that decorates the hero.
 * Combines two scissors, one rotating clockwise, one counter-clockwise.
 */
export function ScissorsAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Right-side giant scissors */}
      <motion.div
        animate={{
          rotate: [12, -12, 12],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[8%] top-[18%] opacity-[0.07]"
      >
        <ScissorsIcon size={420} />
      </motion.div>

      {/* Left side */}
      <motion.div
        animate={{
          rotate: [-20, 20, -20],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[5%] bottom-[18%] opacity-[0.06]"
      >
        <ScissorsIcon size={320} />
      </motion.div>

      {/* Small fast */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[20%] bottom-[28%] opacity-[0.05]"
      >
        <ScissorsIcon size={180} />
      </motion.div>
    </div>
  );
}

function ScissorsIcon({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Horizontal scrolling text marquee
 */
export function Marquee() {
  const items = [
    "Haircut",
    "✦",
    "Beard Trim",
    "✦",
    "Hot Shave",
    "✦",
    "VIP Grooming",
    "✦",
    "Facial",
    "✦",
    "Hair Color",
    "✦",
    "Shampoo",
    "✦",
    "Premium Experience",
    "✦",
  ];
  const doubled = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden py-4">
      <div className="marquee-track flex items-center gap-6 whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-6 font-display text-lg text-background/80"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Big animated scissors loader — used in bookings/loading states.
 */
export function ScissorsLoader({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
      className="text-foreground"
    >
      <ScissorsIcon size={size} />
    </motion.div>
  );
}