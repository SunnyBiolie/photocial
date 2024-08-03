"use server";

import prisma from "@/lib/prisma";

export const updateAccount = async (
  accountId: string,
  imageURL?: string,
  isPrivate?: boolean
) => {
  try {
    if (imageURL) {
      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          imageUrl: imageURL,
        },
      });
    }

    if (isPrivate !== undefined) {
      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          isPrivate,
        },
      });
    }

    return true;
  } catch (err) {
    return false;
  }
};
