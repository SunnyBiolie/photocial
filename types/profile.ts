export type UpdateProfileData = {
  avatar?: File;
  isPrivate?: boolean;
  userName?: string;
};

export type NumberOf = {
  posts: number;
  followers: number;
  following: number;
};
