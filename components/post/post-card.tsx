"use client";

import { useEffect, useState } from "react";
import { Post, Account } from "@prisma/client";
import { countPostComments } from "@/action/comment/get";

import { MessageSquareText, Send } from "lucide-react";
import { LikeButton } from "./like-button";
import { FaComments } from "react-icons/fa6";

import { useHomePageData } from "@/hooks/use-home-state";
import { CommentButton } from "./comment-button";
import { PostHeader, PostHeaderSkeleton } from "./post-header";
import { ImagesViewer } from "./images-viewer";
import { countPostLikes } from "@/action/post/get";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import Link from "next/link";

interface PostCardProps {
  index: number;
  account: Account;
  post: Post;
  initAuthor: Account | undefined;
  likeStatus: boolean | undefined;
  initLikeCounts: number | undefined;
  initCommentCounts: number | undefined;
}

export const PostCard = ({
  index,
  account,
  post,
  initAuthor,
  likeStatus,
  initLikeCounts,
  initCommentCounts,
}: PostCardProps) => {
  const { postCards, setPostCards } = useHomePageData();

  const [captionDisplay, setCaptionDisplay] = useState("");
  const [isShowFullCaption, setIsShowFullCaption] = useState<boolean>(true);

  const [author, setAuthor] = useState<Account | undefined>(initAuthor);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(likeStatus);
  const [likeCounts, setLikeCounts] = useState<number | undefined>(
    initLikeCounts
  );
  const [commentCounts, setCommentCounts] = useState<number | undefined>(
    initCommentCounts
  );
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Xử lý ẩn bớt caption nếu quá dài
    const handleCaption = () => {
      const captionValue = post.caption;
      if (captionValue) {
        let count = 0;
        let temp: string = "";
        for (let i = 0; i < Math.min(captionValue.length, 100); i++) {
          if (captionValue.charCodeAt(i) === 10) {
            count += 1;
          }
          temp += captionValue[i];
          if (count >= 2) break;
        }

        setCaptionDisplay(temp);
        if (temp === captionValue) setIsShowFullCaption(true);
        else setIsShowFullCaption(false);
      }
    };
    handleCaption();

    const initData = async () => {
      if (!postCards) return setIsError(true);

      if (author === undefined) {
        const acc = await getAccountByAccountId(post.authorId);
        if (acc) {
          setAuthor(acc);
          postCards[index].author = acc;
          setPostCards(postCards);
        } else {
          return setIsError(true);
        }
      }

      if (isLiked === undefined) {
        const result = await checkAccountLikedPost(account.id, post.id);
        if (result !== undefined) {
          setIsLiked(result);
          postCards[index].likeStatus = result;
          setPostCards(postCards);
        } else {
          return setIsError(true);
        }
      }

      if (likeCounts === undefined) {
        const likes = await countPostLikes(post.id);
        if (likes !== undefined) {
          setLikeCounts(likes);
          postCards[index].likeCounts = likes;
          setPostCards(postCards);
        } else {
          return setIsError(true);
        }
      }

      if (commentCounts === undefined) {
        const cmtQuantity = await countPostComments(post.id);
        if (cmtQuantity !== undefined) {
          setCommentCounts(cmtQuantity);
          postCards[index].commentCounts = cmtQuantity;
          setPostCards(postCards);
        } else {
          return setIsError(true);
        }
      }
    };
    initData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFullCaption = () => {
    if (post.caption) {
      setIsShowFullCaption(true);
      setCaptionDisplay(post.caption);
    }
  };

  if (isError) return;

  if (
    author === undefined ||
    isLiked === undefined ||
    likeCounts === undefined ||
    commentCounts === undefined
  )
    return <PostCard.Skeleton post={post} />;

  return (
    <div className="w-full py-4 px-5 bg-coffee-bean rounded-md text-sm mb-4 shadow-md">
      <PostHeader author={author} post={post} inModal={false} isInCard />
      <div className="mt-3">
        <ImagesViewer
          post={post}
          aspectRatio={post.aspectRatio <= 4 / 5 ? 4 / 5 : post.aspectRatio}
          containerClassName="w-full border rounded-sm overflow-hidden dark:border-neutral-700"
          imageClassName="size-full"
        />
        <div className="mt-1.5 -ml-2 flex">
          <LikeButton
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            userId={account.id}
            postId={post.id}
            setLikeCounts={setLikeCounts}
          />
          <CommentButton post={post} />
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
        <div className="flex items-center justify-between select-none">
          {likeCounts === 0 ? (
            <span className="text-neutral-400">Be the first to like this</span>
          ) : (
            <span className="font-semibold select-none">
              {likeCounts === 1 ? "1 like" : `${likeCounts} likes`}
            </span>
          )}
          <Link
            href={`/p/${post.id}`}
            className="flex items-center gap-x-1 px-1 cursor-pointer opacity-60 hover:opacity-100"
          >
            <span>{commentCounts}</span>
            <div className="p-0.5">
              <MessageSquareText className="size-4" />
              {/* <FaComments /> */}
            </div>
          </Link>
        </div>
        {post.caption && (
          <div className="mt-2">
            <span className="font-semibold inline-block">
              {author.userName}&nbsp;&nbsp;
            </span>
            <div className="inline hyphens-auto whitespace-pre-line">
              {captionDisplay}
            </div>
            {!isShowFullCaption && (
              <span
                className="text-xs font-semibold cursor-pointer"
                onClick={handleShowFullCaption}
              >
                ...more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SkeletonProps {
  post: Post;
}

PostCard.Skeleton = function Skeleton({ post }: SkeletonProps) {
  return (
    <div className="w-full py-4 px-5 mb-4 bg-coffee-bean rounded-md shadow-md">
      <PostHeaderSkeleton />
      <div
        className="mt-3 w-full rounded-sm bg-jet animate-pulse"
        style={{
          aspectRatio: post.aspectRatio <= 4 / 5 ? 4 / 5 : post.aspectRatio,
        }}
      />
      <div className="mt-2 w-32 h-10 rounded-sm bg-jet animate-pulse" />
      <div className="flex justify-between">
        <div className="mt-2 h-5 w-12 rounded-sm bg-jet animate-pulse" />
        <div className="mt-2 h-5 w-12 rounded-sm bg-jet animate-pulse" />
      </div>
    </div>
  );
};
