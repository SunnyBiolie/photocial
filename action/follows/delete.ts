"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { isExistRecord } from "./get";

export const unfollowAccount = async (
  currentAccountId: string,
  targetAccountId: string
) => {
  try {
    const user = await currentUser();

    if (user && user.id === currentAccountId) {
      const isExist = await isExistRecord(currentAccountId, targetAccountId);

      if (isExist) {
        await prisma.follows.delete({
          where: {
            followingId_followedById: {
              followedById: currentAccountId,
              followingId: targetAccountId,
            },
          },
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeFollowerOfCurrentAccount = async (
  currentAccountId: string,
  targetAccountId: string
) => {
  try {
    const user = await currentUser();

    if (user && user.id === currentAccountId) {
      const isExist = await isExistRecord(targetAccountId, currentAccountId);

      if (isExist) {
        await prisma.follows.delete({
          where: {
            followingId_followedById: {
              followedById: targetAccountId,
              followingId: currentAccountId,
            },
          },
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
