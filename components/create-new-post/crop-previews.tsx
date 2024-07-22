"use client";

import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { cn } from "@/lib/utils";
import { DotQueue } from "../others/dot-queue";
import { Loading } from "../others/loading";
import { ButtonChangeImage } from "../others/btn-change-image";

export const CropPreviews = () => {
  const {
    arrImgPreCropData,
    currentIndex,
    setCurrentIndex,
    direction,
    aspectRatio,
  } = useCreateNewPost();

  if (!arrImgPreCropData) return;

  const currImgPreCropData = arrImgPreCropData[currentIndex];

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-neutral-950/75 backdrop-blur-sm overflow-hidden md:w-[475px]">
      <div
        className={cn(
          "relative transition-all duration-300 ease-out",
          direction === "vertical" ? "h-full" : "w-full"
        )}
        style={{ aspectRatio: aspectRatio }}
      >
        {currImgPreCropData ? (
          <div
            style={{
              backgroundImage: `url(${currImgPreCropData.originURL})`,
              backgroundPositionX: `${
                (currImgPreCropData.perCropPos[1] /
                  (1 - currImgPreCropData.perCropSize[0])) *
                100
              }%`,
              backgroundPositionY: `${
                (currImgPreCropData.perCropPos[0] /
                  (1 - currImgPreCropData.perCropSize[1])) *
                100
              }%`,
              backgroundSize: `${
                currImgPreCropData.perCropSize[0] !== 1 &&
                currImgPreCropData.perCropSize[1] !== 1
                  ? (1 / currImgPreCropData.perCropSize[0]) * 100 + "%"
                  : "cover"
              }`,
            }}
            className="size-full bg-no-repeat"
          />
        ) : (
          <Loading />
        )}
      </div>
      <DotQueue listItems={arrImgPreCropData} currentIndex={currentIndex} />
      <ButtonChangeImage
        action="prev"
        setCurrentIndex={setCurrentIndex}
        disabled={currentIndex <= 0}
      />
      <ButtonChangeImage
        action="next"
        setCurrentIndex={setCurrentIndex}
        disabled={currentIndex >= arrImgPreCropData.length - 1}
      />
    </div>
  );
};
