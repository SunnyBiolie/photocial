import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed top-0 left-0 size-full">
      <div className="w-[min(100%,320px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 text-center">
        <h2 className="text-lg font-bold">
          Sorry, this page isn&#39;t available.
        </h2>
        <p className="dark:text-neutral-500">
          The link you followed may be broken, or the page may have been
          removed.
        </p>
        <Link
          href="/"
          className="w-fit px-4 py-2 rounded-lg font-semibold dark:bg-normal dark:text-coffee-bean"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
