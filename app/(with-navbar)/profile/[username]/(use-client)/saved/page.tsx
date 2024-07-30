"use client";

import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { getListPostsSavedByUserName } from "@/action/post/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { ProfilePostItem } from "@/components/profile/profile-post-item";

interface Props {
  params: { username: string };
}

export default function ProfileSavedPage({ params }: Props) {
  const { currentAccount } = useCurrentAccount();
  const { listSavedPostsOfCurrentAccount, setListSavedPostsOfCurrentAccount } =
    useProfilePageData();

  const [listSavedPosts, setListSavedPosts] = useState<Post[] | null>();

  useEffect(() => {
    if (!currentAccount) return;

    if (isBelongstoCurrentAccount) {
      if (listSavedPostsOfCurrentAccount !== undefined) {
        return setListSavedPosts(listSavedPostsOfCurrentAccount);
      }
    }

    const fetch = async () => {
      const list = await getListPostsSavedByUserName(params.username);
      if (list === undefined) {
        setListSavedPosts([]);
      } else {
        if (isBelongstoCurrentAccount) {
          setListSavedPostsOfCurrentAccount(list);
        }
        setListSavedPosts(list);
      }
    };
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentAccount) return;

  const isBelongstoCurrentAccount = currentAccount.userName === params.username;

  return (
    <div className="py-2">
      {listSavedPosts === null ? (
        <div className="h-96 flex flex-col items-center justify-center gap-y-6">
          <div className="space-y-4">
            <p className="text-3xl font-bold text-center">
              {isBelongstoCurrentAccount ? `Nothing to show!` : `No Posts Yet.`}
            </p>
            <p className="text-sm font-light text-center">
              {isBelongstoCurrentAccount
                ? `When you save posts, they will appear here.`
                : `@${params.username} saved no posts.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
          {listSavedPosts === undefined ? (
            <>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
            </>
          ) : (
            listSavedPosts
              .toReversed()
              .map((p) => <ProfilePostItem key={p.id} post={p} />)
          )}
        </div>
      )}
    </div>
  );
}
