"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Account } from "@prisma/client";
import { getAccountByUserName } from "@/action/account/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { useProfilePageData } from "@/hooks/use-profile-page-data";
import { ProfileInfor } from "@/components/profile/profile-infor";
import { ProfileNavigationBar } from "@/components/profile/profile-navbar";
import { Footer } from "@/components/others/footer";

interface Props {
  params: {
    username: string;
  };
  children: React.ReactNode;
}

export default function ProfileLayout_Client({ params, children }: Props) {
  const { currentAccount } = useCurrentAccount();
  const { setScrollTop } = useProfilePageData();
  const [isError, setIsError] = useState(false);
  const [profileOwner, setProfileOwner] = useState<Account | null>();

  useEffect(() => {
    return () => setScrollTop(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentAccount && currentAccount.userName === params.username) {
      setProfileOwner(currentAccount);
    } else {
      const fetch = async () => {
        const acc = await getAccountByUserName(params.username);
        if (acc === undefined) {
          setIsError(true);
        } else setProfileOwner(acc);
      };
      fetch();
    }
  }, [currentAccount, params]);

  if (!currentAccount || profileOwner === undefined) return;

  if (isError)
    return (
      <div className="fixed top-0 left-0 size-full">
        <div className="w-[min(100%,600px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-6 text-center">
          <h2 className="text-lg font-bold">Something went wrong.</h2>
          <p className="dark:text-neutral-400">
            An error occurred while trying to access the database. Please check
            your connection and try again, or contact support for assistance.
          </p>
          {/* <Link
            href="/"
            className="w-fit px-4 py-2 rounded-lg text-sm font-semibold dark:bg-normal dark:text-jet"
          >
            Back to Photocial
          </Link> */}
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

  return (
    <div className="w-[calc(100vw-24px)] md:px-0 md:w-full">
      <ProfileInfor
        profileOwner={profileOwner}
        isYourProfile={currentAccount.id === profileOwner.id}
      />
      <div className="max-w-[916px] mx-2 md:mx-auto">
        <ProfileNavigationBar userName={profileOwner.userName} />
        <div className="py-4">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
