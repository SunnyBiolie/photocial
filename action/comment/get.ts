"use server";

import prisma from "@/lib/prisma";

export const getListCommentsByPostId = async (postId: string) => {
  try {
    const listComments = await prisma.comment.findMany({
      take: 10,
      where: {
        postId,
        parentId: postId,
        replyForId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return listComments.length > 0 ? listComments : null;
  } catch (err) {
    return undefined;
  }
};

export const getListRepliesByCommentIdAndTime = async (
  postId: string,
  commentId: string,
  beforeTime: Date
) => {
  try {
    const listReplies = await prisma.comment.findMany({
      take: 10,
      where: {
        postId,
        parentId: commentId,
        createdAt: {
          lte: beforeTime,
        },
      },
    });

    return listReplies.length > 0 ? listReplies : null;
  } catch (err) {
    return undefined;
  }
};

export const countPostComments = async (postId: string) => {
  try {
    const counts = await prisma.comment.count({
      where: {
        postId,
      },
    });

    return counts;
  } catch (err) {
    return undefined;
  }
};

export const countCommentReplies = async (commentId: string) => {
  try {
    const counts = await prisma.comment.count({
      where: {
        parentId: commentId,
      },
    });

    return counts !== 0 ? counts : null;
  } catch (err) {
    return undefined;
  }
};
