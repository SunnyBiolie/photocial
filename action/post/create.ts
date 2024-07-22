"use server";

import imageKit from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

type ReturnValue = {
  type: "success" | "error";
  message: string;
};

export const createNewPost = async (
  aspectRatio: number,
  listImagesData: Uint8Array[],
  caption: string | undefined,
  hideLikeCounts: boolean,
  turnOffCmt: boolean
): Promise<ReturnValue> => {
  const user = await currentUser();

  if (user) {
    // Tạo bài viết
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        caption,
        hideLikeCounts,
        turnOffCmt,
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
          folder: "photograms",
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
                  imagesUrl: arrImgUrl,
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
};
