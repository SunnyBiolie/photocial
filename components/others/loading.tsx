import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingProps {
  containerClassName?: string;
  className?: string;
}

export const Loading = ({ containerClassName, className }: LoadingProps) => {
  return (
    <div
      className={cn(
        "size-full flex items-center justify-center",
        containerClassName
      )}
    >
      <Loader className={cn("animate-slow-spin", className)} />
    </div>
  );
};
