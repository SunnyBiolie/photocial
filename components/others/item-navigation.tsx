"use client";

import { useRef, ElementRef, CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  href: string;
  isActive: boolean;
  Icon: IconType | LucideIcon;
  style?: CSSProperties;
}

export const ItemNavigation = ({
  title,
  href,
  isActive,
  Icon,
  style,
}: Props) => {
  const ref = useRef<ElementRef<"div">>(null);

  const hanldeClick = async () => {
    const target = ref.current;
    if (target && !isActive) {
      target.classList.add("bg-neutral-800/60");
      await new Promise((r) => setTimeout(r, 150));
      target.classList.remove("bg-neutral-800/60");
    }
  };

  return (
    <Link
      href={href}
      className="group relative size-full flex items-center justify-center md:size-[60px]"
      style={style}
      onClick={hanldeClick}
    >
      <div className="relative z-10">
        <Icon
          className={cn(
            "size-6 transition-colors",
            isActive ? "text-normal" : "text-unselected"
          )}
        />
      </div>
      <div
        ref={ref}
        className="absolute size-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-800/50 opacity-0 scale-[.85] group-hover:opacity-100 group-hover:scale-100 transition-all"
      />
    </Link>
  );
};
