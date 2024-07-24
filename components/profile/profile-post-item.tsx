"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@prisma/client";
import { Heart, Images, MessageCircle } from "lucide-react";
import { countPostLikes } from "@/action/post/get";
import { countPostComments } from "@/action/comment/get";

interface Props {
  post: Post;
}

export const ProfilePostItem = ({ post }: Props) => {
  const [numberOfLikes, setNumberOfLikes] = useState<number>();
  const [numberOfComments, setNumberOfComments] = useState<number>();

  useEffect(() => {
    const fetch = async () => {
      const likes = await countPostLikes(post.id);
      const comments = await countPostComments(post.id);

      setNumberOfLikes(likes);
      setNumberOfComments(comments);
    };
    fetch();
  }, [post.id]);

  const imageKitLoader = ({ src, width }: { src: string; width: number }) => {
    // aspect ratio: 1 / 1
    return `${src}?tr=ar-1-1,w-${width}`;
  };

  return (
    <Link href={`/p/${post.id}`} className="relative">
      <Image
        loader={imageKitLoader}
        src={`${post.listImageURLs[0]}`}
        alt=""
        width={1080}
        height={1080}
        className="object-cover"
      />
      {post.listImageURLs.length > 1 && (
        <div className="absolute top-3 right-3">
          <Images className="size-5">
            <title>{post.listImageURLs.length} photos</title>
          </Images>
        </div>
      )}
      {numberOfLikes !== undefined && numberOfComments !== undefined && (
        <div className="absolute top-0 left-0 size-full opacity-0 flex items-center justify-center hover:opacity-100 transition-opacity dark:bg-neutral-950/50">
          <div className="flex items-center gap-x-8">
            <div className="flex items-center gap-x-1">
              <Heart className="fill-normal size-5" />
              <span className="font-semibold">{numberOfLikes}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <MessageCircle className="fill-normal size-5" />
              <span className="font-semibold">{numberOfComments}</span>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};
