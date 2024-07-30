"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType | LucideIcon;
  children: React.ReactNode;
}

export const ItemPopup = ({ Icon, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onClick={() => setIsOpen(true)}>
      <div className="size-14 flex items-center justify-center cursor-pointer text-unselected hover:text-normal transition-colors">
        <Icon />
      </div>
      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 w-screen h-screen z-10"
            onClick={(e) => {
              setIsOpen(false);
              e.stopPropagation();
            }}
          ></div>
          <div className="absolute min-w-52 bottom-full left-0 p-2 rounded-lg border dark:border-jet bg-coffee-bean animate-fade-in z-10">
            {children}
          </div>
        </>
      )}
    </div>
  );
};
