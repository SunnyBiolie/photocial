"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
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
  SquarePen,
  UserRound,
} from "lucide-react";
import { BiHomeAlt2 } from "react-icons/bi";
import { ItemPopup } from "./item-popup";

interface Props {
  isDisplayVertical: boolean | undefined;
  setIsCreatingNewPost: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export interface NavItem {
  title: string;
  href: string;
  isActive: boolean;
  Icon: IconType | LucideIcon;
}

export const AppNavigationBar = ({
  isDisplayVertical,
  setIsCreatingNewPost,
  className,
}: Props) => {
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

  if (isDisplayVertical === undefined) return;

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
      href: `/@${user.username}`,
      isActive: pathname.split("/")[1] === `@${user.username}`,
      Icon: UserRound,
    },
  ];

  return (
    <div
      className={cn(
        "fixed w-full h-[var(--app-navbar-horizontal-height)] top-full -translate-y-full left-0 flex items-center justify-between bg-rich-black md:h-full md:w-[var(--app-navbar-vertical-width)] md:flex-col",
        className
      )}
    >
      <div className="py-4">
        {isDisplayVertical && (
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
        )}
      </div>
      <nav className="relative w-full h-full flex items-center gap-1 p-2 md:flex-col md:p-0 md:h-auto">
        {mainItem.map((item, index) => (
          <ItemNavigation
            key={index}
            title={item.title}
            href={item.href}
            isActive={item.isActive}
            Icon={item.Icon}
            style={{
              order: index,
            }}
          />
        ))}
        {!isDisplayVertical && (
          <div
            className="group relative size-full flex items-center justify-center cursor-pointer md:size-[60px] order-1"
            onClick={() => setIsCreatingNewPost(true)}
          >
            <div className="relative z-10">
              <SquarePen
                className={cn("size-6 transition-colors text-unselected")}
              />
            </div>
            <div className="absolute size-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-800/50 opacity-0 scale-[.85] group-hover:opacity-100 group-hover:scale-100 transition-all" />
          </div>
        )}
      </nav>
      {isDisplayVertical && (
        <div className="mb-5">
          <ItemPopup Icon={Pin} />
          <ItemPopup Icon={AlignLeft} />
        </div>
      )}
    </div>
  );
};
