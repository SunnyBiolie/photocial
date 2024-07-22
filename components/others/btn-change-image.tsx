"use client";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ButtonChangeImageProps {
  action: "prev" | "next";
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  disabled: boolean;
  className?: string;
  classNameIcon?: string;
}

export const ButtonChangeImage = ({
  action,
  setCurrentIndex,
  disabled,
  className,
  classNameIcon,
}: ButtonChangeImageProps) => {
  const handleChangeImage = (action: "next" | "prev") => {
    switch (action) {
      case "next":
        setCurrentIndex((prev) => ++prev);
        break;
      case "prev":
        setCurrentIndex((prev) => --prev);
        break;
    }
  };

  if (disabled) {
    return;
  }

  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 p-2 -mx-2 cursor-pointer group",
        action === "prev" ? "left-2.5" : "right-2.5"
      )}
      onClick={() => handleChangeImage(action)}
    >
      <div
        className={cn(
          "size-7 rounded-full bg-coffee-bean opacity-75 group-hover:bg-coffee-bean group-hover:opacity-90 shadow-md transition-all",
          className
        )}
      >
        {action === "prev" ? (
          <IoIosArrowBack
            className={cn(
              "size-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2",
              classNameIcon
            )}
          />
        ) : (
          <IoIosArrowForward
            className={cn(
              "size-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2",
              classNameIcon
            )}
          />
        )}
      </div>
    </div>
  );
};
