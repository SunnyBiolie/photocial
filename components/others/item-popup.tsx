"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType | LucideIcon;
}

export const ItemPopup = ({ Icon }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative size-14 flex items-center justify-center cursor-pointer text-unselected hover:text-normal transition-all"
      onClick={() => setIsOpen(true)}
    >
      <Icon />
      {isOpen && (
        <>
          <div className="absolute bottom-0 left-0 bg-coffee-bean">Popup</div>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-700"
            onClick={(e) => {
              setIsOpen(false);
              e.stopPropagation();
            }}
          ></div>
        </>
      )}
    </div>
  );
};
