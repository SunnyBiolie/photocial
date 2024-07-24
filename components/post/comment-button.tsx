"use client";

import { Post } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentButtonProps {
  post: Post;
}

export const CommentButton = ({ post }: CommentButtonProps) => {
  const router = useRouter();

  const hanldeClick = () => {
    router.push(`/p/${post.id}`);
  };

  return (
    <div
      className="p-2 cursor-pointer hover:opacity-60 transition-opacity"
      onClick={hanldeClick}
    >
      <MessageCircle width={26} height={26} aria-label="Comment">
        <title>Comment</title>
      </MessageCircle>
    </div>
  );
};
