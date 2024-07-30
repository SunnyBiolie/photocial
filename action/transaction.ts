"use server";

import imageKit from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export const transactionDeletePost = async (
  currentAccountId: string,
  postId: string
) => {
  try {
    const user = await currentUser();

    if (user && user.id === currentAccountId) {
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
          authorId: currentAccountId,
        },
        select: {
          listLikedBy: {
            select: {
              id: true,
            },
          },
          listSavedBy: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!post)
        throw new Error("Something went wrong, try again later", {
          cause: "The post does not exist or does not belong to this account",
        });

      const listLikedBysId = post.listLikedBy.map((item) => item.id);
      const listSavedBysId = post.listSavedBy.map((item) => item.id);

      const listLikedByAccounts = await prisma.account.findMany({
        where: {
          id: {
            in: listLikedBysId,
          },
        },
      });
      const listSavedByAccounts = await prisma.account.findMany({
        where: {
          id: {
            in: listSavedBysId,
          },
        },
      });

      const listImages = await prisma.image.findMany({
        where: {
          postId,
        },
        select: {
          id: true,
        },
      });
      const listImagesId = listImages.map((img) => img.id);
      imageKit.bulkDeleteFiles(listImagesId, async function (error) {
        if (error) throw error;
        else {
          await prisma.$transaction(
            [
              prisma.post.update({
                where: {
                  id: postId,
                },
                data: {
                  listLikedBy: {
                    disconnect: listLikedByAccounts,
                  },
                  listSavedBy: {
                    disconnect: listSavedByAccounts,
                  },
                },
              }),
              prisma.image.deleteMany({
                where: {
                  postId,
                },
              }),
              prisma.comment.deleteMany({
                where: {
                  postId,
                },
              }),
              prisma.post.delete({
                where: {
                  id: postId,
                  authorId: currentAccountId,
                },
              }),
            ],
            {
              isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            }
          );
        }
      });
    } else {
      throw new Error("Something went wrong, try again later", {
        cause:
          "The account does not exist, or the request was not made by the current account",
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error(err.cause);
    return err.message;
  }
};
