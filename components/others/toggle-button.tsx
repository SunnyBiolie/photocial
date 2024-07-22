"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleButtonProps {
  defaultValue?: boolean;
  doWhenCheck: () => void;
  doWhenNotCheck: () => void;
}

export const ToggleButton = ({
  defaultValue = false,
  doWhenCheck,
  doWhenNotCheck,
}: ToggleButtonProps) => {
  const [isCheck, setIsCheck] = useState(defaultValue);

  const handleCheck = () => {
    setIsCheck((prev) => !prev);
    if (isCheck) doWhenNotCheck();
    else doWhenCheck();
  };

  return (
    <div
      className={cn(
        "shrink-0 relative h-4 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors",
        !isCheck ? "bg-unselected" : "bg-normal"
      )}
      onClick={handleCheck}
    >
      <div className="absolute h-4 w-12 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div
          className={cn(
            "size-6 absolute top-1/2 -translate-y-1/2 rounded-full bg-coffee-bean transition-all border border-jet",
            !isCheck ? "left-0" : "left-full -translate-x-full"
          )}
        ></div>
      </div>
    </div>
  );
};
