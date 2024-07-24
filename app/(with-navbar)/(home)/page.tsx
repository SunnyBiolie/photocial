"use client";

import { ElementRef, useEffect, useRef } from "react";
import { getListPostsByAccountId } from "@/action/post/get";
import { PostCard } from "@/components/post/post-card";
import { useAccount } from "@/hooks/use-account";
import { useHomeState } from "@/hooks/use-home-state";
import Link from "next/link";

export default function HomePage() {
  const hs = useHomeState();
  const { account } = useAccount();

  const ref = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    if (!account) return;

    if (!hs.data) {
      const fetch = async () => {
        console.log("Initializing...");
        const list = await getListPostsByAccountId(account.id);
        if (list) {
          hs.setData(
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
  }, [account, hs]);

  if (!account || !hs.data) return;

  return (
    <div className="w-[min(100vw-24px,510px)] py-6 mx-auto">
      {/* <div className="flex felx-col">
        <Link href={"/p/clyws4v280003bers1nad9dnm"}>
          clyws4v280003bers1nad9dnm
        </Link>
        <Link href={"/p/clyxyais400017v6x1uec7jnu"}>
          clyxyais400017v6x1uec7jnu
        </Link>
        <Link href={"/p/clyylw17w00059mfzlcnaj8c2"}>
          clyylw17w00059mfzlcnaj8c2
        </Link>
      </div> */}
      {hs.data.map((item, i) => (
        <PostCard
          key={i}
          index={i}
          account={account}
          post={item.post}
          initAuthor={item.author}
          likeStatus={item.likeStatus}
          initLikeCounts={item.likeCounts}
          initCommentCounts={item.commentCounts}
        />
      ))}
      {/* <button
        onClick={() => {
          throw new Error("HOME ERROR");
        }}
      >
        Error
      </button> */}
    </div>
  );
}
