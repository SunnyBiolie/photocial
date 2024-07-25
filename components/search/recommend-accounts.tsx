"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { getListAccountsByPrivateStatus } from "@/action/account/get";
import { SearchItem, SearchItemSkeleton } from "./search-item";
import { ErrorMessage } from "../others/error-message";

interface Props {
  className?: string;
}

export const RecommendedAccounts = ({ className }: Props) => {
  const [listAccounts, setListAccounts] = useState<Account[] | null>();

  useEffect(() => {
    const fetch = async () => {
      const list = await getListAccountsByPrivateStatus(false);

      if (list === undefined) {
        setListAccounts([]);
      } else {
        setListAccounts(list);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className={className}>
        <h6 className="py-4 font-semibold">Recommend</h6>
        {listAccounts === undefined ? (
          <div>
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
          </div>
        ) : listAccounts === null ? (
          <p className="py-4 text-center text-sm font-semibold text-neutral-400">
            No recommend for you.
          </p>
        ) : listAccounts.length === 0 ? (
          <ErrorMessage className="py-4" />
        ) : (
          <div>
            {listAccounts.map((acc, i) => (
              <SearchItem key={i} account={acc} />
            ))}
          </div>
        )}
      </div>
      <div className={className}>
        <h6 className="py-4 font-semibold">Dummy Accounts</h6>
        <div>
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
        </div>
      </div>
    </>
  );
};
