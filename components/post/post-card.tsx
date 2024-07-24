"use client";

import { useEffect, useState } from "react";
import { Post, Account } from "@prisma/client";
import { countPostComments } from "@/action/comment/get";

import { Send } from "lucide-react";
import { LikeButton } from "./like-button";
import { FaComments } from "react-icons/fa6";

import { useHomeState } from "@/hooks/use-home-state";
import { CommentButton } from "./comment-button";
import { PostHeader } from "./post-header";
import { ImagesViewer } from "./images-viewer";
import { countPostLikes } from "@/action/post/get";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";

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
  const hs = useHomeState();

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
      if (!hs.data) throw new Error("hs.data is undefined!");

      if (author === undefined) {
        const account = await getAccountByAccountId(post.authorId);
        if (account === undefined)
          throw new Error(
            `Prisma error: getAccountByAccountId("${post.authorId}")`
          );
        else if (account === null)
          throw new Error(`
          Couldn't find account with id ${post.authorId}
          `);
        else setAuthor(account);
      }

      if (isLiked === undefined) {
        // Hiển thị trạng thái ban đầu nút like (duy nhất lần chạy đầu)
        const result = await checkAccountLikedPost(account.id, post.id);

        setIsLiked(result ? true : false);

        const newData = hs.data;
        newData[index].likeStatus = result ? true : false;

        hs.setData(newData);

        console.log("Request to check isLiked!");
      }

      if (likeCounts === undefined) {
        const likes = await countPostLikes(post.id);
        setLikeCounts(likes);

        const newData = hs.data;
        newData[index].likeCounts = likes;
        hs.setData(newData);

        console.log("Request to count this post's like!");
      }

      if (commentCounts === undefined) {
        const cmtQuantity = await countPostComments(post.id);
        setCommentCounts(cmtQuantity);

        const newData = hs.data;
        newData[index].commentCounts = cmtQuantity;
        hs.setData(newData);

        console.log("Request to count this post's comment!");
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

  return (
    <div className="w-full py-4 px-5 bg-coffee-bean rounded-md text-sm mb-4 shadow-md">
      <PostHeader author={author} post={post} isInCard />
      <div className="mt-3">
        <ImagesViewer
          post={post}
          aspectRatio={post.aspectRatio <= 4 / 5 ? 4 / 5 : post.aspectRatio}
          containerClassName="w-full border rounded-sm overflow-hidden dark:border-neutral-700"
          imageClassName="size-full"
        />
        <div className="mt-1.5 -ml-2 flex">
          {isLiked !== undefined && (
            <LikeButton
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              userId={account.id}
              postId={post.id}
              setLikeCounts={setLikeCounts}
            />
          )}
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
          {likeCounts !== undefined && (
            <>
              {likeCounts === 0 ? (
                <span className="text-neutral-400">
                  Be the first to like this
                </span>
              ) : (
                <span className="font-semibold select-none">
                  {likeCounts === 1 ? "1 like" : `${likeCounts} likes`}
                </span>
              )}
            </>
          )}
          {commentCounts !== undefined && commentCounts !== 0 && (
            <div className="flex items-center gap-x-1 px-1 cursor-pointer group">
              <span className="group-hover:underline">{commentCounts}</span>
              <div className="p-0.5 group-hover:opacity-60">
                <FaComments className="size-4" />
              </div>
            </div>
          )}
        </div>
        {post.caption && (
          <div className="mt-2">
            <span className="font-semibold inline-block">
              {account.userName}&nbsp;
            </span>
            <div className="inline hyphens-auto">{captionDisplay}</div>
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
