"use client";

import { useEffect, useRef } from "react";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useHomePageData } from "@/hooks/use-home-state";
import { TopPostButton } from "@/components/home/top-post-button";
import { HomeContent } from "@/components/home/home-content";

export default function HomePage() {
  const { scrollPosition, setScrollPosition } = useHomePageData();
  const { currentAccount } = useCurrentAccount();

  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: scrollPosition });

    const hanldeScroll = () => {
      // HTML được gỡ trước khi clean-up được chạy
      // nên có khả năng window.scrollTop = 0 khi sang trang mới
      // kiểm tra xem HTML được gỡ hay chưa để tránh lỗi
      if (ref.current) {
        setScrollPosition(window.scrollY);
      }
    };

    window.addEventListener("scroll", hanldeScroll);

    return () => {
      window.removeEventListener("scroll", hanldeScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentAccount) return;

  return (
    <div ref={ref} className="w-[min(100vw-24px,510px)] py-6 mx-auto">
      <TopPostButton />
      <HomeContent />
    </div>
  );
}
