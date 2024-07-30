"use client";

import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Comment } from "@prisma/client";
import { createComment, createReply } from "@/action/comment/create";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { IoClose } from "react-icons/io5";
import { ReplyInfo } from "@/types/others";
import Image from "next/image";

interface Props {
  postId: string;
  setListNewComments: Dispatch<SetStateAction<Comment[] | null>>;
  setListNewReplies: Dispatch<SetStateAction<Comment[] | undefined>>;
  replyInfo: ReplyInfo | undefined;
  setReplyInfo: Dispatch<SetStateAction<ReplyInfo | undefined>>;
  className?: string;
}

export const CommentForm = ({
  postId,
  setListNewComments,
  setListNewReplies,
  replyInfo,
  setReplyInfo,
  className,
}: Props) => {
  const { currentAccount } = useCurrentAccount();

  const ref = useRef<ElementRef<"textarea">>(null);

  const [content, setContent] = useState<string>();
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      target.style.height = "20px";
      target.style.height = Math.min(target.scrollHeight, 80) + "px";
    }
  }, [content]);

  useEffect(() => {
    if (replyInfo && ref.current) {
      ref.current.focus();
    }
  }, [replyInfo]);

  if (!currentAccount) return;

  const handleSubmitForm = async () => {
    if (content && !isPosting) {
      setIsPosting(true);
      // !replyInfo nguời dùng bình luận trực tiếp cho bài post, ngược lại là đang reply một comment
      if (!replyInfo) {
        const cmt = await createComment(currentAccount.id, postId, content);
        if (cmt) {
          toast.success("Your content has been posted successfully");
          setListNewComments((prev) => {
            if (prev) {
              prev.unshift(cmt);
              return [...prev];
            } else return [cmt];
          });
        } else {
          toast.error("Prisma Error: can't create your comment!");
        }
      } else {
        // replyInfo được xử lý trong comment-item.tsx
        const reply = await createReply(
          currentAccount.id,
          postId,
          replyInfo.parentId,
          replyInfo.commentId,
          `@${replyInfo.authorName} ${content}`
        );
        // --- TEST ON CLIENT --- //
        // const reply: Comment = {
        //   id: `reply_id_${Math.round(Math.random() * 1000)}`,
        //   userId: account.id,
        //   postId,
        //   parentId: replyInfo.parentId,
        //   replyForId: replyInfo.commentId,
        //   content: `@${replyInfo.authorName} ${content}`,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // };
        if (reply) {
          toast.success(`Reply ${replyInfo.authorName}'s comment successfully`);
          setListNewReplies((prev) => {
            if (prev) {
              prev.push(reply);
              return [...prev];
            } else return [reply];
          });
        } else {
          toast.error("Prisma Error: can't post your reply!");
        }
      }
      setIsPosting(false);
      setContent(undefined);
      setReplyInfo(undefined);
    }
  };

  const handleCancelReply = () => {
    setReplyInfo(undefined);
  };

  return (
    <div className={cn("py-2 flex items-center gap-x-3", className)}>
      <div className="shrink-0 size-8 relative rounded-full overflow-hidden">
        <Image
          src={currentAccount.imageUrl}
          alt="Your avatar"
          fill
          sizes="auto"
          className="object-cover"
        />
      </div>
      <div className="w-full">
        <form className="flex-1 flex items-center gap-x-2">
          <div className="flex-1">
            {replyInfo && (
              <div className="group pt-2 pb-1 -mt-2 animate-fade-in overflow-hidden">
                <span className="relative bg-black-chocolate z-10">
                  <span className="font-medium">
                    Reply to @{replyInfo.authorName}
                  </span>
                  <div
                    className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 scale-50 p-2 cursor-pointer  group-hover:-right-7 group-hover:opacity-100 group-hover:scale-100 transition-all -z-10"
                    onClick={handleCancelReply}
                  >
                    <IoClose className="size-4"></IoClose>
                  </div>
                </span>
              </div>
            )}
            <textarea
              value={content || ""}
              ref={ref}
              className={cn(
                "w-full h-5 resize-none bg-transparent outline-none placeholder:text-neutral-500 align-middle",
                isPosting && "opacity-75"
              )}
              placeholder="What do you think..."
              maxLength={800}
              onChange={(e) => setContent(e.currentTarget.value)}
              disabled={!isPosting ? false : true}
            ></textarea>
          </div>
          <button
            className={cn(
              "font-semibold  p-2",
              content && !isPosting
                ? "text-sky-500 hover:text-sky-100"
                : "text-sky-800 cursor-not-allowed"
            )}
            disabled={content && !isPosting ? false : true}
            onClick={handleSubmitForm}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
