"use client";

import { Account } from "@prisma/client";
import { AccountAvatar } from "../others/account-avatar";
import Link from "next/link";
import { useAccount } from "@/hooks/use-account";

interface Props {
  account: Account;
}

export const SearchItem = ({ account }: Props) => {
  // const { account: yourAccount } = useAccount();

  // if (!yourAccount) return;

  return (
    <div className="p-2 flex items-center">
      <AccountAvatar account={account} className="size-10 mr-3" />
      <div>
        <Link href={`@${account.userName}`} className="font-bold">
          {account.userName}
        </Link>
      </div>
    </div>
  );
};

export const SearchItemSkeleton = () => {
  return (
    <div className="p-2 flex items-center animate-pulse">
      <div className="size-10 mr-3 rounded-full dark:bg-jet" />
      <div className="w-1/2 h-6 mr-3 rounded-lg dark:bg-jet"></div>
    </div>
  );
};
