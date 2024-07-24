"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Account, Comment, Post } from "@prisma/client";
import { ReplyInfo } from "@/types/others";
import { getAccountByAccountId } from "@/action/account/get";
import { getListCommentsByPostId } from "@/action/comment/get";
import { CommentItem, CommentItemSkeleton } from "./comment-item";

interface Props {
  thisAccount: Account;
  post: Post;
  listNewComments: Comment[] | null;
  listNewReplies: Comment[] | undefined;
  setReplyInfo: Dispatch<SetStateAction<ReplyInfo | undefined>>;
  isLoading: boolean;
}

export const CommentContainer = ({
  thisAccount,
  post,
  listNewComments,
  listNewReplies,
  setReplyInfo,
  isLoading,
}: Props) => {
  const [listComments, setListComments] = useState<Comment[] | null>();
  const [listCommentAccounts, setListCommentAccounts] = useState<
    Account[] | null
  >();

  useEffect(() => {
    const fetch = async () => {
      const listComments = await getListCommentsByPostId(post.id);
      if (listComments === undefined) {
        throw new Error("Prisma Error: something went wrong!");
      }
      setListComments(listComments);
    };
    fetch();
  }, [post.id]);

  useEffect(() => {
    if (listComments) {
      const fetch = () => {
        const listAccounts: Account[] = [];
        listComments.forEach(async (c, i) => {
          const acc = await getAccountByAccountId(c.userId);
          if (acc !== undefined) {
            if (acc) {
              listAccounts[i] = acc;

              let notEmptyCounts = 0;
              listAccounts.forEach(() => (notEmptyCounts += 1));
              if (notEmptyCounts === listComments.length) {
                setListCommentAccounts(listAccounts);
              }
            } else {
              throw new Error("Don't have Account with given id!");
            }
          } else {
            console.error(
              "Prisma error: something went wrong when get Account by user's id!"
            );
          }
        });
      };
      fetch();
    } else {
      setListCommentAccounts(null);
    }
  }, [listComments]);

  return (
    <>
      {listComments === undefined ||
      listCommentAccounts === undefined ||
      isLoading ? (
        <CommentItemSkeleton quantity={5} />
      ) : !listNewComments && listComments === null ? (
        <div className="size-full min-h-[200px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <h6 className="text-xl font-bold">No comments yet.</h6>
            <p>Start the conversation.</p>
          </div>
        </div>
      ) : (
        (listNewComments || listComments) && (
          <div className="py-2">
            {listNewComments &&
              listNewComments.map((c, i) => (
                <CommentItem
                  key={c.id}
                  author={thisAccount}
                  comment={c}
                  setReplyInfo={setReplyInfo}
                  arrayNewReplies={listNewReplies}
                  className="animate-[create_2s_ease-out]"
                />
              ))}
            {listComments &&
              listCommentAccounts &&
              listComments.map((c, i) => (
                <CommentItem
                  key={c.id}
                  author={listCommentAccounts[i]}
                  comment={c}
                  setReplyInfo={setReplyInfo}
                  arrayNewReplies={listNewReplies}
                />
              ))}
          </div>
        )
      )}
    </>
  );
};
