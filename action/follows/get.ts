"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const countFollowers = async (accountId: string) => {
  try {
    const result = await prisma.follows.count({
      where: {
        followingId: accountId,
      },
    });

    return result === 0 ? null : result;
  } catch (err) {
    throw new Error(`Prisma error: countFollowers("${accountId}")`);
  }
};

export const countFollowing = async (accountId: string) => {
  try {
    const result = await prisma.follows.count({
      where: {
        followedById: accountId,
      },
    });

    return result === 0 ? null : result;
  } catch (err) {
    throw new Error(`Prisma error: countFollowing("${accountId}")`);
  }
};

export const checkAccountFollowdByCurrentAccount = async (
  currentAccountId: string,
  targetAccountId: string
) => {
  try {
    const result = await prisma.follows.count({
      where: {
        followedById: currentAccountId,
        followingId: targetAccountId,
      },
    });

    return result > 0 ? true : false;
  } catch (error) {
    throw error;
  }
};

export const getListFollowingIdByAccountId = async (accountId: string) => {
  try {
    const list = await prisma.follows.findMany({
      where: {
        followedById: accountId,
      },
      select: {
        followingId: true,
      },
    });

    if (list.length === 0) return null;

    const listAccountIds = list.map((item) => item.followingId);

    return listAccountIds.length === 0 ? null : listAccountIds;
  } catch (err) {
    return undefined;
  }
};

export const getListFollowersIdByAccountId = async (accountId: string) => {
  try {
    const list = await prisma.follows.findMany({
      where: {
        followingId: accountId,
      },
      select: {
        followedById: true,
      },
    });

    if (list.length === 0) return null;

    const listAccountIds = list.map((item) => item.followedById);

    return listAccountIds.length === 0 ? null : listAccountIds;
  } catch (err) {
    return undefined;
  }
};

export const isExistRecord = async (
  followedById: string,
  followingId: string
) => {
  try {
    const isExist = await prisma.follows.count({
      where: {
        followedById,
        followingId,
      },
    });

    return !!isExist;
  } catch (error) {
    const user = await currentUser();
    if (user) {
      console.log({
        function: "isExistRecord",
        userId: user.id,
        Error: error,
      });
    }
    return undefined;
  }
};
