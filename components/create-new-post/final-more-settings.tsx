"use client";

import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ToggleButton } from "../others/toggle-button";
import { type PostSettings } from "./md-screen/section-final";
import { Plus } from "lucide-react";

interface Props {
  postSettings: PostSettings;
  setPostSettings: Dispatch<SetStateAction<PostSettings>>;
}

export const FinalMoreSettings = ({ postSettings, setPostSettings }: Props) => {
  const ref = useRef<ElementRef<"div">>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const target = ref.current;
    if (target) {
      setHeight(target.offsetHeight);
    }
  }, []);

  return (
    <div className="text-sm">
      <div
        className="flex items-center justify-between py-2 px-3 cursor-pointer dark:bg-neutral-700"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium ">Other settings</span>
        <Plus
          strokeWidth={3}
          className={cn("size-4 transition-transform", isOpen && "rotate-45")}
        />
      </div>
      <div
        ref={ref}
        className={cn(
          "px-3 overflow-hidden transition-all duration-200 border-b border-neutral-700",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: height ? (isOpen ? height + 16 + "px" : "0") : "auto",
          paddingTop: isOpen ? "8px" : "0",
          paddingBottom: isOpen ? "8px" : "0",
        }}
      >
        <div className="flex items-center py-2 gap-x-2">
          <ToggleButton
            defaultValue={postSettings.hideLikeCounts}
            doWhenCheck={() =>
              setPostSettings((prev) => {
                prev.hideLikeCounts = true;
                return prev;
              })
            }
            doWhenNotCheck={() =>
              setPostSettings((prev) => {
                prev.hideLikeCounts = false;
                return prev;
              })
            }
          />
          <span className="text-sm">Hide like counts on this post</span>
        </div>
        <div className="flex items-center py-2 gap-x-2">
          <ToggleButton
            defaultValue={postSettings.turnOffCmt}
            doWhenCheck={() =>
              setPostSettings((prev) => {
                prev.turnOffCmt = true;
                return prev;
              })
            }
            doWhenNotCheck={() =>
              setPostSettings((prev) => {
                prev.turnOffCmt = false;
                return prev;
              })
            }
          />
          <span className="text-sm">Turn off commenting</span>
        </div>
      </div>
    </div>
  );
};
