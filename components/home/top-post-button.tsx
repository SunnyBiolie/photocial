"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useOpenCreatePost } from "@/hooks/use-open-create-post";
import Image from "next/image";

export const TopPostButton = () => {
  const { currentAccount } = useCurrentAccount();
  const { isOpen, onOpen } = useOpenCreatePost();

  const ref = useRef<ElementRef<"div">>(null);

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      target.onmouseenter = () => {
        setIsShow(true);
      };
      target.onmouseleave = () => {
        setIsShow(false);
      };
      target.onclick = () => {
        onOpen();
      };

      return () => {
        target.onmouseenter = null;
        target.onmouseleave = null;
        target.onclick = null;
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentAccount) return;

  return (
    <div className="w-full">
      <div
        ref={ref}
        className="relative w-fit px-5 py-3 mb-6 mx-auto rounded-full overflow-hidden shadow-md flex items-center gap-3 cursor-pointer dark:bg-coffee-bean border border-jet hover:border-tranparent"
      >
        <div className="shrink-0 size-8 z-10 relative rounded-full overflow-hidden cursor-pointer bg-neutral-300 dark:bg-neutral-600">
          <Image
            src={currentAccount.imageUrl}
            alt={`${currentAccount.userName}'s avatar`}
            fill
            sizes="auto"
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex items-center justify-between gap-5">
          <p className="text-sm font-semibold dark:text-neutral-400">
            Want to share some beautiful photos?
          </p>
        </div>
        <div
          className="absolute top-0 left-0 size-full px-5 py-3 flex items-center justify-between bg-neutral-800"
          style={
            isShow || isOpen
              ? {
                  clipPath: "circle(calc(200%) at 36px 28px)",
                  transition: "clip-path ease-in 0.3s",
                }
              : {
                  clipPath: "circle(12px at 36px 28px)",
                  transition: "clip-path ease-in-out 0.25s",
                }
          }
        >
          <div className="ml-8 pl-3">
            <p className="text-sm font-semibold">Let do it!</p>
          </div>
          <button className="-my-3 -mx-5 py-3 px-5 w-20 h-[56px] text-sm font-bold rounded-full  dark:bg-neutral-200 text-neutral-900">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
