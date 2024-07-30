"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeFollowerOfCurrentAccount } from "@/action/follows/delete";
import { isExistRecord } from "@/action/follows/get";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { Loader } from "lucide-react";

interface Props {
  currentAccountId: string;
  targetAccount: Account;
  className?: string;
}

export const RemoveFollowerButton = ({
  currentAccountId,
  targetAccount,
  className,
}: Props) => {
  const { setDialogData } = useViewDialog();

  const [isRemoved, setIsRemoved] = useState<boolean>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const isExist = await isExistRecord(targetAccount.id, currentAccountId);
      setIsRemoved(!isExist);
    };
    fetch();
  }, [currentAccountId, targetAccount]);

  const handleRemove = () => {
    setDialogData({
      titleType: "image",
      titleContent: targetAccount.imageUrl,
      message: `@${targetAccount.userName} will no longer follow you.`,
      type: "warning",
      acceptText: "Remove",
      handleAccept: async () => {
        setIsProcessing(true);
        const isSuccess = await removeFollowerOfCurrentAccount(
          currentAccountId,
          targetAccount.id
        );
        if (isSuccess) {
          toast.success(
            `@${targetAccount.userName} the follower was removed successfully.`
          );
          setIsRemoved(true);
        } else toast.error(`Something went wrong, try again later.`);
        setIsProcessing(false);
      },
      handleCancel: () => {},
    });
  };

  if (isRemoved === undefined) return <RemoveFollowerButton.Skeleton />;

  return (
    <>
      {!isRemoved ? (
        <button
          className={cn(
            "p-2 w-full rounded-md border flex items-start justify-center transition-colors disabled:cursor-not-allowed dark:border-jet dark:hover:bg-neutral-900/50",
            className
          )}
          disabled={isProcessing}
          onClick={handleRemove}
        >
          {isProcessing ? (
            <Loader className="size-5 animate-slow-spin" />
          ) : (
            <span className="text-sm">Remove</span>
          )}
        </button>
      ) : (
        <span className="p-2 w-full text-sm">Removed</span>
      )}
    </>
  );
};

RemoveFollowerButton.Skeleton = function Skeleton() {
  return (
    <div className="w-[min(100%,450px)] h-10 rounded-md bg-jet animate-pulse"></div>
  );
};
