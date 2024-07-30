"use server";

import imageKit from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { configImageKit } from "@/photocial.config";
import { currentUser } from "@clerk/nextjs/server";

type ReturnValue = {
  type: "success" | "error";
  message: string;
};

export const createPost = async (
  aspectRatio: number,
  caption: string | undefined,
  isHideLikeCounts: boolean,
  isOffComment: boolean
) => {
  try {
    const user = await currentUser();

    if (user) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          caption,
          isHideLikeCounts,
          isOffComment,
          aspectRatio,
        },
      });
      return post;
    } else {
      throw new Error("Could not find the current user");
    }
  } catch (error) {
    throw error;
  }
};
