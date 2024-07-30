"use client";

import { toast } from "sonner";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { createArrayCroppedImage } from "./utils";
import { StateHeader } from "./state-header";
import { HiArrowLeft } from "react-icons/hi";
import { CropPreviews } from "./crop-previews";
import { CropParameters } from "./crop-parameters";

export const CNP_SectionCrop = () => {
  const {
    setImageFiles,
    setState,
    arrImgPreCropData,
    setArrCroppedImgData,
    setDialog,
  } = useCreateNewPost();

  const handleDiscard = () => {
    setDialog({
      titleType: "message",
      titleContent: "Discard post?",
      message: "If you leave, your edits won't be saved.",
      type: "warning",
      acceptText: "Discard",
      handleAccept: () => {
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
    <div className="w-[min(100vw-16px,475px)] animate-fade-in">
      <StateHeader
        tilte="Crop"
        LeftBtn={HiArrowLeft}
        abbrTitle="Discard"
        handleLeftBtn={handleDiscard}
        rightBtn="Next"
        handleRightBtn={hanldeNextStep}
      />
      <CropPreviews />
      <CropParameters />
    </div>
  );
};
