"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useFirstRender } from "@/hooks/use-first-render";
import { useHomeState } from "@/hooks/use-home-state";
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
  const hs = useHomeState();

  const debounceValue = useDebounce(isLiked);
  const isFirstRender = useFirstRender();

  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);

    if (isFirstRender || isError) return;

    console.log("Not first render", isLiked);
    const updateLikeStatus = async () => {
      const res = await updateAccountLikedPost(userId, postId, debounceValue);
      if (!res) {
        setIsError(true);
        setIsLiked(!isLiked);
        setLikeCounts((prev) => {
          if (prev !== undefined) {
            if (isLiked) return prev - 1;
            else return prev + 1;
          }
        });
        toast.error("Something went wrong!");
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

    if (hs.data) {
      const index = hs.data.findIndex((item, i) => {
        return item.post.id === postId;
      });
      hs.data[index].likeStatus = !isLiked;
      hs.data[index].likeCounts! += isLiked ? -1 : 1;
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
