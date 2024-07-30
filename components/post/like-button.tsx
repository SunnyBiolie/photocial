"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useFirstRender } from "@/hooks/use-first-render";
import { useHomePageData } from "@/hooks/use-home-state";
import { updateAccountLikedPost } from "@/action/post/update";
import { Heart } from "lucide-react";

interface Props {
  isLiked: boolean;
  setIsLiked: Dispatch<SetStateAction<boolean | undefined>>;
  userId: string;
  postId: string;
  setLikeCounts: Dispatch<SetStateAction<number | undefined>>;
  className?: string;
}

export const LikeButton = ({
  isLiked,
  setIsLiked,
  userId,
  postId,
  setLikeCounts,
  className,
}: Props) => {
  const { postCards } = useHomePageData();

  const debounceValue = useDebounce(isLiked);
  const isFirstRender = useFirstRender();

  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);

    if (isFirstRender || isError) return;

    const updateLikeStatus = async () => {
      const result = await updateAccountLikedPost(
        userId,
        postId,
        debounceValue
      );
      if (!result) {
        // Hoàn tác UI nếu có lỗi, kiểm tra isError để không bị render loop
        setIsError(true);
        setIsLiked(!isLiked);
        setLikeCounts((prev) => {
          if (prev !== undefined) {
            if (isLiked) return prev - 1;
            else return prev + 1;
          }
        });

        if (postCards) {
          const index = postCards.findIndex((item) => {
            return item.post.id === postId;
          });
          postCards[index].likeStatus = !isLiked;
          postCards[index].likeCounts! += isLiked ? -1 : 1;
          console.log("INLIKEBUTTON");
        }

        toast.error("Something went wrong, try again later.");
      }
    };
    updateLikeStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  const handleLikeBtnClick = () => {
    setIsLiked(!isLiked);
    setLikeCounts((prev) => {
      if (prev !== undefined) {
        if (isLiked) return prev - 1;
        else return prev + 1;
      }
    });

    if (postCards) {
      const index = postCards.findIndex((item) => {
        return item.post.id === postId;
      });
      postCards[index].likeStatus = !isLiked;
      postCards[index].likeCounts! += isLiked ? -1 : 1;
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer p-2",
        isLiked
          ? "animate-[click-bounce_0.25s_linear]"
          : "hover:opacity-60 transition-opacity",
        className
      )}
      onClick={handleLikeBtnClick}
    >
      <Heart
        width={26}
        height={26}
        aria-label={isLiked ? "Unlike" : "Like"}
        className={cn(isLiked && "fill-rose-600 stroke-rose-600")}
      >
        <title>{isLiked ? "Unlike" : "Like"}</title>
      </Heart>
    </div>
  );
};
