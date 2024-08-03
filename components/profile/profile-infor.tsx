"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { countPostsByUserId } from "@/action/post/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import {
  checkAccountFollowdByCurrentAccount,
  countFollowers,
  countFollowing,
} from "@/action/follows/get";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { FollowButton } from "../others/follow-button";
import { AccountAvatar } from "../others/account-avatar";
import { EditProfileButton } from "./edit-button";
import { FollowsButton } from "./follows-button";
import { ErrorMessage } from "../others/error-message";

interface Props {
  profileOwner: Account;
  isYourProfile: boolean;
}

export const ProfileInfor = ({ profileOwner, isYourProfile }: Props) => {
  const { currentAccountNumberOf, setCurrentAccountNumberOf } =
    useProfilePageData();

  const { currentAccount } = useCurrentAccount();

  const [numberOf, setNumberOf] = useState<{
    posts: number;
    followers: number;
    following: number;
  } | null>();
  const [isFollowedByCurrentAccount, setIsFollowedByCurrentAccount] =
    useState<boolean>();

  useEffect(() => {
    if (isYourProfile) {
      if (currentAccountNumberOf) return setNumberOf(currentAccountNumberOf);
    }
    const fetch = async () => {
      const [posts, followers, following] = await Promise.all([
        countPostsByUserId(profileOwner.id),
        countFollowers(profileOwner.id),
        countFollowing(profileOwner.id),
      ]);

      if (
        posts === undefined ||
        followers === undefined ||
        following === undefined
      ) {
        setNumberOf(null);
      } else {
        const obj = {
          posts: posts ? posts : 0,
          followers: followers ? followers : 0,
          following: following ? following : 0,
        };
        if (isYourProfile) setCurrentAccountNumberOf(obj);
        setNumberOf(obj);
      }
    };
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentAccount || isYourProfile) return;

    const fetch = async () => {
      const isFollowed = await checkAccountFollowdByCurrentAccount(
        currentAccount.id,
        profileOwner.id
      );
      setIsFollowedByCurrentAccount(isFollowed);
    };
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  if (!currentAccount) return;

  if (
    numberOf === undefined ||
    (!isYourProfile && isFollowedByCurrentAccount === undefined)
  )
    return <ProfileInforSkeleton />;
  if (numberOf === null) return <ErrorMessage />;

  return (
    <div className="mx-2 py-10 flex flex-col items-center justify-center gap-y-4 md:w-[min(100%,450px)] md:mx-auto">
      <AccountAvatar account={profileOwner} sizes="256px" className="size-32" />
      <div>
        <p className="text-xl font-semibold">{profileOwner.userName}</p>
      </div>
      <div className="flex gap-x-10">
        <span>
          <span className="font-medium">{numberOf.posts}</span> posts
        </span>
        <FollowsButton
          currentAccountId={currentAccount.id}
          profileOwner={profileOwner}
          isYourProfile={isYourProfile}
          type="followers"
          counts={numberOf.followers}
        />
        <FollowsButton
          currentAccountId={currentAccount.id}
          profileOwner={profileOwner}
          isYourProfile={isYourProfile}
          type="following"
          counts={numberOf.following}
        />
      </div>
      <div className="w-full my-2 text-center">
        {isYourProfile ? (
          <EditProfileButton currentAccount={currentAccount} />
        ) : (
          <FollowButton
            currentAccountId={currentAccount.id}
            targetAccount={profileOwner}
            isFollowedByCurrentAccount={isFollowedByCurrentAccount!}
          />
        )}
      </div>
    </div>
  );
};

export const ProfileInforSkeleton = () => {
  return (
    <div className="mx-2 py-10 flex flex-col items-center justify-center gap-y-4 md:w-[min(100%,450px)] md:mx-auto animate-pulse">
      <div className="size-32 rounded-full dark:bg-jet"></div>
      <div className="w-32 h-7 rounded-md dark:bg-jet"></div>
      <div className="flex gap-x-10">
        <div className="w-20 h-6 rounded-md dark:bg-jet"></div>
        <div className="w-20 h-6 rounded-md dark:bg-jet"></div>
        <div className="w-20 h-6 rounded-md dark:bg-jet"></div>
      </div>
      <div className="w-full h-10 my-2 rounded-md dark:bg-jet"></div>
    </div>
  );
};
