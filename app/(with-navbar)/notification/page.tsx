"use client";

import imageKit from "@/lib/imagekit";

export default function NotificationPage() {
  return (
    <div className="w-[min(100%-24px,560px)] mx-auto -mb-[var(--app-navbar-horizontal-height)]">
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 bg-rich-black z-10">
          <div className="py-4">
            <h1 className="font-bold text-center">Notifications</h1>
            <div className="absolute size-8 -left-4 -bottom-4 bg-rich-black overflow-hidden">
              <div className="absolute top-1/2 left-1/2 size-8 rounded-full bg-coffee-bean" />
            </div>
            <div className="absolute size-8 -right-4 -bottom-4 bg-rich-black overflow-hidden">
              <div className="absolute top-1/2 right-1/2 size-8 rounded-full bg-coffee-bean" />
            </div>
          </div>
        </div>
        <div className="grow shrink-0 px-6 py-3 dark:bg-coffee-bean">
          <div className="py-6">
            <h6 className="text-center text-xl font-semibold text-neutral-400">
              Comming soon!
            </h6>
          </div>
        </div>
        <div className="h-[var(--app-navbar-horizontal-height)] md:h-[5vh] sticky bottom-0 bg-rich-black">
          <div className="absolute size-8 -left-4 -top-4 bg-rich-black overflow-hidden">
            <div className="absolute bottom-1/2 left-1/2 size-8 rounded-full bg-coffee-bean" />
          </div>
          <div className="absolute size-8 -right-4 -top-4 bg-rich-black overflow-hidden">
            <div className="absolute bottom-1/2 right-1/2 size-8 rounded-full bg-coffee-bean" />
          </div>
        </div>
      </div>
    </div>
  );
}
