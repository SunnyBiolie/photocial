"use client";

import { cn } from "@/lib/utils";
import { TbLoader } from "react-icons/tb";

interface LoadingProps {
  className?: string;
}

export const Loading = ({ className }: LoadingProps) => {
  return (
    <div className="size-full flex items-center justify-center">
      <TbLoader className={cn("size-6 animate-spin", className)} />
    </div>
  );
};
