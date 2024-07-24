"use client";

import { cn } from "@/lib/utils";
import { ElementRef, useEffect, useRef } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

interface Props {
  action: "prev" | "next";
  disabled: boolean;
  handleClick: () => void;
}

export const VF_ChangeImgBtn = ({ action, disabled, handleClick }: Props) => {
  const ref = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    let ignore = false;

    const target = ref.current;
    if (target && !disabled) {
      target.onmousedown = async () => {
        target.classList.remove("hover:scale-110");
        await new Promise((r) => setTimeout(r, 150));
        if (!target.classList.contains("hover:scale-110") && !ignore) {
          target.classList.add("hover:scale-110");
        }
      };
    }

    // Thay đổi ignore để khi nút chuyển sang disabled thì sẽ không thực hiện hàm sau Promise
    return () => {
      // Clean-up chạy với giá trị cũ nên trước khi chuyển sang true, cần bắt disabled ở giá trị false
      if (!disabled) {
        ignore = true;
      }
    };
  }, [disabled]);

  return (
    <div
      ref={ref}
      className={cn(
        "size-11 rounded-full flex items-center justify-center transition-transform duration-300",
        disabled
          ? "text-neutral-800 bg-neutral-900/30 cursor-not-allowed hover:border hover:border-neutral-800"
          : "text-neutral-500 bg-neutral-800/75 cursor-pointer hover:scale-110"
      )}
      onClick={disabled ? () => {} : handleClick}
    >
      {action === "prev" ? (
        <GoArrowLeft className="size-5" />
      ) : (
        <GoArrowRight className="size-5" />
      )}
    </div>
  );
};
