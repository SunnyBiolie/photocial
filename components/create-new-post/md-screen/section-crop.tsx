"use client";

import { toast } from "sonner";
import { createArrayCroppedImage } from "../utils";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { StateHeader } from "../state-header";
import { CropParameters_MD } from "./crop-parameters";
import { CropPreviews } from "../crop-previews";
import { HiArrowLeft } from "react-icons/hi";

export const CNP_SectionCrop_MD = () => {
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
        <CropParameters_MD />
      </div>
    </div>
  );
};
