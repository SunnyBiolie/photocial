"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Account } from "@prisma/client";
import { UpdateProfileData } from "@/types/profile";
import { cn } from "@/lib/utils";
import { updateAccount } from "@/action/account/update";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { ButtonCloseFullView } from "../others/btn-close-full-view";
import { Loading } from "../others/loading";
import { ToggleButton } from "../others/toggle-button";
import { ImageOff, ImageUp } from "lucide-react";

interface Props {
  currentAccount: Account;
}

export const EditProfileButton = ({ currentAccount }: Props) => {
  const { user } = useUser();
  const { setRequestCurrentAccount } = useCurrentAccount();
  const { setDialogData } = useViewDialog();

  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateProfileData>();
  const [newImageURL, setNewImageURL] = useState<string>();
  // const [isPrivate, setIsPrivate] = useState(currentAccount.isPrivate);
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
      // setIsPrivate(currentAccount.isPrivate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // useEffect(() => {
  //   if (isPrivate !== currentAccount.isPrivate) {
  //     setUpdateData((prev) => {
  //       if (prev) {
  //         prev.isPrivate = isPrivate;
  //         return { ...prev };
  //       } else {
  //         return {
  //           isPrivate,
  //         };
  //       }
  //     });
  //   } else {
  //     setUpdateData((prev) => {
  //       if (prev && Object.values(prev).length !== 1) {
  //         prev.isPrivate = undefined;
  //         return { ...prev };
  //       } else {
  //         return undefined;
  //       }
  //     });
  //   }
  // }, [currentAccount, isPrivate]);

  const changeAvatar = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const updateProfile = async () => {
    if (!user || !updateData) return;
    setIsLoading(true);

    let imageURL: string | undefined;

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

    const isSuccess = await updateAccount(
      user.id,
      imageURL,
      updateData.isPrivate
    );

    if (isSuccess) {
      toast.success("Your changes have been saved");
      setRequestCurrentAccount([]);
    } else toast.error("Prisma error: failed to update profile");

    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <>
      <button
        className="py-2 w-[min(100%,450px)] rounded-lg border dark:border-jet dark:bg-neutral-200 dark:text-neutral-700 dark:font-medium transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <span className="text-sm font-medium">Edit profile</span>
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
              <div className="flex flex-col items-center gap-6">
                <div className="relative flex">
                  <input ref={inputRef} type="file" accept="image/*" hidden />
                  <div
                    className="relative group size-32 rounded-full overflow-hidden cursor-pointer"
                    onClick={changeAvatar}
                  >
                    <Image
                      src={newImageURL ? newImageURL : currentAccount.imageUrl}
                      alt={`${currentAccount.userName}'s avatar`}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                    <div className="absolute top-0 left-0 size-full ">
                      <div className="absolute top-0 left-0 size-full opacity-0 group-hover:opacity-100 dark:bg-neutral-900/50 transition-opacity">
                        <ImageUp className="size-8 absolute left-1/2 -translate-x-1/2 top-1/2 group-hover:-translate-y-1/2 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="w-full flex items-center justify-between">
                  <p className="font-medium">Private account</p>
                  <ToggleButton
                    defaultValue={currentAccount.isPrivate}
                    doWhenCheck={() => setIsPrivate(true)}
                    doWhenNotCheck={() => setIsPrivate(false)}
                  />
                </div> */}
                <div className="w-full mt-4">
                  <button
                    className={cn(
                      "w-full p-3 rounded-lg disabled:cursor-not-allowed dark:text-coffee-bean dark:bg-neutral-100 transition-colors dark:disabled:bg-neutral-400"
                    )}
                    disabled={isLoading || !updateData}
                    onClick={() => {
                      if (!updateData) return;
                      if (updateData.isPrivate === undefined) {
                        updateProfile();
                      } else {
                        setDialogData({
                          titleType: "message",
                          titleContent: updateData.isPrivate
                            ? "Private profile?"
                            : "Public profile?",
                          type: "double-check",
                          acceptText: "OK",
                          message: updateData.isPrivate
                            ? "Switch to private profile, only followers can see and interact with your content"
                            : "Switch to public profile, everyone can see and interact with your content",
                          handleAccept: updateProfile,
                          handleCancel: () => {},
                        });
                      }
                    }}
                  >
                    {isLoading ? (
                      <Loading size={20} className="py-0.5" />
                    ) : (
                      <span className="font-medium text-sm text-center">
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
