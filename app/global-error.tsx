"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
          <h2 className="text-xl font-semibold">Something went wrong!</h2>
          <p className="w-2/3 text-center dark:text-neutral-400">
            {error.message}
          </p>
          <button
            className="px-4 py-3 rounded-lg font-semibold dark:bg-normal dark:text-neutral-800"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
