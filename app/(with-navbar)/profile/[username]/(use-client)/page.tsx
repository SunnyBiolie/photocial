"use client";

import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { getListPostsByAccountId } from "@/action/post/get";
import { getAccountByUserName } from "@/action/account/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { ProfilePostItem } from "@/components/profile/profile-post-item";
import { ImagePlus } from "lucide-react";

interface Props {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: Props) {
  const { listPostsOfCurrentAccount, setListPostsOfCurrentAccount } =
    useProfilePageData();
  const { currentAccount } = useCurrentAccount();

  const [listPosts, setListPosts] = useState<Post[] | null>();

  useEffect(() => {
    if (!currentAccount) return;

    if (currentAccount.userName === params.username) {
      if (listPostsOfCurrentAccount !== undefined) {
        return setListPosts(listPostsOfCurrentAccount);
      }
    }

    const fetch = async () => {
      const profileOwner = await getAccountByUserName(params.username);
      if (!profileOwner) {
        setListPosts([]);
      } else {
        const list = await getListPostsByAccountId(profileOwner.id);
        if (list === undefined) {
          setListPosts([]);
        } else {
          const listReverse = list ? [...list].reverse() : null;
          if (currentAccount.id === profileOwner.id) {
            setListPostsOfCurrentAccount(listReverse);
          }
          setListPosts(listReverse);
        }
      }
    };

    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (!currentAccount) return;

  return (
    <div className="py-2">
      {listPosts === null ? (
        <div className="h-96 flex flex-col items-center justify-center gap-y-6">
          <div className="p-6 rounded-full border border-unselected">
            <ImagePlus strokeWidth={1} className="size-10 text-unselected" />
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-center">
              {currentAccount.userName === params.username
                ? `Nothing to show...yet!`
                : `No Posts Yet.`}
            </p>
            <p className="text-sm font-light text-center">
              {currentAccount.userName === params.username
                ? `When you share photos, they will live here.`
                : ``}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
          {listPosts === undefined ? (
            <>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
              <div className="bg-jet size-full aspect-square animate-pulse"></div>
            </>
          ) : (
            listPosts.map((p) => <ProfilePostItem key={p.id} post={p} />)
          )}
        </div>
      )}
    </div>
  );
}
