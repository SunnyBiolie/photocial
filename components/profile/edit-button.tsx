"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Account } from "@prisma/client";
import { UpdateProfileData } from "@/types/profile";
import { updateAccount } from "@/action/account/update";
import { ImageUp, Loader } from "lucide-react";
import { ButtonCloseFullView } from "../others/btn-close-full-view";
import { Loading } from "../others/loading";
import { cn } from "@/lib/utils";

interface Props {
  currentAccount: Account;
}

export const EditProfileButton = ({ currentAccount }: Props) => {
  const { user } = useUser();

  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateProfileData>();
  const [newImageURL, setNewImageURL] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const inputTarget = inputRef.current;
      if (inputTarget) {
        inputTarget.onchange = async () => {
          if (inputTarget.files && inputTarget.files.length === 1) {
            setUpdateData((prev) => {
              if (prev) {
                prev.avatar = inputTarget.files![0];
                return { ...prev };
              } else {
                return {
                  avatar: inputTarget.files![0],
                };
              }
            });
            const blobImage = new Blob([inputTarget.files[0] as BlobPart], {
              type: "image/*",
            });
            const newURL = URL.createObjectURL(blobImage);
            setNewImageURL((prev) => {
              if (prev) {
                URL.revokeObjectURL(prev);
              }
              return newURL;
            });
          }
        };

        return () => {
          inputTarget.onchange = null;
        };
      }
    } else {
      if (newImageURL) URL.revokeObjectURL(newImageURL);
      setUpdateData(undefined);
      setNewImageURL(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const changeAvatar = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const updateProfile = async () => {
    if (!user || !updateData) return;
    setIsLoading(true);

    let imageURL: string | undefined;
    let userName: string | undefined;

    if (updateData.avatar) {
      try {
        const imageResource = await user.setProfileImage({
          file: updateData.avatar,
        });
        imageURL = imageResource.publicUrl!;
      } catch (err) {
        console.warn(err);
      }
    }
    if (updateData.userName) {
      // try {
      //   await user.update({
      //     username:
      //   })
      // }
    }

    const isSuccess = await updateAccount(user.id, imageURL, userName);

    if (isSuccess) toast.success("Your changes have been saved");
    else toast.error("Prisma error: failed to update profile");

    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <>
      <button
        className="py-2 w-[min(100%,450px)] rounded-md border dark:border-jet dark:hover:bg-neutral-900/50 transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <span className="text-sm">Edit profile</span>
      </button>
      {isEditing && (
        <div className="fixed size-full top-0 left-0 z-10">
          <div
            className="absolute size-full top-0 left-0 dark:bg-neutral-950/75"
            onClick={() => setIsEditing(false)}
          >
            <ButtonCloseFullView />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in">
            <h5 className="py-3 text-center font-bold">Edit profile</h5>
            <div className="w-[min(100vw-24px,500px)] p-6 border rounded-lg shadow-md dark:bg-black-chocolate dark:border-jet">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full overflow-hidden">
                  <input ref={inputRef} type="file" hidden />
                  <div
                    className="relative size-32 cursor-pointer"
                    onClick={changeAvatar}
                  >
                    <Image
                      src={newImageURL ? newImageURL : currentAccount.imageUrl}
                      alt={`${currentAccount.userName}'s avatar`}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                    <div className="group absolute top-0 left-0 size-full opacity-0 hover:opacity-100 dark:bg-neutral-950/50 transition-opacity">
                      <ImageUp className="size-8 absolute left-1/2 -translate-x-1/2 top-1/2 group-hover:-translate-y-1/2 transition-all" />
                    </div>
                  </div>
                </div>
                {/* <div className="flex-1">
                  <p>Username</p>
                </div> */}
                <div className="w-full mt-4">
                  <button
                    className={cn(
                      "w-full p-2.5 rounded-lg disabled:cursor-not-allowed dark:text-coffee-bean dark:bg-neutral-100 dark:hover:bg-neutral-200 transition-colors",
                      !isLoading && "dark:disabled:bg-neutral-400"
                    )}
                    onClick={updateProfile}
                    disabled={isLoading || !updateData}
                  >
                    {isLoading ? (
                      <Loading containerClassName="py-0.5" className="size-5" />
                    ) : (
                      <span className="font-medium text-center">
                        Save change
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
