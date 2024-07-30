"use server";

import prisma from "@/lib/prisma";

export const createImage = async (id: string, url: string, postId: string) => {
  try {
    const image = await prisma.image.create({
      data: {
        id,
        url,
        postId,
      },
    });
    return image;
  } catch (error) {
    throw error;
  }
};
