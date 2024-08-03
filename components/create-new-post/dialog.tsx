"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DialogProps } from "@/types/others";
import { Loading } from "../others/loading";
import { CircleAlert, CircleCheck } from "lucide-react";

/**
 * @param type {"warning" | "double-check"} define color for accept button
 * @param handleAccept {() => void} what to do when click accept button
 * @param handleAcceptWithLoadingState {() => Promise<void>} like `handleAccept` but for async funtion
 * @param handleLoadingDone {() => void} go with `handleAcceptWithLoadingState`
 * @returns
 */
export const Dialog = ({
  titleContent,
  message,
  type = "warning",
  acceptText,
  handleAccept,
  handleAcceptWithLoadingState,
  handleLoadingDone,
  handleCancel,
}: DialogProps) => {
  const [isLoading, setIsLoading] = useState<
    "idle" | "loading" | "done" | "fail"
  >("idle");

  const onClick = async () => {
    if (handleAcceptWithLoadingState && handleLoadingDone) {
      setIsLoading("loading");
      const res = await handleAcceptWithLoadingState();
      if (res === "success") setIsLoading("done");
      else if (res === "error") setIsLoading("fail");
      await new Promise((r) => {
        setTimeout(r, 1000);
      });
      handleLoadingDone();
    }
  };

  return (
    <div className="size-full fixed top-0 left-0 flex items-center justify-center z-50">
      <div className="size-full absolute top-0 left-0 bg-neutral-950/60"></div>
      <div className="w-[calc(100%-16px)] max-w-[400px] absolute rounded-xl bg-coffee-bean overflow-hidden shadow-md animate-[appear_0.05s_linear]">
        <div className="flex flex-col items-center justify-center gap-y-2 m-8">
          <h6 className="text-xl font-medium tracking-wide">{titleContent}</h6>
          <p className="text-sm text-center">{message}</p>
        </div>
        <div className="flex flex-col text-sm mt-4">
          {handleAccept ? (
            <button
              className={cn(
                "h-12 flex items-center justify-center font-semibold border-t border-neutral-700 hover:bg-neutral-800",
                type === "warning" ? "text-rose-500" : "text-sky-500"
              )}
              onClick={handleAccept}
            >
              {acceptText}
            </button>
          ) : (
            handleAcceptWithLoadingState && (
              <button
                className="h-12 flex items-center justify-center font-semibold border-t disabled:cursor-not-allowed border-neutral-700 hover:bg-neutral-800"
                disabled={isLoading === "loading"}
                onClick={onClick}
              >
                {isLoading === "loading" ? (
                  <span
                    className={cn(
                      type === "warning" ? "text-rose-500" : "text-sky-500"
                    )}
                  >
                    {acceptText}
                  </span>
                ) : isLoading === "idle" ? (
                  <Loading size={20} />
                ) : isLoading === "done" ? (
                  <CircleCheck className="size-7 text-sky-500 animate-fade-in" />
                ) : (
                  <CircleAlert className="size-7 text-rose-500 animate-fade-in" />
                )}
              </button>
            )
          )}

          <button
            className="h-12 border-t border-neutral-700 hover:bg-neutral-800"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
