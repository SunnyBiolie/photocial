"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Account } from "@prisma/client";
import { ButtonCloseFullView } from "./btn-close-full-view";
import { useViewAccountAvatar } from "@/hooks/use-view-account-avatar";
import { cn } from "@/lib/utils";

interface Props {
  account: Account;
  sizes?: string;
  className?: string;
}

export const AccountAvatar = ({
  account,
  sizes = "auto",
  className,
}: Props) => {
  const { onOpen, setImageURL } = useViewAccountAvatar();

  const hanldeClick = () => {
    setImageURL(account.imageUrl);
    onOpen();
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden cursor-pointer bg-neutral-300 dark:bg-neutral-600",
        className
      )}
    >
      <Image
        src={account.imageUrl}
        alt={`${account.userName}'s avatar`}
        fill
        sizes={sizes}
        className="object-cover"
        onClick={hanldeClick}
      />
    </div>
  );
};
