"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Account } from "@prisma/client";
import { followAccount, unfollowAccount } from "@/action/follows/update";
import { checkAccountFollowdByYou } from "@/action/follows/get";
import { Loader } from "lucide-react";

interface Props {
  yourId: string;
  profileOwner: Account;
}

export const FollowButton = ({ yourId, profileOwner }: Props) => {
  const [isFollowedByYou, setIsFollowedByYou] = useState<boolean>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const isFollowed = await checkAccountFollowdByYou(
        yourId,
        profileOwner.id
      );
      setIsFollowedByYou(isFollowed);
    };
    fetch();
  }, [yourId, profileOwner]);

  if (isFollowedByYou === undefined) return <FollowButton.Skeleton />;

  const toggleFollowAccount = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    if (!isFollowedByYou) {
      const isSuccess = await followAccount(yourId, profileOwner.id);
      if (isSuccess) toast.success(`Followed @${profileOwner.userName}`);
      else return toast.error(`Something went wrong, try again later`);
    } else {
      const isSuccess = await unfollowAccount(yourId, profileOwner.id);
      if (isSuccess) toast.success(`Unfollowed @${profileOwner.userName}`);
      else return toast.error(`Something went wrong, try again later`);
    }
    setIsProcessing(false);
    setIsFollowedByYou(!isFollowedByYou);
  };

  return (
    <button
      className="py-2 w-[min(100%,450px)] rounded-md border flex items-start justify-center transition-colors disabled:cursor-not-allowed dark:border-jet dark:hover:bg-neutral-900/50"
      disabled={isProcessing}
      onClick={toggleFollowAccount}
    >
      {isProcessing ? (
        <Loader className="size-5 animate-slow-spin" />
      ) : (
        <span className="text-sm">
          {isFollowedByYou ? "Following" : "Follow"}
        </span>
      )}
    </button>
  );
};

FollowButton.Skeleton = function Skeleton() {
  return (
    <div className="w-[min(100%,450px)] h-10 rounded-md bg-jet animate-pulse"></div>
  );
};
