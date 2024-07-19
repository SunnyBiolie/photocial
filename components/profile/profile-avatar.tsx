"use client";

import { useState } from "react";
import Image from "next/image";
import { UserInfo } from "@prisma/client";
import { ButtonCloseFullView } from "../others/btn-close-full-view";

interface Props {
  profileOwner: UserInfo;
}

export const ProfileAvatar = ({ profileOwner }: Props) => {
  const [isViewAvatar, setIsViewAvatar] = useState(false);

  return (
    <div className="relative size-32 bg-neutral-500 rounded-full overflow-hidden cursor-pointer">
      <Image
        src={profileOwner.imageUrl}
        alt={`${profileOwner.userName}'s avatar`}
        fill
        sizes="auto"
        className="object-cover"
        onClick={() => {
          setIsViewAvatar(true);
        }}
      />
      {isViewAvatar && (
        <div
          className="fixed top-0 left-0 size-full bg-neutral-900/75 backdrop-blur-2xl animate-[display-backdrop-blur_.2s_linear] z-50"
          onClick={() => {
            setIsViewAvatar(false);
          }}
        >
          <div className="size-64 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden">
            <Image
              src={profileOwner.imageUrl}
              alt={`${profileOwner.userName}'s avatar`}
              fill
              sizes="auto"
              className="object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ButtonCloseFullView />
        </div>
      )}
    </div>
  );
};
