"use server";

import prisma from "@/lib/prisma";

export const countPostsByUserId = async (userId: string) => {
  try {
    const quantity = await prisma.post.count({
      where: {
        authorId: userId,
      },
    });

    return quantity === 0 ? null : quantity;
  } catch (err) {
    return undefined;
  }
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

export const getListPostsByListFollowingId = async (
  listFollowingId: string[]
) => {
  try {
    const list = await prisma.post.findMany({
      where: {
        authorId: {
          in: listFollowingId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return list.length === 0 ? null : list;
  } catch (err) {
    return undefined;
  }
};

export const getListPostsSavedByUserName = async (userName: string) => {
  try {
    const list = await prisma.post.findMany({
      where: {
        listSavedBy: {
          some: {
            userName: userName,
          },
        },
      },
    });

    return list.length === 0 ? null : list;
  } catch (err) {
    return undefined;
  }
};
