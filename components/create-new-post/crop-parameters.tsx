"use client";

import { ElementRef, MouseEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { configCropParams } from "@/photocial.config";
import { AspectRatio } from "@/types/create-post-types";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { defaultPercSizeAndPos } from "./utils";
import { Check, Crop, Images, Ratio, RectangleVertical, X } from "lucide-react";
import { ImageQueue } from "./image-queue";

export const CropParameters = () => {
  const {
    setState,
    arrImgPreCropData,
    setArrImgPreCropData,
    direction,
    setDirection,
    aspectRatio,
    setAspectRatio,
  } = useCreateNewPost();

  const ratioSelectorRef = useRef<ElementRef<"div">>(null);
  const imageSelectorRef = useRef<ElementRef<"div">>(null);

  const verticalReversed = [...configCropParams.vertical].reverse();
  const horizontalReversed = [...configCropParams.horizontal].reverse();
  const verticalDisplayReversed = [
    ...configCropParams.verticalDisplay,
  ].reverse();
  const horizontalDisplayReversed = [
    ...configCropParams.horizontalDisplay,
  ].reverse();

  const [arIndex, setARIndex] = useState<number>(
    verticalReversed.indexOf(aspectRatio) !== -1
      ? verticalReversed.indexOf(aspectRatio)
      : horizontalReversed.indexOf(aspectRatio)
  );
  const [isOpenRatioSelector, setIsOpenRatioSelector] =
    useState<boolean>(false);
  const [isOpenImageSelector, setIsOpenImageSelector] =
    useState<boolean>(false);

  useEffect(() => {
    // Ẩn các selector khi nhấn vào window, có thể chặn bằng stopPropagation
    const hideSelector = () => {
      hideRatioSelector();
      hideImageSelector();
    };
    window.addEventListener("click", hideSelector);

    return () => {
      window.removeEventListener("click", hideSelector);
    };
  }, []);

  if (!arrImgPreCropData) return;

  const handleSelectDirection = (
    newDirection: "vertical" | "horizontal",
    ar: AspectRatio
  ) => {
    if (direction === newDirection) return;

    handleSelectAR(ar, arIndex);
    setDirection(newDirection);
  };

  const handleSelectAR = (newAspectRatio: AspectRatio, index: number) => {
    if (aspectRatio === newAspectRatio) return;

    setARIndex(index);
    setAspectRatio(newAspectRatio);
    if (!arrImgPreCropData) return;

    // Reset perCropSize and perCropPos for cropper display in the middle-center
    setArrImgPreCropData((prev) => {
      if (prev) {
        prev.forEach((item, index) => {
          const { perCropSize, perCropPos } = defaultPercSizeAndPos(
            item.intrinsicAR,
            newAspectRatio
          );
          prev[index] = {
            id: prev[index].id,
            originURL: item.originURL,
            intrinsicAR: item.intrinsicAR,
            perCropSize,
            perCropPos,
          };
        });
      }

      return prev;
    });
  };

  const hideRatioSelector = () => {
    const ratioSelectorTarget = ratioSelectorRef.current;
    if (ratioSelectorTarget) {
      ratioSelectorTarget.style.opacity = "0";
      ratioSelectorTarget.style.bottom = "100%";

      const delay = async () => {
        await new Promise((r) => setTimeout(r, 150));
        setIsOpenRatioSelector(false);
      };
      delay();
    }
  };

  const hideImageSelector = () => {
    const imageSelectorTarget = imageSelectorRef.current;
    if (imageSelectorTarget) {
      imageSelectorTarget.style.opacity = "0";
      imageSelectorTarget.style.bottom = "100%";

      const delay = async () => {
        await new Promise((r) => setTimeout(r, 150));
        setIsOpenImageSelector(false);
      };
      delay();
    }
  };

  const openRatioSelector = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (!isOpenRatioSelector) e.stopPropagation();
    setIsOpenRatioSelector(true);

    hideImageSelector();
  };

  const openImageSelector = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (!isOpenImageSelector) e.stopPropagation();
    setIsOpenImageSelector(true);

    hideRatioSelector();
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-4 text-sm font-medium">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div
            className="relative rounded-full p-2.5 cursor-pointer dark:bg-neutral-900/80"
            onClick={openRatioSelector}
          >
            {isOpenRatioSelector ? (
              <X
                strokeWidth={2}
                className="size-4 animate-[appear-lg_0.15s_linear]"
              />
            ) : (
              <Ratio
                strokeWidth={1.5}
                className="size-4 animate-[appear-lg_0.15s_linear]"
              />
            )}
          </div>
          <div
            className="relative rounded-full p-2.5 cursor-pointer dark:bg-neutral-900/80"
            onClick={() => setState("cr")}
          >
            <Crop
              strokeWidth={2}
              className="size-4 animate-[appear-lg_0.15s_linear]"
            />
          </div>
        </div>
        <div
          className="relative rounded-full p-2.5 cursor-pointer dark:bg-neutral-900/80"
          onClick={openImageSelector}
        >
          {isOpenImageSelector ? (
            <X
              strokeWidth={2}
              className="size-4 animate-[appear-lg_0.15s_linear]"
            />
          ) : (
            <Images
              strokeWidth={1.5}
              className="size-4 animate-[appear-lg_0.15s_linear]"
            />
          )}
        </div>
        {isOpenRatioSelector && (
          <div
            ref={ratioSelectorRef}
            className="absolute bottom-[150%] left-0 w-36 rounded-md overflow-hidden animate-[slide-in-up_0.15s_linear] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-4 py-2 border-b flex items-center justify-between cursor-pointer dark:bg-neutral-900/80 dark:border-neutral-500"
              onClick={() => {
                const d = direction === "vertical" ? "horizontal" : "vertical";
                const listAR =
                  d === "vertical" ? verticalReversed : horizontalReversed;
                handleSelectDirection(d, listAR[arIndex]);
              }}
            >
              <span className="capitalize">{direction}</span>
              <RectangleVertical
                className={cn(
                  "size-5 transition-all",
                  direction === "horizontal" && "rotate-90"
                )}
              />
            </div>
            {direction === "vertical"
              ? verticalReversed.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-2 border-b flex items-center justify-between cursor-pointer dark:text-neutral-400 dark:bg-neutral-900/80 dark:hover:bg-neutral-700/80 dark:border-neutral-900/80",
                      item === aspectRatio && "dark:text-normal"
                    )}
                    onClick={() => handleSelectAR(item, index)}
                  >
                    {verticalDisplayReversed[index]}
                    {item === aspectRatio && <Check className="size-4" />}
                  </div>
                ))
              : horizontalReversed.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-2 border-b flex items-center justify-between cursor-pointer dark:text-neutral-400 dark:bg-neutral-900/80 dark:hover:bg-neutral-700/80 dark:border-neutral-900/80",
                      item === aspectRatio && "dark:text-normal"
                    )}
                    onClick={() => handleSelectAR(item, index)}
                  >
                    {horizontalDisplayReversed[index]}
                    {item === aspectRatio && <Check className="size-4" />}
                  </div>
                ))}
          </div>
        )}
        {isOpenImageSelector && (
          <div
            ref={imageSelectorRef}
            className="absolute bottom-[150%] right-0 max-w-full rounded-md overflow-hidden animate-[slide-in-up_0.15s_linear] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dark:bg-neutral-900/80">
              <ImageQueue />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
