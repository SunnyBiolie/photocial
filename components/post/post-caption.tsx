"use client";

import { RefObject, useEffect } from "react";
import { Post } from "@prisma/client";

interface Props {
  post: Post;
  captionRef: RefObject<HTMLDivElement>;
}

export const PostCaption = ({ post, captionRef }: Props) => {
  useEffect(() => {
    const captionTarget = captionRef.current;
    if (captionTarget) {
      if (post.caption) {
        let temp = "";
        for (let i = 0; i < post.caption.length; i++) {
          if (post.caption.charCodeAt(i) === 10) {
            temp += "<br />";
          } else {
            temp += post.caption[i];
          }
        }
        captionTarget.innerHTML = temp;
      }
    }
  }, [post.caption, captionRef]);

  return (
    <>
      {post.caption && (
        <div className="shrink-0 -mx-4 -mt-2 p-4 pt-0 border-b border-neutral-700 flex">
          <span className="shrink-0 w-[44px]"></span>
          <span ref={captionRef}></span>
        </div>
      )}
    </>
  );
};
