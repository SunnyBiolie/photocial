"use server";

import prisma from "@/lib/prisma";

export const deletePost = async (postId: string) => {
  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return true;
  } catch (error) {
    throw error;
  }
};
