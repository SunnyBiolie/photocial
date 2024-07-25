import { cn } from "@/lib/utils";

interface Props {
  message?: string;
  className?: string;
}

export const ErrorMessage = ({ message, className }: Props) => {
  return (
    <p
      className={cn(
        "text-sm font-semibold text-center dark:text-red-500",
        className
      )}
    >
      {message ? message : "Something went wrong, try agian later."}
    </p>
  );
};
