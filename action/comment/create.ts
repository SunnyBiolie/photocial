"use server";

import prisma from "@/lib/prisma";

export const createComment = async (
  userId: string,
  postId: string,
  content: string
) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        parentId: postId,
        content,
      },
    });

    return comment;
  } catch (error) {
    return undefined;
  }
};

export const createReply = async (
  userId: string,
  postId: string,
  parentId: string,
  replyForId: string,
  content: string
) => {
  try {
    const reply = await prisma.comment.create({
      data: {
        userId,
        postId,
        parentId,
        replyForId,
        content,
      },
    });
    return reply;
  } catch (error) {
    return undefined;
  }
};
