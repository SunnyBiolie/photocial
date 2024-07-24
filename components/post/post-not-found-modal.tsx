"use client";

import { useRouter } from "next/navigation";
import { ButtonCloseFullView } from "../others/btn-close-full-view";

export const PostNotFoundModal = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="fixed top-0 left-0 size-full">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-900/75"
        onClick={handleBack}
      >
        <ButtonCloseFullView />
      </div>
      <div className="w-[min(100%,350px)] p-6 rounded-lg shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 text-center dark:bg-coffee-bean">
        <h2 className="text-lg font-bold">
          Sorry, this post isn&#39;t available.
        </h2>
        <p className="dark:text-neutral-400">
          The link you followed may be broken, or the page may have been
          removed.
        </p>
        <div
          className="w-fit px-4 py-2 rounded-lg font-semibold cursor-pointer dark:bg-normal dark:text-coffee-bean"
          onClick={handleBack}
        >
          Back
        </div>
      </div>
    </div>
  );
};
