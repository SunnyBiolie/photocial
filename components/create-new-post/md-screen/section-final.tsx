// @ts-nocheck

"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Post } from "@prisma/client";
import imageKit from "@/lib/imagekit";
import { configImageKit } from "@/photocial.config";
import { createPost } from "@/action/post/create";
import { createImage } from "@/action/image/create";
import { updateImagesURL } from "@/action/post/update";
import { deletePost } from "@/action/post/delete";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { StateHeader } from "../state-header";
import { FinalPreviews } from "../final-previews";
import { FinalMoreSettings } from "../final-more-settings";
import { PostCaption } from "../post-caption";
import { HiArrowLeft } from "react-icons/hi";

export type PostSettings = {
  hideLikeCounts: boolean;
  turnOffCmt: boolean;
};

export const CNP_FinalState_MD = () => {
  const { setListPostsOfCurrentAccount, setCurrentAccountNumberOf } =
    useProfilePageData();
  const { currentAccount } = useCurrentAccount();

  const {
    setState,
    setImageFiles,
    arrCroppedImgData,
    setArrCroppedImgData,
    aspectRatio,
    setDialog,
  } = useCreateNewPost();

  const [caption, setCaption] = useState<string>();
  const [postSettings, setPostSettings] = useState<PostSettings>({
    hideLikeCounts: false,
    turnOffCmt: false,
  });

  if (!currentAccount) return;

  const handleBack = () => {
    setDialog({
      titleType: "message",
      titleContent: "Back to edit?",
      message: "If you leave, your changes won't be saved.",
      type: "warning",
      acceptText: "Back",
      handleAccept: () => {
        if (!arrCroppedImgData)
          return console.error(`"arrCroppedImgData" is undefined!`);

        setState("ar");
        arrCroppedImgData.forEach((item) => {
          URL.revokeObjectURL(item.croppedURL);
        });
        setArrCroppedImgData(undefined);
        setDialog(undefined);
      },
      handleCancel: () => setDialog(undefined),
    });
  };

  const handleSharePost = async () => {
    if (!arrCroppedImgData) return;

    let type: "success" | "error";

    setDialog({
      titleType: "message",
      titleContent: "Share this post?",
      message: "This post will be shared with everyone.",
      type: "double-check",
      acceptText: "Share it",
      handleAcceptWithLoadingState: async () => {
        const listImagesData: Uint8Array[] = arrCroppedImgData.map(
          (item) => item.bytes
        );
        let checkPost: Post | undefined = undefined;
        try {
          const post = await createPost(
            aspectRatio,
            caption,
            postSettings.hideLikeCounts,
            postSettings.turnOffCmt
          );
          checkPost = post;

          const uploadRespones = await Promise.all(
            listImagesData.map(async (bytes) => {
              const blob = new Blob([bytes]);
              const respone = await imageKit.upload({
                file: blob,
                fileName: `${currentAccount.userName}`,
                folder: configImageKit.folderName,
              });
              return respone;
            })
          );

          const arrImgUrl = await Promise.all(
            uploadRespones.map(async (respone) => {
              const image = await createImage(
                respone.fileId,
                respone.url,
                post.id
              );
              return image.url;
            })
          );

          await updateImagesURL(post.id, arrImgUrl);

          type = "success";
          toast.success("Created post successfully");
        } catch (error) {
          type = "error";
          toast.error("Something went wrong, try again later");
          console.error(error);
          if (checkPost) {
            await deletePost(checkPost.id);
          }
        }

        return type;
      },
      handleLoadingDone: () => {
        setDialog(undefined);

        if (type === "success") {
          setImageFiles(undefined);
          setListPostsOfCurrentAccount(undefined);
          setCurrentAccountNumberOf(undefined);

          setListPostsOfCurrentAccount(undefined);
        } else if (type === "error") {
        }
      },
      handleCancel: () => setDialog(undefined),
    });
  };

  return (
    <div className="animate-fade-in md:w-auto md:aspect-auto">
      <StateHeader
        tilte="Create new post"
        LeftBtn={HiArrowLeft}
        abbrTitle="Back"
        handleLeftBtn={handleBack}
        rightBtn="Share"
        handleRightBtn={handleSharePost}
      />
      <div className="w-[min(100vw-16px,475px)] aspect-square overflow-auto flex flex-col md:w-auto md:aspect-auto md:flex-row">
        <div className="py-2 backdrop-blur-sm dark:bg-neutral-950/75 md:py-0 md:backdrop-blur-none md:dark:bg-transparent">
          <FinalPreviews />
        </div>
        <div className="flex-1 order-first w-full bg-[rgb(32,32,32)] md:order-none md:w-[325px]">
          <div className="flex items-center gap-x-3 my-4 mx-4">
            <div className="relative size-7 rounded-full overflow-hidden">
              <Image
                src={currentAccount.imageUrl || ""}
                alt=""
                fill
                sizes="auto"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold">
              {currentAccount.userName}
            </span>
          </div>
          <PostCaption
            caption={caption}
            setCaption={setCaption}
            className="px-5 text-sm"
          />
          <FinalMoreSettings
            postSettings={postSettings}
            setPostSettings={setPostSettings}
          />
        </div>
      </div>
    </div>
  );
};
