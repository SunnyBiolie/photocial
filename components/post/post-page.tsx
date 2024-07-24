"use client";

import { ElementRef, UIEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Comment, Post, Account } from "@prisma/client";
import { countPostLikes } from "@/action/post/get";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import { useAccount } from "@/hooks/use-account";
import { PostHeader } from "@/components/post/post-header";
import { LikeButton } from "./like-button";
import { CommentForm } from "@/components/post/comment-form";
import {
  CommentItem,
  CommentItemSkeleton,
} from "@/components/post/comment-item";
import { ImagesViewer } from "@/components/post/images-viewer";
import { Send } from "lucide-react";
import { ReplyInfo } from "@/types/others";
import { getListCommentsByPostId } from "@/action/comment/get";
import { PostLeftSide } from "./post-left-side";

interface Props {
  post: Post;
}

export const PostPage = ({ post }: Props) => {
  const { account } = useAccount();

  const [postAuthor, setPostAuthor] = useState<Account>();
  const [isLiked, setIsLiked] = useState<boolean>();
  const [likeCounts, setLikeCounts] = useState<number>();

  const [listNewComments, setListNewComments] = useState<Comment[] | null>(
    null
  );
  const [listNewReplies, setListNewReplies] = useState<Comment[]>();
  const [replyInfo, setReplyInfo] = useState<ReplyInfo>();

  useEffect(() => {
    if (account) {
      const fetch = async () => {
        const isLiked = await checkAccountLikedPost(account.id, post.id);
        if (isLiked === undefined) {
          throw new Error("Prisma Error: Fetching isLiked failed");
        }
        const numberOfLikes = await countPostLikes(post.id);
        if (numberOfLikes === undefined) {
          throw new Error("Prisma Error: Fetching numberOfLikes failed");
        }
        const postAuthor = await getAccountByAccountId(post.authorId);
        if (postAuthor === undefined) {
          throw new Error("Prisma Error: Fetching postAuthor failed");
        } else if (postAuthor === null) {
          throw new Error("Couldn't find post's author");
        }

        setIsLiked(isLiked);
        setLikeCounts(numberOfLikes);
        setPostAuthor(postAuthor);
      };
      fetch();
    }
  }, [account, post]);

  if (!account) return;

  return (
    <div className="w-full py-6 flex flex-col items-center">
      <div className="h-[min(80vh,60vw)] max-h-[800px] min-h-[400px] w-[calc(100%-20px)] flex items-center justify-center animate-fade-in">
        <ImagesViewer
          post={post}
          aspectRatio={post.aspectRatio >= 1 ? 1 : post.aspectRatio}
          containerClassName="h-full border animate-fade-in dark:border-neutral-700 z-20"
          imageClassName={cn(post.aspectRatio >= 1 ? "w-full" : "h-full")}
        />
        <PostLeftSide
          account={account}
          post={post}
          postAuthor={postAuthor}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeCounts={likeCounts}
          setLikeCounts={setLikeCounts}
          listNewComments={listNewComments}
          setListNewComments={setListNewComments}
          listNewReplies={listNewReplies}
          setListNewReplies={setListNewReplies}
          replyInfo={replyInfo}
          setReplyInfo={setReplyInfo}
          className="max-w-[400px] min-w-[335px] border border-l-0 border-neutral-700"
        />
      </div>
    </div>
  );
};

PostPage.Skeleton = function PostPageSkeleton({ post }: { post: Post }) {
  return (
    <>
      <div
        className="h-full overflow-hidden dark:bg-jet"
        style={{ aspectRatio: post.aspectRatio }}
      ></div>
      <div className="basis-1/2 max-w-[400px] min-w-[335px] h-full dark:bg-coffee-bean"></div>
    </>
  );
};
