import { cn } from "@/lib/utils";

interface DotQueueProps {
  listItems: any[];
  currentIndex: number;
}

export const DotQueue = ({ listItems, currentIndex }: DotQueueProps) => {
  if (listItems.length <= 1) return;

  return (
    <>
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-x-1 p-1">
        {listItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "size-1.5 rounded-full",
              index === currentIndex ? "bg-sky-500" : "bg-sky-100/75"
            )}
          ></div>
        ))}
      </div>
    </>
  );
};
