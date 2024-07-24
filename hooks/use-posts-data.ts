import { create } from "zustand";
import { Account, Comment, Post } from "@prisma/client";
import { ReplyInfo } from "@/types/others";

type PostProps = {
  post: Post;
  author?: Account;
  likeStatus?: boolean;
  likeCounts?: number;
  listComments?: Comment[];
  listCommentAccounts?: Account[];
  listNewComments?: Comment[];
  listNewReplies?: Comment[];
  replyInfo?: ReplyInfo;
};

type Props = {
  data: PostProps[] | undefined;
  setData: (data: PostProps[] | undefined) => void;
};

export const usePostsData = create<Props>()((set) => ({
  data: undefined,
  setData: (data: PostProps[] | undefined) => {
    set({ data });
  },
}));
