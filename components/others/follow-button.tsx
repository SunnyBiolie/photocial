"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Account } from "@prisma/client";
import { cn } from "@/lib/utils";
import { unfollowAccount } from "@/action/follows/delete";
import { followAccount } from "@/action/follows/create";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { Loader } from "lucide-react";
import { Loading } from "./loading";

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

  if (currentAccountId === targetAccount.id) return;

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
        "relative px-4 py-2 w-full min-w-20 rounded-md border flex items-start justify-center transition-colors disabled:cursor-not-allowed dark:border-unselected",
        className
      )}
      disabled={isProcessing}
      onClick={toggleFollowAccount}
    >
      {isProcessing ? (
        <Loading size={16} stroke={1.5} className="py-0.5" />
      ) : (
        <span className="text-sm">{isFollowed ? "Following" : "Follow"}</span>
      )}
    </button>
  );
};
