"use client";

import { useRef, ElementRef } from "react";
import Link from "next/link";
import { type IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  href: string;
  isActive: boolean;
  Icon: IconType | LucideIcon;
}

export const ItemNavigation = ({ title, href, isActive, Icon }: Props) => {
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
      className="group relative size-[60px] flex items-center justify-center"
      onClick={hanldeClick}
    >
      <div className="relative z-10">
        <Icon
          className={cn(
            "size-6 transition-colors",
            isActive ? "text-nav-item-hightlight" : "text-nav-item"
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
