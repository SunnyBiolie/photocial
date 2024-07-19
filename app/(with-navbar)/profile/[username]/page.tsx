"use client";

import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import { Copy, ImagePlus, Images, Layers } from "lucide-react";
import { getListPostsByUserId } from "@/action/post/get";
import { getUserByUserName } from "@/action/user/get";
import Image from "next/image";

interface Props {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: Props) {
  const [listPosts, setListPosts] = useState<Post[] | null | undefined>(
    undefined
  );

  useEffect(() => {
    const fetch = async () => {
      const userInfo = await getUserByUserName(params.username);
      if (userInfo) {
        const list = await getListPostsByUserId(userInfo.id);
        setListPosts(list);
      }
    };
    fetch();
  }, [params]);

  const imageKitLoader = ({ src, width }: { src: string; width: number }) => {
    // aspect ratio: 1 / 1
    return `${src}?tr=ar-1-1,w-${width}`;
  };

  return (
    <div className="py-2">
      {listPosts === undefined ? (
        "Loading"
      ) : listPosts === null ? (
        <div className="h-96 flex flex-col items-center justify-center gap-y-6">
          <div className="p-6 rounded-full border border-unselected">
            <ImagePlus strokeWidth={1} className="size-10 text-unselected" />
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-center">
              Nothing to show...yet!
            </p>
            <p className="text-sm font-light text-center">
              When you share photos, they will will live here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {listPosts.toReversed().map((p, i) => (
            <div key={i} className="relative">
              <Image
                loader={imageKitLoader}
                src={`${p.imagesUrl[0]}`}
                alt=""
                width={1080}
                height={1080}
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <Images className="size-5">
                  <title>{p.imagesUrl.length} photos</title>
                </Images>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
