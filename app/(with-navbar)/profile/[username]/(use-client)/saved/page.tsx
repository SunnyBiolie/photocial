"use client";

import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { getListPostsSavedByUserName } from "@/action/post/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { ProfilePostItem } from "@/components/profile/profile-post-item";
import { Loading } from "@/components/others/loading";
import { ErrorMessage } from "@/components/others/error-message";

interface Props {
  params: { username: string };
}

export default function ProfileSavedPage({ params }: Props) {
  const { currentAccount } = useCurrentAccount();
  const {
    listSavedPostsOfCurrentAccount,
    setListSavedPostsOfCurrentAccount,
    scrollTop,
  } = useProfilePageData();

  const [listSavedPosts, setListSavedPosts] = useState<Post[] | null>();

  const [isError, setIsError] = useState<boolean>(false);

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
        setIsError(true);
      } else {
        const listReverse = list ? [...list].reverse() : null;
        if (isBelongstoCurrentAccount) {
          setListSavedPostsOfCurrentAccount(listReverse);
        }
        setListSavedPosts(listReverse);
      }
    };
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listSavedPosts !== undefined) window.scrollTo({ top: scrollTop });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSavedPosts]);

  if (!currentAccount) return;

  const isBelongstoCurrentAccount = currentAccount.userName === params.username;

  if (isError) return <ErrorMessage className="py-10" />;

  return (
    <div className="py-2">
      {listSavedPosts === undefined ? (
        <Loading className="py-8" />
      ) : listSavedPosts === null ? (
        <div className="h-80 flex flex-col items-center justify-center gap-y-6">
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
          {listSavedPosts.map((p) => (
            <ProfilePostItem key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
