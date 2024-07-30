import { Copyright } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="py-10">
      <div className="flex flex-col items-center gap-y-4 text-xs text-neutral-400">
        <nav className="flex items-center justify-center gap-x-4">
          <Link
            href={"https://sunnybiolie.vercel.app/"}
            className="hover:underline"
          >
            About
          </Link>
          <Link
            href={"https://sbmusic.vercel.app/"}
            className="hover:underline"
          >
            SBmusic
          </Link>
          <Link
            href={"https://share-story.vercel.app/"}
            className="hover:underline"
          >
            Share Story
          </Link>
        </nav>
        <div className="flex items-center gap-x-1">
          <Copyright strokeWidth={1.5} className="size-3.5" />
          <span>2024</span>
          <span>SunnyBiolie</span>
        </div>
      </div>
    </div>
  );
};
