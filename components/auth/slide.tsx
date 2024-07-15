import Link from "next/link";
import { cn } from "@/lib/utils";
import { type AuthBackgroundItem } from "@/data/auth-background";
import {
  type LegacyRef,
  forwardRef,
  useEffect,
  useState,
  useRef,
  ElementRef,
} from "react";
import Image from "next/image";

interface AuthSlideProps {
  slide: AuthBackgroundItem;
  className?: string;
}

export const AuthSlide = forwardRef(function AuthSlide(
  { slide, className }: AuthSlideProps,
  ref?: LegacyRef<HTMLDivElement>
) {
  const imageRef = useRef<ElementRef<"img">>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current;

      image.onload = () => {
        setIsLoading(false);
      };

      image.src = slide.url.origin;
    }
  }, [slide.url.origin]);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed size-full transition-[opacity] [transition-duration:1200ms]",
        className
      )}
    >
      <Image
        ref={imageRef}
        src={slide.url.origin}
        alt="Auth's background image"
        fill
        sizes="auto"
        className="size-full object-cover"
      />
      {isLoading && (
        <div className="absolute top-0 left-0 size-full bg-neutral-900">
          <Image
            src={slide.url.tiny}
            alt=""
            fill
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="absolute top-0 left-0 size-full flex items-center justify-center bg-sky-950/30">
        <div className="absolute bottom-4 right-8">
          <Link
            href={slide.author.link}
            className="text-xs font-medium hover:underline cursor-pointer"
          >
            {slide.author.name}
          </Link>
        </div>
      </div>
    </div>
  );
});
