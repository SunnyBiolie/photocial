"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useViewFull } from "@/hooks/use-view-full";
import { VF_ChangeImgBtn } from "./vf-change-img-btn";
import { IoCloseOutline } from "react-icons/io5";
import { useBreakpoint } from "@/hooks/use-breakppoint";

export const ViewFull = () => {
  const {
    isOpen,
    onClose,
    listImages,
    currentIndex,
    setCurrentIndex,
    aspectRatio,
  } = useViewFull();

  const ref = useRef<ElementRef<"div">>(null);

  const [isFullWidth, setIsFullWidth] = useState<boolean>();

  useEffect(() => {
    const target = ref.current;
    if (target && aspectRatio) {
      const ar = target.offsetWidth / target.offsetHeight;
      if (ar <= aspectRatio) setIsFullWidth(true);
      else setIsFullWidth(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Thiết đặt các phím tắt
  useEffect(() => {
    if (isOpen === true) {
      window.onkeydown = (e) => {
        switch (e.code) {
          case "Escape":
            handleClose();
            break;
          case "ArrowLeft":
            handlePrevImage();
            break;
          case "ArrowRight":
            handleNextImage();
            break;
        }
      };
    } else {
      window.onkeydown = () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex]);

  const handleClose = () => {
    onClose();
  };

  const handlePrevImage = () => {
    if (listImages === undefined || currentIndex === undefined) return;

    if (listImages[currentIndex - 1]) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (listImages === undefined || currentIndex === undefined) return;

    if (listImages[currentIndex + 1]) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (
    isOpen &&
    listImages !== undefined &&
    currentIndex !== undefined &&
    aspectRatio !== undefined
  ) {
    return (
      <div className="fixed z-50 top-0 right-0 bottom-0 left-0 bg-rich-black select-none flex animate-[appear_0.1s_linear]">
        <div className="shrink-0 w-24 flex items-center justify-center">
          <VF_ChangeImgBtn
            action="prev"
            disabled={currentIndex <= 0}
            handleClick={handlePrevImage}
          />
        </div>
        <div
          ref={ref}
          className="flex-1 flex items-center justify-center overflow-hidden"
        >
          <div
            className={cn(
              "relative overflow-hidden",
              isFullWidth ? "w-full" : "h-full"
            )}
            style={{ aspectRatio }}
          >
            <div
              className="absolute h-full w-fit flex transition-all duration-500"
              style={{
                left: `-${currentIndex * 100}%`,
              }}
            >
              {listImages.map((img, index) => (
                <div
                  key={index}
                  className="relative h-full bg-[#2A2A2A]"
                  style={{ aspectRatio }}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="auto"
                    quality={100}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-24 flex items-center justify-center">
          <VF_ChangeImgBtn
            action="next"
            disabled={currentIndex >= listImages.length - 1}
            handleClick={handleNextImage}
          />
        </div>
        <div
          className="absolute top-6 right-6 size-11 rounded-full text-neutral-500 bg-neutral-800/75 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onClick={handleClose}
        >
          <IoCloseOutline className="size-6" />
        </div>
      </div>
    );
  }
};
