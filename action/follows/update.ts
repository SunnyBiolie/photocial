"use server";

import prisma from "@/lib/prisma";

export const followAccount = async (yourId: string, accountId: string) => {
  try {
    await prisma.follows.create({
      data: {
        followedById: yourId,
        followingId: accountId,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const unfollowAccount = async (yourId: string, accountId: string) => {
  try {
    await prisma.follows.delete({
      where: {
        followingId_followedById: {
          followedById: yourId,
          followingId: accountId,
        },
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};
