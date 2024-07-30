"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useBreakpoint } from "@/hooks/use-breakppoint";
import { ItemNavigation } from "./item-navigation";
import { type IconType } from "react-icons";
import {
  AlignLeft,
  Bell,
  LogOut,
  LucideIcon,
  Pin,
  SearchIcon,
  SquarePen,
  UserRound,
} from "lucide-react";
import { BiHomeAlt2 } from "react-icons/bi";
import { ItemPopup } from "./item-popup";
import { useOpenCreatePost } from "@/hooks/use-open-create-post";
import { useHomePageData } from "@/hooks/use-home-state";
import { SignOutButton } from "@clerk/nextjs";

export interface NavItem {
  title: string;
  href: string;
  isActive: boolean;
  Icon: IconType | LucideIcon;
}

interface Props {
  className?: string;
}

export const AppNavigationBar = ({ className }: Props) => {
  const { onOpen } = useOpenCreatePost();
  const { setPostCards } = useHomePageData();
  const { isMedium } = useBreakpoint();
  const { currentAccount } = useCurrentAccount();

  const pathname = usePathname();

  let mainItem: NavItem[] = [];

  useEffect(() => {
    if (!currentAccount) return;

    let check = false;
    mainItem.forEach((item) => {
      if (item.isActive) {
        check = true;
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, pathname]);

  if (isMedium === undefined) return;

  if (!currentAccount) return;

  mainItem = [
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
      href: `/@${currentAccount.userName}`,
      isActive: pathname.split("/")[1] === `@${currentAccount.userName}`,
      Icon: UserRound,
    },
  ];

  return (
    <div
      className={cn(
        "fixed w-full h-[var(--app-navbar-horizontal-height)] top-full -translate-y-full left-0 flex items-center justify-between bg-rich-black md:h-full md:w-[var(--app-navbar-vertical-width)] md:flex-col z-10",
        className
      )}
    >
      <div className="py-4">
        {isMedium && (
          <Link href="/" onClick={() => setPostCards(undefined)}>
            <div className="relative size-10 rounded-full overflow-hidden bg-neutral-800">
              <Image
                src={"/favicon.ico"}
                alt="Photocial's logo"
                fill
                sizes="auto"
                className="object-cover"
              />
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
        {!isMedium && (
          <div
            className="group relative size-full flex items-center justify-center cursor-pointer md:size-[60px] order-1"
            onClick={() => onOpen()}
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
      {isMedium && (
        <div className="mb-5">
          <ItemPopup Icon={Pin}>
            <div className="p-2">
              <p className="text-center text-sm font-medium text-neutral-400">
                Comming soon!
              </p>
            </div>
          </ItemPopup>
          <ItemPopup Icon={AlignLeft}>
            <SignOutButton>
              <button
                className="w-full p-2.5 rounded-md flex items-center justify-between hover:bg-jet transition-all"
                onClick={() => {}}
              >
                <span className="font-medium">Log out</span>
                <LogOut className="size-5" />
              </button>
            </SignOutButton>
          </ItemPopup>
        </div>
      )}
    </div>
  );
};
