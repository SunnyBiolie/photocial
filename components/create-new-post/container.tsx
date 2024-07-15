"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import {
  type CreatePostState,
  type AspectRatio,
  type Direction,
  type ImgPreCropData,
  type ImgCroppedData,
  ImageFile,
} from "@/types/create-post-types";
import { defaultPercSizeAndPos } from "./utils";
import { CreatePostInput } from "./section-input";
import { CreatePostAdvancedCrop } from "./section-advanced-crop";
import { CreatePostCrop } from "./section-crop";
import { CreatePostFinalState } from "./section-final";
import { Dialog, DialogProps } from "./dialog";

export const configValues = {
  defCurrIndex: 0,
  defDirection: "vertical" as Direction,
  defAspectRatio: 1 as AspectRatio,
  maxImageFiles: 8,
  limitSize: 10,
};

type CreatePostContainerContextType = {
  setState: Dispatch<SetStateAction<CreatePostState>>;
  imageFiles: ImageFile[] | undefined;
  setImageFiles: Dispatch<SetStateAction<ImageFile[] | undefined>>;
  arrImgPreCropData: ImgPreCropData[] | undefined;
  setArrImgPreCropData: Dispatch<SetStateAction<ImgPreCropData[] | undefined>>;
  arrCroppedImgData: ImgCroppedData[] | undefined;
  setArrCroppedImgData: Dispatch<SetStateAction<ImgCroppedData[] | undefined>>;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  direction: Direction;
  setDirection: Dispatch<SetStateAction<Direction>>;
  aspectRatio: AspectRatio;
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
  setDialog: Dispatch<SetStateAction<DialogProps | undefined>>;
};

export const CreatePostContainerContext = createContext<
  CreatePostContainerContextType | undefined
>(undefined);

export const CreatePostContainer = () => {
  const [state, setState] = useState<CreatePostState>("se");
  const [imageFiles, setImageFiles] = useState<ImageFile[]>();
  const [arrImgPreCropData, setArrImgPreCropData] =
    useState<ImgPreCropData[]>();
  const [arrCroppedImgData, setArrCroppedImgData] =
    useState<ImgCroppedData[]>();
  const [currentIndex, setCurrentIndex] = useState(configValues.defCurrIndex);
  const [direction, setDirection] = useState<Direction>(
    configValues.defDirection
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    configValues.defAspectRatio
  );

  const [dialog, setDialog] = useState<DialogProps>();

  useEffect(() => {
    if (!imageFiles) {
      // Revoke URLs tránh tràn RAM
      arrImgPreCropData?.forEach((imgPreCropData) => {
        URL.revokeObjectURL(imgPreCropData.originURL);
      });

      // Khi xóa tất cả file: thiết đặt về mặc định
      setState("se");
      setArrImgPreCropData(undefined);
      setArrCroppedImgData(undefined);
      setCurrentIndex(configValues.defCurrIndex);
      setDirection(configValues.defDirection);
      setAspectRatio(configValues.defAspectRatio);
    } else {
      setState("ar");

      // Revoke URL khi xóa 1 ảnh ra khỏi việc tạo bài viết
      if (arrImgPreCropData && imageFiles.length < arrImgPreCropData.length) {
        arrImgPreCropData.forEach((item) => {
          const existsFile = imageFiles.find((file) => file.id === item.id);
          if (!existsFile) {
            URL.revokeObjectURL(item.originURL);
          }
        });
      }

      const newArrImgData: ImgPreCropData[] = [];

      imageFiles.forEach((imgFile, fileIndex) => {
        const existsImgData = arrImgPreCropData?.find(
          (imgData) => imgFile.id === imgData.id
        );

        // Nếu id ảnh tồn tại từ trước, các thông số sẽ được gán từ ảnh trước (trừ originURL)
        if (existsImgData) {
          newArrImgData[fileIndex] = {
            id: existsImgData.id,
            originURL: existsImgData.originURL,
            intrinsicAR: existsImgData.intrinsicAR,
            perCropSize: existsImgData.perCropSize,
            perCropPos: existsImgData.perCropPos,
          };

          // Do dùng index để gán nên có thể ảnh ở vị trí sau được gán trước, ảnh ở vị trí trước (hoặc khác) có thể bị empty, nên không thể dùng length để kiểm tra mà cần đếm các phần tử không empty
          let notEmptyCount = 0;
          // Các phần tử empty (chưa được gán giá trị) sẽ không được lặp trong forEach()
          newArrImgData.forEach(() => (notEmptyCount += 1));

          if (notEmptyCount === imageFiles.length) {
            setArrImgPreCropData(newArrImgData);
          }
        } else {
          const blobImage = new Blob([imgFile.file as BlobPart], {
            type: "image/*",
          });
          const originURL = URL.createObjectURL(blobImage);

          const img = new Image();
          img.onload = () => {
            const intrinsicAR = img.naturalWidth / img.naturalHeight;

            const { perCropSize, perCropPos } = defaultPercSizeAndPos(
              intrinsicAR,
              aspectRatio
            );

            // Vì đang xử lý trong onload() của img nên sẽ gặp bất đồng bộ, dùng index thay vì push() để đảm bảo thứ tự trong mảng
            newArrImgData[fileIndex] = {
              id: imgFile.id,
              originURL,
              intrinsicAR,
              perCropSize,
              perCropPos,
            };

            // Do dùng index để gán nên có thể ảnh ở vị trí sau được gán trước, ảnh ở vị trí trước (hoặc khác) có thể bị empty, nên không thể dùng length để kiểm tra mà cần đếm các phần tử không empty
            let notEmptyCount = 0;
            // Các phần tử empty (chưa được gán giá trị) sẽ không được lặp trong forEach()
            newArrImgData.forEach(() => (notEmptyCount += 1));

            if (notEmptyCount === imageFiles.length) {
              setArrImgPreCropData(newArrImgData);
            }
          };
          img.src = originURL;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  return (
    <CreatePostContainerContext.Provider
      value={{
        setState,
        imageFiles,
        setImageFiles,
        arrImgPreCropData,
        setArrImgPreCropData,
        arrCroppedImgData,
        setArrCroppedImgData,
        currentIndex,
        setCurrentIndex,
        direction,
        setDirection,
        aspectRatio,
        setAspectRatio,
        setDialog,
      }}
    >
      <div className="shrink-0 overflow-hidden">
        {state === "se" && !imageFiles ? (
          <CreatePostInput />
        ) : (
          imageFiles &&
          arrImgPreCropData && (
            <>
              <div className="p-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="flex flex-col rounded-md overflow-hidden ">
                  {state === "ar" && <CreatePostCrop />}
                  {state === "cr" && <CreatePostAdvancedCrop />}
                  {state === "in" && <CreatePostFinalState />}
                </div>
              </div>
              <div
                className="fixed size-full top-0 left-0 bg-neutral-950/60 z-10"
                onClick={() =>
                  setDialog({
                    title: "Discard post?",
                    message: "If you leave, your edits won't be saved.",
                    acceptText: "Discard",
                    handleAccept: () => {
                      setState("se");
                      setImageFiles(undefined);
                      arrCroppedImgData?.forEach((item) => {
                        URL.revokeObjectURL(item.croppedURL);
                      });
                      setArrCroppedImgData(undefined);
                      setDialog(undefined);
                    },
                    handleCancel: () => setDialog(undefined),
                  })
                }
              />
              {dialog && (
                <Dialog
                  title={dialog.title}
                  message={dialog.message}
                  type={dialog.type}
                  acceptText={dialog.acceptText}
                  handleAccept={dialog.handleAccept}
                  handleAcceptWithLoadingState={
                    dialog.handleAcceptWithLoadingState
                  }
                  handleLoadingDone={dialog.handleLoadingDone}
                  handleCancel={dialog.handleCancel}
                />
              )}
            </>
          )
        )}
      </div>
    </CreatePostContainerContext.Provider>
  );
};
