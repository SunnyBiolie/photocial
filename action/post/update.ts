"use server";

import { Post } from "@prisma/client";
import prisma from "@/lib/prisma";

export const updateAccountLikedPost = async (
  userId: string,
  postId: string,
  isLiked: boolean
) => {
  try {
    let post: Post;
    if (isLiked) {
      post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          listLikedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } else {
      post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          listLikedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    }
    return post;
  } catch (error) {
    return undefined;
  }
};
