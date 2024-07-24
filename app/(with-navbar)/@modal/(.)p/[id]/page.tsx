"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Account, Comment, Post } from "@prisma/client";
import { cn } from "@/lib/utils";
import { countPostLikes, getPostByPostId } from "@/action/post/get";
import { useAccount } from "@/hooks/use-account";
import { useBreakpoint } from "@/hooks/use-breakppoint";
import { ImagesViewer } from "@/components/post/images-viewer";
import { PostLeftSide } from "@/components/post/post-left-side";
import { PostNotFoundModal } from "@/components/post/post-not-found-modal";
import { LoaderPinwheel, Send } from "lucide-react";
import { PostHeader } from "@/components/post/post-header";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import { LikeButton } from "@/components/post/like-button";
import { CommentForm } from "@/components/post/comment-form";
import { ReplyInfo } from "@/types/others";

interface Props {
  params: { id: string };
}

export default function PostModal({ params }: Props) {
  const router = useRouter();
  const { isMedium } = useBreakpoint();
  const { account } = useAccount();

  const [post, setPost] = useState<Post | null>();
  const [postAuthor, setPostAuthor] = useState<Account>();
  const [isLiked, setIsLiked] = useState<boolean>();
  const [likeCounts, setLikeCounts] = useState<number>();

  const [listNewComments, setListNewComments] = useState<Comment[] | null>(
    null
  );
  const [listNewReplies, setListNewReplies] = useState<Comment[]>();
  const [replyInfo, setReplyInfo] = useState<ReplyInfo>();

  useEffect(() => {
    const fetch = async () => {
      const postFetched = await getPostByPostId(params.id);
      if (postFetched === undefined) {
        throw new Error(`Prisma error: getPostByPostId(${params.id}) `);
      }

      setPost(postFetched);
    };
    fetch();
  }, [params.id]);

  useEffect(() => {
    if (account && post) {
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
  if (post === undefined)
    return (
      <div className="fixed top-0 left-0 size-full bg-neutral-900/75 z-50 flex items-center justify-center">
        <LoaderPinwheel
          strokeWidth={1.5}
          className="size-10 animate-slow-spin"
        />
      </div>
    );
  else if (post === null) return <PostNotFoundModal />;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="fixed top-0 left-0 size-full z-50">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-900/75"
        onClick={handleBack}
      ></div>
      {/* {isMedium ? ( */}
      <div className="h-[min(90vh,60vw)] max-h-[800px] min-h-[400px] w-[calc(100%-20px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex hidden">
        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          onClick={handleBack}
        ></div>
        <ImagesViewer
          post={post}
          aspectRatio={post.aspectRatio >= 1 ? 1 : post.aspectRatio}
          containerClassName="h-full min-w-[300px] border-r border-neutral-700 z-20"
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
          className="max-w-[475px] min-w-[335px] z-10"
        />
      </div>
      {/* ) : ( */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm md:hidden block">
        <div className="px-2 py-3">
          <PostHeader post={post} author={postAuthor} />
        </div>
        <div
          className={cn(
            "bg-black-chocolate",
            post.aspectRatio === 1
              ? "w-[335px]"
              : post.aspectRatio > 1
              ? "w-[min(100vw-16px,435px)]"
              : "h-[min(80vh,400px)]"
          )}
          style={{ aspectRatio: post.aspectRatio }}
        >
          <ImagesViewer
            post={post}
            aspectRatio={post.aspectRatio}
            containerClassName="h-full min-w-[300px]"
            imageClassName={cn(post.aspectRatio >= 1 ? "w-full" : "h-full")}
          />
        </div>
        <div className="shrink-0 px-4 py-2 border-t darkborder-neutral-700 dark:bg-black-chocolate">
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
      </div>
      {/* )} */}
    </div>
  );
}
