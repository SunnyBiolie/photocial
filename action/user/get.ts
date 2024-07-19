"use server";

import prisma from "@/lib/prisma";

export const getUserByUserName = async (userName: string) => {
  try {
    const userInfo = await prisma.userInfo.findFirst({
      where: {
        userName,
      },
    });

    return userInfo;
  } catch (err) {
    return undefined;
  }
};
