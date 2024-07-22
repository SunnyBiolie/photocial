"use server";

import prisma from "@/lib/prisma";

export const getUserInfoByUserName = async (userName: string) => {
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

export const getUserInfoByUserId = async (userId: string) => {
  try {
    const userInfo = await prisma.userInfo.findUnique({
      where: {
        id: userId,
      },
    });

    return userInfo;
  } catch (err) {
    return undefined;
  }
};
