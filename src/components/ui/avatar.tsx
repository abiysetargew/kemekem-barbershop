import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  rounded?: boolean;
}

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
  "2xl": "h-28 w-28 text-2xl",
};

export function Avatar({
  src,
  alt,
  size = "md",
  className,
  rounded = true,
}: AvatarProps) {
  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-muted font-semibold",
        rounded ? "rounded-full" : "rounded-2xl",
        SIZES[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      ) : (
        <span className="text-muted-foreground">{initials}</span>
      )}
    </div>
  );
}