import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
  stroke?: number;
  speed?: number;
}

export const Loading = ({
  className,
  size = 24,
  stroke = 2,
  speed = 1,
}: LoadingProps) => {
  const numberOfLine = 12;
  const lines: number[] = new Array(numberOfLine);
  lines.fill(0);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative mx-auto flex items-center justify-start"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {lines.map((item, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex items-center justify-start"
            style={{
              width: `${stroke}px`,
              transform: `rotate(calc(360deg / -${numberOfLine} * ${i + 1}))`,
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-1/4 bg-white"
              style={{
                borderRadius: stroke / 2,
                animation: `loader-pulse ${speed}s ease-in-out infinite`,
                transition: "background-color 0.3s ease",
                animationDelay: `${(speed / -12) * i}s`,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
