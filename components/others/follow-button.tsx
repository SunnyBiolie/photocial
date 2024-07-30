"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Account } from "@prisma/client";
import { cn } from "@/lib/utils";
import { unfollowAccount } from "@/action/follows/delete";
import { followAccount } from "@/action/follows/create";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { Loader } from "lucide-react";

interface Props {
  currentAccountId: string;
  targetAccount: Account;
  isFollowedByCurrentAccount: boolean;
  className?: string;
}

export const FollowButton = ({
  currentAccountId,
  targetAccount,
  isFollowedByCurrentAccount,
  className,
}: Props) => {
  const { setDialogData } = useViewDialog();

  const [isFollowed, setIsFollowed] = useState<boolean>(
    isFollowedByCurrentAccount
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const toggleFollowAccount = async () => {
    if (isFollowed === undefined) return;

    if (!isFollowed) {
      setIsProcessing(true);
      const isSuccess = await followAccount(currentAccountId, targetAccount.id);
      if (isSuccess) {
        toast.success(`Followed @${targetAccount.userName}`);
        setIsFollowed(!isFollowed);
      } else toast.error(`Something went wrong, try again later.`);
      setIsProcessing(false);
    } else {
      setDialogData({
        titleType: "image",
        titleContent: targetAccount.imageUrl,
        message: `Unfollow @${targetAccount.userName}?`,
        type: "warning",
        acceptText: "Unfollow",
        handleAccept: async () => {
          setIsProcessing(true);
          const isSuccess = await unfollowAccount(
            currentAccountId,
            targetAccount.id
          );
          if (isSuccess) {
            toast.success(`Unfollowed @${targetAccount.userName}`);
            setIsFollowed(!isFollowed);
          } else toast.error(`Something went wrong, try again later.`);
          setIsProcessing(false);
        },
        handleCancel: () => {},
      });
    }
  };

  return (
    <button
      className={cn(
        "relative p-2 w-full rounded-md border flex items-start justify-center transition-colors disabled:cursor-not-allowed dark:border-jet dark:hover:bg-neutral-900/50",
        className
      )}
      disabled={isProcessing}
      onClick={toggleFollowAccount}
    >
      {isProcessing ? (
        <Loader className="size-5 animate-slow-spin" />
      ) : (
        <span className="text-sm">{isFollowed ? "Following" : "Follow"}</span>
      )}
    </button>
  );
};
