"use client";

import { useEffect, useState } from "react";
import { Comment, Post, Account } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ReplyInfo } from "@/types/others";
import { countPostLikes, getPostByPostId } from "@/action/post/get";
import {
  checkAccountLikedPost,
  getAccountByAccountId,
} from "@/action/account/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { ImagesViewer } from "@/components/post/images-viewer";
import { PostRightSide } from "@/components/post/post-right-side";
import { Footer } from "@/components/others/footer";

interface Props {
  params: { id: string };
}

export default function PostPage({ params }: Props) {
  const { currentAccount } = useCurrentAccount();

  const [post, setPost] = useState<Post>();
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
      const post = await getPostByPostId(params.id);
      if (post) {
        setPost(post);
      }
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

  if (!currentAccount || !post) return;

  if (
    postAuthor === undefined ||
    likeCounts === undefined ||
    isLiked === undefined
  )
    return <PostPage.Skeleton post={post} />;

  return (
    <div className="w-full py-6 flex flex-col items-center">
      <div className="h-[min(80vh,60vw)] max-h-[800px] min-h-[400px] w-[calc(100%-20px)] flex items-center justify-center animate-fade-in">
        <ImagesViewer
          post={post}
          aspectRatio={post.aspectRatio >= 1 ? 1 : post.aspectRatio}
          containerClassName="h-full border animate-fade-in dark:border-neutral-700 z-10"
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
          className="max-w-[400px] min-w-[335px] border border-l-0 border-neutral-700"
          inModal={false}
        />
      </div>
      <Footer />
    </div>
  );
}

PostPage.Skeleton = function PostPageSkeleton({ post }: { post: Post }) {
  return (
    <div className="my-6 h-[min(80vh,60vw)] max-h-[800px] min-h-[400px] w-[calc(100%-20px)] flex justify-center">
      <div
        className="h-full overflow-hidden dark:bg-jet"
        style={{ aspectRatio: post.aspectRatio }}
      ></div>
      <div className="basis-1/2 max-w-[400px] min-w-[335px] h-full dark:bg-coffee-bean"></div>
    </div>
  );
};
