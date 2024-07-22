"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { configCreateNewPost } from "@/photocial.config";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { checkNewImagesValid } from "./utils";
import { BsExclamationCircle } from "react-icons/bs";
import { ImagePlus } from "lucide-react";

export const CNP_SectionInput_MD = () => {
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
            configCreateNewPost.maxImageFiles,
            configCreateNewPost.limitSize
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
                message: `"${sizeError}" is bigger than ${configCreateNewPost.limitSize}MB and could not be uploaded.`,
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
        dropZoneTarget.classList.remove("border-unselected");
        dropZoneTarget.classList.add("border-normal");
      };
      dropZoneTarget.ondragleave = (e) => {
        e.preventDefault();
        dropZoneTarget.classList.add("border-unselected");
        dropZoneTarget.classList.remove("border-normal");
      };
      dropZoneTarget.ondrop = (e) => {
        e.preventDefault();
        dropZoneTarget.classList.add("border-unselected");
        dropZoneTarget.classList.remove("border-normal");

        const fileList = e.dataTransfer?.files;
        if (fileList) {
          const files = Array.from(fileList);

          const { validFiles, typeError, sizeError } = checkNewImagesValid(
            files,
            configCreateNewPost.maxImageFiles,
            configCreateNewPost.limitSize
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
    <div className="space-y-4 p-8">
      <input ref={inputFileRef} type="file" accept="image/*" multiple hidden />
      <h6 className="text-center font-bold">Create new post</h6>
      <div
        ref={dropZoneRef}
        className="size-[min(100vw-16px,420px)] flex flex-col items-center justify-center gap-y-4 p-4 rounded-lg border border-dashed border-unselected overflow-hidden dark:bg-neutral-900 shadow-md"
      >
        {!error ? (
          <>
            <div className="p-6 w-fit rounded-full dark:text-neutral-500 border dark:border-neutral-500">
              <ImagePlus strokeWidth={1} className="size-10" />
            </div>
            <p className="text-lg">Drag and drop photos here</p>
          </>
        ) : (
          <>
            <BsExclamationCircle className="size-16" />
            <p className="text-lg">{error.title}</p>
            <p className="text-sm text-center px-2">{error.message}</p>
          </>
        )}
        <button
          ref={selectImageRef}
          className="py-1 px-8 mt-4 rounded-lg dark:text-neutral-700 dark:bg-neutral-300"
        >
          <span className="text-sm dark:font-medium">
            {!error ? "Select from computer" : "Select other files"}
          </span>
        </button>
      </div>
    </div>
  );
};
