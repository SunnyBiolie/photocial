"use client";

import { useEffect, useState } from "react";
import { useBreakpoint } from "@/hooks/use-breakppoint";
import { CreateNewPost } from "@/components/create-new-post/create-new-post";
import { AppNavigationBar } from "@/components/others/app-navbar";
import { ViewAccountAvatar } from "@/components/others/view-account-avatar";
import { ViewFull } from "@/components/others/view-full";
import { Plus } from "lucide-react";
import { useOpenCreatePost } from "@/hooks/use-open-create-post";
import { AppDialog } from "@/components/others/app-dialog";
import { useCurrentAccount } from "@/hooks/use-current-account";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function WithNavbarLayout({ children, modal }: Props) {
  const { currentAccount } = useCurrentAccount();
  const { onOpen } = useOpenCreatePost();

  const { isMedium, setIsMedium } = useBreakpoint();

  useEffect(() => {
    const handleDisplayStyle = () => {
      if (window.innerWidth >= 768) {
        setIsMedium(true);
      } else {
        setIsMedium(false);
      }
    };

    window.addEventListener("resize", handleDisplayStyle);

    handleDisplayStyle();

    return () => {
      window.removeEventListener("resize", handleDisplayStyle);
    };
  }, [setIsMedium]);

  return (
    <>
      <div className="w-full min-h-full">
        <div className="w-full pb-[var(--app-navbar-horizontal-height)] md:px-[var(--app-navbar-vertical-width)] md:pb-0">
          {children}
        </div>
        <AppNavigationBar />
        {isMedium && (
          <div
            className="fixed bottom-8 right-8 size-16 rounded-full border shadow-md cursor-pointer hover:scale-110 transition-all dark:bg-coffee-bean dark:border-unselected"
            onClick={() => onOpen()}
          >
            <Plus
              strokeWidth={2.5}
              className="size-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        )}
        {isMedium !== undefined && <CreateNewPost />}
      </div>
      {modal}
      <ViewFull />
      <ViewAccountAvatar />
      <AppDialog />
      {!currentAccount && (
        <div className="fixed top-0 left-0 size-full bg-rich-black z-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="flex flex-col items-center">
              <Image
                src="/favicon.ico"
                alt="Photocial's icon"
                width={128}
                height={128}
              />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <h1 className="text-lg font-medium dark:text-neutral-400">
              Photocial
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
