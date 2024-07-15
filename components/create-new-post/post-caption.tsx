"use client";

import { Dispatch, ElementRef, SetStateAction, useEffect, useRef } from "react";

interface PostCaptionProps {
  caption: string | undefined;
  setCaption: Dispatch<SetStateAction<string | undefined>>;
  className?: string;
}

const maxCaptionLength = 800;

export const PostCaption = ({
  caption,
  setCaption,
  className,
}: PostCaptionProps) => {
  const captionRef = useRef<ElementRef<"textarea">>(null);

  useEffect(() => {
    const captionTarget = captionRef.current;

    if (!captionTarget) return;

    captionTarget.onclick = (e) => {
      e.stopPropagation();
    };
    captionTarget.onbeforeinput = (e) => {
      const event = e as unknown as InputEvent;
      const len = event.data ? event.data.length : 0;
      if (captionTarget.value.length + len > maxCaptionLength)
        e.preventDefault();
    };
    captionTarget.onpaste = (e) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;
      const pasteData = clipboardData.getData("Text");
      if (captionTarget.value.length + pasteData.length > maxCaptionLength)
        e.preventDefault();
    };
    captionTarget.oninput = () => {
      if (captionTarget.value.length > maxCaptionLength) {
        setCaption(captionTarget.value.substring(0, maxCaptionLength));
      } else if (
        captionTarget.value.length === 1 &&
        captionTarget.value.charCodeAt(0) === 10
      ) {
        captionTarget.value = "";
        setCaption(undefined);
      } else setCaption(captionTarget.value);

      captionTarget.style.height = "auto";
      captionTarget.style.height =
        Math.min(captionTarget.scrollHeight, 208) + "px";
    };
    captionTarget.onkeydown = (e) => {
      if (e.code === "Enter") {
        if (!caption) e.preventDefault();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caption]);

  const hanldeContainerClick = () => {
    const captionTarget = captionRef.current;
    if (captionTarget) {
      captionTarget.focus();
    }
  };

  return (
    <div className={className}>
      <div
        className="relative h-fit overflow-auto cursor-text"
        onClick={hanldeContainerClick}
      >
        {!caption && (
          <p
            className="size-full absolute top-0 left-0 text-neutral-400"
            onClick={hanldeContainerClick}
          >
            Write your caption...
          </p>
        )}
        <textarea
          ref={captionRef}
          value={caption}
          className="relative z-10 focus-visible:outline-none w-full min-h-40 bg-transparent resize-none"
        ></textarea>
      </div>
      <div className=" text-right py-2">
        <span className="text-xs font-medium text-neutral-500">
          {caption ? caption.length : 0}/{maxCaptionLength}
        </span>
      </div>
    </div>
  );
};
