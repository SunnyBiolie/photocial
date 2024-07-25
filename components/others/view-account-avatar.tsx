"use client";

import Image from "next/image";
import { ButtonCloseFullView } from "./btn-close-full-view";
import { useViewAccountAvatar } from "@/hooks/use-view-account-avatar";

export const ViewAccountAvatar = () => {
  const { isOpen, onClose, imageURL } = useViewAccountAvatar();

  if (!isOpen || !imageURL) return;

  return (
    <div
      className="fixed top-0 left-0 size-full bg-neutral-900/75 backdrop-blur-2xl animate-fade-in z-50"
      onClick={() => {
        onClose();
      }}
    >
      <div className="size-64 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden">
        <Image
          src={imageURL}
          alt={`Account's avatar`}
          fill
          sizes="100vw"
          className="object-cover"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <ButtonCloseFullView />
    </div>
  );
};
