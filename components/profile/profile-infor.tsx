"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { ProfileAvatar } from "./profile-avatar";
import { useAccount } from "@/hooks/use-account";
import { FollowButton } from "./follow-button";
import { EditProfileButton } from "./edit-button";
import { FollowsButton } from "./follows-button";

interface Props {
  profileOwner: Account;
  numberOfPosts: number;
  numberOfFollowers: number;
  numberOfFollowing: number;
}

export const ProfileInfor = ({
  profileOwner,
  numberOfPosts,
  numberOfFollowers,
  numberOfFollowing,
}: Props) => {
  const { account } = useAccount();

  const [isYourProfile, setIsYourProfile] = useState<boolean>();

  useEffect(() => {
    if (account) {
      if (account.id === profileOwner.id) setIsYourProfile(true);
      else setIsYourProfile(false);
    }
  }, [account, profileOwner]);

  return (
    <div className="mx-2 py-10 flex flex-col items-center justify-center gap-y-4 md:w-[min(100%,450px)] md:mx-auto">
      <ProfileAvatar profileOwner={profileOwner} />
      <div>
        <p className="text-xl font-semibold">{profileOwner.userName}</p>
      </div>
      <div className="flex gap-x-10">
        <span>
          <span className="font-medium">{numberOfPosts}</span> posts
        </span>
        <FollowsButton
          profileOwner={profileOwner}
          type="followers"
          counts={numberOfFollowers}
        />
        <FollowsButton
          profileOwner={profileOwner}
          type="following"
          counts={numberOfFollowing}
        />
      </div>
      <div className="w-full my-2 text-center">
        {isYourProfile !== undefined && account ? (
          isYourProfile ? (
            <EditProfileButton yourAccount={account} />
          ) : (
            <FollowButton yourId={account.id} profileOwner={profileOwner} />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
