"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Account, Comment, Post } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ReplyInfo } from "@/types/others";
import { countPostLikes, getPostByPostId } from "@/action/post/get";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useBreakpoint } from "@/hooks/use-breakppoint";
import { ImagesViewer } from "@/components/post/images-viewer";
import {
  BottomSkeleton,
  PostRightSide,
} from "@/components/post/post-right-side";
import { PostHeader, PostHeaderSkeleton } from "@/components/post/post-header";

import { LikeButton } from "@/components/post/like-button";
import { CommentForm } from "@/components/post/comment-form";
import { Loading } from "@/components/others/loading";
import { ButtonCloseFullView } from "@/components/others/btn-close-full-view";
import { Send } from "lucide-react";

interface Props {
  params: { id: string };
}

export default function PostModal({ params }: Props) {
  const router = useRouter();
  const { isMedium } = useBreakpoint();
  const { currentAccount } = useCurrentAccount();

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
    if (currentAccount && post) {
      const fetch = async () => {
        const isLiked = await checkAccountLikedPost(currentAccount.id, post.id);
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
  }, [currentAccount, post]);

  if (!currentAccount) return;

  const handleBack = () => {
    router.back();
  };

  if (post === undefined)
    return (
      <div
        className="fixed top-0 left-0 size-full bg-neutral-900/75 z-50 flex items-center justify-center"
        onClick={handleBack}
      >
        <Loading />
      </div>
    );
  else if (post === null) return <PostModal.NotFound handleBack={handleBack} />;

  if (
    postAuthor === undefined ||
    likeCounts === undefined ||
    isLiked === undefined
  )
    return <PostModal.Skeleton post={post} handleBack={handleBack} />;

  return (
    <div className="fixed top-0 left-0 size-full z-50">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-900/75"
        onClick={handleBack}
      ></div>
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
        <PostRightSide
          account={currentAccount}
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
          inModal={true}
          className="max-w-[475px] min-w-[335px] z-10"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm md:hidden block">
        <div className="px-2 py-3">
          <PostHeader post={post} author={postAuthor} inModal={true} />
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
                userId={currentAccount.id}
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
    </div>
  );
}

interface NotFoundProps {
  handleBack: () => void;
}

PostModal.NotFound = function NotFound({ handleBack }: NotFoundProps) {
  return (
    <div className="fixed top-0 left-0 size-full z-10">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-900/75"
        onClick={handleBack}
      >
        <ButtonCloseFullView />
      </div>
      <div className="w-[min(100%,350px)] p-6 rounded-lg shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 text-center dark:bg-coffee-bean">
        <h2 className="text-lg font-bold">
          Sorry, this post isn&#39;t available.
        </h2>
        <p className="text-sm dark:text-neutral-400">
          The link you followed may be broken, or the page may have been
          removed.
        </p>
        <div
          className="w-fit px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer dark:bg-normal dark:text-coffee-bean"
          onClick={handleBack}
        >
          Back
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  post: Post;
  handleBack: () => void;
}

PostModal.Skeleton = function Skeleton({ post, handleBack }: SkeletonProps) {
  return (
    <div className="fixed top-0 left-0 size-full z-50">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-900/75"
        onClick={handleBack}
      ></div>
      <div className="h-[min(90vh,60vw)] max-h-[800px] min-h-[400px] w-[calc(100%-20px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex hidden animate-fade-in">
        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          onClick={handleBack}
        ></div>
        <div
          className="shrink-0 h-full min-w-[300px] dark:bg-coffee-bean  "
          style={{
            aspectRatio: post.aspectRatio >= 1 ? 1 : post.aspectRatio,
          }}
        ></div>
        <div className="basis-1/2 h-full max-w-[475px] min-w-[335px] flex flex-col dark:bg-jet" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden block animate-fade-in">
        <div className="px-2 py-3">
          <PostHeaderSkeleton />
        </div>
        <div
          className={cn(
            "min-w-[300px] bg-coffee-bean",
            post.aspectRatio === 1
              ? "w-[335px]"
              : post.aspectRatio > 1
              ? "w-[min(100vw-16px,435px)]"
              : "h-[min(80vh,400px)]"
          )}
          style={{ aspectRatio: post.aspectRatio }}
        ></div>
        <BottomSkeleton />
      </div>
    </div>
  );
};
