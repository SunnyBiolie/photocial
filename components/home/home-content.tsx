"use client";

import { useEffect, useState } from "react";
import { PostCard } from "../post/post-card";
import { useHomePageData } from "@/hooks/use-home-state";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { getListFollowingIdByAccountId } from "@/action/follows/get";
import { getListPostsByListFollowingId } from "@/action/post/get";
import { ErrorMessage } from "../others/error-message";
import { Loading } from "../others/loading";
import Link from "next/link";

export const HomeContent = () => {
  const { postCards, setPostCards } = useHomePageData();
  const { currentAccount } = useCurrentAccount();

  const [listFollowingId, setListFollowingId] = useState<string[] | null>();
  const [isError, setIsError] = useState(false);

  // Kiểm tra có follow tài khoản nào không
  useEffect(() => {
    if (currentAccount && postCards === undefined) {
      const fetch = async () => {
        const list = await getListFollowingIdByAccountId(currentAccount.id);
        if (list === undefined) {
          setIsError(true);
          setPostCards(undefined);
        } else if (list === null) {
          setPostCards(null);
        } else {
          setListFollowingId(list);
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postCards]);

  // Kiểm tra tài khoản được follow có bài viết hay không
  useEffect(() => {
    if (listFollowingId) {
      const fetch = async () => {
        const list = await getListPostsByListFollowingId(listFollowingId);
        if (list === undefined) {
          setIsError(true);
          setPostCards(undefined);
        } else if (list === null) {
          setPostCards(null);
        } else {
          setPostCards(
            list.map((p) => {
              return {
                post: p,
              };
            })
          );
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFollowingId]);

  if (!currentAccount) return;

  if (isError) return <ErrorMessage className="py-12" />;

  return (
    <div>
      {postCards === undefined ? (
        <Loading className="py-12" />
      ) : postCards === null ? (
        <div className="py-10 text-center space-y-4 dark:text-neutral-300">
          <h6 className="text-xl font-bold">No posts to show.</h6>
          <p className="text-sm">
            <Link href={"/search"} className="underline">
              Follow more people
            </Link>{" "}
            to see more content.
          </p>
        </div>
      ) : (
        postCards.map((item, i) => (
          <PostCard
            key={i}
            index={i}
            account={currentAccount}
            post={item.post}
            initAuthor={item.author}
            likeStatus={item.likeStatus}
            initLikeCounts={item.likeCounts}
            initCommentCounts={item.commentCounts}
          />
        ))
      )}
    </div>
  );
};
