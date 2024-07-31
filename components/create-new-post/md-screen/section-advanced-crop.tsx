"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { StateHeader } from "../state-header";
import { BiUndo } from "react-icons/bi";

export const CNP_AdvancedCrop_MD = () => {
  const {
    setState,
    currentIndex,
    aspectRatio,
    arrImgPreCropData,
    setArrImgPreCropData,
  } = useCreateNewPost();

  const containerRef = useRef<ElementRef<"div">>(null);
  const imgContainerRef = useRef<ElementRef<"div">>(null);
  const cropperRef = useRef<ElementRef<"div">>(null);
  const gridRef = useRef<ElementRef<"div">>(null);

  const topDivRef = useRef<ElementRef<"div">>(null);
  const bottomDivRef = useRef<ElementRef<"div">>(null);
  const leftDivRef = useRef<ElementRef<"div">>(null);
  const rightDivRef = useRef<ElementRef<"div">>(null);

  const topLeftCornerRef = useRef<ElementRef<"div">>(null);

  const [containerAR, setContainerAR] = useState<number>();
  const [imgContainerSize, setImgContainerSize] = useState<[number, number]>();

  useEffect(() => {
    const containerTarget = containerRef.current;
    if (containerTarget) {
      setContainerAR(
        containerTarget.offsetWidth / containerTarget.offsetHeight
      );
    }

    const backToPreviousState = () => {
      setState("ar");
    };

    window.addEventListener("resize", backToPreviousState);

    return () => {
      window.removeEventListener("resize", backToPreviousState);
    };
  }, [setState]);

  useEffect(() => {
    const imgContainerTarget = imgContainerRef.current;
    if (imgContainerTarget) {
      const imgWidth = imgContainerTarget.getBoundingClientRect().width;
      const imgHeight = imgContainerTarget.getBoundingClientRect().height;
      setImgContainerSize([imgWidth, imgHeight]);
    }
  }, [containerAR]);

  if (!arrImgPreCropData) return;

  const currOriImgData = arrImgPreCropData[currentIndex];

  const handleMoveCropper = () => {
    const cropperTarget = cropperRef.current;
    const gridTarget = gridRef.current;

    const topDivTarget = topDivRef.current;
    const bottomDivTarget = bottomDivRef.current;
    const leftDivTarget = leftDivRef.current;
    const rightDivTarget = rightDivRef.current;

    if (
      !imgContainerSize ||
      !cropperTarget ||
      !gridTarget ||
      !topDivTarget ||
      !bottomDivTarget ||
      !leftDivTarget ||
      !rightDivTarget
    )
      return;

    cropperTarget.style.cursor = "grabbing";

    const onMove = (e: MouseEvent) => {
      gridTarget.style.display = "grid";

      const imgWidth = imgContainerSize[0];
      const imgHeight = imgContainerSize[1];

      const cropperWidth = cropperTarget.offsetWidth;
      const cropperHeight = cropperTarget.getBoundingClientRect().height;
      const cropperTop = cropperTarget.offsetTop;
      const cropperLeft = cropperTarget.offsetLeft;

      if (cropperTop + e.movementY <= 0) cropperTarget.style.top = "0px";
      else if (cropperTop + e.movementY >= imgHeight - cropperHeight) {
        cropperTarget.style.top = imgHeight - cropperHeight + "px";
        bottomDivTarget.style.height = "0px";
      } else cropperTarget.style.top = cropperTop + e.movementY + "px";

      if (cropperLeft + e.movementX <= 0) cropperTarget.style.left = "0px";
      else if (cropperLeft + e.movementX >= imgWidth - cropperWidth) {
        cropperTarget.style.left = imgWidth - cropperWidth + "px";
        rightDivTarget.style.width = "0px";
      } else cropperTarget.style.left = cropperLeft + e.movementX + "px";

      topDivTarget.style.height = cropperTarget.offsetTop + "px";
      topDivTarget.style.left = cropperTarget.offsetLeft + "px";
      bottomDivTarget.style.height =
        imgHeight - cropperHeight - cropperTarget.offsetTop + "px";
      bottomDivTarget.style.left = cropperTarget.offsetLeft + "px";
      leftDivTarget.style.width = cropperTarget.offsetLeft + "px";
      rightDivTarget.style.width =
        imgWidth - cropperWidth - cropperTarget.offsetLeft + "px";
    };

    const stopMove = () => {
      gridTarget.style.display = "none";
      cropperTarget.style.cursor = "grab";

      cropperTarget.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stopMove);
    };

    cropperTarget.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stopMove);
  };

  const handleResizeCropper = (resizeDirection: "left" | "right") => {
    const cropperTarget = cropperRef.current;

    const topDivTarget = topDivRef.current;
    const bottomDivTarget = bottomDivRef.current;
    const leftDivTarget = leftDivRef.current;
    const rightDivTarget = rightDivRef.current;

    if (
      !imgContainerSize ||
      !cropperTarget ||
      !topDivTarget ||
      !bottomDivTarget ||
      !leftDivTarget ||
      !rightDivTarget
    )
      return;

    const onMove = (e: MouseEvent) => {
      const imgWidth = imgContainerSize[0];
      const imgHeight = imgContainerSize[1];

      const cropperWidth = cropperTarget.offsetWidth;
      const cropperHeight = cropperTarget.getBoundingClientRect().height;
      const cropperTop = cropperTarget.offsetTop;
      const cropperLeft = cropperTarget.offsetLeft;

      if (resizeDirection === "left") {
        // Aspect Ratio ảnh lớn hơn --> Mặc định: cropperHeight === imgHeight
        if (currOriImgData.intrinsicAR > aspectRatio) {
          // cropperHeight nhỏ nhất bằng 1/2 imgHeight
          if (cropperHeight - e.movementX * aspectRatio <= imgHeight / 2) {
            cropperTarget.style.width = (imgHeight / 2) * aspectRatio + "px";

            // cropperHeight lớn nhất bằng imgHeight
          } else if (cropperHeight - e.movementX * aspectRatio >= imgHeight) {
            cropperTarget.style.width = imgHeight * aspectRatio + "px";

            // Cropper nằm sát dưới khi mở rộng
            if (
              cropperTop + cropperHeight - e.movementX * aspectRatio >=
              imgHeight
            ) {
              // cropperTarget.style.top = "0px";
            }
          } else {
            cropperTarget.style.width = cropperWidth - e.movementX + "px";

            // Cropper nằm sát trái và đang rộng
            if (cropperTarget.offsetLeft <= 0 && e.movementX <= 0) {
              cropperTarget.style.left = "0px";
            } else {
              cropperTarget.style.left = cropperLeft + e.movementX + "px";
            }

            // Cropper nằm sát dưới khi mở rộng
            if (
              cropperTop + cropperHeight - e.movementX * aspectRatio >=
              imgHeight
            ) {
              cropperTarget.style.top =
                cropperTop + e.movementX / aspectRatio + "px";
            }
          }

          // Aspect Ratio ảnh nhỏ hơn --> Mặc định: cropperWidth === imgWidth
        } else {
          // cropperWidth nhỏ nhất bằng 1/2 imgWidth
          if (cropperWidth - e.movementX <= imgWidth / 2) {
            cropperTarget.style.width = imgWidth / 2 + "px";

            // cropperWidth lớn nhất bằng imgWidth
          } else if (cropperWidth - e.movementX >= imgWidth) {
            cropperTarget.style.width = imgWidth + "px";
            cropperTarget.style.left = "0px";
            rightDivTarget.style.width = "0px";

            // Cropper nằm sát dưới khi mở rộng
            if (
              cropperTop + cropperHeight - e.movementX * aspectRatio >=
              imgHeight
            ) {
              cropperTarget.style.top =
                imgHeight - cropperTarget.offsetHeight + "px";
            }

            // cropperWidth ở khoảng giữa 1/2 và 1 của imgWidth
          } else {
            cropperTarget.style.width = cropperWidth - e.movementX + "px";

            // Cropper nằm sát trái và đang mở rộng
            if (cropperTarget.offsetLeft <= 0 && e.movementX <= 0) {
              cropperTarget.style.left = "0px";
            } else {
              cropperTarget.style.left = cropperLeft + e.movementX + "px";
            }

            // Cropper nằm sát dưới khi mở rộng
            if (
              cropperTop + cropperHeight - e.movementX * aspectRatio >=
              imgHeight
            ) {
              cropperTarget.style.top =
                cropperTop + e.movementX / aspectRatio + "px";
            }
          }
        }
      } else if (resizeDirection === "right") {
        // Aspect Ratio ảnh lớn hơn --> Mặc định: cropperHeight === imgHeight
        if (currOriImgData.intrinsicAR > aspectRatio) {
          // cropperHeight nhỏ nhất bằng 1/2 imgHeight
          if (cropperHeight + e.movementX * aspectRatio <= imgHeight / 2) {
            cropperTarget.style.width = (imgHeight / 2) * aspectRatio + "px";

            // cropperHeight lớn nhất bằng imgHeight
          } else if (cropperHeight + e.movementX * aspectRatio >= imgHeight) {
            cropperTarget.style.width = imgHeight * aspectRatio + "px";

            // imgHeight/2 < cropperHeight < imgHeight
          } else {
            cropperTarget.style.width = cropperWidth + e.movementX + "px";
          }
          // Aspect Ratio ảnh nhỏ hơn --> Mặc định: cropperWidth === imgWidth
        } else {
          if (cropperWidth + e.movementX <= imgWidth / 2) {
            cropperTarget.style.width = imgWidth / 2 + "px";
          } else if (cropperWidth + e.movementX >= imgWidth) {
            cropperTarget.style.width = imgWidth + "px";
          } else {
            cropperTarget.style.width = cropperWidth + e.movementX + "px";
          }
        }
      }

      if (cropperTarget.offsetLeft <= 0) {
        cropperTarget.style.left = "0px";
      }
      // Stick right
      if (cropperTarget.offsetLeft + cropperTarget.offsetWidth >= imgWidth) {
        cropperTarget.style.left = imgWidth - cropperTarget.offsetWidth + "px";
        rightDivTarget.style.width = "0px";
      }
      if (cropperTarget.offsetTop <= 0) {
        cropperTarget.style.top = "0px";
      }
      if (cropperTarget.offsetTop + cropperTarget.offsetHeight >= imgHeight) {
        cropperTarget.style.top = imgHeight - cropperTarget.offsetHeight + "px";
      }

      topDivTarget.style.width = cropperTarget.offsetWidth + "px";
      topDivTarget.style.height = cropperTarget.offsetTop + "px";
      topDivTarget.style.left = cropperTarget.offsetLeft + "px";

      bottomDivTarget.style.width = cropperTarget.offsetWidth + "px";
      bottomDivTarget.style.height =
        imgHeight - cropperTarget.offsetTop - cropperTarget.offsetHeight + "px";
      bottomDivTarget.style.left = cropperTarget.offsetLeft + "px";

      leftDivTarget.style.width = cropperTarget.offsetLeft + "px";

      rightDivTarget.style.width =
        imgWidth - cropperTarget.offsetWidth - cropperTarget.offsetLeft + "px";
    };

    const stopMove = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stopMove);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stopMove);
  };

  const handleUndo = () => {
    setState("ar");
  };

  const handleSaveChange = () => {
    const cropperTarget = cropperRef.current;
    if (imgContainerSize && cropperTarget) {
      setState("ar");
      setArrImgPreCropData((prev) => {
        if (prev) {
          prev![currentIndex].perCropPos = [
            cropperTarget.offsetTop / imgContainerSize[1],
            cropperTarget.offsetLeft / imgContainerSize[0],
          ];
          prev![currentIndex].perCropSize = [
            cropperTarget.offsetWidth / imgContainerSize[0],
            cropperTarget.offsetHeight / imgContainerSize[1],
          ];
        }
        return prev;
      });
    }
  };

  return (
    <div className="animate-fade-in select-none">
      <StateHeader
        tilte="Crop in more detail"
        LeftBtn={BiUndo}
        abbrTitle="Undo"
        handleLeftBtn={handleUndo}
        rightBtn="Done"
        handleRightBtn={handleSaveChange}
      />
      <div
        ref={containerRef}
        className="relative w-[min(100vw-16px,75vh)] aspect-square  flex items-center justify-center dark:bg-neutral-950/75 backdrop-blur-sm px-1 md:w-[min(100vw-16px,800px)] md:h-[500px]"
      >
        {containerAR && (
          <div
            ref={imgContainerRef}
            className={cn(
              "relative",
              currOriImgData.intrinsicAR > containerAR ? "w-full" : "h-full"
            )}
            style={{ aspectRatio: currOriImgData.intrinsicAR }}
          >
            <Image
              src={currOriImgData.originURL}
              alt=""
              fill
              className="object-cover"
            />
            {imgContainerSize && (
              <div className="absolute top-0 left-0 size-full flex">
                <div
                  ref={leftDivRef}
                  className="absolute top-0 left-0 h-full bg-neutral-950/75"
                  style={{
                    width: currOriImgData.perCropPos[1] * imgContainerSize[0],
                  }}
                ></div>
                <div className="flex flex-col">
                  <div
                    ref={topDivRef}
                    className="absolute top-0 bg-neutral-950/75"
                    style={{
                      width:
                        currOriImgData.perCropSize[0] * imgContainerSize[0],
                      height:
                        currOriImgData.perCropPos[0] * imgContainerSize[1],
                      left: currOriImgData.perCropPos[1] * imgContainerSize[0],
                    }}
                  ></div>
                  <div
                    ref={cropperRef}
                    className="absolute cursor-grab border-2 border-sky-100/75 z-10"
                    style={{
                      width:
                        currOriImgData.perCropSize[0] * imgContainerSize[0],
                      aspectRatio,
                      top: currOriImgData.perCropPos[0] * imgContainerSize[1],
                      left: currOriImgData.perCropPos[1] * imgContainerSize[0],
                    }}
                    onMouseDown={handleMoveCropper}
                  >
                    <div ref={gridRef} className="size-full hidden grid-cols-3">
                      <div className="border-r border-b border-sky-100/50"></div>
                      <div className="border border-t-0 border-sky-100/50"></div>
                      <div className="border-l border-b border-sky-100/50"></div>
                      <div className="border border-l-0 border-sky-100/50"></div>
                      <div className="border border-sky-100/50"></div>
                      <div className="border border-r-0 border-sky-100/50"></div>
                      <div className="border-t border-r border-sky-100/50"></div>
                      <div className="border border-b-0 border-sky-100/50"></div>
                      <div className="border-t border-l border-sky-100/50"></div>
                    </div>
                    <div
                      ref={topLeftCornerRef}
                      className="absolute top-0 -left-[1px] bottom-0 cursor-ew-resize"
                      onMouseDown={(e) => {
                        handleResizeCropper("left");
                        e.stopPropagation();
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 min-h-12 max-h-24 h-1/4 bg-sky-100 rounded-sm"></div>
                    </div>
                    <div
                      className="absolute top-0 -right-[1px] bottom-0 cursor-ew-resize"
                      onMouseDown={(e) => {
                        handleResizeCropper("right");
                        e.stopPropagation();
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 min-h-12 max-h-24 h-1/4 bg-sky-100 rounded-sm"></div>
                    </div>
                  </div>
                  <div
                    ref={bottomDivRef}
                    className="absolute bottom-0 bg-neutral-950/75"
                    style={{
                      width:
                        currOriImgData.perCropSize[0] * imgContainerSize[0],
                      height:
                        imgContainerSize[1] -
                        currOriImgData.perCropPos[0] * imgContainerSize[1] -
                        currOriImgData.perCropSize[1] * imgContainerSize[1],
                      left: currOriImgData.perCropPos[1] * imgContainerSize[0],
                    }}
                  ></div>
                </div>
                <div
                  ref={rightDivRef}
                  className="absolute top-0 right-0 h-full bg-neutral-950/75"
                  style={{
                    width:
                      imgContainerSize[0] -
                      currOriImgData.perCropPos[1] * imgContainerSize[0] -
                      currOriImgData.perCropSize[0] * imgContainerSize[0],
                  }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
