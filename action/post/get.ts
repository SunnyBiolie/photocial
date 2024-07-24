"use server";

import prisma from "@/lib/prisma";
import { checkAccountLikedPost, getAccountByAccountId } from "../account/get";
import { getListCommentsByPostId } from "../comment/get";

export const countPostsByUserId = async (userId: string) => {
  const quantity = await prisma.post.count({
    where: {
      authorId: userId,
    },
  });

  return quantity;
};

export const getListPostsByAccountId = async (userId: string) => {
  try {
    const list = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });

    if (list.length > 0) return list;
    else return null;
  } catch (err) {
    return undefined;
  }
};

export const getPostByPostId = async (postId: string) => {
  try {
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    return post;
  } catch (err) {
    return undefined;
  }
};

export const countPostLikes = async (postId: string) => {
  try {
    const result = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        _count: {
          select: {
            listLikedBy: true,
          },
        },
      },
    });

    if (result) return result._count.listLikedBy;
    else return 0;
  } catch (err) {
    return undefined;
  }
};

export const getListPostsByFollowing = async () => {};

// Chưa try - catch
export const getPostRelatedData = async (userId: string, postId: string) => {
  const post = await getPostByPostId(postId);
  if (post) {
    const isLiked = await checkAccountLikedPost(userId, postId);
    const likeCounts = await countPostLikes(postId);
    const comments = await getListCommentsByPostId(postId);

    const author = await getAccountByAccountId(post.authorId);

    if (isLiked !== undefined && likeCounts !== undefined && author)
      return { post, isLiked, likeCounts, comments, author };
  }
};
