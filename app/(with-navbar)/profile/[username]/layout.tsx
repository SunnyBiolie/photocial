import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAccountByUserName } from "@/action/account/get";
import { countPostsByUserId } from "@/action/post/get";
import { ProfileNavigationBar } from "@/components/profile/profile-navbar";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileInfor } from "@/components/profile/profile-infor";
import { countFollowers, countFollowing } from "@/action/follows/get";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  return {
    title: `@${params.username} on Photocial`,
    description: `@${params.username}'s profile`,
  };
}

interface Props {
  params: {
    username: string;
  };
  children: React.ReactNode;
}

export default async function ProfileLayout({ params, children }: Props) {
  const profileOwner = await getAccountByUserName(params.username);

  if (profileOwner === undefined)
    throw new Error(
      `Some thing went wrong when fetching account with username: "${params.username}"`
    );

  if (profileOwner === null) return notFound();

  const numberOfPosts = await countPostsByUserId(profileOwner.id);
  const numberOfFollowers = await countFollowers(profileOwner.id);
  const numberOfFollowing = await countFollowing(profileOwner.id);

  return (
    <div className="w-[calc(100vw-24px)] md:px-0 md:w-full">
      <ProfileInfor
        profileOwner={profileOwner}
        numberOfPosts={numberOfPosts}
        numberOfFollowers={numberOfFollowers}
        numberOfFollowing={numberOfFollowing}
      />
      <div className="max-w-[916px] mx-2 md:mx-auto">
        <ProfileNavigationBar userName={profileOwner.userName} />
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
