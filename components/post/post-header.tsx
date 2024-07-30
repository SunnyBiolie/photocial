"use client";

import { Post, Account } from "@prisma/client";
import { cn, transformTime } from "@/lib/utils";
import { AccountAvatar } from "../others/account-avatar";
import { PostMoreOptions } from "./post-more-options";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";

interface Props {
  post: Post;
  author: Account | undefined;
  inModal: boolean;
  isInCard?: boolean;
  className?: string;
}

export const PostHeader = ({
  post,
  author,
  inModal,
  isInCard,
  className,
}: Props) => {
  if (!author) return <PostHeaderSkeleton />;

  return (
    <div className={cn("w-full flex items-center", className)}>
      <AccountAvatar account={author} sizes="64px" className="size-8 mr-3" />
      <div className="flex-1 flex items-center justify-between">
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-center gap-x-1">
            <Link href={`/@${author.userName}`} className="font-semibold">
              {author.userName}
            </Link>
            {isInCard && (
              <>
                <GoDotFill className="size-2 opacity-75" />
                <p className="opacity-75">
                  {transformTime(Date.now() - post.createdAt.getTime())}
                </p>
              </>
            )}
          </div>
          {!isInCard && (
            <div className="">
              <p className="text-xs opacity-75">
                {post.createdAt.toLocaleDateString("en-EN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
        <PostMoreOptions post={post} inModal={inModal} />
      </div>
    </div>
  );
};

export function PostHeaderSkeleton() {
  return (
    <div className="flex items-center animate-pulse">
      <div className="size-8 rounded-full mr-3 bg-jet" />
      <div className="flex-1 flex flex-col justify-between h-9">
        <div className="w-full max-w-36 min-w-20 h-4 bg-jet rounded-md" />
        <div className="w-full max-w-28 min-w-16 h-3.5 bg-jet rounded-md" />
      </div>
    </div>
  );
}
