"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { type IconType } from "react-icons";
import { ItemNavigation } from "./item-navigation";
import {
  AlignLeft,
  Bell,
  LucideIcon,
  Pin,
  SearchIcon,
  UserRound,
} from "lucide-react";
import { BiHomeAlt2 } from "react-icons/bi";
import { ItemPopup } from "./item-popup";

interface Props {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  isActive: boolean;
  Icon: IconType | LucideIcon;
}

export const MainNavigationBar = ({ className }: Props) => {
  const { user } = useUser();

  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    let check = false;
    mainItem.forEach((item) => {
      if (item.isActive) {
        check = true;
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!user) return;

  const mainItem: NavItem[] = [
    {
      title: "Home",
      href: "/",
      isActive: pathname === "/",
      Icon: BiHomeAlt2,
    },
    {
      title: "Search",
      href: "/search",
      isActive: pathname === "/search",
      Icon: SearchIcon,
    },
    {
      title: "Notifications",
      href: "/notification",
      isActive: pathname === "/notification",
      Icon: Bell,
    },
    {
      title: "Profile",
      href: `@${user.username}`,
      isActive: pathname === `/@${user.username}`,
      Icon: UserRound,
    },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen w-20 flex flex-col items-center justify-between bg-[#0a0a0a]",
        className
      )}
    >
      <div className="py-4">
        <Link href="/" className="">
          <div className="relative size-10 rounded-full overflow-hidden bg-sky-500">
            {/* <Image
              src={""}
              alt="Photocial's logo"
              fill
              sizes="auto"
              className="object-cover"
            /> */}
          </div>
        </Link>
      </div>
      <nav className="relative w-full">
        <div className="relative w-full flex flex-col items-center gap-y-1">
          {mainItem.map((item, index) => (
            <ItemNavigation
              key={index}
              title={item.title}
              href={item.href}
              isActive={item.isActive}
              Icon={item.Icon}
            />
          ))}
        </div>
      </nav>
      <div className="mb-5">
        <ItemPopup Icon={Pin} />
        <ItemPopup Icon={AlignLeft} />
      </div>
    </div>
  );
};
