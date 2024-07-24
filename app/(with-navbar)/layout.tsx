"use client";

import { CreateNewPost } from "@/components/create-new-post/create-new-post";
import { AppNavigationBar } from "@/components/others/app-navbar";
import { ViewFull } from "@/components/others/view-full";
import { useBreakpoint } from "@/hooks/use-breakppoint";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function WithNavbarLayout({ children, modal }: Props) {
  const { isMedium, setIsMedium } = useBreakpoint();

  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);

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

  useEffect(() => {
    if (isCreatingNewPost) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isCreatingNewPost]);

  return (
    <>
      <div className="w-full h-full">
        {/* <div className="mx-auto w-[calc(72vh)] min-w-[302px] max-w-[632px]"> */}
        <div className="w-full pb-[var(--app-navbar-horizontal-height)] md:px-[var(--app-navbar-vertical-width)] md:pb-0">
          {children}
        </div>
        <AppNavigationBar setIsCreatingNewPost={setIsCreatingNewPost} />
        {isMedium && (
          <div
            className="fixed bottom-8 right-8 size-16 rounded-full border shadow-md cursor-pointer hover:scale-110 transition-all dark:bg-coffee-bean dark:border-unselected"
            onClick={() => setIsCreatingNewPost(true)}
          >
            <Plus
              strokeWidth={2.5}
              className="size-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        )}
        {isMedium !== undefined && (
          <CreateNewPost
            isShow={isCreatingNewPost}
            setIsShow={setIsCreatingNewPost}
          />
        )}
      </div>
      {modal}
      <ViewFull />
    </>
  );
}
