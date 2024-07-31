"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Account, Comment } from "@prisma/client";
import { cn, transformTime } from "@/lib/utils";
import { ReplyInfo } from "@/types/others";
import {
  countCommentReplies,
  getListRepliesByCommentIdAndTime,
} from "@/action/comment/get";
import { getAccountByAccountId } from "@/action/account/get";
import { useCurrentAccount } from "@/hooks/use-current-account";

interface Props {
  author: Account;
  comment: Comment;
  setReplyInfo: Dispatch<SetStateAction<ReplyInfo | undefined>>;
  arrayNewReplies?: Comment[];
  className?: string;
}

export const CommentItem = ({
  author,
  comment,
  setReplyInfo,
  arrayNewReplies,
  className,
}: Props) => {
  const { currentAccount } = useCurrentAccount();

  const [requestTime, setRequestTime] = useState<Date>();
  const [numberOfReplies, setNumberOfReplies] = useState<number | null>();
  const [listReplies, setListReplies] = useState<Comment[] | null>();
  const [listReplyAccounts, setListReplyAccounts] = useState<Account[] | null>(
    null
  );
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isViewAllReplies, setIsViewAllReplies] = useState(false);

  const [listNewReplies, setListNewReplies] = useState<Comment[]>();

  useEffect(() => {
    if (comment.parentId === comment.postId) {
      const countReplies = async () => {
        setRequestTime(new Date());
        const counts = await countCommentReplies(comment.id);
        if (counts !== undefined) {
          setNumberOfReplies(counts);
        } else console.error("Prisma Error: can't get data!");
      };
      countReplies();
    }
  }, [comment]);

  useEffect(() => {
    if (arrayNewReplies) {
      const newReply = arrayNewReplies[arrayNewReplies.length - 1];
      if (newReply.parentId === comment.id) {
        setListNewReplies((prev) => {
          if (prev) {
            prev.push(newReply);
            return [...prev];
          } else return [newReply];
        });
        setIsViewAllReplies(true);
      }
    }
  }, [arrayNewReplies, comment]);

  if (!currentAccount) return;

  const handleReplyClick = () => {
    // Nếu reply comment level 1 --> parentId = id của commnet (Cmt level 1 có parentId = postId)
    // Nếu reply comment level 2, 3... --> parentId = parentId của comment (tức bằng id của comment level 1)
    if (comment.postId === comment.parentId) {
      setReplyInfo({
        postId: comment.postId,
        authorName: author.userName,
        parentId: comment.id,
        commentId: comment.id,
      });
    } else {
      setReplyInfo({
        postId: comment.postId,
        authorName: author.userName,
        parentId: comment.parentId,
        commentId: comment.id,
      });
    }
  };

  const handleViewAllReply = () => {
    setIsViewAllReplies((prev) => !prev);
    fetchRepliesRelatedData(!isViewAllReplies);
  };

  const fetchRepliesRelatedData = (trigger: boolean) => {
    if (trigger && numberOfReplies && requestTime) {
      if (!listReplies) {
        const fetch = async () => {
          setIsLoadingReplies(true);

          const listReplies = await getListRepliesByCommentIdAndTime(
            comment.postId,
            comment.id,
            requestTime
          );

          if (listReplies !== undefined) {
            setListReplies(listReplies);
            if (listReplies) {
              const listRepliers: Account[] = [];
              listReplies.forEach(async (r, i) => {
                const account = await getAccountByAccountId(r.userId);
                if (account !== undefined) {
                  if (account) listRepliers[i] = account;

                  let notEmptyCounts = 0;
                  listRepliers.forEach(() => (notEmptyCounts += 1));
                  if (notEmptyCounts === listReplies.length) {
                    setListReplyAccounts(listRepliers);
                    setIsLoadingReplies(false);
                  }
                } else console.error("Prisma Error: can't get Account data!");
              });
            }
          } else console.error("Prisma Error: can't get ListReplies data!");
        };
        fetch();
      }
    }
  };

  return (
    <div className={cn("py-2 px-4 -mx-4 flex rounded-sm", className)}>
      <div className="shrink-0 relative size-8 rounded-full overflow-hidden mr-3">
        <Image
          src={author.imageUrl}
          alt={`${author.userName}'s avatar`}
          fill
          sizes="auto"
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-x-2">
          <span className="font-semibold">{author.userName}</span>
          <span className="opacity-75 font-light">
            {transformTime(Date.now() - comment.createdAt.getTime())}
          </span>
        </div>
        <div>
          {comment.parentId === comment.postId ? (
            <span>{comment.content}</span>
          ) : (
            <>
              <span className="text-sky-100">
                {comment.content.slice(0, comment.content.indexOf(" "))}
              </span>
              <span>{comment.content.slice(comment.content.indexOf(" "))}</span>
            </>
          )}
        </div>
        <div className="mt-1 flex items-center gap-x-4 text-xs font-semibold">
          <button
            className="text-neutral-500 hover:text-neutral-400"
            onClick={handleReplyClick}
          >
            Reply
          </button>
          {(numberOfReplies || listNewReplies) && (
            <div
              className="group flex items-center gap-x-1 text-neutral-500 hover:text-neutral-400 cursor-pointer"
              onClick={handleViewAllReply}
            >
              <div className="w-8 border-t border-neutral-500 group-hover:border-neutral-400"></div>
              {isViewAllReplies
                ? "Hide all peplies"
                : `View all ${
                    (numberOfReplies ? numberOfReplies : 0) +
                    (listNewReplies ? listNewReplies.length : 0)
                  } replies`}
            </div>
          )}
        </div>
        {isViewAllReplies && (
          <div className="mt-1">
            {listNewReplies &&
              listNewReplies.map((r) => (
                <CommentItem
                  key={r.id}
                  author={currentAccount}
                  comment={r}
                  setReplyInfo={setReplyInfo}
                  className="animate-[create_2s_ease-out]"
                />
              ))}
            {numberOfReplies && !listReplies && !isLoadingReplies && (
              <div
                className="group pt-1 w-fit flex items-center gap-x-1 text-neutral-500 hover:text-neutral-400 cursor-pointer text-xs font-semibold"
                onClick={() => fetchRepliesRelatedData(isViewAllReplies)}
              >
                <div className="w-8 border-t border-neutral-500 group-hover:border-neutral-400"></div>
                {`Show more replies (${numberOfReplies})`}
              </div>
            )}
            {numberOfReplies && isLoadingReplies && (
              <CommentItemSkeleton quantity={numberOfReplies} />
            )}
            {listReplies &&
              listReplyAccounts &&
              listReplies.map((r, i) => (
                <CommentItem
                  key={r.id}
                  author={listReplyAccounts[i]}
                  comment={r}
                  setReplyInfo={setReplyInfo}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export function CommentItemSkeleton({ quantity }: { quantity: number }) {
  const array = new Array(quantity >= 5 ? 5 : quantity);
  array.fill(0);

  return (
    <div className="space-y-1 py-2">
      {array.map((item, i) => (
        <div key={i} className="py-2 flex">
          <div
            className="size-8 rounded-full mr-3 bg-jet animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
          <div className="flex-1 flex flex-col justify-between h-10">
            <div
              className="w-full max-w-28 min-w-20 h-4 bg-jet rounded-md animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
            <div
              className="w-full max-w-72 min-w-56 h-4 bg-jet rounded-md animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
