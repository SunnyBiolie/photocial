export type ReplyInfo = {
  authorName: string;
  postId: string;
  parentId: string;
  commentId: string;
};

export type UpdateProfileData = {
  avatar?: File;
  userName?: string;
};
