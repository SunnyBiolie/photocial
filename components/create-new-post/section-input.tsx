"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { configValues } from "./container";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { checkNewImagesValid } from "./utils";
import { IoImagesOutline } from "react-icons/io5";
import { BsExclamationCircle } from "react-icons/bs";

export const CreatePostInput = () => {
  const { imageFiles, setImageFiles } = useCreateNewPost();

  const inputFileRef = useRef<ElementRef<"input">>(null);
  const selectImageRef = useRef<ElementRef<"button">>(null);
  const dropZoneRef = useRef<ElementRef<"div">>(null);

  const [error, setError] = useState<{ title: string; message: string }>();

  useEffect(() => {
    const inputFileTarget = inputFileRef.current;
    const selectImageTarget = selectImageRef.current;
    const dropZoneTarget = dropZoneRef.current;
    if (inputFileTarget && selectImageTarget && dropZoneTarget) {
      selectImageTarget.onclick = () => {
        inputFileTarget.click();
      };
      inputFileTarget.onchange = () => {
        if (inputFileTarget.files && inputFileTarget.files.length > 0) {
          const files = Array.from(inputFileTarget.files);

          const { validFiles, typeError, sizeError } = checkNewImagesValid(
            files,
            configValues.maxImageFiles,
            configValues.limitSize
          );

          if (typeError || sizeError) {
            if (typeError) {
              setError({
                title: "This file is not supported",
                message: `"${typeError}" could not be uploaded.`,
              });
            }

            if (sizeError) {
              setError({
                title: "This file is too large",
                message: `"${sizeError}" is bigger than ${configValues.limitSize}MB and could not be uploaded.`,
              });
            }

            // Reset input value
            inputFileTarget.value = "";
            if (inputFileTarget.value) {
              inputFileTarget.type = "text";
              inputFileTarget.type = "file";
            }
            return;
          }

          const newImageFiles = validFiles.map((file) => {
            const id = crypto.randomUUID();
            return {
              id,
              file,
            };
          });
          setImageFiles(newImageFiles);
        }
      };

      dropZoneTarget.ondragover = (e) => {
        e.preventDefault();
        dropZoneTarget.classList.remove("border-dark_3");
        dropZoneTarget.classList.add("border-light_3");
      };
      dropZoneTarget.ondragleave = (e) => {
        e.preventDefault();
        dropZoneTarget.classList.add("border-dark_3");
        dropZoneTarget.classList.remove("border-light_3");
      };
      dropZoneTarget.ondrop = (e) => {
        e.preventDefault();
        dropZoneTarget.classList.add("border-dark_3");
        dropZoneTarget.classList.remove("border-light_3");

        const fileList = e.dataTransfer?.files;
        if (fileList) {
          const files = Array.from(fileList);

          const { validFiles, typeError, sizeError } = checkNewImagesValid(
            files,
            configValues.maxImageFiles,
            configValues.limitSize
          );

          if (typeError || sizeError) {
            if (typeError) {
              setError({
                title: "This file is not supported",
                message: `"${typeError}" could not be uploaded.`,
              });
            }

            if (sizeError) {
              setError({
                title: "This file is too large",
                message: `"${sizeError}" could not be uploaded.`,
              });
            }

            // Reset input value
            inputFileTarget.value = "";
            if (inputFileTarget.value) {
              inputFileTarget.type = "text";
              inputFileTarget.type = "file";
            }
            return;
          }

          const newImageFiles = validFiles.map((file) => {
            const id = crypto.randomUUID();
            return {
              id,
              file,
            };
          });
          setImageFiles(newImageFiles);
        }
      };

      return () => {
        selectImageTarget.onclick = null;
        inputFileTarget.onchange = null;
        dropZoneTarget.ondragover = null;
        dropZoneTarget.ondragleave = null;
        dropZoneTarget.ondrop = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (imageFiles) throw new Error("Already has file(s)");

  return (
    <div className="space-y-8">
      <input ref={inputFileRef} type="file" accept="image/*" multiple hidden />
      <div
        ref={dropZoneRef}
        className="size-[475px] flex flex-col items-center justify-center gap-y-4 p-4 font-medium rounded-lg border-2 border-dashed border-dark_3 text-light_1"
      >
        {!error ? (
          <>
            <IoImagesOutline className="size-12" />
            <p>Drag and drop photos here</p>
          </>
        ) : (
          <>
            <BsExclamationCircle className="size-16" />
            <p className="text-lg">{error.title}</p>
            <p className="text-sm text-center font-normal px-2">
              {error.message}
            </p>
          </>
        )}
        <button
          ref={selectImageRef}
          className="py-2 px-4 mt-4 rounded-md bg-slate-200 text-dark_3"
        >
          {!error ? "Select photos" : "Select other files"}
        </button>
      </div>
      {/* <div className="w-[475px] text-sm text-slate-400">
        Each new post only allows a maximum of 6 files, files in image format
        (image/*) and capacity not exceeding 15 MB. Files that do not meet the
        requirements will not be added.
      </div> */}
    </div>
  );
};
