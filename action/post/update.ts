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

export const updateSavedPost = async (
  currentAccountId: string,
  postId: string,
  action: "save" | "unsave"
) => {
  try {
    if (action === "save") {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          listSavedBy: {
            connect: { id: currentAccountId },
          },
        },
      });
    } else {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          listSavedBy: {
            disconnect: { id: currentAccountId },
          },
        },
      });
    }

    return true;
  } catch (error) {
    return true;
  }
};

export const updateImagesURL = async (postId: string, arrImgsURL: string[]) => {
  try {
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        listImageURLs: arrImgsURL,
      },
    });
  } catch (error) {
    throw error;
  }
};
