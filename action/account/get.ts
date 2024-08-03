"use server";

import prisma from "@/lib/prisma";

export const getAccountByUserName = async (userName: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userName,
      },
    });

    return account;
  } catch (err) {
    return undefined;
  }
};

export const getAccountByAccountId = async (accountId: string) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    return account;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const checkAccountLikedPost = async (
  accountId: string,
  postId: string
) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        listLikedPost: {
          some: {
            id: postId,
          },
        },
      },
    });

    if (account) return true;
    else return false;
  } catch (err) {
    return undefined;
  }
};

export const checkAccountSavedPost = async (
  accountId: string,
  postId: string
) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        listSavedPost: {
          some: {
            id: postId,
          },
        },
      },
    });

    return account ? true : false;
  } catch (error) {
    return undefined;
  }
};

export const getAllAccount = async () => {
  try {
    const list = await prisma.account.findMany();
    return list.length > 0 ? list : undefined;
  } catch (error) {
    return undefined;
  }
};

export const getListAccountsByListAccountIds = async (accountIds: string[]) => {
  try {
    const list = await prisma.account.findMany({
      where: {
        id: { in: accountIds },
      },
    });

    // Sucked code!!!
    // const list = await Promise.all(
    //   accountIds.map(async (id) => {
    //     const account = await prisma.account.findUnique({
    //       where: {
    //         id,
    //       },
    //     });
    //     return account;
    //   })
    // );

    return list.length === 0 ? null : list;
  } catch (err) {
    return undefined;
  }
};

export const getListAccountsByPrivateStatus = async (isPrivate: boolean) => {
  try {
    const list = await prisma.account.findMany({
      where: {
        isPrivate,
      },
    });

    return list.length === 0 ? null : list;
  } catch (err) {
    return undefined;
  }
};

export const getListAccountsBySearchUserName = async (text: string) => {
  try {
    const result = await prisma.account.findMany({
      where: {
        userName: {
          contains: text,
        },
      },
    });
    return result.length === 0 ? null : result;
  } catch (err) {
    return undefined;
  }
};
