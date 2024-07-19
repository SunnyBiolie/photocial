"use server";

import prisma from "@/lib/prisma";

export const countPostsByUserId = async (userId: string) => {
  const quantity = await prisma.post.count({
    where: {
      authorId: userId,
    },
  });

  return quantity;
};

export const getListPostsByUserId = async (userId: string) => {
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
