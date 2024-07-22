import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getUserInfoByUserName } from "@/action/user-info/get";
import { countPostsByUserId } from "@/action/post/get";
import { ProfileNavigationBar } from "@/components/profile/profile-navbar";
import { ProfileAvatar } from "@/components/profile/profile-avatar";

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
  const profileOwner = await getUserInfoByUserName(params.username);

  if (profileOwner === undefined)
    throw new Error(
      `Some thing went wrong when fetching userInfo with username: "${params.username}"`
    );

  if (profileOwner === null) return notFound();

  const numberOfPosts = await countPostsByUserId(profileOwner.id);

  const isUserProfile = true;

  return (
    <div className="w-[calc(100vw-24px)] md:px-0 md:w-[calc(100vw-(var(--app-navbar-vertical-width)*2))]">
      <div className="mx-2 py-10 flex flex-col items-center justify-center gap-y-4 md:w-[min(100%,450px)] md:mx-auto">
        <ProfileAvatar profileOwner={profileOwner} />
        <div>
          <p className="text-xl font-semibold">{profileOwner.userName}</p>
        </div>
        <div className="space-x-10">
          <span>
            <span className="font-medium">{numberOfPosts}</span> posts
          </span>
          <span>
            <span className="font-medium">{profileOwner.followes.length}</span>{" "}
            followers
          </span>
          <span>
            <span className="font-medium">
              {profileOwner.followings.length}
            </span>{" "}
            following
          </span>
        </div>
        <div className="w-full my-2 text-center">
          {isUserProfile ? (
            <button className="py-1 w-[min(100%,450px)] rounded-md border border-jet hover:bg-neutral-900/50 transition-colors">
              <span className="text-sm">Edit profile</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="max-w-[916px] mx-2 md:mx-auto">
        <ProfileNavigationBar userName={profileOwner.userName} />
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
