"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Account, Post } from "@prisma/client";
import { cn } from "@/lib/utils";
import { checkAccountSavedPost } from "@/action/account/get";
import { updateSavedPost } from "@/action/post/update";
import { transactionDeletePost } from "@/action/transaction";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { Loading } from "../others/loading";
import { ErrorMessage } from "../others/error-message";
import { Bookmark, Ellipsis, Trash2 } from "lucide-react";

interface Props {
  post: Post;
  inModal: boolean;
}

export const PostMoreOptions = ({ post, inModal }: Props) => {
  const { currentAccount } = useCurrentAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [isSavedByCurrentAccount, setIsSavedByCurrentAccount] =
    useState<boolean>();
  const [isServerError, setIsServerError] = useState(false);

  useEffect(() => {
    if (!currentAccount) return;

    if (isOpen) {
      const fetch = async () => {
        const isSaved = await checkAccountSavedPost(currentAccount.id, post.id);
        if (isSaved === undefined) {
          return setIsServerError(true);
        } else {
          setIsSavedByCurrentAccount(isSaved);
        }
      };
      fetch();

      const onCloseOptions = () => {
        setIsOpen(false);
      };
      window.addEventListener("click", onCloseOptions);
      return () => {
        window.removeEventListener("click", onCloseOptions);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!currentAccount) return;

  const isBelongsToCurrentAccount = currentAccount.id === post.authorId;

  return (
    <div className="relative -mr-1.5">
      <div
        className="p-1.5 rounded-full cursor-pointer transition-all dark:hover:bg-jet"
        onClick={(e) => {
          setIsOpen(!isOpen);
          e.stopPropagation();
        }}
      >
        <Ellipsis className="size-5" />
      </div>
      {isOpen && (
        <div
          className="absolute top-full right-0 w-60 p-2 rounded-lg border dark:bg-neutral-900 dark:border-jet z-10 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {isServerError ? (
            <ErrorMessage />
          ) : isSavedByCurrentAccount === undefined ? (
            <Loading size={20} className="py-3" />
          ) : (
            <div className="space-y-1">
              {isBelongsToCurrentAccount && (
                <ButtonDeletePost
                  currentAccount={currentAccount}
                  postId={post.id}
                  inModal={inModal}
                />
              )}
              <ButtonSavePost
                currentAccountId={currentAccount.id}
                postId={post.id}
                isSaved={isSavedByCurrentAccount}
                setIsSaved={setIsSavedByCurrentAccount}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ButtonSavePostProps {
  currentAccountId: string;
  postId: string;
  isSaved: boolean;
  setIsSaved: Dispatch<SetStateAction<boolean | undefined>>;
}

const ButtonSavePost = ({
  currentAccountId,
  postId,
  isSaved,
  setIsSaved,
}: ButtonSavePostProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const hanleToggleSave = async () => {
    setIsProcessing(true);
    if (isSaved) {
      const isSuccess = await updateSavedPost(
        currentAccountId,
        postId,
        "unsave"
      );
      if (isSuccess) {
        toast.success("Post unsaved successfully");
        setIsSaved(false);
      } else {
        toast.error("Something went wrong, try again later");
      }
    } else {
      const isSuccess = await updateSavedPost(currentAccountId, postId, "save");
      if (isSuccess) {
        toast.success("Post saved successfully");
        setIsSaved(true);
      } else {
        toast.error("Something went wrong, try again later");
      }
    }
    setIsProcessing(false);
  };

  return (
    <button
      className="w-full p-3 flex items-center justify-between rounded-md cursor-pointer disabled:cursor-default dark:hover:bg-neutral-800 dark:disabled:hover:bg-transparent transition-all"
      onClick={hanleToggleSave}
      disabled={isProcessing}
    >
      <span className="font-semibold">{isSaved ? "Saved" : "Save"}</span>
      {isProcessing ? (
        <Loading size={20} stroke={2} className="size-fit" />
      ) : (
        <Bookmark
          className={cn(
            "size-5 animate-[fade-in_.2s_linear]",
            isSaved && "fill-current"
          )}
        />
      )}
    </button>
  );
};

interface ButtonDeletePostProps {
  currentAccount: Account;
  postId: string;
  inModal: boolean;
}

const ButtonDeletePost = ({
  currentAccount,
  postId,
  inModal,
}: ButtonDeletePostProps) => {
  const { setDialogData } = useViewDialog();
  const { setListPostsOfCurrentAccount } = useProfilePageData();

  const router = useRouter();

  const hanldeDeletePost = async () => {
    let type: "success" | "error";
    setDialogData({
      titleType: "message",
      titleContent: "Delete post?",
      message: "Are you sure you want to delete this post?",
      type: "warning",
      acceptText: "Delete",
      handleAcceptWithLoadingState: async () => {
        const errorMessage = await transactionDeletePost(
          currentAccount.id,
          postId
        );

        if (errorMessage) {
          type = "error";
          toast.error(errorMessage);
        } else {
          type = "success";
          toast.success(`Post deleted successfully`);
          setListPostsOfCurrentAccount(undefined);
        }

        return type;
      },
      handleLoadingDone: () => {
        if (inModal) router.back();
        else router.push(`/@${currentAccount.userName}`);
      },
      handleCancel: () => {},
    });
  };

  return (
    <button
      className="w-full p-3 flex items-center justify-between rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-jet text-rose-500 dark:hover:bg-neutral-800 transition-all"
      onClick={hanldeDeletePost}
    >
      <span className="font-semibold ">Delete</span>
      <Trash2 className={cn("size-5")} />
    </button>
  );
};
