import { Dispatch, SetStateAction } from "react";
import {
  ImgCroppedData,
  ImgPreCropData,
  AspectRatio,
} from "@/types/create-post-types";

export const defaultPercSizeAndPos = (
  intrinsicAR: number,
  aspectRatio: AspectRatio
) => {
  const perCropHeight =
    intrinsicAR >= aspectRatio ? 1 : 1 / (aspectRatio / intrinsicAR);
  const perCropWidth =
    intrinsicAR <= aspectRatio ? 1 : aspectRatio / intrinsicAR;
  const perCropTop = perCropHeight === 1 ? 0 : 0.5 - perCropHeight / 2;
  const perCropLeft = perCropWidth === 1 ? 0 : 0.5 - perCropWidth / 2;

  return {
    perCropSize: [perCropWidth, perCropHeight],
    perCropPos: [perCropTop, perCropLeft],
  } as {
    perCropSize: [number, number];
    perCropPos: [number, number];
  };
};

type CheckValidImageType = {
  validFiles: File[];
  typeError?: string;
  sizeError?: string;
};

export const checkNewImagesValid = (
  validFiles: File[],
  limitLength: number,
  limitSize: number
) => {
  const result: CheckValidImageType = { validFiles: [] };

  for (let i = 0; i < limitLength; i++) {
    if (validFiles[i]) {
      result.validFiles.push(validFiles[i]);
    }
  }

  result.validFiles.forEach((file) => {
    if (file.type.split("/")[0] !== "image") {
      result.typeError = file.name;
    }
  });

  if (!result.typeError) {
    result.validFiles.forEach((file) => {
      if (file.size > limitSize * 1024 * 1024) {
        result.sizeError = file.name;
      }
    });
  }

  return result;
};

export function createArrayCroppedImage(
  arrImgPreCrop: ImgPreCropData[],
  setArrCroppedImgData: Dispatch<SetStateAction<ImgCroppedData[] | undefined>>
) {
  let result: ImgCroppedData[] = [];

  arrImgPreCrop.forEach((item, index) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");

      const cropHeight = img.naturalHeight * item.perCropSize[1];
      const cropWidth = img.naturalWidth * item.perCropSize[0];

      canvas.height = cropHeight;
      canvas.width = cropWidth;

      const x = img.naturalWidth * item.perCropPos[1];
      const y = img.naturalHeight * item.perCropPos[0];

      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        img,
        x,
        y,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      // Chọn type là jpg/jpge và chất lượng nén là 85% để giảm kích thước
      const dataURL = canvas.toDataURL("image/jpeg", 0.85);
      const base64Data = dataURL.split(",")[1];
      const binaryString = atob(base64Data);
      const length = binaryString.length;
      // Chuyển dữ liệu từ base64 sang Uint8Array --> giảm kích thước dữ liệu (?)
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const croppedURL = URL.createObjectURL(
        new Blob([bytes.buffer], { type: "image/jpeg" })
      );

      result[index] = { bytes, croppedURL };

      let notEmptyCount = 0;
      result.forEach(() => (notEmptyCount += 1));

      if (notEmptyCount === arrImgPreCrop.length) {
        setArrCroppedImgData(result);
      }
    };
    img.src = item.originURL;
  });
}
