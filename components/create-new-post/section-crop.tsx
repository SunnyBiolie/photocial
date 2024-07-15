"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createArrayCroppedImage } from "./utils";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { StateHeader } from "./state-header";
import { CropParameters } from "./crop-parameters";
import { CropPreviews } from "./crop-previews";
import { HiArrowLeft } from "react-icons/hi";

export const CreatePostCrop = () => {
  const {
    setImageFiles,
    setState,
    arrImgPreCropData,
    setArrCroppedImgData,
    setDialog,
  } = useCreateNewPost();

  const handleDiscard = () => {
    setDialog({
      title: "Discard post?",
      message: "If you leave, your edits won't be saved.",
      acceptText: "Discard",
      handleAccept: () => {
        setState("se");
        setImageFiles(undefined);
        setDialog(undefined);
      },
      handleCancel: () => setDialog(undefined),
    });
  };

  const hanldeNextStep = () => {
    setState("in");
    if (arrImgPreCropData) {
      createArrayCroppedImage(arrImgPreCropData, setArrCroppedImgData);
    } else {
      toast.error(`"arrImgPreCropData" is not defined!`);
    }
  };
  return (
    <div className="animate-fade-in">
      <StateHeader
        tilte="Crop"
        LeftBtn={HiArrowLeft}
        abbrTitle="Discard"
        handleLeftBtn={handleDiscard}
        rightBtn="Next"
        handleRightBtn={hanldeNextStep}
      />
      <div className="relative flex">
        <CropPreviews />
        <CropParameters />
        <div
          className={cn(
            "w-[760px] h-[475px] absolute bottom-0 left-0 bg-slate-800",
            arrImgPreCropData ? "hidden" : "flex items-center justify-center"
          )}
        >
          Loading ...
        </div>
      </div>
    </div>
  );
};
