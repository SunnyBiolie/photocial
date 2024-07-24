"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import { useViewFull } from "@/hooks/use-view-full";
import { ButtonChangeImage } from "../others/btn-change-image";
import { DotQueue } from "../others/dot-queue";

interface ImagesViewerProps {
  post: Post;
  aspectRatio: number;
  containerClassName: string;
  imageClassName: string;
}

export const ImagesViewer = ({
  post,
  aspectRatio,
  containerClassName,
  imageClassName,
}: ImagesViewerProps) => {
  const vf = useViewFull();

  const [currentIndex, setCurrentIndex] = useState(0);

  const hanldeViewFull = (currIndex: number) => {
    vf.setListImages(post.listImageURLs);
    vf.setCurrentIndex(currIndex);
    vf.setAspectRatio(post.aspectRatio);
    vf.onOpen();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden dark:bg-black-chocolate",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      <div
        className="absolute size-full flex transition-all duration-300"
        style={{ left: `-${currentIndex * 100}%` }}
      >
        {post.listImageURLs.map((url, i) => (
          <div
            key={i}
            className={cn(
              "shrink-0 absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer overflow-hidden",
              imageClassName
            )}
            style={{ aspectRatio: post.aspectRatio, left: `${i * 100}%` }}
            onClick={() => hanldeViewFull(currentIndex)}
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="auto"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <ButtonChangeImage
        action="prev"
        setCurrentIndex={setCurrentIndex}
        disabled={currentIndex === 0}
      />
      <ButtonChangeImage
        action="next"
        setCurrentIndex={setCurrentIndex}
        disabled={currentIndex === post.listImageURLs.length - 1}
      />
      <DotQueue listItems={post.listImageURLs} currentIndex={currentIndex} />
    </div>
  );
};
