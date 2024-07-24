"use server";

import prisma from "@/lib/prisma";

export const updateAccount = async (
  accountId: string,
  imageURL?: string,
  userName?: string
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

    return true;
  } catch (err) {
    return false;
  }
};
