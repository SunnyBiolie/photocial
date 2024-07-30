"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { isExistRecord } from "./get";

export const followAccount = async (
  currentAccountId: string,
  targetAccountId: string
) => {
  try {
    const user = await currentUser();

    if (user && user.id === currentAccountId) {
      const isExist = await isExistRecord(currentAccountId, targetAccountId);

      if (!isExist) {
        await prisma.follows.create({
          data: {
            followedById: currentAccountId,
            followingId: targetAccountId,
          },
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};
