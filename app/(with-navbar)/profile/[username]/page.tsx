"use client";

import { act, useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { getListPostsByAccountId } from "@/action/post/get";
import { getAccountByUserName } from "@/action/account/get";
import { useAccount } from "@/hooks/use-account";
import { ProfilePostItem } from "@/components/profile/profile-post-item";
import { ImagePlus, Loader } from "lucide-react";

interface Props {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: Props) {
  const { account } = useAccount();

  const [listPosts, setListPosts] = useState<Post[] | null>();

  useEffect(() => {
    const fetch = async () => {
      const account = await getAccountByUserName(params.username);
      if (account) {
        const list = await getListPostsByAccountId(account.id);
        setListPosts(list);
      }
    };
    fetch();
  }, [params]);

  if (!account) return;

  if (listPosts === undefined)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loader className="size-6 animate-slow-spin" />
      </div>
    );

  return (
    <div className="py-2">
      {listPosts === null ? (
        <div className="h-96 flex flex-col items-center justify-center gap-y-6">
          <div className="p-6 rounded-full border border-unselected">
            <ImagePlus strokeWidth={1} className="size-10 text-unselected" />
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-center">
              {account.userName === params.username
                ? `Nothing to show...yet!`
                : `No Posts Yet.`}
            </p>
            <p className="text-sm font-light text-center">
              {account.userName === params.username
                ? `When you share photos, they will live here.`
                : ``}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {listPosts.toReversed().map((p) => (
            <ProfilePostItem key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
