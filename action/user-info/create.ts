"use server";

import prisma from "@/lib/prisma";
import { UserInfo } from "@prisma/client";

export const createUserInfo = async (data: UserInfo) => {
  try {
    const userInfo = await prisma.userInfo.create({
      data,
    });

    return userInfo;
  } catch (err) {
    return undefined;
  }
};
