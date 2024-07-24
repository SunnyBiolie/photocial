"use client";

import {
  Dispatch,
  ElementRef,
  SetStateAction,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ReplyInfo } from "@/types/others";
import { Account, Comment, Post } from "@prisma/client";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import { countPostLikes } from "@/action/post/get";
import { CommentContainer } from "./comment-container";
import { PostCaption } from "./post-caption";
import { PostHeader, PostHeaderSkeleton } from "./post-header";
import { LikeButton } from "./like-button";
import { CommentForm } from "./comment-form";
import { Send } from "lucide-react";

interface Props {
  account: Account;
  post: Post;
  postAuthor: Account | undefined;
  isLiked: boolean | undefined;
  setIsLiked: Dispatch<SetStateAction<boolean | undefined>>;
  likeCounts: number | undefined;
  setLikeCounts: Dispatch<SetStateAction<number | undefined>>;
  listNewComments: Comment[] | null;
  setListNewComments: Dispatch<SetStateAction<Comment[] | null>>;
  listNewReplies: Comment[] | undefined;
  setListNewReplies: Dispatch<SetStateAction<Comment[] | undefined>>;
  replyInfo: ReplyInfo | undefined;
  setReplyInfo: Dispatch<SetStateAction<ReplyInfo | undefined>>;
  className?: string;
}

export const PostLeftSide = ({
  account,
  post,
  postAuthor,
  isLiked,
  setIsLiked,
  likeCounts,
  setLikeCounts,
  listNewComments,
  setListNewComments,
  listNewReplies,
  setListNewReplies,
  replyInfo,
  setReplyInfo,
  className,
}: Props) => {
  const headerRef = useRef<ElementRef<"div">>(null);
  const captionRef = useRef<ElementRef<"div">>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLiked !== undefined && likeCounts !== undefined && postAuthor) {
      setIsLoading(false);
    }
  }, [isLiked, likeCounts, postAuthor]);

  const handleScrollCommentContainer = (
    e: UIEvent<HTMLDivElement, globalThis.UIEvent>
  ) => {
    const headerTarget = headerRef.current;
    const captionTarget = captionRef.current;
    if (headerTarget && captionTarget) {
      if (
        e.currentTarget.scrollTop >=
        captionTarget.parentElement!.getBoundingClientRect().height
      ) {
        headerTarget.style.borderBottom = "1px solid rgba(38, 38, 38, 1)";
      } else {
        headerTarget.style.borderBottom = "none";
      }
    }
  };

  return (
    <div
      className={cn(
        "basis-1/2 h-full flex flex-col text-sm dark:bg-black-chocolate",
        className
      )}
    >
      <div
        ref={headerRef}
        className={cn(
          "shrink-0 px-4 py-3",
          !post.caption && "border-b border-neutral-700"
        )}
      >
        <PostHeader author={postAuthor} post={post} />
      </div>
      <div
        className="flex-1 flex flex-col px-4 py-2 overflow-auto"
        onScroll={handleScrollCommentContainer}
      >
        {!isLoading && <PostCaption post={post} captionRef={captionRef} />}
        <CommentContainer
          thisAccount={account}
          post={post}
          listNewComments={listNewComments}
          listNewReplies={listNewReplies}
          setReplyInfo={setReplyInfo}
          isLoading={isLoading}
        />
      </div>
      {isLoading ? (
        <BottomSkeleton />
      ) : (
        <div className="shrink-0 px-4 py-2 border-t border-neutral-700">
          <div className="flex items-center justify-between">
            <span>
              {likeCounts === 0 ? (
                <span className="text-neutral-400">
                  Be the first to like this
                </span>
              ) : (
                <span className="font-semibold select-none">
                  {likeCounts === 1 ? "1 like" : `${likeCounts} likes`}
                </span>
              )}
            </span>
            <div className="flex -ml-2">
              <LikeButton
                isLiked={isLiked!}
                setIsLiked={setIsLiked}
                setLikeCounts={setLikeCounts}
                userId={account.id}
                postId={post.id}
              />
              <div className="p-2 hover:opacity-60 transition-opacity">
                <Send
                  width={26}
                  height={26}
                  aria-label="Share"
                  className="rotate-[12deg]"
                >
                  <title>Share</title>
                </Send>
              </div>
            </div>
          </div>
          <CommentForm
            postId={post.id}
            setListNewComments={setListNewComments}
            setListNewReplies={setListNewReplies}
            replyInfo={replyInfo}
            setReplyInfo={setReplyInfo}
          />
        </div>
      )}
    </div>
  );
};

const BottomSkeleton = () => {
  return (
    <div className="shrink-0 p-4 border-t border-neutral-700 flex flex-col gap-y-3 animate-pulse">
      <div className="w-full flex items-center justify-between">
        <div className="w-24 h-6 bg-jet rounded-md"></div>
        <div className="w-24 h-6 bg-jet rounded-md"></div>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="shrink-0 size-8 rounded-full bg-jet"></div>
        <div className="w-full flex items-center justify-between gap-x-4">
          <div className="flex-1 h-6 bg-jet rounded-md"></div>
          <div className="w-12 h-6 bg-jet rounded-md"></div>
        </div>
      </div>
    </div>
  );
};
