"use client";

import { ElementRef, MouseEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { NavItem } from "../others/app-navbar";
import { Bookmark, Grid3X3 } from "lucide-react";

interface Props {
  userName: string;
}

export const ProfileNavigationBar = ({ userName }: Props) => {
  const { setScrollTop } = useProfilePageData();

  const pathname = usePathname();

  const navRef = useRef<ElementRef<"nav">>(null);

  const [underline, setUnderline] = useState<{ left: number; width: number }>();

  useEffect(() => {
    const navTarget = navRef.current;
    if (navTarget) {
      const handleSetUnderline = () => {
        const list = navTarget.children;
        for (let i = 0; i < list.length; i++) {
          if (profileItem[i].isActive) {
            const element = list.item(i) as HTMLElement;
            setUnderline({
              width: element.getBoundingClientRect().width,
              left: element.offsetLeft,
            });
            break;
          }
        }
      };

      window.addEventListener("resize", handleSetUnderline);

      handleSetUnderline();

      return () => {
        window.removeEventListener("resize", handleSetUnderline);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileItem: NavItem[] = [
    {
      title: "Created",
      href: `/@${userName}/`,
      isActive: pathname === `/@${userName}`,
      Icon: Grid3X3,
    },
    {
      title: "Saved",
      href: `/@${userName}/saved/`,
      isActive: pathname === `/@${userName}/saved`,
      Icon: Bookmark,
    },
  ];

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    setUnderline({
      width: e.currentTarget.getBoundingClientRect().width,
      left: e.currentTarget.offsetLeft,
    });
    setScrollTop(window.scrollY);
  };

  return (
    <div className="relative w-full border-b border-jet">
      <nav ref={navRef} className="w-fit mx-auto flex items-center gap-x-12">
        {profileItem.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={cn(
              "py-5 flex items-center gap-x-1",
              item.isActive ? "text-normal" : "text-unselected"
            )}
            onClick={handleLinkClick}
          >
            <item.Icon className="size-3.5" />
            <span className="uppercase text-xs font-medium tracking-wider">
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
      {underline && (
        <div
          className="absolute bottom-0 border-b rounded-full transition-all duration-300"
          style={{
            width: underline.width,
            left: underline.left,
          }}
        />
      )}
    </div>
  );
};
