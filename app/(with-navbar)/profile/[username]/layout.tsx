import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAccountByUserName } from "@/action/account/get";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const profileOwner = await getAccountByUserName(params.username);

  if (profileOwner)
    return {
      title: `@${params.username} on Photocial`,
      description: `@${params.username}'s profile`,
    };
  else
    return {
      title: `Page not found`,
      description: `The link you followed may be broken, or the page may have been
          removed`,
    };
}

interface Props {
  params: {
    username: string;
  };
  children: React.ReactNode;
}

export default async function ProfileLayout({ params, children }: Props) {
  const profileOwner = await getAccountByUserName(params.username);

  if (profileOwner === undefined)
    return (
      <div className="fixed top-0 left-0 size-full">
        <div className="w-[min(100%,400px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 text-center">
          <h2 className="text-lg font-bold">Something went wrong.</h2>
          <p className="dark:text-neutral-400">
            An error occurred while trying to access the database. Please check
            your connection and try again, or contact support for assistance.
          </p>
        </div>
      </div>
    );

  if (profileOwner === null)
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
            className="w-fit px-4 py-2 rounded-lg text-sm font-semibold dark:bg-normal dark:text-jet"
          >
            Back to Photocial
          </Link>
        </div>
      </div>
    );

  return <>{children}</>;
}
