"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { ImageQueue } from "./image-queue";
import { AspectRatio } from "@/types/create-post-types";
import { defaultPercSizeAndPos } from "./utils";
import { configValues } from "./container";
import { CiCrop } from "react-icons/ci";
import { LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";

const vertical: AspectRatio[] = [0.5625, 0.6666666666666667, 0.75, 0.8, 1];
const verticalDisplay = ["9:16", "2:3", "3:4", "4:5", "1:1"];
const horizontal: AspectRatio[] = [
  1.7777777777777778, 1.5, 1.3333333333333333, 1.25, 1,
];
const horizontalDisplay = ["16:9", "3:2", "4:3", "5:4", "1:1"];

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

  const [arIndex, setARIndex] = useState<number>(
    vertical.indexOf(aspectRatio) !== -1
      ? vertical.indexOf(aspectRatio)
      : horizontal.indexOf(aspectRatio)
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
    <div className="flex-1 w-[325px] bg-dark_2 p-4 text-sm font-medium space-y-3 overflow-hidden select-none">
      <section className="space-y-1.5">
        <p>Direction</p>
        <div className="w-fit bg-dark_3 p-1 rounded-md flex items-center gap-x-1">
          <div
            className={cn(
              "py-2 px-3 rounded-md cursor-pointer",
              direction === "vertical" && "bg-light_3"
            )}
            onClick={() => handleSelectDirection("vertical", vertical[arIndex])}
          >
            <LuRectangleVertical className="size-5" />
          </div>
          <div
            className={cn(
              "py-2 px-3 rounded-md cursor-pointer",
              direction === "horizontal" && "bg-light_3"
            )}
            onClick={() =>
              handleSelectDirection("horizontal", horizontal[arIndex])
            }
          >
            <LuRectangleHorizontal className="size-5" />
          </div>
        </div>
      </section>
      <section className="space-y-1.5">
        <p>Aspect ratio</p>
        <div className="w-fit bg-dark_3 p-1 rounded-md flex items-center gap-x-1">
          {direction === "vertical"
            ? vertical.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-2 px-3 rounded-md cursor-pointer",
                    item === aspectRatio && "bg-light_3"
                  )}
                  onClick={() => handleSelectAR(item, index)}
                >
                  {verticalDisplay[index]}
                </div>
              ))
            : horizontal.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-2 px-3 rounded-md cursor-pointer",
                    item === aspectRatio && "bg-light_3"
                  )}
                  onClick={() => handleSelectAR(item, index)}
                >
                  {horizontalDisplay[index]}
                </div>
              ))}
        </div>
      </section>
      <section className="space-y-1.5">
        <p>
          Photos ({arrImgPreCropData.length}/{configValues.maxImageFiles})
        </p>
        <ImageQueue />
      </section>
      <section className="space-y-1.5">
        <p>Crop in more detail</p>
        <button
          className="p-2 rounded-sm bg-dark_3 hover:bg-light_3 transition"
          onClick={() => setState("cr")}
        >
          <CiCrop className="size-6" />
        </button>
      </section>
    </div>
  );
};
