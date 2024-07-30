import { Account, Post } from "@prisma/client";

export type ReplyInfo = {
  authorName: string;
  postId: string;
  parentId: string;
  commentId: string;
};

export type DialogProps = {
  titleType: "message" | "image";
  titleContent: string;
  message: string;
  type: "warning" | "double-check";
  acceptText: string;
  handleAccept?: () => void;
  handleAcceptWithLoadingState?: () => Promise<string>;
  handleLoadingDone?: () => void;
  handleCancel: () => void;
};

export type PostCardProps = {
  post: Post;
  author?: Account;
  likeStatus?: boolean;
  likeCounts?: number;
  commentCounts?: number;
};
