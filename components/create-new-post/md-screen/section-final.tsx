"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createNewPost } from "@/action/post/create";
import { useCreateNewPost } from "@/hooks/use-create-new-post";
import { useAccount } from "@/hooks/use-account";
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
  const { account } = useAccount();

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

  if (!account) return;

  const handleBack = () => {
    setDialog({
      title: "Back to edit?",
      message: "If you leave, your changes won't be saved.",
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

    let type: string;

    setDialog({
      title: "Share this post?",
      message: "This post will be shared with everyone.",
      type: "double-check",
      acceptText: "Share it",
      handleAcceptWithLoadingState: async () => {
        let listImagesData: Uint8Array[] = [];
        arrCroppedImgData.forEach((item) => {
          listImagesData.push(item.bytes);
        });
        const res = await createNewPost(
          aspectRatio,
          listImagesData,
          caption,
          postSettings.hideLikeCounts,
          postSettings.turnOffCmt
        );
        toast[res.type](res.message);
        type = res.type;
        return type;
      },
      handleLoadingDone: () => {
        setDialog(undefined);

        if (type === "success") {
          setImageFiles(undefined);
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
                src={account.imageUrl || ""}
                alt=""
                fill
                sizes="auto"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold">{account.userName}</span>
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
