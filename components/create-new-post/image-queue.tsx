"use client";

import {
  Dispatch,
  ElementRef,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import { configCreateNewPost } from "@/photocial.config";
import { ImgPreCropData } from "@/types/create-post-types";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { checkNewImagesValid } from "./utils";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

type ScrollInfor = {
  isScrollLeft: boolean;
  isScrollRight: boolean;
};

export const ImageQueue = () => {
  const { imageFiles, setImageFiles, setCurrentIndex, arrImgPreCropData } =
    useCreateNewPost();

  const inputRef = useRef<ElementRef<"input">>(null);
  const containerRef = useRef<ElementRef<"div">>(null);
  const queueContainerRef = useRef<ElementRef<"div">>(null);

  const [scrollInfo, setScrollInfo] = useState<ScrollInfor>({
    isScrollLeft: false,
    isScrollRight: false,
  });

  useEffect(() => {
    const inputTarget = inputRef.current;
    if (inputTarget && imageFiles) {
      inputTarget.onchange = () => {
        if (inputTarget.files && inputTarget.files.length > 0) {
          const files = Array.from(inputTarget.files);

          const { validFiles, typeError, sizeError } = checkNewImagesValid(
            files,
            configCreateNewPost.maxImageFiles - imageFiles.length,
            configCreateNewPost.limitSize
          );

          if (typeError || sizeError) {
            if (typeError) {
              toast.error("This file is not supported", {
                description: `"${typeError}" could not be uploaded.`,
              });
            }

            if (sizeError) {
              toast.error("This file is too large", {
                description: `"${sizeError}" is bigger than ${configCreateNewPost.limitSize}MB and could not be uploaded.`,
              });
            }
          } else {
            const newImageFiles = validFiles.map((file) => {
              const id = crypto.randomUUID();
              return {
                id,
                file,
              };
            });
            setImageFiles([...imageFiles, ...newImageFiles]);
            // Set currentIndex bằng với phần tử đầu tiên được thêm
            setCurrentIndex(imageFiles.length);
          }

          // Reset input value
          inputTarget.value = "";
          if (inputTarget.value) {
            inputTarget.type = "text";
            inputTarget.type = "file";
          }
        }
      };

      return () => {
        inputTarget.onchange = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  useEffect(() => {
    const containerTarget = containerRef.current;
    const queueContainerTarget = queueContainerRef.current;
    if (queueContainerTarget && containerTarget) {
      if (queueContainerTarget.scrollWidth > containerTarget.offsetWidth) {
        setScrollInfo((prev) => {
          if (queueContainerTarget.scrollLeft === 0) {
            prev.isScrollLeft = false;
          } else {
            prev.isScrollLeft = true;
          }
          if (queueContainerTarget.scrollLeft === containerTarget.scrollWidth) {
            prev.isScrollRight = false;
          } else {
            prev.isScrollRight = true;
          }

          return { ...prev };
        });
      } else {
        setScrollInfo({
          isScrollLeft: false,
          isScrollRight: false,
        });
      }
    }
  }, [arrImgPreCropData]);

  if (!imageFiles || !arrImgPreCropData) return;

  const hanldeAddImage = () => {
    const inputTarget = inputRef.current;
    if (inputTarget && imageFiles.length < configCreateNewPost.maxImageFiles) {
      inputTarget.click();
    }
  };

  const handleScroll = (action: "prev" | "next") => {
    const containerTarget = containerRef.current;
    const queueContainerTarget = queueContainerRef.current;
    if (queueContainerTarget && containerTarget) {
      let space =
        action === "prev"
          ? -containerTarget.offsetWidth
          : containerTarget.offsetWidth;

      setScrollInfo((prev) => {
        if (Math.round(queueContainerTarget.scrollLeft + space) <= 0) {
          prev.isScrollLeft = false;
        } else {
          prev.isScrollLeft = true;
        }
        if (
          Math.round(queueContainerTarget.scrollLeft + space * 2) >=
          queueContainerTarget.scrollWidth
        ) {
          prev.isScrollRight = false;
        } else {
          prev.isScrollRight = true;
        }

        return { ...prev };
      });

      queueContainerTarget.scroll({
        left: queueContainerTarget.scrollLeft + space,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex p-3 gap-x-3">
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <div ref={queueContainerRef} className="overflow-hidden">
          <div className="flex gap-x-2">
            {arrImgPreCropData.map((item, index) => (
              <ImageQueueItem
                key={item.id}
                imgPreCropData={item}
                index={index}
                setScrollInfo={setScrollInfo}
                containerTarget={containerRef.current}
                queueContainerTarget={queueContainerRef.current}
              />
            ))}
          </div>
        </div>
        {scrollInfo.isScrollLeft && (
          <button
            className="absolute top-1/2 left-1 -translate-y-1/2 p-1 bg-normal opacity-50 rounded-full overflow-hidden transition-all hover:opacity-75"
            onClick={() => handleScroll("prev")}
          >
            <ChevronLeft className="text-jet size-4" />
          </button>
        )}
        {scrollInfo.isScrollRight && (
          <button
            className="absolute top-1/2 right-1 -translate-y-1/2 p-1 bg-normal opacity-50 rounded-full overflow-hidden transition-all hover:opacity-75"
            onClick={() => handleScroll("next")}
          >
            <ChevronRight className="text-jet size-4" />
          </button>
        )}
      </div>
      {imageFiles.length < configCreateNewPost.maxImageFiles && (
        <div className="shrink-0 flex items-center justify-center">
          <input ref={inputRef} type="file" accept="image/*" multiple hidden />
          <div
            className="p-2 rounded-full cursor-pointer dark:hover:bg-neutral-500/50 transition-all"
            onClick={hanldeAddImage}
          >
            <Plus />
          </div>
        </div>
      )}
    </div>
  );
};

interface ItemProps {
  imgPreCropData: ImgPreCropData;
  index: number;
  setScrollInfo: Dispatch<SetStateAction<ScrollInfor>>;
  containerTarget: HTMLDivElement | null;
  queueContainerTarget: HTMLDivElement | null;
}

const ImageQueueItem = ({
  imgPreCropData,
  index,
  setScrollInfo,
  containerTarget,
  queueContainerTarget,
}: ItemProps) => {
  const {
    setState,
    imageFiles,
    setImageFiles,
    currentIndex,
    setCurrentIndex,
    setDialog,
  } = useCreateNewPost();

  const handleRemoveImage = () => {
    if (imageFiles) {
      if (currentIndex === imageFiles.length - 1)
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      if (imageFiles.length === 1) {
        setImageFiles(undefined);
      } else
        setImageFiles((prev) => {
          return prev!.toSpliced(currentIndex, 1);
        });
    }
  };

  const handleOnClick = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (queueContainerTarget && containerTarget) {
      const newScrollLeft =
        e.currentTarget.offsetLeft - e.currentTarget.offsetWidth;
      queueContainerTarget.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      setCurrentIndex(index);

      console.log(newScrollLeft);
      setScrollInfo((prev) => {
        if (Math.round(newScrollLeft) <= 0) {
          prev.isScrollLeft = false;
        } else {
          prev.isScrollLeft = true;
        }
        if (
          Math.round(newScrollLeft + containerTarget.offsetWidth) >=
          queueContainerTarget.scrollWidth
        ) {
          prev.isScrollRight = false;
        } else {
          prev.isScrollRight = true;
        }

        return { ...prev };
      });
    }
  };

  return (
    <div
      className="shrink-0 relative size-28 rounded-sm overflow-hidden cursor-pointer"
      onClick={handleOnClick}
    >
      <Image
        src={imgPreCropData.originURL}
        alt=""
        fill
        sizes="auto"
        className="object-cover"
      />
      {index === currentIndex ? (
        <div
          className="absolute top-1.5 right-1.5 p-1.5 rounded-full cursor-pointer dark:bg-neutral-800/75"
          onClick={() =>
            setDialog({
              title: "Discard photo?",
              message: "This will remove the photo from your post.",
              acceptText: "Discard",
              handleAccept: () => {
                handleRemoveImage();
                setDialog(undefined);
              },
              handleCancel: () => setDialog(undefined),
            })
          }
        >
          <X className="size-4" />
        </div>
      ) : (
        <div className="absolute size-full top-0 left-0 dark:bg-neutral-950/50" />
      )}
    </div>
  );
};
