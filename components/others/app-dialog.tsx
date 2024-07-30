"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useViewDialog } from "@/hooks/use-view-dialog";
import { Loading } from "../others/loading";
import { CircleAlert, CircleCheck } from "lucide-react";

/**
 * @param type {"warning" | "double-check"} define color for accept button
 * @param handleAccept {() => void} what to do when click accept button
 * @param handleAcceptWithLoadingState {() => Promise<void>} like `handleAccept` but for async funtion
 * @param handleLoadingDone {() => void} go with `handleAcceptWithLoadingState`
 * @returns
 */
export const AppDialog = () => {
  const { dialogData, setDialogData } = useViewDialog();

  const [state, setState] = useState<"idle" | "loading" | "done" | "fail">(
    "idle"
  );

  if (!dialogData) return;

  const {
    titleType,
    titleContent,
    message,
    type,
    acceptText,
    handleAccept,
    handleAcceptWithLoadingState,
    handleLoadingDone,
    handleCancel,
  } = dialogData;

  const onCloseDialog = () => {
    setDialogData(undefined);
  };

  const onAccept = () => {
    if (handleAccept) {
      handleAccept();
      onCloseDialog();
    }
  };

  const onAcceptWithLoadingState = async () => {
    if (handleAcceptWithLoadingState && handleLoadingDone) {
      setState("loading");
      const res = await handleAcceptWithLoadingState();
      if (res === "success") setState("done");
      else if (res === "error") setState("fail");
      await new Promise((r) => {
        setTimeout(r, 1000);
      });
      handleLoadingDone();
      onCloseDialog();
      setState("idle");
    }
  };

  const onCancel = () => {
    handleCancel();
    onCloseDialog();
  };

  return (
    <div className="size-full fixed top-0 left-0 flex items-center justify-center z-50">
      <div
        className="size-full absolute top-0 left-0 bg-neutral-950/60"
        onClick={onCloseDialog}
      ></div>
      <div className="w-[calc(100%-16px)] max-w-[400px] absolute rounded-xl bg-coffee-bean overflow-hidden shadow-md animate-[appear_0.05s_linear]">
        <div className="flex flex-col items-center justify-center gap-y-2 m-8">
          {titleType === "message" ? (
            <h6 className="max-w-full text-xl font-medium text-center tracking-wide break-words">
              {titleContent}
            </h6>
          ) : (
            titleType === "image" && (
              <div className="relative size-20 mb-4 rounded-full overflow-hidden dark:bg-neutral-600">
                <Image
                  src={titleContent}
                  alt=""
                  fill
                  sizes="auto"
                  className="object-cover"
                />
              </div>
            )
          )}
          <p className="text-sm text-center">{message}</p>
        </div>

        <div className="flex flex-col text-sm mt-4">
          {handleAccept ? (
            <button
              className={cn(
                "h-12 flex items-center justify-center border-t border-neutral-700 hover:bg-neutral-800",
                type === "warning" ? "text-rose-500" : "text-sky-500"
              )}
              onClick={onAccept}
            >
              <span className="font-bold">{acceptText}</span>
            </button>
          ) : (
            handleAcceptWithLoadingState && (
              <button
                className="h-12 flex items-center justify-center font-semibold border-t border-neutral-700 hover:bg-neutral-800"
                onClick={onAcceptWithLoadingState}
                disabled={state === "loading"}
              >
                {state === "idle" ? (
                  <span
                    className={cn(
                      type === "warning" ? "text-rose-500" : "text-sky-500"
                    )}
                  >
                    {acceptText}
                  </span>
                ) : state === "loading" ? (
                  <Loading className="text-white size-5" />
                ) : state === "done" ? (
                  <CircleCheck className="size-7 text-sky-500 animate-fade-in" />
                ) : (
                  <CircleAlert className="size-7 text-rose-500 animate-fade-in" />
                )}
              </button>
            )
          )}

          <button
            className="h-12 border-t border-neutral-700 hover:bg-neutral-800"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
