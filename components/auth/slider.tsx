"use client";

import { ElementRef, useEffect, useRef, useState } from "react";

import { type AuthBackgroundItem } from "@/data/auth-background";
import { AuthSlide as Slide } from "./slide";

interface AuthSliderProps {
  slides: AuthBackgroundItem[];
}

export const AuthSlider = ({ slides }: AuthSliderProps) => {
  const firstSlideRef = useRef<ElementRef<"div">>(null);
  const lastSlideRef = useRef<ElementRef<"div">>(null);

  const startIndex = 0;

  const [firstSlideIndex, setFirstSlideIndex] = useState<number>(
    startIndex === slides.length - 1 ? 0 : startIndex + 1
  );
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(startIndex);
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [activeSlide, setActiveSlide] = useState<"first" | "last">("last");

  useEffect(() => {
    const updateBackground = async (currIndex: number) => {
      let currentIndex;

      if (slides[currIndex + 1]) {
        currentIndex = currIndex + 1;
      } else {
        currentIndex = 0;
      }

      if (activeSlide === "last") {
        if (lastSlideRef.current && firstSlideRef.current) {
          lastSlideRef.current.style.opacity = "0";

          // Duration của opacity được set bằng với thời gian của timeout bên dưới
          await new Promise((r) => setTimeout(r, 1200));

          lastSlideRef.current.style.zIndex = "0";
          firstSlideRef.current.style.zIndex = "1";

          lastSlideRef.current.style.opacity = "100%";
          setActiveSlide("first");

          if (slides[currentIndex + 1]) {
            setLastSlideIndex(currentIndex + 1);
          } else {
            setLastSlideIndex(0);
          }
        }
      } else if (activeSlide === "first") {
        if (firstSlideRef.current && lastSlideRef.current) {
          firstSlideRef.current.style.opacity = "0";

          await new Promise((r) => setTimeout(r, 1200));

          firstSlideRef.current.style.zIndex = "0";
          lastSlideRef.current.style.zIndex = "1";

          firstSlideRef.current.style.opacity = "100%";
          setActiveSlide("last");

          if (slides[currentIndex + 1]) {
            setFirstSlideIndex(currentIndex + 1);
          } else {
            setFirstSlideIndex(0);
          }
        }
      }

      setCurrentIndex(currentIndex);
    };

    const timeOut = setTimeout(() => {
      updateBackground(currentIndex);
    }, 4500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [currentIndex, firstSlideIndex, lastSlideIndex, slides, activeSlide]);

  return (
    <div className="fixed size-full">
      <Slide ref={firstSlideRef} slide={slides[firstSlideIndex]} />
      <Slide ref={lastSlideRef} slide={slides[lastSlideIndex]} />
    </div>
  );
};
