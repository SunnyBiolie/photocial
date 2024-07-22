"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/types/create-post-types";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { configCreateNewPost, configCropParams } from "@/photocial.config";
import { defaultPercSizeAndPos } from "../utils";
import { ImageQueue_MD } from "./image-queue";
import { CiCrop } from "react-icons/ci";
import { LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";

export const CropParameters_MD = () => {
  const {
    setState,
    arrImgPreCropData,
    setArrImgPreCropData,
    direction,
    setDirection,
    aspectRatio,
    setAspectRatio,
  } = useCreateNewPost();

  const [arIndex, setARIndex] = useState<number>(
    configCropParams.vertical.indexOf(aspectRatio) !== -1
      ? configCropParams.vertical.indexOf(aspectRatio)
      : configCropParams.horizontal.indexOf(aspectRatio)
  );

  if (!arrImgPreCropData) return;

  const handleSelectDirection = (
    newDirection: "vertical" | "horizontal",
    ar: AspectRatio
  ) => {
    if (direction === newDirection) return;

    handleSelectAR(ar, arIndex);
    setDirection(newDirection);
    setAspectRatio(ar);
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

  return (
    <div className="shrink-0 w-[325px] bg-jet p-4 text-sm space-y-3 overflow-hidden select-none">
      <section className="space-y-1.5">
        <p>Direction</p>
        <div className="w-fit bg-coffee-bean p-1 rounded-md flex items-center gap-x-1">
          <div
            className={cn(
              "py-2 px-3 rounded-md cursor-pointer",
              direction === "vertical" && "bg-unselected"
            )}
            onClick={() =>
              handleSelectDirection(
                "vertical",
                configCropParams.vertical[arIndex]
              )
            }
          >
            <LuRectangleVertical className="size-5" />
          </div>
          <div
            className={cn(
              "py-2 px-3 rounded-md cursor-pointer",
              direction === "horizontal" && "bg-unselected"
            )}
            onClick={() =>
              handleSelectDirection(
                "horizontal",
                configCropParams.horizontal[arIndex]
              )
            }
          >
            <LuRectangleHorizontal className="size-5" />
          </div>
        </div>
      </section>
      <section className="space-y-1.5">
        <p>Aspect ratio</p>
        <div className="w-fit bg-coffee-bean p-1 rounded-md flex items-center gap-x-1">
          {direction === "vertical"
            ? configCropParams.vertical.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-2 px-3 rounded-md cursor-pointer",
                    item === aspectRatio && "bg-unselected"
                  )}
                  onClick={() => handleSelectAR(item, index)}
                >
                  {configCropParams.verticalDisplay[index]}
                </div>
              ))
            : configCropParams.horizontal.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-2 px-3 rounded-md cursor-pointer",
                    item === aspectRatio && "bg-unselected"
                  )}
                  onClick={() => handleSelectAR(item, index)}
                >
                  {configCropParams.horizontalDisplay[index]}
                </div>
              ))}
        </div>
      </section>
      <section className="space-y-1.5">
        <p>
          Photos&nbsp;
          <span className="tracking-wider">
            ({arrImgPreCropData.length}/{configCreateNewPost.maxImageFiles})
          </span>
        </p>
        <ImageQueue_MD />
      </section>
      <section className="space-y-1.5">
        <p>Crop in more detail</p>
        <button
          className="p-2 rounded-md transition-colors dark:bg-coffee-bean dark:hover:bg-unselected"
          onClick={() => setState("cr")}
        >
          <CiCrop className="size-6" />
        </button>
      </section>
    </div>
  );
};
