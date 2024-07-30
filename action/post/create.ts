"use server";

import imageKit from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { configImageKit } from "@/photocial.config";
import { currentUser } from "@clerk/nextjs/server";

type ReturnValue = {
  type: "success" | "error";
  message: string;
};

export const createNewPost = async (
  aspectRatio: number,
  listImagesData: Uint8Array[],
  caption: string | undefined,
  isHideLikeCounts: boolean,
  isOffComment: boolean
): Promise<ReturnValue> => {
  try {
    const user = await currentUser();

    if (user) {
      // Tạo bài viết
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          caption,
          isHideLikeCounts,
          isOffComment,
          aspectRatio,
        },
      });

      const arrImgUrl: string[] = [];
      listImagesData.forEach((bytes, index) => {
        const buffer = Buffer.from(bytes);
        imageKit.upload(
          {
            file: buffer,
            fileName: `${user.username}`,
            folder: configImageKit.folderName,
          },
          async function (err, res) {
            if (err) return err;
            else if (res) {
              const image = await prisma.image.create({
                data: {
                  id: res.fileId,
                  url: res.url,
                  postId: post.id,
                },
              });

              arrImgUrl[index] = image.url;

              let notEmptyCounts = 0;
              arrImgUrl.forEach(() => (notEmptyCounts += 1));
              if (notEmptyCounts === listImagesData.length) {
                await prisma.post.update({
                  where: {
                    id: post.id,
                  },
                  data: {
                    listImageURLs: arrImgUrl,
                  },
                });
              }
            }
          }
        );
      });

      return {
        type: "success",
        message: "Created successfully!",
      };
    } else {
      return {
        type: "error",
        message: "Cannot find the user!",
      };
    }
  } catch (err) {
    return {
      type: "error",
      message: "Something went wrong when create your post!",
    };
  }
};
