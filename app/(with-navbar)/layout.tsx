"use client";

import { CreateNewPost } from "@/components/create-new-post/create-new-post";
import { AppNavigationBar } from "@/components/others/app-navbar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function WithNavbarLayout({ children }: Props) {
  const [isDisplayVertical, setIsDisplayVertical] = useState<boolean>();
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);

  useEffect(() => {
    const handleDisplayStyle = () => {
      if (window.innerWidth >= 768) {
        setIsDisplayVertical(true);
      } else {
        setIsDisplayVertical(false);
      }
    };

    window.addEventListener("resize", handleDisplayStyle);

    handleDisplayStyle();

    return () => {
      window.removeEventListener("resize", handleDisplayStyle);
    };
  }, []);

  useEffect(() => {
    if (isCreatingNewPost) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isCreatingNewPost]);

  return (
    <div className="w-full h-full">
      {/* <div className="mx-auto w-[calc(72vh)] min-w-[302px] max-w-[632px]"> */}
      <div className="mx-auto md:pb-0 pb-[var(--app-navbar-horizontal-height)] w-fit">
        {children}
      </div>
      <AppNavigationBar
        isDisplayVertical={isDisplayVertical}
        setIsCreatingNewPost={setIsCreatingNewPost}
      />
      {isDisplayVertical && (
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
      {isDisplayVertical !== undefined && (
        <CreateNewPost
          isShow={isCreatingNewPost}
          setIsShow={setIsCreatingNewPost}
          isDisplayVertical={isDisplayVertical}
        />
      )}
    </div>
  );
}
