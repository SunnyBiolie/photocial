"use client";

import Link from "next/link";
import { Account } from "@prisma/client";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { AccountAvatar } from "../others/account-avatar";
import { FollowButton } from "../others/follow-button";

interface Props {
  account: Account;
  isFollowedByCurrentAccount: boolean;
}

export const SearchItem = ({ account, isFollowedByCurrentAccount }: Props) => {
  const { currentAccount } = useCurrentAccount();

  if (!currentAccount) return;

  if (isFollowedByCurrentAccount === undefined) return <SearchItemSkeleton />;

  return (
    <div className="p-2 flex items-center">
      <AccountAvatar account={account} className="size-10 mr-3" />
      <div className="flex-1 flex items-center justify-between">
        <Link href={`@${account.userName}`} className="font-semibold">
          {account.userName}&nbsp;
          {account.id === currentAccount.id && (
            <span className="font-medium">(you)</span>
          )}
        </Link>
        {currentAccount.id !== account.id && (
          <div className="w-28">
            <FollowButton
              currentAccountId={currentAccount.id}
              targetAccount={account}
              isFollowedByCurrentAccount={isFollowedByCurrentAccount}
              className="font-medium dark:hover:bg-jet"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchItemSkeleton = () => {
  return (
    <div className="p-2 flex items-center animate-pulse">
      <div className="shrink-0 size-10 mr-3 rounded-full dark:bg-jet" />
      <div className="flex-1 flex items-center justify-between">
        <div className="w-1/2 h-6 mr-3 rounded-md dark:bg-jet"></div>
        <div className="w-28 h-9 rounded-md dark:bg-jet"></div>
      </div>
    </div>
  );
};

export const DummyItem = () => {
  return (
    <div className="p-2 flex items-center">
      <div className="relative size-10 mr-3 rounded-full overflow-hidden cursor-pointer bg-neutral-300 dark:bg-neutral-600"></div>
      <p className="font-bold">Dummy user</p>
    </div>
  );
};
