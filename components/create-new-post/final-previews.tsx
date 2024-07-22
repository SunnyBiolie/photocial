"use client";

import { useCreateNewPost } from "@/hooks/use-create-new-post";
import Image from "next/image";
import { Loading } from "../others/loading";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonChangeImage } from "../others/btn-change-image";
import { DotQueue } from "../others/dot-queue";

export const FinalPreviews = () => {
  const { arrCroppedImgData, direction, aspectRatio } = useCreateNewPost();

  const loaderRef = useRef<ElementRef<"div">>(null);

  const [croppedIndex, setCroppedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 350);

    const target = loaderRef.current;
    if (target) {
      const animationEnd = () => {
        target.classList.remove("animate-fade-out");
        target.style.display = "none";
      };

      target.addEventListener("animationend", animationEnd, { once: true });

      return () => {
        target.removeEventListener("animationend", animationEnd);
      };
    }
  }, []);

  return (
    <div className="shrink-0 relative w-full aspect-square flex items-center justify-center bg-neutral-950/75 backdrop-blur-sm overflow-hidden md:size-[475px]">
      {arrCroppedImgData && (
        <>
          <div
            className={cn(
              "relative transition-all",
              direction === "vertical" ? "h-full" : "w-full"
            )}
            style={{ aspectRatio: aspectRatio }}
          >
            {arrCroppedImgData[croppedIndex] ? (
              <Image
                src={arrCroppedImgData[croppedIndex].croppedURL}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <Loading />
            )}
          </div>
          <DotQueue listItems={arrCroppedImgData} currentIndex={croppedIndex} />
          {/* <div className="absolute top-0 left-0 size-full bg-sky-500/50"></div> */}
          <ButtonChangeImage
            action="prev"
            setCurrentIndex={setCroppedIndex}
            disabled={croppedIndex <= 0}
          />
          <ButtonChangeImage
            action="next"
            setCurrentIndex={setCroppedIndex}
            disabled={croppedIndex >= arrCroppedImgData.length - 1}
          />
        </>
      )}
      <div
        ref={loaderRef}
        className={cn(
          "size-full absolute bottom-0 left-0 flex items-center justify-center bg-neutral-900",
          arrCroppedImgData && !isLoading && "animate-[fade-out_0.5s_ease-in]"
        )}
      >
        {(!arrCroppedImgData || isLoading) && <Loading />}
      </div>
    </div>
  );
};
